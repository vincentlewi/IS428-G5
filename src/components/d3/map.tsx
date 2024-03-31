import * as d3 from 'd3'
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson'
import { useState, useRef, useEffect } from 'react'
import sg from '@/assets/map/sg.json'
import busIcon from "@/assets/bus.svg";
import mrtlrtIcon from "@/assets/mrtlrt.svg";
import hawkerIcon from "@/assets/hawker.svg";
import supermarketIcon from "@/assets/supermarket.svg";
import mallIcon from "@/assets/mall.svg";
import parkIcon from "@/assets/park.svg";
import schoolIcon from "@/assets/school.svg";
import busLocations from "@/assets/datasets/bus.json";
import hawkerLocations from "@/assets/datasets/hawker.json";
import mallsLocations from "@/assets/datasets/malls.json";
import mrtlrtLocations from "@/assets/datasets/mrtlrt.json";  
import parksLocations from "@/assets/datasets/parks.json";
import schoolsLocations from "@/assets/datasets/schools.json";
import supermarketLocations from "@/assets/datasets/schools.json";

type MapProps = {
  width: number
  height: number
  points?: House[]
  selectedAmenity?: string
}
interface House {
  LATITUDE: string
  LONGITUDE: string
  address: string
  town: string
  region: string
  flat_type: string
  floor_area_sqm: number
  score: number
  resale_price: number
  remaining_lease: number
  price_per_sqm: number
  'bus_within_0.5': number
  'school_within_2.0': number
  'mall_within_2.0': number
  'supermarket_within_0.5': number
  cbd_distance: number
  hawker_distance: number
  park_distance: number
  mrtlrt_distance: number
}
const amenities = {
  'bus': { locations: busLocations, icon: busIcon},
  'hawker': { locations: hawkerLocations, icon: hawkerIcon},
  'mall': { locations: mallsLocations, icon: mallIcon},
  'mrtlrt': { locations: mrtlrtLocations, icon: mrtlrtIcon},
  'park': { locations: parksLocations, icon: parkIcon},
  'school': { locations: schoolsLocations, icon: schoolIcon},
  'supermarket': { locations: supermarketLocations, icon: supermarketIcon},
}

export default function Map({ width, height, points, selectedAmenity }: MapProps) {
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
      .selectAll('path, circle, image')
      .transition()
      .duration(750)
      .attr('transform', `translate(${translate}) scale(${scale})`)
  }

  const resetZoom = () => {
    d3.select(gRef.current)
      .selectAll('path, circle, image')
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

  // Recommended HDB Points
  const [svgPoints, setSvgPoints] = useState<JSX.Element[]>([])
  useEffect(() => {
    if (points) {
      const newPoints = points.map(point => {
        const projected = projection([+point.LONGITUDE, +point.LATITUDE]);
        // You can customize these attributes
        const circleAttributes: React.SVGProps<SVGCircleElement> = {
          cx: projected[0],
          cy: projected[1],
          r: 4, // Example radius
          fill: 'red', // Example fill color
          style: { pointerEvents: 'none' } as React.CSSProperties,
          key: `${point.address} ${point.town} ${point.flat_type}`,
        };
        return (
          <circle
            {...circleAttributes}
            // Add more attributes & event listeners as needed
          />
        );
      });
      setSvgPoints(newPoints);
    }
  }, [points])

  // Selected Amenity Points
  const [svgAmenity, setSvgAmenity] = useState<JSX.Element[]>([])
  useEffect(() => {
    if (selectedAmenity) {
      const newPoints = amenities[selectedAmenity].locations.map(amenity => {
        const projected = projection([+amenity.LONGITUDE, +amenity.LATITUDE]);
        // Customize these attributes as needed
        const imageAttributes = {
          href: amenities[selectedAmenity].icon,
          width: 5,
          height: 5,
          x: projected[0] - 2.5, // Centering the icon
          y: projected[1] - 2.5, // Centering the icon
          style: { pointerEvents: 'none' } as React.CSSProperties,
        };
        return (
          <image
            key={`${amenity.QUERY} ${amenity.LATITUDE},${amenity.LONGITUDE}`}
            {...imageAttributes}
          />
        );
      });
      setSvgAmenity(newPoints);
    } else {
      setSvgAmenity([])
    }
  }, [selectedAmenity])

  return (
    <svg ref={svgRef} width={width} height={height} onClick={handleMapContainerClick}>
      <g ref={gRef}>
        {allSvgPaths}
        {svgAmenity}
        {svgPoints}
      </g>
    </svg>
  )
}