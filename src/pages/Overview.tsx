import "./Overview.css";
import React, { useEffect, useState } from "react";
import Nav from "@/components/ui/nav";
import { Button } from "@/components/ui/button";
import Map from "@/components/d3/map";
import CustomContainer from "@/components/ui/customContainer";
import ScrollIntoView from "react-scroll-into-view";
import { ArrowBigDown } from "lucide-react";
import { Wave } from "react-animated-text";
import { useNavigate } from "react-router-dom";
// import OwnershipTimeChart from "@/components/d3/OwnershipTimeChart";
import Resale_Flat_Hdb from "@/components/d3/Resale_Flat_Hdb";
import MedianMaturityPriceChart from "@/components/d3/medianmaturity";
import * as d3 from "d3";
// import { Recommend } from "@/components/d3/recommend";

interface HDBData {
  town: string;
  flat_type: string;
  floor_area: number;
  resale_price: number;
  year: string;
  adjusted_price: number;
  price_per_sqm: number;
  adjusted_price_per_sqm: number;
  town_classification: string;
}

interface DataEntry {
  year: string;
  maturity: string;
  flat_type: string;
  adjusted_price: number;
  town_classification: string;
  resale_price: string;
  average_household_income: string;
}

interface IncomeData {
  year: string;
  flat_type: string;
  average_household_income: number;
}

interface MedianAdjustedPriceEntry {
  year: string;
  flat_type: string;
  town_classification: string;
  resale_price: number;
  adjusted_price: number;
  price_per_sqm: number;
  adjusted_price_per_sqm: number;
}

interface MaturityPrice {
  year: string;
  mature: Array<number>;
  nonMature: Array<number>;
}

interface RatioDataEntry {
  year: string;
  flat_type: string;
  ratio: number;
}

interface IncomeDataEntry {
  year: string;
  flat_type: string;
  average_household_income: number; // Ensure this is number after loading and conversion
}

interface Filter {
  year: Array<string>;
  flatTypes: Array<string>;
}

const preferences = {
  bus: 4,
  school: 1,
  mall: 2,
  supermarket: 1,
  cbd: 0,
  hawker: 1,
  park: 1,
  mrt: 2,
};

const filter = {
  min_price: 0,
  max_price: 1500000,
  min_remaining_lease: 0,
  region: "West",
  flat_type: "3 ROOM",
};

