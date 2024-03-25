import React, { useEffect, useState } from "react";
import "./Overview.css";
import Nav from "@/components/ui/nav";
import { Button } from "@/components/ui/button";
import Test from "@/components/d3/test";
import * as d3 from "d3";

export default function Overview() {
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    d3.csv("hdb_scaled.csv").then((loadedData) => {
      console.log("CSV data loaded:", loadedData);
      const years = Array.from(new Set(loadedData.map((d) => +d.year))).sort();
      setSelectedYear(years[0]);
      setData(loadedData);
    });
  }, []);

  return (
    <>
      <Nav activePage="overview" />
      <div className="overview">
        <h1>Finding Home is Difficult</h1>
        <p>Lorem ipsum...</p>
        <Button variant="outline">Button</Button>
        {data.length > 0 && selectedYear !== null ? (
          <Test data={data} selectedYear={selectedYear} />
        ) : null}
      </div>
    </>
  );
}
