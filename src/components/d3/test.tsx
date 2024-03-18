import * as d3 from "d3";
import { useState, useMemo } from "react";

export default function Test() {
  const generateDataset = () =>
    Array(10)
      .fill(0)
      .map(() => [Math.random() * 80 + 10, Math.random() * 35 + 10]);
  const [dataset, setDataset] = useState(generateDataset());

  const Axis = () => {
    const ticks = useMemo(() => {
      const xScale = d3.scaleLinear().domain([0, 100]).range([10, 290]);
      return xScale.ticks().map((value) => ({
        value,
        xOffset: xScale(value),
      }));
    }, []);
  };

  return (
    <svg viewBox="0 0 100 50">
      {dataset.map(([x, y], i) => (
        <circle cx={x} cy={y} r="3" />
      ))}
    </svg>
  );
}
