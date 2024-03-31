import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { data } from "@/assets/datasets/treemap_data";

interface IncomeData {
  year: string;
  flat_type: string;
  average_household_income: number;
}

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

interface RatioDataEntry {
  year: string;
  flat_type: string;
  ratio: number;
}

interface OwnershipTimeChartProps {
  incomeData: IncomeData[];
  hdbData: HDBData[];
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
      const height = 330;

      const svgContainer = d3.select(container);
      svgContainer.selectAll("*").remove();

      const svg = svgContainer
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(60,50)");

        updateChart(svg, incomeData, hdbData, selectedFilter, width, height);
        
      // Add Gridlines, Axis Titles, and Legend as per your JS example
      // ... (You'll need to implement these based on the existing JS logic)
    
    // if (data && data.length > 0) {
    //   const container = chartRef.current;
    //   if (!container) return;

    //   const width = 500;
    //   const height = 300;

    //   const svgContainer = d3.select(container);
    //   svgContainer.selectAll("*").remove();

    //   const svg = svgContainer
    //     .append("svg")
    //     .attr("width", width)
    //     .attr("height", height)
    //     .append("g")
    //     .attr("transform", "translate(60,50)");

      // Assuming you have a function updateChart that draws or updates the graph
    //   updateChart(svg, data, selectedFilter, width, height);
    // }
  };


  useEffect(() => {
    resizeSVG();
    // if (hdbData.length > 0 && incomeData.length > 0 && chartRef.current) {
    //   const svgElement = d3.select(chartRef.current);
    //   svgElement.selectAll("*").remove();

    //   const margin = { top: 70, right: 30, bottom: 40, left: 80 },
    //     width = 480 - margin.left - margin.right,
    //     height = 300 - margin.top - margin.bottom;
    //   const svg = svgElement
    //     .append("svg")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", height + margin.top + margin.bottom)
    //     .append("g")
    //     .attr("transform", `translate(${margin.left},${margin.top})`);

    //     // svgElement.selectAll("*").remove();

    //     updateChart(svg, incomeData, hdbData, selectedFilter);
        
    //   // Add Gridlines, Axis Titles, and Legend as per your JS example
    //   // ... (You'll need to implement these based on the existing JS logic)
    // }
  }, [incomeData, hdbData, selectedFilter]); // Dependencies to re-run the effect when they change

  function calculateRatioIncomePrice(avgPrice: { year: string; flat_types: { flat_type: string; mean: number; }[]; }[], incomeData: IncomeData[]) {
    const ratios = [];

    // Iterate over each year entry in avgPrice
    for (const priceEntry of avgPrice) {
        const year = priceEntry.year;

        // Now, iterate over each flat_type within the year
        for (const flatTypeEntry of priceEntry.flat_types) {
            const income = incomeData.find(i => i.year === year && i.flat_type === flatTypeEntry.flat_type);
            if (income) {
                // Calculate the ratio and add it to the ratios array
                ratios.push({
                    year: year,
                    flat_type: flatTypeEntry.flat_type,
                    ratio: flatTypeEntry.mean / income.average_household_income
                });
            }
        }
    }

    // It's not necessary to filter for nulls since we only push when we find a match
    return ratios;
  } 

  function updateChart( 
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    incomeData: IncomeData[],
    hdbData: HDBData[],
    selectedFilter: OwnershipTimeChartProps["selectedFilter"],
    width: number,
    height: number
    ){
      const margin = { top: 50, right: 50, bottom: 50, left: 50 },
      width_graph = width - margin.left - margin.right,
      height_graph = height - margin.top - margin.bottom;

      svg.selectAll("*").remove();

      const avgResalePriceByYearAndType = d3.rollups(
        hdbData,
        (group) => d3.mean(group, d => d.resale_price), // Ensure this returns the mean
        (d) => d.year,  // First level of grouping: by year
        (d) => d.flat_type // Second level of grouping: by flat_type
      ).map(([year, flatTypes]) => ({  
        // This maps the nested structure into a flat one, if that's what you're looking for.
        // Otherwise, you can adjust the structure as needed.
        year: year,
        flat_types: flatTypes.map(([flat_type, mean]) => ({
          flat_type, mean
        }))

      }));

      const ratioData = calculateRatioIncomePrice(avgResalePriceByYearAndType, incomeData);
      // Adjusted filter data based on the selectedFilter object
    // let processedData = data
    // .filter(
    //   (d) =>
    //     selectedFilter.year.includes("All") ||
    //     selectedFilter.year.includes(d.year)
    // )
    // .filter(
    //   (d) =>
    //     selectedFilter.flatTypes.includes("All") ||
    //     selectedFilter.flatTypes.includes(d.flat_type)
    // );
      
  //  svg 
  //   .selectAll("g")
  //   .data(processedData)
  //   .attr("width", width + margin.left + margin.right)
  //   .attr("height", height + margin.top + margin.bottom);

  // svg.selectAll("*").remove(); // Clear the svg for redrawing

  // svg
  //   .append("g")
  //   .attr("transform", `translate(${margin.left},${margin.top})`);
      
  const maxRatio = d3.max(ratioData, (d) => d.ratio);
 
  
  const minYear = d3.min(ratioData, (d) => new Date(d.year).getFullYear());
  const maxYear = d3.max(ratioData, (d) => new Date(d.year).getFullYear());

  // Scales
  const xScale = d3
    .scaleLinear()
    .domain([minYear || 0, maxYear || 0])
    .range([0, width_graph]);

  const yScale = d3
    .scaleLinear()
    .domain([0, maxRatio || 0])
    .range([height_graph, 0]);

  // Line generator
  const lineGenerator = d3
    .line<RatioDataEntry>()
    .x((d) => xScale(new Date(d.year).getFullYear()))
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


  // console.log("maxratio", maxRatio);
  // Add X axis
  svg.append("g")
    .attr("transform", `translate(0,${height_graph})`)
    .call(d3.axisBottom(xScale));

  // Add Y axis
  svg.append("g").call(d3.axisLeft(yScale));

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
      let title = `Years to Pay Off ${selectedFilter} HDB Flats`;
      return title;
    }
  }
  return <div ref={chartRef} ></div>;
};

export default OwnershipTimeChart;
