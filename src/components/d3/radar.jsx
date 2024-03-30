import React, { useEffect, useState } from "react";
import Radar from "react-d3-radar";

const defaultVariableOptions = [
  { key: "BusStops", label: "BusStops" },
  { key: "Schools", label: "Schools" },
  { key: "Malls", label: "Malls" },
  { key: "Supermarkets", label: "Supermarkets" },
  { key: "CBD", label: "CBD" },
  { key: "Hawker", label: "Hawker" },
  { key: "Park", label: "Park" },
  { key: "MRTLRT", label: "MRTLRT" },
];

const defaultSetOptions = [
  {
    key: "me",
    label: "My Scores",
    values: {
        BusStops: 4,
        Schools: 6,
        Malls: 7,
        Supermarkets: 2,
        CBD: 8,
        Hawker: 1,
        Park:10,
        MRTLRT:5
    },
  },
  {
    key: "everyone",
    label: "Everyone",
    values: {
        BusStops: 4,
        Schools: 6,
        Malls: 7,
        Supermarkets: 2,
        CBD: 8,
        Hawker: 1,
        Park:10,
        MRTLRT:5
    },
  },
];

const DiscoveryRadar = ({ options = { variables: [], sets: [] } }) => {
  const [chartData, setChartData] = useState({
    variables: [...defaultVariableOptions],
    sets: [...options.sets],
  });

  const transformedData = options.sets.map((item) => ({
      BusStops: (+item['bus_within_0.5'] - 3) / (48-3) * 10, 
      Schools: (+item['school_within_2.0'] - 0) / (42)* 10,
      Malls: (+item['mall_within_2.0'] - 0) / 36* 10,
      Supermarkets: (+item['supermarket_within_0.5'] - 0) / 10* 10,
      CBD: (parseFloat(item.cbd_distance) - 0.625748) / (20.147391 - 0.625748)* 10,
      Hawker: (parseFloat(item.hawker_distance) - 0.006965) / (2.867585-0.006965)* 10,
      Park: (parseFloat(item.park_distance) - 0.046005) / (2.411689-0.046005)* 10,
      MRTLRT: (parseFloat(item.mrtlrt_distance) - 0.021364) / (3.516454 - 0.021364)* 10,
    
  }));

  console.log(transformedData)
  console.log(options)
  

  useEffect(() => {
    // Update the chart data only if options are provided
    if (transformedData) {
      setChartData({
        variables: [...defaultVariableOptions],
        sets: [...transformedData],
      });
    }
  }, []);

  console.log(chartData)

  return (
    <Radar
      width={500}
      height={500}
      padding={150}
    //   MAX VALUE`
      domainMax={10} 
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
