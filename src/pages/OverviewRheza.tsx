import React, { useEffect, useState } from "react";
import "./Overview.css";
import Nav from "@/components/ui/nav";
import { Button } from "@/components/ui/button";
import Resale_Flat_Hdb from "@/components/d3/Resale_Flat_Hdb";
import OwnershipTimeChart from "@/components/d3/OwnershipTimeChart";
import MedianMaturityPriceChart from "@/components/d3/medianmaturity";
// import MapVisualization from "@/components/d3/MapVisualization";
import * as d3 from "d3";

interface DataEntry {
  year: string;
  maturity: string;
  flat_type: string;
  adjusted_price: number;
  town_classification: string;
  resale_price: string;
  average_household_income: string;
}

interface MedianAdjustedPriceEntry {
  year: Date;
  mature: number;
  nonMature: number;
}

interface RatioDataEntry {
  year: Date;
  flat_type: string;
  ratio: number;
}

interface IncomeDataEntry {
  year: string;
  flat_type: string;
  average_household_income: number; // Ensure this is number after loading and conversion
}

export default function Overview() {
  const [data, setData] = useState<DataEntry[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [maturityEstates, setMaturityEstates] = useState<string[]>([]);
  const [flatTypes, setFlatTypes] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<{
    year: string[];
    maturity: string;
    flatTypes: string[];
  }>({ year: ["all"], maturity: "All", flatTypes: [] });

  const [medianAdjustedPrices, setMedianAdjustedPrices] = useState<
    MedianAdjustedPriceEntry[]
  >([]);
  const [ratioData, setRatioData] = useState<RatioDataEntry[]>([]);
  const [hdbData, setHdbData] = useState<DataEntry[]>([]);
  const [incomeData, setIncomeData] = useState<IncomeDataEntry[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [hdbData, incomeData] = await Promise.all([
          d3.csv("../../datasets/hdb_scaled.csv"),
          d3.csv("../../datasets/average_income_by_household.csv"),
        ]);

        const loadedData: DataEntry[] = hdbData.map((d) => ({
          ...d,
          year: d.year,
          maturity: d.maturity,
          flat_type: d.flat_type,
          adjusted_price: +d.adjusted_price,
          town_classification: d.town_classification,
          resale_price: d.resale_price,
          average_household_income:
            incomeData.find(
              (i) => i.year === d.year && i.flat_type === d.flat_type
            )?.average_household_income || "0",
        }));

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
        setMaturityEstates(uniqueMaturities);
        setFlatTypes(uniqueFlatTypes);
        setData(loadedData);

        const processedData = calculateMedianAdjustedPrices(
          filterData(loadedData, selectedFilter)
        );
        setMedianAdjustedPrices(processedData);

        // Convert string values to appropriate types
        const hdbProcessed = hdbData.map((d) => ({
          ...d,
          year: d.year,
          flat_type: d.flat_type,
          resale_price: +d.resale_price,
        }));

        const incomeProcessed = incomeData.map((d) => ({
          ...d,
          year: d.year,
          flat_type: d.flat_type.trim(), // Ensuring flat_type consistency
          average_household_income: +d.average_household_income,
        }));

        // Aggregate HDB data for average resale price by flat type and year
        const avgResalePriceByYearAndType = d3.rollups(
          hdbProcessed,
          (v) => d3.mean(v, (d) => d.resale_price),
          (d) => `${d.year}-${d.flat_type}`
        );

        const ratioData: RatioDataEntry[] = avgResalePriceByYearAndType
          .map(([key, avgResalePrice]) => {
            const [year, flat_type] = key.split("-");
            const incomeKey = key; // Matching key for income data
            const average_household_income = incomeProcessed.find(
              (d) => `${d.year}-${d.flat_type}` === incomeKey
            )?.average_household_income;

            return average_household_income
              ? {
                  year: d3.timeParse("%Y")(year) as Date, // Cast to Date to satisfy type expectation
                  flat_type,
                  ratio: avgResalePrice / average_household_income,
                }
              : null;
          })
          .filter((d): d is RatioDataEntry => d !== null); // Type guard to filter out nulls and satisfy TypeScript

        // Update state with the prepared ratioData
        const validRatioData = ratioData.filter(
          (d): d is RatioDataEntry => d !== undefined
        );
        setRatioData(validRatioData);

        setRatioData(ratioData);
      } catch (error) {
        console.error("Error loading data: ", error);
      }
    };

    loadData();
  }, [selectedFilter]);

  const filterData = (data: DataEntry[], filter: typeof selectedFilter) => {
    return data.filter(
      (d) =>
        (filter.year.includes("all") || filter.year.includes(d.year)) &&
        (filter.flatTypes.includes("all") ||
          filter.flatTypes.length === 0 || // You might not need this condition if "all" is always added
          filter.flatTypes.includes(d.flat_type))
    );
  };

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
        year: parseYear(year),
        mature: matureMedian,
        nonMature: nonMatureMedian,
      };
    });
  };
  const handleFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    filterType: "year" | "flatTypes"
  ) => {
    let value = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );

    // Special handling for "all" selection in flatTypes
    if (filterType === "flatTypes") {
      if (value.includes("all")) {
        value = ["all"]; // Reset to "all" only, or handle as needed
      }
    }

    setSelectedFilter((prevFilter) => ({
      ...prevFilter,
      [filterType]: value,
    }));
  };

  const filteredData = filterData(data, selectedFilter);

  return (
    <>
      <Nav activePage="overview" />
      <div className="overview">
        <h1>Finding Home is Difficult</h1>

        <div className="filter-selector">
          <label htmlFor="year-select">Select Year: </label>
          <select
            multiple // Added to enable multiple selections
            id="year-select"
            value={selectedFilter.year}
            onChange={(e) => handleFilterChange(e, "year")}
            size={years.length} // Adjust as needed
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
            value={selectedFilter.flatTypes}
            onChange={(e) => handleFilterChange(e, "flatTypes")}
            size={flatTypes.length}
          >
            <option value="all">All</option>
            {flatTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <Resale_Flat_Hdb data={filteredData} selectedFilter={selectedFilter} />
      </div>

      <MedianMaturityPriceChart
        data={medianAdjustedPrices}
        selectedFilter={selectedFilter}
      />
      <OwnershipTimeChart
        data={ratioData}
        selectedFilter={selectedFilter} // Change to pass the entire selectedFilter object
      />
    </>
  );
}
