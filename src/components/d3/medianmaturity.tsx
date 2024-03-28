import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { MedianAdjustedPriceEntry } from "../pages/Overview"; // Adjust the import path as needed

interface Props {
  data: MedianAdjustedPriceEntry[];
  selectedFilter: {
    year: string[];
    flatTypes: string[]; // Ensure this matches the structure in Overview.tsx
  };
}

const MedianMaturityPriceChart: React.FC<Props> = ({ data }) => {
  const d3Container = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (data && d3Container.current) {
      const svgElement = d3Container.current;
      const margin = { top: 70, right: 30, bottom: 40, left: 80 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

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

      // Scales
      const xScale = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => d.year) as [Date, Date])
        .range([0, width]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => Math.max(d.mature, d.nonMature))])
        .range([height, 0]);

      // Line generators
      const lineMature = d3
        .line<MedianAdjustedPriceEntry>()
        .x((d) => xScale(d.year))
        .y((d) => yScale(d.mature));

      const lineNonMature = d3
        .line<MedianAdjustedPriceEntry>()
        .x((d) => xScale(d.year))
        .y((d) => yScale(d.nonMature));

      // Draw lines
      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", lineMature);

      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", lineNonMature);

      // Axes
      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

      g.append("g").call(d3.axisLeft(yScale));
    }
  }, [data]);

  return <svg ref={d3Container} />;
};

export default MedianMaturityPriceChart;
