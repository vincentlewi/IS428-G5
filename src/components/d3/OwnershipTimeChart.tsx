import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { data } from "@/assets/datasets/treemap_data";

interface IncomeData {
  year: string;
  median_income: number;
}

interface MedianPriceData {
  year: string;
  resale_price: number;
  flat_type: string;
}

interface RatioDataEntry {
  year: string;
  town_classification: string;
  ratio: number;
}

interface OwnershipTimeChartProps {
  incomeData: IncomeData[];
  hdbData: MedianPriceData[];
  selectedFilter: string; // Ensure this matches the structure in Overview.tsx;
}

const OwnershipTimeChart: React.FC<OwnershipTimeChartProps> = ({
  incomeData,
  hdbData,
  selectedFilter, // Ensure this prop is correctly provided as an array
}) => {
  // const chartRef = useRef(null);
  const chartRef = useRef(null);
  const resizeSVG = () => {
    const container = chartRef.current;
      if (!container) return;

      const width = 500;
      const height = 280;

      const svgContainer = d3.select(container);
      svgContainer.selectAll("*").remove();

      const svg = svgContainer
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(30,50)");

        updateChart(svg, incomeData, hdbData, selectedFilter, width, height);
  };


  useEffect(() => {
    resizeSVG();
  }, [incomeData, hdbData, selectedFilter]); // Dependencies to re-run the effect when they change

  function calculateRatioIncomePrice(hdbData: MedianPriceData[], incomeData: IncomeData[]) {
    const ratios = [];
    for (const medianPrice of hdbData){
      const year = medianPrice.year;
      const income = incomeData.filter((d) => d.year === (year + " "));
      if (income) {
        income.map((d) => 
          ratios.push({
            year: year,
            flat_type: medianPrice.flat_type,
            ratio: medianPrice.resale_price / d.median_income
          }))
        ;
      }
    }

    // It's not necessary to filter for nulls since we only push when we find a match
    return ratios;
  } 

  function updateChart( 
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    incomeData: IncomeData[],
    hdbData: MedianPriceData[],
    selectedFilter: OwnershipTimeChartProps["selectedFilter"],
    width: number,
    height: number
    ){
      const margin = { top: 50, right: 50, bottom: 50, left: 50 },
      width_graph = width - margin.left - margin.right,
      height_graph = height - margin.top - margin.bottom;

      svg.selectAll("*").remove();

      const ratioData = calculateRatioIncomePrice(hdbData, incomeData);
      console.log(ratioData)
  const maxRatio = d3.max(ratioData, (d) => d.ratio);
 
  
  const minYear = d3.min(ratioData, (d) => new Date(d.year));
  const maxYear = d3.max(ratioData, (d) => new Date(d.year));

  // Scales
  const xScale = d3
    .scaleTime()
    .domain([minYear || 0, maxYear || 0])
    .range([0, width_graph]);

  const yScale = d3
    .scaleLinear()
    .domain([0, maxRatio || 0])
    .range([height_graph, 0]);

  // Line generator
  const lineGenerator = d3
    .line<RatioDataEntry>()
    .x((d) => xScale(new Date(d.year)))
    .y((d) => yScale(d.ratio));

  // Define the color scale
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  // Group the data by flat type
  const dataByFlatType = d3.groups(ratioData, (d) => d.flat_type);

  // Draw the line for each flat type
  dataByFlatType.forEach(([flat_type, values], index) => {
    svg.append("path")
      .datum(values)
      .attr("fill", "none")
      .attr("stroke", colorScale(index.toString())) // Use index for color or a different property if needed
      .attr("stroke-width", 1.5)
      .attr("d", lineGenerator)
      ;
 });

  // Add X axis
  svg.append("g")
    .attr("transform", `translate(0,${height_graph})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y")));

  // Add Y axis
  svg.append("g").call(d3.axisLeft(yScale));

  const legendSize = 10; // Size of the legend box
  const legendSpacing = 100; // Space between each legend item
  const legendXPosition = 0; // Starting horizontal position of the first legend item
  const legendYPosition = height_graph + margin.bottom - 20; // Positioned below the graph

  const legend = svg.selectAll('.legend')
    .data(dataByFlatType) // Use the grouped data
    .enter().append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => {
        // Calculate the horizontal position by accumulating space
        const xPosition = legendXPosition + i * (legendSize + legendSpacing);
        return `translate(${xPosition},${legendYPosition})`;
      });

  // Append rectangles for legend symbols
  legend.append('rect')
    .attr('width', legendSize)
    .attr('height', legendSize)
    .style('fill', (d, i) => colorScale(i.toString()))
    .style('stroke', (d, i) => colorScale(i.toString()));

  // Append text labels for legend
legend.append('text')
  .attr('x', legendSize + 5) // A small padding from the rectangle
  .attr('y', legendSize / 2)
  .attr('dy', '.35em') // Vertically center text
  .style('font-size', '12px') // Set the font size to 14px
  .text((d) => d[0]); // Using the town_classification as label text

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
      selectedFilter: OwnershipTimeChartProps["selectedFilter"]
    ): string {
      let title = `Years to Pay Off HDB vs. Condominium Flats`;
      return title;
    }
  }
  return <div ref={chartRef} ></div>;
};

export default OwnershipTimeChart;
