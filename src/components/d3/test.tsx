import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface TestProps {
  data: any[];
  selectedYear: number;
}

const Test: React.FC<TestProps> = ({ data, selectedYear }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (data && data.length > 0) {
      // Ensure the SVG is only appended once
      const svgContainer = d3.select(chartRef.current);
      svgContainer.selectAll("*").remove(); // Clear previous SVG to prevent duplication

      const svg = svgContainer
        .append("svg")
        .attr("width", 960)
        .attr("height", 500)
        .append("g")
        .attr("transform", "translate(60,50)");

      updateChart(svg, selectedYear, data);
    }
  }, [data, selectedYear]);

  function updateChart(svg, selectedYear, data) {
    const margin = { top: 50, right: 30, bottom: 70, left: 60 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // Clear previous content
    svg.selectAll("*").remove();

    // Filter data based on the selected year
    const filteredData = data.filter((d) => +d.year === +selectedYear);

    // Count the number of flats by town
    const countByTown = d3
      .rollups(
        filteredData,
        (v) => v.length,
        (d) => d.town
      )
      .sort((a, b) => b[1] - a[1]);

    // Color scale
    const color = d3
      .scaleOrdinal()
      .domain(countByTown.map((d) => d[0]))
      .range(d3.schemeTableau10);

    // X axis
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(countByTown, (d) => d[1])])
      .range([0, width]);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    // Y axis
    const y = d3
      .scaleBand()
      .range([0, height])
      .domain(countByTown.map((d) => d[0]))
      .padding(0.1);

    svg.append("g").call(d3.axisLeft(y));

    // Bars
    svg
      .selectAll("rect")
      .data(countByTown)
      .enter()
      .append("rect")
      .attr("x", x(0))
      .attr("y", (d) => y(d[0]))
      .attr("width", (d) => x(d[1]))
      .attr("height", y.bandwidth())
      .attr("fill", (d) => color(d[0]));

    // Add chart title
    svg
      .append("text")
      .attr("class", "chart-title")
      .attr("x", width / 2)
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("text-decoration", "underline")
      .text("Total Number of Flats Sold by Year");
  }

  return <div id="my_dataviz2" ref={chartRef}></div>;
};

export default Test;
