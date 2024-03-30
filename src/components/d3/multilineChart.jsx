import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export default function multilineChart() {
  // interface FeatureDataPoint {
  //   year: string;
  //   Importances: number;
  // }

  // interface FeatureGroup {
  //   key: string;
  //   value: FeatureDataPoint[];
  // }

  const d3Container = useRef(null);
  const [dataset, setDataset] = useState([]);

  useEffect(() => {
    const fetchDataset = async () => {
      try {
        const response = await fetch('../../../src/assets/datasets/catboost_aggregated.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const json = await response.json();
        const groupedData = Array.from(d3.group(json, d => d["Features"]), ([key, value]) => ({ key, value }));
        setDataset(groupedData);
      } catch (error) {
        console.error('Error loading dataset:', error);
      }
    };

    fetchDataset();
  }, []);

  useEffect(() => {
    if (dataset.length > 0 && d3Container.current) {
        const margin = { top: 20, right: 20, bottom: 30, left: 60 };
        const legendMargin = { top: 20, right: 20, width: 150 };
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;
        const svgWidth = width + margin.left + margin.right + legendMargin.width + legendMargin.right + 100;
        const svgHeight = height + margin.top + margin.bottom;
        

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
        const legendSpace = 24; // Define spacing for the legend
        const legendRectSize = 12; // Define the size of the legend marker

        // Create a legend group element
        const legend = svg.selectAll('.legend')
        .data(dataset)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', (_, i) => `translate(${width + margin.left + margin.right}, ${i * legendSpace})`);

        // Draw legend rectangles
        legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', d => color(d.key))
        .style('stroke', d => color(d.key));

        // Draw legend text
        legend.append('text')
        .attr('x', legendRectSize + 5)
        .attr('y', legendRectSize - 2)
        .text(d => d.key)
        .attr('text-anchor', 'start')
        .style('alignment-baseline', 'middle')
        .style('fill', d => color(d.key));

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
