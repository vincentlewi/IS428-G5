import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import d3Tip from "d3-tip";
import "./mapintro.css";

interface TownData {
  n: number;
  monthDt: number;
  perSqmPriceSum: number;
  town: string;
  meanPerSqmPrice: number;
  perSqmAdjustedPriceSum?: number;
  meanPerSqmAdjustedPrice: number;
}

interface TransformedData {
  towns: TownData[];
}

interface FeatureProperties {
  PLN_AREA_N: string;
  meanPerSqmPrice?: number; // Added to use in mapping and rendering
}

interface GeoJSONFeature
  extends GeoJSON.Feature<GeoJSON.Geometry, FeatureProperties> {}

interface GeoJSONFeatureCollection
  extends GeoJSON.FeatureCollection<GeoJSON.Geometry, FeatureProperties> {}

interface MapIntroProps {
  dataUrl: string;
  topojsonUrl: string;
}

const MapIntro: React.FC<MapIntroProps> = ({ dataUrl, topojsonUrl }) => {
  const [geoData, setGeoData] = useState<GeoJSONFeatureCollection | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentYear, setCurrentYear] = useState<number>(2019);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  useEffect(() => {
    async function fetchDataAndProcess() {
      try {
        const transformedDataResp = await fetch(dataUrl);
        const topojsonDataResp = await fetch(topojsonUrl);
        const transformedData: TransformedData =
          await transformedDataResp.json();
        const topojsonData: GeoJSONFeatureCollection =
          await topojsonDataResp.json();

        // Process and merge data right after fetching
        processAndMergeData(topojsonData, transformedData, currentYear);
      } catch (error) {
        console.error("Error fetching or processing data:", error);
      }
    }

    fetchDataAndProcess();
  }, [dataUrl, topojsonUrl, currentYear]);
  // Interval for auto-changing years
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentYear((prevYear) => (prevYear < 2024 ? prevYear + 1 : 1990));
      }, 1000); // Change every second

      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  // Handler for play/pause
  const handlePlayPause = () => setIsPlaying(!isPlaying);

  // Handler for changing year manually
  const handleNextYear = () =>
    setCurrentYear((year) => (year < 2024 ? year + 1 : 1990));

  useEffect(() => {
    if (!geoData) return;

    const svgElement = svgRef.current;
    if (!svgElement) return;

    const width = 600;
    const height = 600;
    const maxPrice = Math.max(
      ...geoData.features.map((d) => d.properties.meanPerSqmPrice ?? 0)
    );

    // Set up D3 tip
    const tip = d3Tip()
      .attr("class", "d3-tip")
      .html(
        (
          event: any,
          d: { properties: { meanPerSqmPrice?: number; PLN_AREA_N: string } }
        ) => {
          const price = d.properties.meanPerSqmPrice;
          return price
            ? `${d.properties.PLN_AREA_N}<br>${price.toFixed(2)} S$/sqm`
            : `${d.properties.PLN_AREA_N}<br>(No data)`;
        }
      );

    // Select the SVG element and clear previous contents
    const svg = d3.select(svgElement).html("");

    // Set up the projection and path generator
    const projection = d3.geoMercator().fitSize([width, height], geoData);
    const pathGenerator = d3.geoPath().projection(projection);

    const colorScale = d3
      .scaleSequential()
      .domain([0, maxPrice])
      .interpolator(d3.interpolate("#F3EDC8", "#BF3131")); //
    // Draw the map
    svg
      .selectAll(".region")
      .data(geoData.features)
      .join("path")
      .attr("class", "region")
      .attr("d", pathGenerator)
      .attr("fill", (d) => {
        return d.properties.meanPerSqmPrice
          ? colorScale(d.properties.meanPerSqmPrice)
          : "#F3EDC8"; // Fallback color for no data
      })
      .on("mouseover", tip.show)
      .on("mouseout", function () {
        tip.hide();
      });

    // Call tip
    svg.call(tip);

    // Draw the year label
    svg
      .append("text")
      .attr("class", "year-label")
      .attr("x", width - 10)
      .attr("y", height - 10)
      .attr("font-size", "80px")
      .attr("text-anchor", "end")
      .text(currentYear);

    // Draw the legend
    const legendValues = [0, maxPrice / 2, maxPrice];

    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 10}, ${height - 195})`);

    // legendValues.forEach((value, i) => {
    //   const legendRow = legend
    //     .append("g")
    //     .attr("transform", `translate(0, ${i * 20})`);
    legendValues.forEach((value, i) => {
      const legendRow = legend
        .append("g")
        .attr("transform", `translate(0, ${i * 20})`);

      legendRow
        .append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("stroke-width", 1)
        .attr("stroke", "#000000")
        .attr("fill", colorScale(value));

      legendRow
        .append("text")
        .attr("x", -10)
        .attr("y", 10)
        .attr("text-anchor", "end")
        .style("text-transform", "capitalize")
        .text(`${value.toFixed(0)} S$/sqm`);

      const projection = d3.geoMercator().fitSize([width, height], geoData);
      const pathGenerator = d3.geoPath().projection(projection);

      // Draw the regions with borders
      svg
        .selectAll(".region")
        // ... existing code for regions ...
        .attr("stroke", "#000000") // Add this line for the borders
        .attr("stroke-width", 0.65); // And this line for the border width

      // Add this block for graticules if needed
    });
  }, [geoData, currentYear]); // Depend on geoData and currentYear

  function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef<() => void>();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        if (savedCallback.current) {
          savedCallback.current();
        }
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  const processAndMergeData = (
    geojson: GeoJSONFeatureCollection,
    transformedData: TransformedData,
    year: number
  ) => {
    // Initially, create a structure to hold aggregated data for each town
    const aggregatedTownData: { [key: string]: TownData } = {};

    // Filter and process data for the given year
    transformedData.towns.forEach((town) => {
      if (new Date(town.monthDt).getFullYear() === year) {
        if (!aggregatedTownData[town.town]) {
          // Initialize the town's data aggregation
          aggregatedTownData[town.town] = { ...town, n: 0, perSqmPriceSum: 0 };
        }

        // Aggregate data
        aggregatedTownData[town.town].n += town.n;
        aggregatedTownData[town.town].perSqmPriceSum += town.perSqmPriceSum;
        // Calculate the new mean price per square meter
        aggregatedTownData[town.town].meanPerSqmPrice =
          aggregatedTownData[town.town].perSqmPriceSum /
          aggregatedTownData[town.town].n;
      }
    });

    // Now, merge this aggregated data with the GeoJSON features
    const featuresWithTownData = geojson.features.map((feature) => {
      const townName = feature.properties.PLN_AREA_N;
      const townData = aggregatedTownData[townName];
      if (townData) {
        feature.properties.meanPerSqmPrice = townData.meanPerSqmPrice;
      } else {
      }
      return feature;
    });

    setGeoData({ ...geojson, features: featuresWithTownData });
  };

  // In your component's return statement
  return (
    <div>
      <svg ref={svgRef} width="1200" height="600"></svg>
      <div style={{ textAlign: "center" }}>
        <button onClick={handlePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          onClick={() =>
            setCurrentYear((year) => (year > 1990 ? year - 1 : 2024))
          }
        >
          Previous Year
        </button>
        <button onClick={handleNextYear}>Next Year</button>
      </div>
    </div>
  );
};

export default MapIntro;