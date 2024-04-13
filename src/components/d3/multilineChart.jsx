import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import input_data from "@/assets/datasets/catboost_aggregated.json"

export default function multilineChart() {
  const d3Container = useRef(null);
  const dataset = Array.from(d3.group(input_data, d => d["Features"]), ([key, value]) => ({ key, value }));

  useEffect(() => {
    if (dataset.length > 0 && d3Container.current) {
      const containerWidth = d3Container.current.getBoundingClientRect().width;

      const margin = { top: 20, right: 10, bottom: 100, left: 20 };
      const legendMargin = { top: 20, right: 20, width: 150 };
      const width = containerWidth - margin.left - margin.right
      const height = 450 - margin.top - margin.bottom;
      const svgWidth = containerWidth; // Use the container's full width
      const svgHeight = 500;
        
      // Remove any previous SVG
      d3.select(d3Container.current).selectAll('*').remove();

      // Append SVG object to the ref element
      const svg = d3.select(d3Container.current)
        .append('svg')
        .attr('width', '100%') // Set svg width to 100% of the container
        .attr('height', svgHeight)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Add X axis
      const x = d3.scalePoint()
        .domain(dataset[0].value.map(d => d.year))
        .range([0, width])
        .padding(0.5)

      svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x))

      // Compute maximum value in dataset for Y axis domain
    const maxY = d3.max(dataset.flatMap(group => group.value.map(point => point.Importances))) ?? 0;

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, maxY])
        .range([height, 0]);

    svg.append('g').call(d3.axisLeft(y));

    // X-axis title
    svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width / 2 + margin.left)
    .attr("y", height + 40) // Adjust accordingly
    .text("Year Range")
    .style("font-size", "12px");

    const lineGenerator = d3.line()
        .x(d => x(d.year) || 0)
        .y(d => y(d.Importances));

    const color = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(dataset.map(d => d.key));

    // Render lines
    svg.selectAll('.line')
        .data(dataset)
        .join('path')
        .attr('fill', 'none')
        .attr('stroke', d => color(d.key))
        .attr('stroke-width', d => {
          // Make the stroke thicker for the top 3 features
          // You need to define logic to determine the top 3 features
          // For demonstration, we'll assume the first three dataset items are "top"
          return dataset.indexOf(d) < 3 ? 3 : 1.5; // Increase stroke width for top 3 features
        })
        .attr('d', d => lineGenerator(d.value));

              // Legend setup
      const legendContainer = svg.append('g')
      .attr('class', 'legend-container')
      .attr('transform', `translate(0, ${height + 60})`);

    let currentX = 0;
    let currentY = 0;
    const legendItemHeight = 20;
    const legendSpacing = 4;
    const legendRectSize = 10;
    const legendPadding = 15;

    dataset.forEach((d, i) => {
      const textLength = d.key.length * 6; // Approximation of text length
      const legendItemWidth = legendRectSize + textLength + legendPadding;

      if (currentX + legendItemWidth > width) {
        currentX = 0; // Reset X position
        currentY += legendItemHeight; // Move to next line
      }
      
      const legend = legendContainer.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${currentX}, ${currentY})`);
      
      legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', color(d.key))
        .style('stroke', color(d.key));

      legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(d.key)
        .attr('font-size', '10px')
        .style('fill', color(d.key));

      currentX += legendItemWidth;
    });
    }
  }, [dataset]); // Redraw chart if data changes

  return (
    <div>
      <div ref={d3Container} style={{width: '100%'}} /> {/* Ensure the container div takes up 100% width */}
    </div>
  );
};
