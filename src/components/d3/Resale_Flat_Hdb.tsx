import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface HDBData {
  town: string;
  flat_type: string;
  floor_area: number;
  resale_price: number;
  year: string;
  adjusted_price: number;
  price_per_sqm: number;
  adjusted_price_per_sqm: number;
  town_classification: string;
}

interface ResaleFlatHdbProps {
  data: HDBData[];
  selectedFilter: {
    year: string[];
    flatTypes: string[];
  };
}

const Resale_Flat_Hdb: React.FC<ResaleFlatHdbProps> = ({ data, selectedFilter }) => {
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

      updateChart(svg, data, selectedFilter);
    }
  }, [data, selectedFilter]);

  function updateChart(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    data: HDBData[],
    selectedFilter: ResaleFlatHdbProps["selectedFilter"]
  ) {
    const margin = { top: 50, right: 30, bottom: 70, left: 100 },
      width = 1000 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    svg.selectAll("*").remove();

    // Adjusted filter data based on the selectedFilter object
    let processedData = data
      .filter(
        (d) =>
          selectedFilter.year.includes("All") ||
          selectedFilter.year.includes(d.year)
      )
      .filter(
        (d) =>
          selectedFilter.flatTypes.includes("All") ||
          selectedFilter.flatTypes.includes(d.flat_type)
      );

    // Rollup and sort data, then take top 5
    const newProcessedData = d3
      .rollups(
        processedData,
        (v) => v.length,
        (d) => d.town
      )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([keys, value]) => ({
        town: keys,
        count: value,
      })); // Take only top 5

    // The rest of your D3 code to draw the chart remains the same
    // Color scale, X axis, Y axis, Bars, and Chart title

    // Color scale
    const color = d3
      .scaleOrdinal()
      .domain(newProcessedData.map((d) => d.town))
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
    
    const maxCount = d3.max(newProcessedData, (d) => d.count);

    // X axis
    const x = d3
      .scaleLinear()
      .domain([0, maxCount || 0 ])
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
      .domain(newProcessedData.map((d) => d.town))
      .padding(0.1);
    

    svg.append("g").call(d3.axisLeft(y));

    // Bars
    svg
      .selectAll("rect")
      .data(newProcessedData)
      .enter()
      .append("rect")
      .attr("x", x(0))
      .attr("y", (d) => y(d.town) as number) // Ensure a valid value is assigned to 'y'
      .attr("width", (d) => x(d.count))
      .attr("height", y.bandwidth())
      .attr("fill", (d) => color(d.town) as string) // Add type annotation to ensure a valid value is returned
      .on("mouseover", (event, d) => {
        tooltip.style("visibility", "visible").text(`${d.town}: ${d.count}`);
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
      .text(generateChartTitle(selectedFilter));
  }

  // Adjust the generateChartTitle function to correctly utilize selectedFilter
  function generateChartTitle(
    selectedFilter: ResaleFlatHdbProps["selectedFilter"]
  ): string {
    let title = "Top 5 Flats Sold";
    if (!selectedFilter.year.includes("all")) {
      if (selectedFilter.year.length > 1) {
        title += ` in Multiple Years`; // Simple indication of multiple selections
      } else if (selectedFilter.year.length === 1) {
        title += ` in ${selectedFilter.year[0]}`; // Single year selected
      }
    }
    // if (selectedFilter.maturity !== "All") {
    //   title += ` - ${selectedFilter.maturity} Estates`;
    // }
    if (
      !selectedFilter.flatTypes.includes("all") &&
      selectedFilter.flatTypes.length > 0
    ) {
      const flatTypes = selectedFilter.flatTypes.join(", ");
      title += ` - ${flatTypes}`;
    }
    return title;
  }

  return <div ref={chartRef}></div>;
};

export default Resale_Flat_Hdb;
