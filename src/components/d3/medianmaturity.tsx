import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface MedianAdjustedPriceEntry {
  year: string;
  flat_type: string;
  town_classification: string;
  resale_price: number;
  adjusted_price: number;
  price_per_sqm: number;
  adjusted_price_per_sqm: number;
}

interface Props {
  data: MedianAdjustedPriceEntry[];
  selectedFilter:string; // Ensure this matches the structure in Overview.tsx;
}

const MedianMaturityPriceChart: React.FC<Props> = ({ data, selectedFilter }) => {
  const d3Container = useRef<SVGSVGElement | null>(null);
  const [mature, setMature] = useState<MedianAdjustedPriceEntry[]>([]);
  const [nonMature, setNonMature] = useState<MedianAdjustedPriceEntry[]>([]);
  
  useEffect(() => {
    if (data && d3Container.current) {
      const svgElement = d3Container.current;
      const margin = { top: 70, right: 50, bottom: 40, left: 40 },
        width = 480 - margin.left - margin.right,
        height = 320 - margin.top - margin.bottom;
    
      // Set the outer dimensions of the SVG
      const svg = d3
        .select(svgElement)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

      // Remove any previous graphics
      svg.selectAll("*").remove();

      // Set up the group element for the margin convention
      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const maturePrice = data.filter((d) => d.town_classification === "Mature"
      );
      setMature(maturePrice);
      
      const nonMaturePrice = data.filter((d) => d.town_classification === "Non-Mature"
      );
      setNonMature(nonMaturePrice);

      const minYear = d3.min(maturePrice, (d) => new Date(d.year).getFullYear());
      const maxYear = d3.max(maturePrice, (d) => new Date(d.year).getFullYear());

      // Scales
      const xScale = d3
        .scaleLinear()
        .domain([minYear || 0, maxYear|| 0])
        .range([0, width]);

      const yScale = d3
        .scaleLinear()
        // .domain([0, d3.max(data, (d) => Math.max(d.resale_price)) || 0])
        .domain([0, d3.max([...maturePrice, ...nonMaturePrice], (d) => d.resale_price) || 0])
        .range([height, 0]);

      // Line generators
      const lineMature = d3
        .line<MedianAdjustedPriceEntry>()
        .x((maturePrice) => xScale(new Date(maturePrice.year).getFullYear()))
        .y((maturePrice) => yScale(maturePrice.resale_price));

      const lineNonMature = d3
        .line<MedianAdjustedPriceEntry>()
        .x((nonMaturePrice) => xScale(new Date(nonMaturePrice.year).getFullYear()))
        .y((nonMaturePrice) => yScale(nonMaturePrice.resale_price));

      // Draw lines
      g.append("path")
        .datum(maturePrice)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", lineMature);

      g.append("path")
        .datum(nonMaturePrice)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", lineNonMature);

      // Axes
      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

      g.append("g").call(d3.axisLeft(yScale));

      g
      .append("text")
      .attr("class", "chart-title")
      .attr("x", width / 2)
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .style("font-size", "15px")
      .style("text-decoration", "underline")
      .text(generateChartTitle(selectedFilter));
    
      function generateChartTitle(
        selectedFilter: Props["selectedFilter"]
      ): string {
        let title = `Mature vs. Non-Mature Median Price for ${selectedFilter} Flat Types`;
        return title;
      }
    }
  }, [data, selectedFilter]);

  return <svg ref={d3Container} />;
};

export default MedianMaturityPriceChart;
