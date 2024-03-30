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
  selectedFilter: {
    year: string[];
    flatTypes: string[]; // Ensure this matches the structure in Overview.tsx
  };
}

const MedianMaturityPriceChart: React.FC<Props> = ({ data, selectedFilter }) => {
  const d3Container = useRef<SVGSVGElement | null>(null);
  const [mature, setMature] = useState<MedianAdjustedPriceEntry[]>([]);
  const [nonMature, setNonMature] = useState<MedianAdjustedPriceEntry[]>([]);
  useEffect(() => {
    if (data && d3Container.current) {
      const svgElement = d3Container.current;
      const margin = { top: 70, right: 30, bottom: 40, left: 80 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

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

      const minYear = d3.min(maturePrice, (d) => new Date(d.year));
      const maxYear = d3.max(maturePrice, (d) => new Date(d.year));

      // Scales
      const xScale = d3
        .scaleTime()
        .domain([minYear || 0, maxYear|| 0])
        .range([0, width]);

      const yScale = d3
        .scaleLinear()
        // .domain([0, d3.max(data, (d) => Math.max(d.resale_price)) || 0])
        .domain([0, d3.max([...mature, ...nonMature], (d) => d.resale_price) || 0])
        .range([height, 0]);

      // Line generators
      const lineMature = d3
        .line<MedianAdjustedPriceEntry>()
        .x((mature) => xScale(new Date(mature.year)))
        .y((mature) => yScale(mature.resale_price));

      const lineNonMature = d3
        .line<MedianAdjustedPriceEntry>()
        .x((nonMature) => xScale(new Date(nonMature.year)))
        .y((nonMature) => yScale(nonMature.resale_price));

      // Draw lines
      g.append("path")
        .datum(mature)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", lineMature);

      g.append("path")
        .datum(nonMature)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", lineNonMature);

      // Axes
      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

      g.append("g").call(d3.axisLeft(yScale));
    }
  }, [data, selectedFilter]);

  return <svg ref={d3Container} />;
};

export default MedianMaturityPriceChart;
