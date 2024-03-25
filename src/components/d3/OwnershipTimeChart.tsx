// OwnershipTimeChart.tsx

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface IncomeDataEntry {
  year: string;
  average_household_income: number;
  flat_type: string;
}

interface OwnershipTimeChartProps {
  data: IncomeDataEntry[];
  selectedYear: string;
  selectedFlatType: string;
}

const OwnershipTimeChart: React.FC<OwnershipTimeChartProps> = ({
  data,
  selectedYear,
  selectedFlatType,
}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (data.length > 0) {
      // Process and filter the data
      const parseYear = d3.timeParse("%Y");
      const processedData = data
        .filter(d => selectedFlatType === "all" || d.flat_type === selectedFlatType)
        .map(d => ({
          ...d,
          year: parseYear(d.year),
        }))
        .filter(d => d.year);

      const filteredData = selectedYear === "all"
        ? processedData
        : processedData.filter(d => d.year.getFullYear().toString() === selectedYear);

      // Continue with the rest of your D3 code here to render the chart
      // You can use the filteredData to draw your line chart
    }
  }, [data, selectedYear, selectedFlatType]);

  return <div ref={chartRef} />;
};

export default OwnershipTimeChart;
