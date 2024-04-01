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
      const margin = { top: 70, right: 50, bottom: 70, left: 50 },
        width = 400 - margin.left - margin.right,
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

      // const minYear = d3.min(maturePrice, (d) => new Date(d.year).getFullYear());
      // const maxYear = d3.max(maturePrice, (d) => new Date(d.year).getFullYear());

      const minYear = d3.min(maturePrice, (d) => new Date(d.year)); // January of the min year
      const maxYear = d3.max(maturePrice, (d) => new Date(d.year)); // End of the max year
      
      // Scales
      const xScale = d3
        .scaleTime()
        .domain([minYear || 0, maxYear|| 0])
        .range([0, width]);

      const yScale = d3
        .scaleLinear()
        // .domain([0, d3.max(data, (d) => Math.max(d.resale_price)) || 0])
        .domain([0, d3.max([...maturePrice, ...nonMaturePrice], (d) => d.resale_price) || 0])
        .range([height, 0]);

      // Line generators
      // const lineMature = d3.line<MedianAdjustedPriceEntry>()
      // .x((d) => xScale(new Date(maturePrice.year)))
      // .y((d) => yScale(nonMaturePrice.resale_price));

      // const lineNonMature = d3.line<MedianAdjustedPriceEntry>()
      // .x((d) => xScale(new Date(nonMaturePrice.year)))
      // .y((d) => yScale(nonMaturePrice.resale_price));
      const lineMature = d3
        .line<MedianAdjustedPriceEntry>()
        .x((maturePrice) => xScale(new Date(maturePrice.year)))
        .y((maturePrice) => yScale(maturePrice.adjusted_price));

      const lineNonMature = d3
        .line<MedianAdjustedPriceEntry>()
        .x((nonMaturePrice) => xScale(new Date(nonMaturePrice.year)))
        .y((nonMaturePrice) => yScale(nonMaturePrice.adjusted_price));

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
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"))) // Formatting the date
      .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)"); // Rotate the text labels

      g.append("g").call(d3.axisLeft(yScale));

      

      // Legend setup
      const legend = g.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${margin.left}, ${height + 45})`); // Adjust as necessary

      // Legend for Mature Price
      legend.append('rect')
      .attr('x', 0)
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', 'steelblue');

      legend.append('text')
      .attr('x', 20) // Distance from the rectangle
      .attr('y', 10) // Vertically align with the rectangle
      .text('Mature')
      .style('font-size', '12px')
      .attr('alignment-baseline', 'middle');

      // Legend for Non-Mature Price
      legend.append('rect')
      .attr('x', 100) // Adjust this value based on your actual layout
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', 'red');

      legend.append('text')
      .attr('x', 120) // Adjust based on the rectangle's position
      .attr('y', 10) // Vertically align with the rectangle
      .text('Non-Mature')
      .style('font-size', '12px')
      .attr('alignment-baseline', 'middle');

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
        let title = `Mature vs. Non-Mature Median Price - ${selectedFilter}`;
        return title;
      }
    }
  }, [data, selectedFilter]);

  return <svg ref={d3Container} />;
};

export default MedianMaturityPriceChart;
