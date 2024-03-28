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
interface HdbDataEntry {
  town: string;
  flat_type: string;
  year: string;
  resale_price: string; // or number if the CSV is preprocessed correctly
  // ... include other properties as needed
}

interface IncomeDataEntry {
  year: string;
  flat_type: string;
  average_household_income: string; // or number if the CSV is preprocessed correctly
}

interface RatioDataEntry {
  year: Date;
  flat_type: string;
  ratio: number;
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
  const [ratioData, setRatioData] = useState<RatioDataEntry[]>([]);

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

  useEffect(() => {
    // Load both datasets
    Promise.all([
      d3.csv("../../datasets/hdb_scaled.csv"),
      d3.csv("../../datasets/average_income_by_household.csv"),
    ])
      .then(([hdbData, incomeData]) => {
        // Process hdbData
        const hdbProcessed: HdbDataEntry[] = hdbData.map((d) => ({
          ...d,
          year: d3.timeParse("%Y")(d.year),
          resale_price: +d.resale_price,
        }));

        // Process incomeData
        const incomeProcessed: IncomeDataEntry[] = incomeData.map((d) => ({
          ...d,
          year: d3.timeParse("%Y")(d.year),
          average_household_income: +d.average_household_income,
        }));

        // Group and calculate average resale price by flat_type and year
        const avgResalePrice = d3
          .rollups(
            hdbProcessed,
            (v) => d3.mean(v, (d) => d.resale_price),
            (d) => d.year!.getFullYear().toString(), // Assertion since year is a Date object now
            (d) => d.flat_type
          )
          .map(([year, types]) => {
            const yearObj: { [key: string]: any } = {
              year: d3.timeParse("%Y")(year),
            };
            types.forEach(([type, avgPrice]) => {
              yearObj[type] = avgPrice;
            });
            return yearObj;
          });

        // Calculate ratio
        const ratios: RatioDataEntry[] = incomeProcessed
          .map((d) => {
            const year = d.year!.getFullYear().toString(); // Assertion since year is a Date object now
            const matchingYearData = avgResalePrice.find(
              (y) => y.year.getFullYear().toString() === year
            );
            if (matchingYearData) {
              const ratio =
                matchingYearData[d.flat_type] / d.average_household_income;
              return {
                year: d.year!,
                flat_type: d.flat_type,
                ratio: ratio || 0, // Handle potential division by zero or undefined values
              };
            }
            return null; // Or handle missing data as needed
          })
          .filter((d) => d !== null) as RatioDataEntry[];

        // Update state with the processed data
        setRatioData(ratios);
        // Log to verify the data
      })
      .catch((error) => {
        console.error("Error loading data: ", error);
      });
  }, []);

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
      <OwnershipTimeChart
        data={ratioData}
        selectedYear={selectedYear}
        selectedFlatType={selectedFlatTypes} // Make sure this matches the prop expected by OwnershipTimeChart
      />
    </>
  );
}


// import React, { useEffect, useState } from "react";
// import "./Overview.css";
// import Nav from "@/components/ui/nav";
// import { Button } from "@/components/ui/button";
// import Resale_Flat_Hdb from "@/components/d3/Resale_Flat_Hdb";
// import OwnershipTimeChart from "@/components/d3/OwnershipTimeChart";
// import MedianMaturityPriceChart from "@/components/d3/medianmaturity";
// import * as d3 from "d3";

// interface DataEntry {
//   year: string;
//   maturity: string;
//   flat_type: string;
//   adjusted_price: number;
//   town_classification: string;
//   resale_price: string;
//   average_household_income: string;
// }

// interface MedianAdjustedPriceEntry {
//   year: Date;
//   mature: number;
//   nonMature: number;
// }

// interface RatioDataEntry {
//   year: Date;
//   flat_type: string;
//   ratio: number;
// }

// interface IncomeDataEntry {
//   year: string;
//   flat_type: string;
//   average_household_income: number; // Ensure this is number after loading and conversion
// }

// export default function Overview() {
//   const [data, setData] = useState<DataEntry[]>([]);
//   const [years, setYears] = useState<string[]>([]);
//   const [maturityEstates, setMaturityEstates] = useState<string[]>([]);
//   const [flatTypes, setFlatTypes] = useState<string[]>([]);
//   const [selectedFilter, setSelectedFilter] = useState<{
//     year: string;
//     maturity: string;
//     flatTypes: string[];
//   }>({ year: "all", maturity: "All", flatTypes: [] });

//   const [medianAdjustedPrices, setMedianAdjustedPrices] = useState<
//     MedianAdjustedPriceEntry[]
//   >([]);
//   const [ratioData, setRatioData] = useState<RatioDataEntry[]>([]);
//   const [hdbData, setHdbData] = useState<DataEntry[]>([]);
//   const [incomeData, setIncomeData] = useState<IncomeDataEntry[]>([]);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const [hdbData, incomeData] = await Promise.all([
//           d3.csv("../../datasets/hdb_scaled.csv"),
//           d3.csv("../../datasets/average_income_by_household.csv"),
//         ]);

//         const loadedData: DataEntry[] = hdbData.map((d) => ({
//           ...d,
//           year: d.year,
//           maturity: d.maturity,
//           flat_type: d.flat_type,
//           adjusted_price: +d.adjusted_price,
//           town_classification: d.town_classification,
//           resale_price: d.resale_price,
//           average_household_income:
//             incomeData.find(
//               (i) => i.year === d.year && i.flat_type === d.flat_type
//             )?.average_household_income || "0",
//         }));

