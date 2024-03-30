import { useMemo } from "react";
import { Tree, data } from "@/assets/datasets/treemap_data";
import * as d3 from "d3";
import styles from "./treemap.module.css"


const Treemap = () => {
  const hierarchy = useMemo(() => {
    return d3.hierarchy(data).sum((d) => d.value).sort((a,b) => b.value - a.value)
  }, [data]);

  const width = 800
  const height = 600



  const root = useMemo(() => {
    const treeGenerator = d3.treemap<Tree>().size([width, height]).padding(4);
    return treeGenerator(hierarchy);
  }, [hierarchy, width, height]);

  const valueExtent = useMemo(() => {
    return [root.leaves()[0]?.value, root.leaves().slice(-1)[0]?.value];
  }, [root.leaves()]);

const colorScale = d3.scaleLinear()
    .domain([valueExtent[1], valueExtent[0]])
    .range([d3.color("#b3cde3") as unknown as number, d3.color("#08306b") as unknown as number]); // Soft blue to dark blue



  const allShapes = root.leaves().map((leaf) => {
    return (
      <g key={leaf.id} className={styles.rectangle}>
        <rect
            x={leaf.x0}
            y={leaf.y0}
            width={leaf.x1 - leaf.x0}
            height={leaf.y1 - leaf.y0}
            stroke="transparent"
            fill={colorScale(leaf.value).toString()} // Convert number to string
            className={"opacity-80 hover:opacity-100"}
        />
        <text
          x={leaf.x0 + 3}
          y={leaf.y0 + 3}
          fontSize={12}
          textAnchor="start"
          alignmentBaseline="hanging"
          fill="white"
          className="font-bold"
        >
          {leaf.data.name}
        </text>
        <text
          x={leaf.x0 + 3}
          y={leaf.y0 + 18}
          fontSize={12}
          textAnchor="start"
          alignmentBaseline="hanging"
          fill="white"
          className="font-light"
        >
          {leaf.data.value}%
        </text>
      </g>
    );
  });

  return (
    <div>
      <svg width={width} height={height} className={styles.container}>
        {allShapes}
      </svg>
    </div>
  );
};

export default Treemap