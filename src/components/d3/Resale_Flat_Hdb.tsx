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

const Resale_Flat_Hdb: React.FC<ResaleFlatHdbProps> = ({ data, selectedFilter, }) => {
  const chartRef = useRef(null);
  const resizeSVG = () => {
    if (data && data.length > 0) {
      const container = chartRef.current;
      if (!container) return;

      const width = 450;
      const height = 300;

      const svgContainer = d3.select(container);
      svgContainer.selectAll("*").remove();

      const svg = svgContainer
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(85,50)");

      // Assuming you have a function updateChart that draws or updates the graph
      updateChart(svg, data, selectedFilter, width, height);
    }
  };

  useEffect(() => {
    resizeSVG();
  }, [data, selectedFilter]);

  function updateChart(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    data: HDBData[],
    selectedFilter: ResaleFlatHdbProps["selectedFilter"],
    width: number,
    height: number
    ) {
    const margin = { top: 50, right: 70, bottom: 70, left: 120 },
      width_graph = width - margin.left - margin.right,
      height_graph = height - margin.top - margin.bottom;

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
      .range([0, width_graph]);
    
    // X Axis Label
    svg.append('text')
    .attr('class', 'x axis-label')
    .attr('x', width_graph / 2)
    .attr('y', height_graph + 35) // Adjust this value to position the label below the x-axis
    .attr('text-anchor', 'middle')
    .style('font-size', '12px') // You can adjust the style as needed
    .text('No. of Flats'); // Replace 'Axis Label Text Here' with your actual x-axis label

    // Draw the x-axis with gridlines
    svg
      .append("g")
      .attr("transform", `translate(0,${height_graph})`)
      .call(d3.axisBottom(x).tickSize(-height_graph))
      .call((g) => g.select(".domain").remove()) // Optional: removes the axis line
      .call((g) => g.selectAll(".tick line").attr("stroke-opacity", 0.2)); // Optional: styles the gridlines

    // Y axis
    const y = d3
      .scaleBand()
      .range([0, height_graph])
      .domain(newProcessedData.map((d) => d.town))
      .padding(0.1);
    
    // // Y Axis Label
    // svg.append('text')
    // .attr('class', 'y axis-label')
    // .attr('transform', 'rotate(-90)') // Rotate the text for y-axis label
    // .attr('y', -margin.left + 20) // Adjust this value to position the label next to the y-axis
    // .attr('x', - (height_graph / 2))
    // .attr('dy', '1em') // Further adjust the position of the label
    // .attr('text-anchor', 'middle')
    // .style('font-size', '12px') // You can adjust the style as needed
    // .text('Town'); // Replace 'Axis Label Text Here' with your actual y-axis label
    
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
      .attr("x", width_graph / 2)
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .style("font-size", "15px")
      .style("text-decoration", "underline")
      .text(generateChartTitle(selectedFilter));
    
      function generateChartTitle(
        selectedFilter: ResaleFlatHdbProps["selectedFilter"]
      ): string {
        let title = `Top 5 Areas with Most ${selectedFilter.flatTypes} Resale Flats Sold`;
        if (!selectedFilter.year.includes("All")) {
            title += ` in ${selectedFilter.year}`; // Single year selected
        }
        return title;
      }
  }

  return <div ref={chartRef} ></div> 
};

export default Resale_Flat_Hdb;