export default function Overview() {
  const [years, setYears] = useState<string[]>(["All"]);
  const [flatTypes, setFlatTypes] = useState<string[]>(["All"]);
  const [selectedFilter, setSelectedFilter] = useState<Filter>({
    year: years,
    flatTypes: flatTypes,
  });
  const [maturityPrice, setMaturityPrice] = useState<MaturityPrice[]>([
    {
      year: "",
      mature: [],
      nonMature: [],
    },
  ]);
  const [medianAdjustedPrices, setMedianAdjustedPrices] = useState<
    MedianAdjustedPriceEntry[]
  >([
    {
      year: "",
      flat_type: "",
      resale_price: 0,
      town_classification: "",
      adjusted_price: 0,
      price_per_sqm: 0,
      adjusted_price_per_sqm: 0,
    },
  ]);
  const [ratioData, setRatioData] = useState<RatioDataEntry[]>([]);
  const [hdbData, setHdbData] = useState<HDBData[]>([]);
  const [incomeData, setIncomeData] = useState<IncomeData[]>([]);
  const [filteredHDBData, setFilteredHDBData] = useState<HDBData[]>([]);

  // Upon initial load, fetch the data
  useEffect(() => {
    // Load HDB data from CSV files
    d3.csv("/datasets/hdb/hdb_scaled.csv").then((data) => {
      setHdbData(
        data.map((d) => ({
          town: d["town"],
          flat_type: d["flat_type"],
          floor_area: +d["floor_area"],
          resale_price: +d["resale_price"],
          year: d["year"],
          adjusted_price: +d["adjusted_price"],
          price_per_sqm: +d["price_per_sqm"],
          adjusted_price_per_sqm: +d["adjusted_price_per_sqm"],
          town_classification: d["town_classification"],
        }))
      );
    });

    // Load income data from CSV files
    d3.csv("/datasets/income/average_income_by_household.csv").then((data) => {
      setIncomeData(
        data.map((d) => ({
          year: d["year"],
          flat_type: d["flat_type"],
          average_household_income: +d["average_household_income"],
        }))
      );
    });

    // Load the median price data from the CSV file
    d3.csv("/datasets/hdb/median_price.csv").then((data) => {
      setMedianAdjustedPrices(
        data.map((d) => ({
          year: d["year"],
          flat_type: d["flat_type"],
          town_classification: d["town_classification"],
          resale_price: +d["resale_price"],
          adjusted_price: +d["adjusted_price"],
          price_per_sqm: +d["price_per_sqm"],
          adjusted_price_per_sqm: +d["adjusted_price_per_sqm"],
        }))
      );
    });

    // Set the unique years
    const uniqueYears: string[] = Array.from(
      new Set(hdbData.map((d) => d.year))
    );
    uniqueYears.sort();
    uniqueYears.unshift("All");
    setYears(uniqueYears);

    // Set the unique flat types
    const uniqueFlatTypes: string[] = Array.from(
      new Set(hdbData.map((d) => d.flat_type))
    );
    uniqueFlatTypes.sort();
    uniqueFlatTypes.unshift("All");
    setFlatTypes(uniqueFlatTypes);

    // Set the unique maturity estates
    // const uniqueMaturities : string[] = Array.from(new Set(hdbData.map(d => d.town_classification)));
    // uniqueMaturities.sort();
    // uniqueMaturities.unshift("All");
    // setMaturityEstates(uniqueMaturities);
  }, []);

  // console.log(hdbData);
  // console.log(incomeData);
  // console.log(medianAdjustedPrices);
  // console.log(years);
  // console.log(flatTypes);
  // console.log(maturityEstates);

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
      if (value.includes("All")) {
        value = ["All"]; // Reset to "all" only, or handle as needed
      }
    }

    setSelectedFilter((prevFilter) => ({
      ...prevFilter,
      [filterType]: value,
    }));
  };

  function filterData(
    data: (HDBData | IncomeData | MedianAdjustedPriceEntry)[],
    filter: Filter
  ) {
    return data.filter(
      (d) =>
        (filter.year.includes("All") || filter.year.includes(d.year)) &&
        (filter.flatTypes.includes("All") ||
          filter.flatTypes.length === 0 || // You might not need this condition if "all" is always added
          filter.flatTypes.includes(d.flat_type))
    );
  }

  useEffect(() => {
    const filterHDB = filterData(hdbData, selectedFilter);
    setFilteredHDBData(filterHDB);
    const filteredIncomeData = filterData(incomeData, selectedFilter);
    const filteredMedianAdjustedPrices = filterData(
      medianAdjustedPrices,
      selectedFilter
    );

    setMedianAdjustedPrices(filteredMedianAdjustedPrices);

    function calculateAverageResalePrice(data: HDBData[]) {
      return d3
        .rollups(
          data,
          (meanPrice) => {
            d3.mean(meanPrice, (d) => (d as HDBData).resale_price);
          },
          (d) => [d.year, d.flat_type]
        )
        .map(([keys, value]) => ({
          year: keys[0],
          flat_type: keys[1],
          mean: value,
        }));
    }

    const avgResalePriceByYearAndType =
      calculateAverageResalePrice(filteredHDBData);

    function calculateRatioIncomePrice(
      avgPrice: { year: string; flat_type: string; mean: number }[],
      incomeData: IncomeData[]
    ) {
      return avgPrice
        .map((d) => {
          const income = incomeData.find(
            (i) => i.year === d.year && i.flat_type === d.flat_type
          );
          if (income) {
            return {
              year: income.year,
              flat_type: income.flat_type,
              ratio: d.mean / income.average_household_income,
            };
          }
          return null;
        })
        .filter((d) => d !== null);
    }

    const ratioData = calculateRatioIncomePrice(
      avgResalePriceByYearAndType,
      filteredIncomeData
    );

    const validRatioData = ratioData.filter(
      (d): d is RatioDataEntry => d !== undefined
    );
    setRatioData(validRatioData);

    setRatioData(ratioData);
  }, [selectedFilter]);

  // Load when filter input is changed
  // useEffect(() => {
  //   const processedData = calculateMedianAdjustedPrices(
  //     filterData(loadedData, selectedFilter)
  //   );
  //   setMedianAdjustedPrices(processedData);

  //   // Convert string values to appropriate types
  //   const hdbProcessed = hdbData.map((d) => ({
  //     ...d,
  //     year: d.year,
  //     flat_type: d.flat_type,
  //     resale_price: +d.resale_price,
  //   }));

  //   const incomeProcessed = incomeData.map((d) => ({
  //     ...d,
  //     year: d.year,
  //     flat_type: d.flat_type.trim(), // Ensuring flat_type consistency
  //     average_household_income: +d.average_household_income,
  //   }));

  //   // Aggregate HDB data for average resale price by flat type and year
  //   const avgResalePriceByYearAndType = d3.rollups(
  //     hdbProcessed,
  //     (v) => d3.mean(v, (d) => d.resale_price),
  //     (d) => `${d.year}-${d.flat_type}`
  //   );

  //   const ratioData: RatioDataEntry[] = avgResalePriceByYearAndType
  //     .map(([key, avgResalePrice]) => {
  //       const [year, flat_type] = key.split("-");
  //       const incomeKey = key; // Matching key for income data
  //       const average_household_income = incomeProcessed.find(
  //         (d) => `${d.year}-${d.flat_type}` === incomeKey
  //       )?.average_household_income;

  //       return average_household_income
  //         ? {
  //             year: d3.timeParse("%Y")(year) as Date, // Cast to Date to satisfy type expectation
  //             flat_type,
  //             ratio: avgResalePrice / average_household_income,
  //           }
  //         : null;
  //     })
  //     .filter((d): d is RatioDataEntry => d !== null); // Type guard to filter out nulls and satisfy TypeScript

  //     // Update state with the prepared ratioData
  //     const validRatioData = ratioData.filter(
  //       (d): d is RatioDataEntry => d !== undefined
  //     );
  //     setRatioData(validRatioData);

  //     setRatioData(ratioData);
  //   } catch (error) {
  //     console.error("Error loading data: ", error);
  //   }
  // };

  // loadData();
  // }, [selectedFilter]);

  // const filterData = (data: DataEntry[], filter: typeof selectedFilter) => {
  //   return data.filter(
  //     (d) =>
  //       (filter.year.includes("all") || filter.year.includes(d.year)) &&
  //       (filter.flatTypes.includes("all") ||
  //         filter.flatTypes.length === 0 || // You might not need this condition if "all" is always added
  //         filter.flatTypes.includes(d.flat_type))
  //   );
  // };

  // const calculateMedianAdjustedPrices = (
  //   filteredData: DataEntry{}
  // ): MedianAdjustedPriceEntry[] => {
  //   const parseYear = d3.timeParse("%Y");
  //   const groupedByYear = d3.groups(filteredData, (d) => d.year);

  //   return groupedByYear.map(([year, entries]) => {
  //     const matureEntries = entries.filter(
  //       (e) => e.town_classification === "Mature"
  //     );
  //     const nonMatureEntries = entries.filter(
  //       (e) => e.town_classification === "Non-Mature"
  //     );

  //     const matureMedian =
  //       matureEntries.length > 0
  //         ? d3.median(matureEntries, (e) => e.adjusted_price)
  //         : 0;
  //     const nonMatureMedian =
  //       nonMatureEntries.length > 0
  //         ? d3.median(nonMatureEntries, (e) => e.adjusted_price)
  //         : 0;

  //     return {
  //       year: parseYear(year),
  //       mature: matureMedian,
  //       nonMature: nonMatureMedian,
  //     };
  //   });
  // };
  // const handleFilterChange = (
  //   event: React.ChangeEvent<HTMLSelectElement>,
  //   filterType: "year" | "flatTypes"
  // ) => {
  //   let value = Array.from(
  //     event.target.selectedOptions,
  //     (option) => option.value
  //   );

  //   // Special handling for "all" selection in flatTypes
  //   if (filterType === "flatTypes") {
  //     if (value.includes("all")) {
  //       value = ["all"]; // Reset to "all" only, or handle as needed
  //     }
  //   }

  //   setSelectedFilter((prevFilter) => ({
  //     ...prevFilter,
  //     [filterType]: value,
  //   }));
  // };

  // const filteredData = filterData(data, selectedFilter);

  const navigate = useNavigate();

  const handleDashboardButton = () => {
    navigate("./recommend");
  };

  return (
    <>
      <Nav activePage="overview" />
      <CustomContainer
        style={{ backgroundColor: "#deebf7" }}
        className="content-center relative"
      >
        <div className="flex justify-center content-center">
          <div className="grid grid-cols-2 gap-4 h-80 w-2/3 content-center">
            <div className="text-center content-center">
              <p className="font-bold text-5xl pb-5">Housing in Singapore</p>
              <p className="text-3xl">Finding the right home in Singapore</p>
            </div>
            <div className="flex justify-content content-center pl-5">
              <Map width={500} height={500} />
            </div>
          </div>
          <div className="absolute bottom-20 text-center align-center">
            <ScrollIntoView selector="#sg-scene">
              <button>
                {/* <p className="text-lg pb-3">Let us tell you the story</p> */}
                <Wave
                  text="Let us tell you the story"
                  effect="jump"
                  effectDirection="up"
                  speed={30}
                  effectChange={0.5}
                  effectDuration={0.5}
                />
                <p className="flex justify-center">
                  <ArrowBigDown />
                </p>
              </button>
            </ScrollIntoView>
          </div>
        </div>
      </CustomContainer>

      <CustomContainer
        id="sg-scene"
        style={{ backgroundColor: "#c6dbef" }}
        className="content-center relative"
      >
        <div className="flex justify-center">
          <div className="w-3/4">
            <p className="text-3xl font-bold pb-5">The Singapore Scene</p>
            <img
              src="https://helpcodenow.files.wordpress.com/2019/06/map_white_bg.png"
              width="600"
              className="float-right pl-20"
            />
            <p className="text-lg text-justify pt-5 pb-10">
              In Singapore, the general trend has been that resale prices are
              higher in mature estates, particularly in central areas, as
              illustrated in the graph. However, as Singapore's development has
              progressed rapidly over the years, we have observed significant
              price increases in locations such as Sengkang and Punggol, even
              though they are far from the downtown area. The continued
              development in these areas is gradually transforming them into
              more mature estates.
            </p>
            <img
              src="https://marketplace.canva.com/EAFWCND-WvI/1/0/1600w/canva-white-%26-blue-modern-line-chart-graph-8kIrqnT9H-0.jpg"
              width="550"
              className="float-left pr-20"
            />
            <br />
            <br />
            <br />
            <br />
            <br />
            <p className="text-3xl font-bold pb-5">The Problem</p>
            <p className="text-lg text-justify">
              Throughout the years, the price disparity between homes in mature
              and non-mature estates has fluctuated, with the gap narrowing
              since 2019. This trend suggests that as estates across Singapore
              mature and the difference in prices diminishes, the
              decision-making process for young Singaporeans who have just
              graduated from university regarding where to buy becomes more
              complex. How should they determine which location to choose for
              their home purchase
            </p>
          </div>
          <div className="absolute bottom-5 text-center align-center">
            <ScrollIntoView selector="#further-data">
              <button>
                {/* <p className="text-lg pb-3">Let us tell you the story</p> */}
                <Wave
                  text="Further into the Data"
                  effect="jump"
                  effectDirection="up"
                  speed={30}
                  effectChange={0.5}
                  effectDuration={0.5}
                />
                <p className="flex justify-center">
                  <ArrowBigDown />
                </p>
              </button>
            </ScrollIntoView>
          </div>
        </div>
      </CustomContainer>

      <CustomContainer
        id="further-data"
        style={{ backgroundColor: "#9ecae1" }}
        className="content-center relative"
      >
        <div className="flex justify-center">
          <div className="w-3/4">
            <p className="text-3xl font-bold pb-5 text-center">
              Further into the Data
            </p>
            <p className="text-lg text-justify pb-10">
              Our team has developed a tool that will help you make the best
              decision on where to buy your home. By using our tool, you will be
              able to compare the prices of homes across different estates in
              Singapore, and make an informed decision based on your preferences
              and budget. Our tool will provide you with a comprehensive
              overview of the prices of homes in different estates, and help you
              make the best decision on where to buy your home.
            </p>
            <div className="grid grid-cols-3 gap-10">
              <div>
                <p className="text-2xl font-bold pb-3">Graph 1</p>
                <p className="text-md text-justify pb-5">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <img src="https://learn.microsoft.com/en-us/power-bi/visuals/media/power-bi-line-charts/line-chart-6.png" />
              </div>
              <div>
                <p className="text-2xl font-bold pb-3">Graph 2</p>
                <p className="text-md text-justify pb-5">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <img src="https://learn.microsoft.com/en-us/power-bi/visuals/media/power-bi-line-charts/power-bi-line.png" />
              </div>
              <div>
                <p className="text-2xl font-bold pb-3">Graph 3</p>
                <p className="text-md text-justify pb-5">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <img src="https://www.tableau.com/sites/default/files/2021-09/Line%20Chart%201%20-%20Good%20-%20900x650.png" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-5 text-center align-center">
            <ScrollIntoView selector="#decision-making">
              <button>
                {/* <p className="text-lg pb-3">Let us tell you the story</p> */}
                <Wave
                  text="The Decision Making Process"
                  effect="jump"
                  effectDirection="up"
                  speed={30}
                  effectChange={0.5}
                  effectDuration={0.5}
                />
                <p className="flex justify-center">
                  <ArrowBigDown />
                </p>
              </button>
            </ScrollIntoView>
          </div>
        </div>
      </CustomContainer>

      <CustomContainer
        id="decision-making"
        style={{ backgroundColor: "#6baed6" }}
        className="content-center relative"
      >
        <div className="flex justify-center">
          <div className="w-3/4">
            <p className="text-3xl font-bold pb-5 text-center">
              The Decision Making Process
            </p>
            <p className="text-lg text-justify pb-10">
              Our tool will provide you with a comprehensive overview of the
              prices of homes in different estates, and help you make the best
              decision on where to buy your home. By using our tool, you will be
              able to compare the prices of homes across different estates in
              Singapore, and make an informed decision based on your preferences
              and budget.
            </p>
            <img
              src="https://datavizcatalogue.com/methods/images/top_images/line_graph.png"
              width="100%"
            />
          </div>
          <div className="absolute bottom-5 text-center align-center">
            <ScrollIntoView selector="#solution">
              <button>
                {/* <p className="text-lg pb-3">Let us tell you the story</p> */}
                <Wave
                  text="The Solution"
                  effect="jump"
                  effectDirection="up"
                  speed={30}
                  effectChange={0.5}
                  effectDuration={0.5}
                />
                <p className="flex justify-center">
                  <ArrowBigDown />
                </p>
              </button>
            </ScrollIntoView>
          </div>
        </div>
      </CustomContainer>

      <CustomContainer
        id="solution"
        style={{ backgroundColor: "#08306b" }}
        className="content-center"
      >
        <div className="flex justify-center">
          <div className="w-3/4">
            <p className="text-3xl font-bold pb-5 text-center text-zinc-50">
              The Solution
            </p>
            <div className="flex justify-center">
              <img
                src="https://i.redd.it/2kga3e4v4dx71.png"
                width="50%"
                className="pb-5"
              />
            </div>
            <p className="text-lg text-justify pb-10 text-zinc-50">
              Our tool will provide you with a comprehensive overview of the
              prices of homes in different estates, and help you make the best
              decision on where to buy your home. By using our tool, you will be
              able to compare the prices of homes across different estates in
              Singapore, and make an informed decision based on your preferences
              and budget.
            </p>
            <div className="text-center">
              <Button onClick={handleDashboardButton} variant="outline">
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </CustomContainer>

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

      <Resale_Flat_Hdb data={filteredHDBData} selectedFilter={selectedFilter} />
      <MedianMaturityPriceChart
        data={medianAdjustedPrices}
        selectedFilter={selectedFilter}
      />
      {/* <OwnershipTimeChart
        data={ratioData}
        selectedFilter={selectedFilter} // Change to pass the entire selectedFilter object
      /> */}
    </>
  );
}