//         const uniqueYears: string[] = [
//           "all",
//           ...new Set(loadedData.map((d) => d.year)),
//         ].sort();
//         const uniqueMaturities: string[] = [
//           "All",
//           ...new Set(loadedData.map((d) => d.maturity)),
//         ].sort();
//         const uniqueFlatTypes: string[] = [
//           "all",
//           ...new Set(loadedData.map((d) => d.flat_type)),
//         ].sort();

//         setYears(uniqueYears);
//         setMaturityEstates(uniqueMaturities);
//         setFlatTypes(uniqueFlatTypes);
//         setData(loadedData);

//         const processedData = calculateMedianAdjustedPrices(
//           filterData(loadedData, selectedFilter)
//         );
//         setMedianAdjustedPrices(processedData);

//         const ratios = calculateRatioData(loadedData);
//         setRatioData(ratios);
//       } catch (error) {
//         console.error("Error loading data: ", error);
//       }
//     };

//     loadData();
//   }, [selectedFilter]);

//   const filterData = (data: DataEntry[], filter: typeof selectedFilter) => {
//     return data.filter(
//       (d) =>
//         (filter.year === "all" || d.year === filter.year) &&
//         (filter.maturity === "All" || d.maturity === filter.maturity) &&
//         (filter.flatTypes.length === 0 ||
//           filter.flatTypes.includes(d.flat_type))
//     );
//   };

//   const calculateMedianAdjustedPrices = (
//     filteredData: DataEntry[]
//   ): MedianAdjustedPriceEntry[] => {
//     const parseYear = d3.timeParse("%Y");
//     const groupedByYear = d3.groups(filteredData, (d) => d.year);

//     return groupedByYear.map(([year, entries]) => {
//       const matureEntries = entries.filter(
//         (e) => e.town_classification === "Mature"
//       );
//       const nonMatureEntries = entries.filter(
//         (e) => e.town_classification === "Non-Mature"
//       );

//       const matureMedian =
//         matureEntries.length > 0
//           ? d3.median(matureEntries, (e) => e.adjusted_price)
//           : 0;
//       const nonMatureMedian =
//         nonMatureEntries.length > 0
//           ? d3.median(nonMatureEntries, (e) => e.adjusted_price)
//           : 0;
//       return {
//         year: parseYear(year),
//         mature: matureMedian,
//         nonMature: nonMatureMedian,
//       };
//     });
//   };

//   const calculateRatioData = (
//     hdbData: DataEntry[],
//     incomeData: IncomeDataEntry[]
//   ): RatioDataEntry[] => {
//     // Convert 'year' in incomeData to a comparable format with hdbData if necessary
//     const incomeMap = new Map<string, number>();
//     incomeData.forEach((item) => {
//       const key = `${item.year}-${item.flat_type}`;
//       incomeMap.set(key, item.average_household_income);
//     });

//     return hdbData
//       .map((hdbEntry) => {
//         const incomeKey = `${hdbEntry.year}-${hdbEntry.flat_type}`;
//         const income = incomeMap.get(incomeKey);

//         // Handle missing income data by setting ratio to null (or 0, depending on your preference)
//         if (!income) {
//           return null;
//         }

//         const ratio = +hdbEntry.resale_price / income;
//         return {
//           year: d3.timeParse("%Y")(hdbEntry.year) as Date,
//           flat_type: hdbEntry.flat_type,
//           ratio: ratio,
//         };
//       })
//       .filter((entry): entry is RatioDataEntry => entry !== null);
//   };

//   const handleFilterChange = (
//     event: React.ChangeEvent<HTMLSelectElement>,
//     filterType: "year" | "maturity" | "flatTypes"
//   ) => {
//     const value =
//       filterType === "flatTypes"
//         ? Array.from(event.target.selectedOptions, (option) => option.value)
//         : event.target.value;

//     setSelectedFilter((prevFilter) => ({
//       ...prevFilter,
//       [filterType]: value,
//     }));
//   };

//   const filteredData = filterData(data, selectedFilter);

//   return (
//     <>
//       <Nav activePage="overview" />
//       <div className="overview">
//         <h1>Finding Home is Difficult</h1>

//         {/* Year Selector */}
//         <div className="filter-selector">
//           <label htmlFor="year-select">Select Year: </label>
//           <select
//             id="year-select"
//             value={selectedFilter.year}
//             onChange={(e) => handleFilterChange(e, "year")}
//           >
//             {years.map((year) => (
//               <option key={year} value={year}>
//                 {year}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Flat Type Selector */}
//         <div className="filter-selector">
//           <label htmlFor="flat-type-select">Flat Type: </label>
//           <select
//             multiple
//             id="flat-type-select"
//             value={selectedFilter.flatTypes}
//             onChange={(e) => handleFilterChange(e, "flatTypes")}
//             size={flatTypes.length}
//           >
//             {flatTypes.map((type) => (
//               <option key={type} value={type}>
//                 {type}
//               </option>
//             ))}
//           </select>
//         </div>

//         <Resale_Flat_Hdb data={filteredData} selectedFilter={selectedFilter} />
//       </div>

//       <MedianMaturityPriceChart
//         data={medianAdjustedPrices}
//         selectedFilter={selectedFilter}
//       />
//       <OwnershipTimeChart data={ratioData} selectedFilter={selectedFilter} />
//     </>
//   );
// }
