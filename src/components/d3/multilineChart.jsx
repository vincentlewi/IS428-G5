import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import input_data from "@/assets/datasets/catboost_aggregated.json"

export default function multilineChart() {

  const d3Container = useRef(null);

  const dataset = Array.from(d3.group(input_data, d => d["Features"]), ([key, value]) => ({ key, value }));


  useEffect(() => {
    if (dataset.length > 0 && d3Container.current) {
        const margin = { top: 20, right: 10, bottom: 100, left: 20 };
        const legendMargin = { top: 20, right: 20, width: 150 };
        const width = 600 - margin.left - margin.right;
        const height = 350 - margin.top - margin.bottom;
        const svgWidth = width + margin.left + margin.right + legendMargin.width + legendMargin.right + 100;
        const svgHeight = 500;
        

      // Remove any previous SVG
      d3.select(d3Container.current).selectAll('*').remove();

      // Append SVG object to the ref element
      const svg = d3.select(d3Container.current)
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Add X axis
      const x = d3.scalePoint()
        .domain(dataset[0].value.map(d => d.year))
        .range([0, width])
        .padding(0.5);

      svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x));

      // Compute maximum value in dataset for Y axis domain
    const maxY = d3.max(dataset.flatMap(group => group.value.map(point => point.Importances))) ?? 0;

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, maxY])
        .range([height, 0]);

    svg.append('g').call(d3.axisLeft(y));


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
        .attr('stroke-width', 1.5)
        .attr('d', d => lineGenerator(d.value));

        // Legend setup
      const legendRectSize = 10; // Size of the legend marker
      const legendSpacing = 5; // Space between legend marker and text
      const legendHeight = legendRectSize + legendSpacing;

      // Create legend below the chart
      dataset.forEach((d, i) => {
        const legend = svg.append('g')
          .attr('class', 'legend')
          .attr('transform', `translate(0, ${height + margin.bottom / 2 + (i * legendHeight)})`);

        legend.append('rect')
          .attr('width', legendRectSize)
          .attr('height', legendRectSize)
          .style('fill', color(d.key))
          .style('stroke', color(d.key));

        legend.append('text')
          .attr('x', legendRectSize + 5)
          .attr('y', legendRectSize / 2)
          .text(d.key)
          .attr('dy', '0.32em') // Vertically center text
          .attr('text-anchor', 'start')
          .attr('font-size', '10px')
          .style('alignment-baseline', 'middle')
          .style('fill', color(d.key));
      });

        svg.attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
        .attr('preserveAspectRatio', 'xMinYMin meet');

        const variablesToLabel = ["floor_area_sqm", "cbd_distance", "remaining_lease"];

        // For each feature group, add labels only for the specified variables
        dataset.forEach((featureGroup) => {
        if (variablesToLabel.includes(featureGroup.key)) {
            featureGroup.value.forEach((d) => {
            svg.append("text")
                .attr("x", x(d.year))
                .attr("y", y(d.Importances))
                .attr("dy", "-0.5em") // Adjust position above the circle
                .attr("text-anchor", "middle")
                .text(`${d.Importances.toFixed(2)}`) // Show the feature name and value
                .attr("font-size", "10px") // Adjust font size as needed
                .attr("fill", color(featureGroup.key)); // Use the color scale for consistency
            });
        }
        });


    }
  }, [dataset]); // Redraw chart if data changes

  return (
    <div>
      <div ref={d3Container} />
    </div>
  );
};
