import { useMemo, useRef, useEffect, useState } from "react";
import { Tree, data } from "@/assets/datasets/treemap_data";
import * as d3 from "d3";
import styles from "./treemap.module.css"

const nTree = 15

const Treemap = () => {
  const containerRef = useRef(null); // Create a ref for the parent container
  const [size, setSize] = useState({ width: 0, height: 450 }); // Initial size state

  useEffect(() => {
    // Function to update size state based on container's clientWidth
    const updateSize = () => {
      if (containerRef.current) {
        setSize({ width: containerRef.current.clientWidth, height: 450 });
      }
    };
    updateSize(); // Update size on mount
    window.addEventListener('resize', updateSize); // Add resize listener to keep track of size changes.
    return () => window.removeEventListener('resize', updateSize); // Clean-up the event listener on unmount
  }, []);
  
  // Modify data to include an "others" category for everything beyond the top 10 features.
  const modifiedData = useMemo(() => {
    if ('children' in data) {
      let sortedChildren = data.children.sort((a, b) => b.value - a.value);
      let topFeatures = sortedChildren.slice(0, nTree);
      let othersValue = sortedChildren.slice(nTree).reduce((acc, curr) => acc + curr.value, 0);
      // Ensure the 'Others' category complies with your Tree structure (add 'type' if needed)
      let modifiedChildren = [...topFeatures, {name: 'Others', value: othersValue, type: "leaf"}];
      
      return { ...data, children: modifiedChildren } as Tree;
    }
    return data;
  }, [data]);

  const hierarchy = useMemo(() => {
    return d3.hierarchy(modifiedData).sum((d) => d.value).sort((a, b) => b.value - a.value);
  }, [modifiedData]);

  const width = 600
  const height = 450

  const root = useMemo(() => {
    // Use dynamic width from size state
    const treeGenerator = d3.treemap<Tree>().size([size.width, size.height]).padding(4);
    return treeGenerator(hierarchy);
  }, [hierarchy, size.width, size.height]); // Depend on dynamic size

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
        {/* Title */}
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
        {/* Percentage */}
        <text
          x={leaf.x0 + 3}
          y={leaf.y0 + 18}
          fontSize={12}
          textAnchor="start"
          alignmentBaseline="hanging"
          fill="white"
          className="font-light"
        >
          {Math.round((leaf.data.value + Number.EPSILON) * 10) / 10}%
        </text>
      </g>
    );
  });

  return (
    <div ref={containerRef}> {/* Assign ref to the container */}
      <svg width="100%" height={size.height} className={styles.container}> {/* Set width to "100%" */}
        {allShapes}
      </svg>
    </div>
  );
};

export default Treemap