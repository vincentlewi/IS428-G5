import React, { useEffect, useState } from "react";
import "./Overview.css";
import Nav from "@/components/ui/nav";
import { Button } from "@/components/ui/button";
import Resale_Flat_Hdb from "@/components/d3/Resale_Flat_Hdb";
import OwnershipTimeChart from "@/components/d3/OwnershipTimeChart";
import MedianMaturityPriceChart from "@/components/d3/medianmaturity";
import * as d3 from "d3";

interface DataEntry {
  year: string;
  maturity: string;
  flat_type: string;
  adjusted_price: number; // Assuming this is a number
  // Add other properties from your CSV data as needed
}
interface MedianAdjustedPriceEntry {
  year: Date; // Using Date type as we will parse the year for D3's time scale
  mature: number;
  nonMature: number;
}
type MedianAdjustedPrices = MedianAdjustedPriceEntry[];

export default function Overview() {
  const [data, setData] = useState<DataEntry[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [maturityEstates, setMaturityEstates] = useState<string[]>([
    "All",
    "Mature",
    "Non-Mature",
  ]);
  const [flatTypes, setFlatTypes] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedMaturity, setSelectedMaturity] = useState<string>("All");
  const [selectedFlatTypes, setSelectedFlatTypes] = useState<string[]>([]);

  useEffect(() => {
    d3.csv("../../datasets/hdb_scaled.csv")
      .then((loadedData: DataEntry[]) => {
        const uniqueYears: string[] = [
          "all",
          ...new Set(loadedData.map((d) => d.year)),
        ].sort();
        const uniqueMaturities: string[] = [
          "All",
          ...new Set(loadedData.map((d) => d.maturity)),
        ].sort();
        const uniqueFlatTypes: string[] = [
          "all",
          ...new Set(loadedData.map((d) => d.flat_type)),
        ].sort();

        setYears(uniqueYears);
        // Assuming 'maturity' and 'flat_type' are the correct property names in your CSV
        setMaturityEstates(uniqueMaturities);
        setFlatTypes(uniqueFlatTypes);
        setData(loadedData);
      })
      .catch((error) => {
        console.error("Error loading CSV:", error);
      });
  }, []);
  useEffect(() => {
    // Only attempt to calculate if the initial data is loaded
    if (data.length > 0) {
      const processedData = calculateMedianAdjustedPrices(
        data
          .filter((d) => selectedYear === "all" || d.year === selectedYear)
          .filter(
            (d) => selectedMaturity === "All" || d.maturity === selectedMaturity
          )
          .filter(
            (d) =>
              selectedFlatTypes.length === 0 ||
              selectedFlatTypes.includes(d.flat_type)
          )
      );
      setMedianAdjustedPrices(processedData);
    }
  }, [data, selectedYear, selectedMaturity, selectedFlatTypes]); // Update dependencies array here too

  const calculateMedianAdjustedPrices = (
    filteredData: DataEntry[]
  ): MedianAdjustedPriceEntry[] => {
    const parseYear = d3.timeParse("%Y");
    const groupedByYear = d3.groups(filteredData, (d) => d.year);

    return groupedByYear.map(([year, entries]) => {
      const matureEntries = entries.filter(
        (e) => e.town_classification === "Mature"
      );
      const nonMatureEntries = entries.filter(
        (e) => e.town_classification === "Non-Mature"
      );

      const matureMedian =
        matureEntries.length > 0
          ? d3.median(matureEntries, (e) => e.adjusted_price)
          : 0;
      const nonMatureMedian =
        nonMatureEntries.length > 0
          ? d3.median(nonMatureEntries, (e) => e.adjusted_price)
          : 0;

      return {
        year: parseYear(year), // Make sure this parsing matches the date format in your dataset
        mature: matureMedian,
        nonMature: nonMatureMedian,
      };
    });
  };

  const [medianAdjustedPrices, setMedianAdjustedPrices] = useState<
    MedianAdjustedPriceEntry[]
  >([]);

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(event.target.value);
  };

  const handleFlatTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    // Get all selected options and map them to their values
    const values = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedFlatTypes(values);
  };

  // Dynamically filter the data based on the selected year, maturity, and flat type
  const filteredData = data
    .filter((d) => selectedYear === "all" || d.year === selectedYear)
    .filter(
      (d) => selectedMaturity === "All" || d.maturity === selectedMaturity
    )
    .filter(
      (d) =>
        selectedFlatTypes.length === 0 ||
        selectedFlatTypes.includes(d.flat_type)
    );

  return (
    <>
      <Nav activePage="overview" />
      <div className="overview">
        <h1>Finding Home is Difficult</h1>

        {/* Year Selector */}
        <div className="filter-selector">
          <label htmlFor="year-select">Select Year: </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={handleYearChange}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Flat Type Selector */}
        <div className="filter-selector">
          <label htmlFor="flat-type-select">Flat Type: </label>
          <select
            multiple
            id="flat-type-select"
            value={selectedFlatTypes}
            onChange={handleFlatTypeChange}
            size={flatTypes.length} // This determines how many options are shown at once
          >
            {flatTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <Resale_Flat_Hdb
          data={filteredData}
          selectedYear={selectedYear}
          selectedMaturity={selectedMaturity}
          selectedFlatTypes={selectedFlatTypes} // Ensure this prop is correctly handled in the child component
        />
      </div>

      <MedianMaturityPriceChart
        data={medianAdjustedPrices}
        selectedYear={selectedYear}
        selectedMaturity={selectedMaturity}
        selectedFlatTypes={selectedFlatTypes}
      />
    </>
  );
}
