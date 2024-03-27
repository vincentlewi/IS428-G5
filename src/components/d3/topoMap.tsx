import * as d3 from 'd3';
import { feature,  } from 'topojson-client';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import sg from '@/assets/datasets/map/sgtopo.json'
import { Topology, Objects } from 'topojson-specification';

type MapProps = {
  width: number;
  height: number;
};

export default function TopoMap({ width, height }: MapProps) {
  const sgTopology: Topology<Objects<GeoJsonProperties>> = sg as any;
 
  const data = feature(sgTopology, sgTopology.objects['sg-']) as FeatureCollection<Geometry, GeoJsonProperties>;

  const projection = d3
    .geoMercator()
    .fitSize([width, height], data)
  const geoPathGenerator = d3.geoPath().projection(projection);

  const allSvgPaths = data.features
  .map((shape) => {
    const pathData = geoPathGenerator(shape);
    // Ensure pathData does not include "NaN" before creating the path element
    if (pathData && !pathData.includes("NaN")) {
      return (
        <path
          key={shape.properties?.OBJECTID}
          d={pathData}
          stroke="lightGrey"
          strokeWidth={0.5}
          fill="grey"
          fillOpacity={0.7}
        />
      );
    }
  }).filter(Boolean); // Removes any undefined paths that result from including "NaN"

  return (
    <div>
      <svg width={width} height={height}>
        {allSvgPaths}
      </svg>
    </div>
  );
};