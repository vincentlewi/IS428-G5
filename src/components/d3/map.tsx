import * as d3 from 'd3'
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson'
import sg from '@/assets/map/sg.json'
import { useState, useRef } from 'react'

type MapProps = {
  width: number
  height: number
  points: { LATITUDE: string, LONGITUDE: string, address: string, town: string, flat_type: string }[]
}

export default function Map({ width, height, points }: MapProps) {
  const data = sg as FeatureCollection<Geometry, GeoJsonProperties>
  const projection = d3
    .geoMercator()
    .fitSize([width, height], data)
  const geoPathGenerator = d3.geoPath().projection(projection)

  const svgRef = useRef<SVGSVGElement>(null)
  const gRef = useRef<SVGGElement>(null);
  const [lastClicked, setLastClicked] = useState(null)
  const onClickFeature = (feature: any) => {
    // Check if the same feature is clicked twice to reset
    if (feature === lastClicked) {
      resetZoom()
    } else {
      zoomIn(feature)
    }

    // Update the last clicked feature
    setLastClicked(feature === lastClicked ? null : feature)
  }

  const zoomIn = (feature: any) => {
    const bounds = geoPathGenerator.bounds(feature),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
      translate = [width / 2 - scale * x, height / 2 - scale * y]

    d3.select(gRef.current)
      .selectAll('path, circle')
      .transition()
      .duration(750)
      .attr('transform', `translate(${translate}) scale(${scale})`)
  }

  const resetZoom = () => {
    d3.select(gRef.current)
      .selectAll('path, circle')
      .transition()
      .duration(750)
      .attr('transform', '')
  }

  const handleMapContainerClick = (event: React.MouseEvent) => {
    // If the clicked element is the map container itself, reset zoom.
    if (event.target === event.currentTarget) {
      resetZoom()
      // Clear the last clicked feature state as well
      setLastClicked(null)
    }
  }

  const allSvgPaths = data.features  
  .map((shape) => {
    const pathData = geoPathGenerator(shape)
    // Ensure pathData does not include "NaN" before creating the path element
    if (pathData && !pathData.includes("NaN")) {
      const [areaColor, setAreaColor] = useState<string>("grey")
      const shapeRef = useRef<SVGPathElement>(null)
      return (
        <path
          ref={shapeRef}
          key={shape.properties?.PLN_AREA_N}
          d={pathData}
          stroke="lightGrey"
          strokeWidth={0.5}
          fill={shape === lastClicked ? "darkerGrey" : areaColor}
          cursor="pointer"
          onMouseOver={() => {setAreaColor("darkerGrey")}}
          onMouseLeave={() => {setAreaColor("grey")}}
          onClick={() => onClickFeature(shape)}
        />
      )
    }
  }).filter(Boolean) // Removes any undefined paths that result from including "NaN"

  const svgPoints = points.map(point => {
    const projected = projection([parseFloat(point.LONGITUDE), parseFloat(point.LATITUDE)]);
    // You can customize these attributes
    const circleAttributes = {
      cx: projected[0],
      cy: projected[1],
      r: 4, // Example radius
      fill: 'red', // Example fill color
    };
    return (
      <circle
        key={point.address}
        {...circleAttributes}
        // Add more attributes & event listeners as needed
      />
    );
  });

  return (
    <svg ref={svgRef} width={width} height={height} onClick={handleMapContainerClick}>
      <g ref={gRef}>
        {allSvgPaths}
        {svgPoints}
      </g>
    </svg>
  )
}