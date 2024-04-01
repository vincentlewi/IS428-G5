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

const DiscoveryRadar = ({ options = { variables: [], sets: [] }, hovered }) => {
  const sets = options.sets
  const [chartData, setChartData] = useState({
    variables: [...defaultVariableOptions],
    sets: [sets],
  });
  

  const transformedData = options.sets.map((item) => ({
    key: `${item.address} ${item.town} ${item.flat_type}`,
    label: item.town,
    values: {
      BusStops: ((Math.log(+item['bus_within_0.5'] + 1) / 2.833213344056216) - 0.489301084236452) / (1.373641807199326 - 0.489301084236452), 
      Schools: ((Math.log(+item['school_within_2.0'] + 1) / 2.833213344056216) - 0) / (1.327538613914891 - 0),
      Malls: ((Math.log(+item['mall_within_2.0'] + 1) / 1.791759469228055) - 0) / (1.859738746970775 - 0),
      Supermarkets: ((Math.log(+item['supermarket_within_0.5'] + 1) / 1.0986122886681098) - 0) / (2.182658338644138 - 0),
      CBD: ((2.6918131575504636 - Math.log(+item['cbd_distance'] + 1)) - (-0.35970338335873064)) /  (1.7775188171402796 - (-0.35970338335873064)),
      Hawker: ((0.5280186725354765 - Math.log(+item['hawker_distance'] + 1)) - (-0.8246116087100726)) / (0.49930002895364245 - (-0.8246116087100726)),
      Park: ((0.5125843761855321 - Math.log(+item['park_distance'] + 1)) - (-0.7146231004033047)) / (0.4552574209939195 - (-0.7146231004033047	)),
      MRTLRT: ((0.43037103127764664 - Math.log(+item['mrtlrt_distance'] + 1)) - (-1.0773561414005774)) / (0.40923204240852556 - (-1.0773561414005774)),
    }
  }));

  useEffect(() => {
      setChartData({
        variables: defaultVariableOptions,
        sets: transformedData,
      });
  }, [sets]); 

  const [highlighted, setHighlighted] = useState('');

  useEffect(() => {
    setHighlighted(hovered);
  }, [hovered]);

  return (
    <div>
    <Radar
      width={400}
      height={400}
      padding={30}
      domainMax={1} 
      highlighted={{"setKey": highlighted}}
      // onHover={(e) => console.log(e)}
      data={{
        variables: chartData.variables,
        sets: chartData.sets
      }}
    />
    </div>
  );
};

export default DiscoveryRadar;
