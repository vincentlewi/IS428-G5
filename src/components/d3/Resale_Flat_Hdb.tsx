import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface DataPoint {
  town: string;
  year: string;
  maturity: string;
  flat_type: string;
  // You can add more fields from your dataset as needed
}

interface ResaleFlatHdbProps {
  data: DataPoint[];
  selectedYear: string;
  selectedMaturity: string;
  selectedFlatTypes: string[];
}

const Resale_Flat_Hdb: React.FC<ResaleFlatHdbProps> = ({
  data,
  selectedYear,
  selectedMaturity,
  selectedFlatTypes,
}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (data && data.length > 0) {
      const svgContainer = d3.select(chartRef.current);
      svgContainer.selectAll("*").remove();

      const svg = svgContainer
        .append("svg")
        .attr("width", 1000)
        .attr("height", 500)
        .append("g")
        .attr("transform", "translate(60,50)");

      updateChart(svg, data, selectedYear, selectedMaturity, selectedFlatTypes);
    }
  }, [data, selectedYear, selectedMaturity, selectedFlatTypes]);

  function updateChart(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    data: DataPoint[],
    selectedYear: string,
    selectedMaturity: string,
    selectedFlatType: string
  ) {
    const margin = { top: 50, right: 30, bottom: 70, left: 100 }, // Increase left margin here
      width = 1000 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    svg.selectAll("*").remove();

    // Filter data based on the selected filters
    let processedData = data
      .filter((d) => selectedYear === "all" || d.year === selectedYear)
      .filter(
        (d) => selectedMaturity === "All" || d.maturity === selectedMaturity
      )
      .filter(
        (d) =>
          selectedFlatTypes.length === 0 ||
          selectedFlatTypes.includes(d.flat_type)
      );

    // Rollup and sort data, then take top 5
    processedData = d3
      .rollups(
        processedData,
        (v) => v.length,
        (d) => d.town
      )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Take only top 5

    // The rest of your D3 code to draw the chart remains the same
    // Color scale, X axis, Y axis, Bars, and Chart title

    // Color scale
    const color = d3
      .scaleOrdinal()
      .domain(processedData.map((d) => d[0]))
      .range(d3.schemeTableau10);

    // Define the tooltip for the chart
    const tooltip = d3
      .select(chartRef.current)
      .append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "white")
      .style("border", "1px solid #ddd")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("box-shadow", "2px 2px 5px rgba(0,0,0,0.2)")
      .style("pointer-events", "none"); // This line ensures the tooltip does not interfere with mouse events.

    // X axis
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(processedData, (d) => d[1])])
      .range([0, width]);

    // Draw the x-axis with gridlines
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(-height))
      .call((g) => g.select(".domain").remove()) // Optional: removes the axis line
      .call((g) => g.selectAll(".tick line").attr("stroke-opacity", 0.2)); // Optional: styles the gridlines

    // Y axis
    const y = d3
      .scaleBand()
      .range([0, height])
      .domain(processedData.map((d) => d[0]))
      .padding(0.1);

    svg.append("g").call(d3.axisLeft(y));

    // Bars
    svg
      .selectAll("rect")
      .data(processedData)
      .enter()
      .append("rect")
      .attr("x", x(0))
      .attr("y", (d) => y(d[0]))
      .attr("width", (d) => x(d[1]))
      .attr("height", y.bandwidth())
      .attr("fill", (d) => color(d[0]))
      .on("mouseover", (event, d) => {
        tooltip.style("visibility", "visible").text(`${d[0]}: ${d[1]}`);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      });

    // Add chart title
    svg
      .append("text")
      .attr("class", "chart-title")
      .attr("x", width / 2)
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("text-decoration", "underline")
      .text(
        generateChartTitle(selectedYear, selectedMaturity, selectedFlatType)
      );
  }

  function generateChartTitle(
    selectedYear: string,
    selectedMaturity: string,
    selectedFlatType: string
  ): string {
    let title = "Top 5 Flats Sold";
    if (selectedYear !== "all") {
      title += ` in ${selectedYear}`;
    }
    if (selectedMaturity !== "All") {
      title += ` - ${selectedMaturity} Estates`;
    }
    if (selectedFlatType !== "all") {
      title += ` - ${selectedFlatType}`;
    }
    return title;
  }

  return <div ref={chartRef}></div>;
};

export default Resale_Flat_Hdb;
