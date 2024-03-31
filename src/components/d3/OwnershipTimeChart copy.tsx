import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface RatioDataEntry {
  year: string;
  flat_type: string;
  ratio: number;
}

interface OwnershipTimeChartProps {
  data: RatioDataEntry[];
  selectedFilter: {
    year: string[];
    flatTypes: string[]; // Ensure this matches the structure in Overview.tsx
  };
}

const OwnershipTimeChart: React.FC<OwnershipTimeChartProps> = ({
  data,
  selectedFilter, // Ensure this prop is correctly provided as an array
}) => {
  // const chartRef = useRef(null);
  const chartRef = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    if (data.length > 0 && chartRef.current) {
      const svgElement = chartRef.current;
      const margin = { top: 70, right: 30, bottom: 40, left: 80 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
      const svg = d3
        .select(svgElement)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

      svg.selectAll("*").remove(); // Clear the svg for redrawing
      // console.log("data", data);
      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const maxRatio = d3.max(data, (d) => d.ratio);
      console.log("data", data);

      const minYear = d3.min(data, (d) => new Date(d.year).getFullYear());
      const maxYear = d3.max(data, (d) => new Date(d.year).getFullYear());

      // Scales
      const xScale = d3
        .scaleTime()
        .domain([minYear || 0, maxYear || 0])
        .range([0, width]);

      const yScale = d3
        .scaleLinear()
        .domain([0, maxRatio || 0])
        .range([height, 0]);

      // Line generator
      const lineGenerator = d3
        .line<RatioDataEntry>()
        .x((d) => xScale(new Date(d.year).getFullYear()))
        .y((d) => yScale(d.ratio));

      // Define the color scale
      const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

      // Group the data by flat type
      const dataByFlatType = d3.groups(data, (d) => d.flat_type);

      // Draw the line for each flat type
      dataByFlatType.forEach(([flat_type, values], index) => {
        g.append("path")
          .datum(values)
          .attr("fill", "none")
          .attr("stroke", colorScale(index.toString())) // Use index for color or a different property if needed
          .attr("stroke-width", 1.5)
          .attr("d", lineGenerator);
      });
      console.log("maxratio", maxRatio);
      // Add X axis
      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

      // Add Y axis
      g.append("g").call(d3.axisLeft(yScale));

      // Add Gridlines, Axis Titles, and Legend as per your JS example
      // ... (You'll need to implement these based on the existing JS logic)
    }
  }, [data, selectedFilter]); // Dependencies to re-run the effect when they change

  return <svg ref={chartRef} width="960" height="500"></svg>;
};

export default OwnershipTimeChart;
