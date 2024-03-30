import React, { useEffect, useState } from "react";
import Radar from "react-d3-radar";

const defaultVariableOptions = [
  { key: "BusStops", label: "Bus stops within 500m" },
  { key: "Schools", label: "Schools within 2km" },
  { key: "Malls", label: "Malls within 2km" },
  { key: "Supermarkets", label: "Supermarkets within 500m" },
  { key: "CBD", label: "Distance to CBD" },
  { key: "Hawker", label: "Distance to nearest hawker" },
  { key: "Park", label: "Distance to nearest park" },
  { key: "MRTLRT", label: "Distance to nearest MRT/LRT" },
];

// const defaultVariableOptions = [
//     { key: "BusStops", label: "BusStops" },
//     { key: "Schools", label: "Schools" },
//     { key: "Malls", label: "Malls" },
//     { key: "Supermarkets", label: "Supermarkets" },
//     { key: "CBD", label: "CBD" },
//     { key: "Hawker", label: "Hawker" },
//     { key: "Park", label: "Park" },
//     { key: "MRTLRT", label: "MRTLRT" },

const DiscoveryRadar = ({ options = { variables: [], sets: [] } }) => {
  const sets = options.sets
  const [chartData, setChartData] = useState({
    variables: [...defaultVariableOptions],
    sets: [sets],
  });
  

  const transformedData = options.sets.map((item) => ({
    key: item.address,
    label: item.town,
    values: {
      BusStops: ((Math.log(+item['bus_within_0.5'] + 1) / 2.772588722239781) - 0.500000) / (1.403677-0.5), 
      Schools: (Math.log(+item['school_within_2.0'] + 1) / 2.833213344056216) / 1.327539,
      Malls: (Math.log(+item['mall_within_2.0'] + 1) / 1.791759469228055) / 2.015292,
      Supermarkets: (Math.log(+item['supermarket_within_0.5'] + 1) / 1.0986122886681098) / 2.182658,
      CBD: ((2.6561072220310518 - Math.log(+item['cbd_distance'] + 1)) - (-1.346968)) /  (2.124915 - (-1.346968)),
      Hawker: ((0.4868281744936002 - Math.log(+item['hawker_distance'] + 1)) - (-1.566642)) / (4.453686 - (-1.566642)),
      Park: ((0.5096731599345877 - Math.log(+item['park_distance'] + 1)) - (-1.370654	)) / (2.588678 - (-1.370654	)),
      MRTLRT: ((0.4227980215034163 - Math.log(+item['mrtlrt_distance'] + 1)) - (-1.834655)) / (3.268846 - (-1.834655)),
    }
  }));

  useEffect(() => {
    // Update the chart data only if options are provided
    // if (transformedData) { 
      setChartData({
        variables: defaultVariableOptions,
        sets: transformedData,
      });
    // }
  }, [sets]); 

  return (
    <div>
    <Radar
      width={400}
      height={400}
      padding={30}
      domainMax={1} 
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
    </div>
  );
};

export default DiscoveryRadar;
