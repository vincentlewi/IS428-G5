import React, { useEffect, useState } from "react";
import Radar from "react-d3-radar";

const defaultVariableOptions = [
  { key: "resilience", label: "Resilience" },
  { key: "strength", label: "Strength" },
  { key: "adaptability", label: "Adaptability" },
  { key: "creativity", label: "Creativity" },
  { key: "openness", label: "Open to Change" },
  { key: "confidence", label: "Confidence" },
  { key: "goblog", label: "goblog" },
];

const defaultSetOptions = [
  {
    key: "me",
    label: "My Scores",
    values: {
      resilience: 4,
      strength: 6,
      adaptability: 7,
      creativity: 2,
      openness: 8,
      confidence: 1,
      goblog:10,
    },
  },
  {
    key: "everyone",
    label: "Everyone",
    values: {
      resilience: 10,
      strength: 8,
      adaptability: 6,
      creativity: 4,
      openness: 2,
      confidence: 0,
      goblog:10
    },
  },
];

const DiscoveryRadar = ({ options = { variables: [], sets: [] } }) => {
  const [chartData, setChartData] = useState({
    variables: [...options.variables, ...defaultVariableOptions],
    sets: [...options.sets, ...defaultSetOptions],
  });

  useEffect(() => {
    // Update the chart data only if options are provided
    if (options.variables && options.sets) {
      setChartData({
        variables: [...options.variables, ...defaultVariableOptions],
        sets: [...options.sets, ...defaultSetOptions],
      });
    }
  }, [options]);


  return (
    <Radar
      width={500}
      height={500}
      padding={80}
    //   MAX VALUE`
      domainMax={20} 
      highlighted={null}
      onHover={(point) => {
        if (point) {
          console.log("hovered over a data point", point);
        } else {
          console.log("not over anything");
        }
      }}
      data={{
        variables: chartData.variables,
        sets: chartData.sets
      }}
    />
  );
};

export default DiscoveryRadar;
