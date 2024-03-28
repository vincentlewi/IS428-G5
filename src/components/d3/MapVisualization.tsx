import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import d3Tip from "d3-tip";
import * as topojson from "topojson-client";

interface TownData {
  n: number;
  monthDt: number;
  perSqmPriceSum: number;
  town: string;
  meanPerSqmPrice: number;
}

const MapVisualization: React.FC = () => {
  const [geoData, setGeoData] = useState<any>(null);
  const [consolidatedPrices, setConsolidatedPrices] = useState<{
    towns: TownData[];
  } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const width = 1200;
  const height = 600;

  useEffect(() => {
    Promise.all([
      d3.json("../../datasets/singapore-planning-areas-topojson.json"), // Adjust the path to your data location
      d3.json("../../datasets/transformed_data.json"), // Adjust the path to your data location
    ])
      .then(([topoData, priceData]) => {
        const geoData = topojson.feature(
          topoData,
          topoData.objects.po
        ); // Replace 'your_topology_object_name' with actual name
        setGeoData(geoData);
        setConsolidatedPrices(priceData as { towns: TownData[] });
      })
      .catch((error) => console.error("Error loading data:", error));
  }, []);

  useEffect(() => {
    if (!geoData || !consolidatedPrices || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Create a color scale
    const maxPrice = d3.max(consolidatedPrices.towns, (t) => t.meanPerSqmPrice);
    const colorScale = maxPrice
      ? d3.scaleSequential([0, maxPrice], d3.interpolateBlues)
      : () => "#ccc";

    const projection = d3.geoMercator().fitSize([width, height], geoData);
    const path = d3.geoPath().projection(projection);

    const tip = d3Tip()
      .attr("class", "d3-tip")
      .html((event, d: any) => {
        let selectedData = consolidatedPrices.towns.find(
          (t) => t.town === d.properties.PLN_AREA_N
        );
        return selectedData
          ? `${
              d.properties.PLN_AREA_N
            }<br>${selectedData.meanPerSqmPrice.toFixed(2)} S$/sqm`
          : `${d.properties.PLN_AREA_N}<br>(No data)`;
      });

    svg.call(tip);

    svg
      .append("g")
      .selectAll("path")
      .data(geoData.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", (d) => {
        let selectedData = consolidatedPrices.towns.find(
          (t) => t.town === d.properties.PLN_AREA_N
        );
        return selectedData ? colorScale(selectedData.meanPerSqmPrice) : "#ccc";
      })
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

    // If you have additional drawing logic, add it here
  }, [geoData, consolidatedPrices]);

  return (
    <div>
      <svg ref={svgRef} width={width} height={height} />
      {/* Additional JSX for other UI elements can be added here */}
    </div>
  );
};

export default MapVisualization;
