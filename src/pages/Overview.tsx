import "./Overview.css";
import React, { useEffect, useState } from "react";
import Nav from '@/components/ui/nav'
import { Button } from "@/components/ui/button"
import Map from '@/components/d3/map';
import CustomContainer from '@/components/ui/customContainer';
import ScrollIntoView from 'react-scroll-into-view';
import { ArrowBigDown } from 'lucide-react';
import { Wave } from 'react-animated-text';
import { useNavigate } from 'react-router-dom';
import OwnershipTimeChart from '@/components/d3/OwnershipTimeChart';
import Resale_Flat_Hdb from '@/components/d3/Resale_Flat_Hdb';
import MedianMaturityPriceChart from '@/components/d3/medianmaturity';
import * as d3 from "d3";
import { DropdownFilter } from '@/components/ui/dropdownFilterGraph'
import { DropdownFilterFlat } from "@/components/ui/dropdownFilterFlat";
import MapIntro from "@/components/d3/map_intro";
import Treemap from "@/components/d3/treemap";
import MultilineChart from '@/components/d3/multilineChart.jsx'

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
  median_income: number;
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

export default function Overview() {
  const [years, setYears] = useState<string[]>(['All']);
  const [flatTypes, setFlatTypes] = useState<string[]>(['All']);
  const [selectedFilter, setSelectedFilter] = useState<Filter>({ 
    year: years, 
    flatTypes: flatTypes });
  const [selectedIncomeFlatType, setSelectedIncomeFlatType] = useState<string>('All');
  const [selectedMedianFlatType, setSelectedMedianFlatType] = useState<string>('All');
  const [medianAdjustedPrices, setMedianAdjustedPrices] = useState<MedianAdjustedPriceEntry[]>([{
    year: '',
    flat_type:'',
    resale_price: 0,
    town_classification: '',
    adjusted_price: 0,
    price_per_sqm: 0,
    adjusted_price_per_sqm: 0
  }]);
  const [ratioData, setRatioData] = useState<RatioDataEntry[]>([]);
  const [hdbData, setHdbData] = useState<HDBData[]>([]);
  const [incomeData, setIncomeData] = useState<IncomeData[]>([]);
  const [filteredHDBData, setFilteredHDBData] = useState<HDBData[]>([]);
  const [filteredIncomeData, setFilteredIncomeData] = useState<IncomeData[]>([]);
  const [filteredMedianAdjustedPrices, setFilteredMedianAdjustedPrices] = useState<MedianAdjustedPriceEntry[]>([]);
  const [filterHdbFlat, setFilterHdbFlat] = useState<MedianAdjustedPriceEntry[]>([]);
  

  // Upon initial load, fetch the data
  const setdata = async () => {
    const hdbData = await d3.csv("/datasets/hdb/hdb_scaled.csv");
    setHdbData(hdbData.map((d) => ({
      town: d['town'],
      flat_type: d['flat_type'],
      floor_area: +d['floor_area'],
      resale_price: +d['resale_price'],
      year: d['year'],
      adjusted_price: +d['adjusted_price'],
      price_per_sqm: +d['price_per_sqm'],
      adjusted_price_per_sqm: +d['adjusted_price_per_sqm'],
      town_classification: d['town_classification']
      })));
    setFilteredHDBData(hdbData.map((d) => ({
      town: d['town'],
      flat_type: d['flat_type'],
      floor_area: +d['floor_area'],
      resale_price: +d['resale_price'],
      year: d['year'],
      adjusted_price: +d['adjusted_price'],
      price_per_sqm: +d['price_per_sqm'],
      adjusted_price_per_sqm: +d['adjusted_price_per_sqm'],
      town_classification: d['town_classification']
      })));
    
    const incomeData = await d3.csv("/datasets/hdb/median_house.csv");
    setIncomeData(incomeData.map((d) => ({
      year: d['Year'],
      median_income: +d['Median Income']
      })));
    setFilteredIncomeData(incomeData.map((d) => ({
      year: d['Year'],
      median_income: +d['Median Income']
      })));

    const medianAdjustedPrices = await d3.csv("/datasets/hdb/median_price_final.csv");
    setMedianAdjustedPrices(medianAdjustedPrices.map((d) => ({
      year: d['year'],
      flat_type: d['flat_type'],
      town_classification: d['town_classification'],
      resale_price: +d['resale_price'],
      adjusted_price: +d['adjusted_price'],
      price_per_sqm: +d['price_per_sqm'],
      adjusted_price_per_sqm: +d['adjusted_price_per_sqm']
    })));
    setFilteredMedianAdjustedPrices(medianAdjustedPrices.map((d) => ({
      year: d['year'],
      flat_type: d['flat_type'],
      town_classification: d['town_classification'],
      resale_price: +d['resale_price'],
      adjusted_price: +d['adjusted_price'],
      price_per_sqm: +d['price_per_sqm'],
      adjusted_price_per_sqm: +d['adjusted_price_per_sqm']
    })));

      const uniqueYears : string[] = Array.from(new Set(hdbData.map(d => d.year)));
      uniqueYears.sort();
      uniqueYears.unshift("All");
      setYears(uniqueYears);

      const uniqueFlatTypes : string[] = Array.from(new Set(hdbData.map(d => d.flat_type)));
      uniqueFlatTypes.sort();
      uniqueFlatTypes.unshift("All");
      setFlatTypes(uniqueFlatTypes)

      setSelectedFilter({
        year: ['All'],
        flatTypes: ['All']
      })
  }
  useEffect(() => {
    setdata()
  } , []);

  function filterData(data: HDBData[], filter: Filter) {
    return data.filter(
      (d) =>
        (filter.year.includes("All") || filter.year.includes(d.year)) &&
        (filter.flatTypes.includes("All") || // You might not need this condition if "all" is always added
          filter.flatTypes.includes(d.flat_type))
    );
  };

  function filterMedianPriceData(data: MedianAdjustedPriceEntry[], filter: string) {
    return data.filter(
      (d) =>
        (filter.includes(d.flat_type))
    );
  }

  function filterHDBFlat(data: HDBData[], filter: string) {
    return data.filter(
      (d) =>
        (filter.includes("All") || // You might not need this condition if "all" is always added
          filter.includes(d.flat_type))
    );
  }

  useEffect(() => {
    const filterHDB = filterData(hdbData, selectedFilter);
    setFilteredHDBData(filterHDB);
    const filteredHDBFlat = filterMedianPriceData(medianAdjustedPrices, "All");
    setFilterHdbFlat(filteredHDBFlat);
    const filterMedianAdjustedPrices = filterMedianPriceData(medianAdjustedPrices, selectedMedianFlatType);
    setFilteredMedianAdjustedPrices(filterMedianAdjustedPrices);
    }, [selectedFilter, selectedIncomeFlatType, selectedMedianFlatType]);

  const navigate = useNavigate();

  const handleDashboardButton = () => {
    navigate("./dashboard");
  };
  
  return (
    <>
      <Nav activePage="overview" />
      <CustomContainer
        style={{ backgroundColor: "#fdfaecff" }}
        className="content-center relative"
      >
        <div className="flex justify-center content-center">
          <div className="grid grid-cols-2 gap-4 h-80 w-2/3 content-center">
            <div className="text-center content-center">
              <p className="font-bold text-5xl pb-5">Housing in Singapore</p>
              <p className="text-3xl">Finding the right home in Singapore</p>
            </div>
            <div className="flex justify-content content-center pl-5">
              <Map width={500} height={500}/>
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
        style={{ backgroundColor: "#eae6d6ff" }}
        className="content-center relative"
      >
        <div className="flex justify-center">
          <div className="w-3/4">
            
            {/* helo ini map ya */}
            <div className="float-left pl-20">
              <MapIntro/>
            </div>
            <p className="text-3xl font-bold pb-5">The Singapore Scene</p>
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
        style={{ backgroundColor: "#fdfaecff" }}
        className="content-center relative"
      >
        <div className="flex justify-center">
          <div className="w-3/4">
            <p className="text-3xl font-bold pb-5 text-center">
              Further into the Data
            </p>
            <p className="text-lg pb-10 text-center">
              Let us further explore the data that we have to better understand the housing market in Singapore.
            </p>
            <div className="grid grid-cols-3 gap-10">
              <div>
                <p className="text-2xl font-bold pb-3">Top 5 Area with Most Resale Flats Count</p>
                {/* <p className="text-md text-justify pb-5">Below is the graph showing the top 5 towns that have the most resale flats according to the year and flat types. From 2016, transaction counts at Sengkang and Punggol are increasing rapidly as seen in 2020 and 2021 they are the top two. You can toggle the filters for the year and flat types to understand more on which areas have the most sold flats in that year.</p> */}
                <div className="flex grid grid-cols-2 gap-4 pb-5">
                  <div>
                    <label htmlFor="year-select">Select Year: </label>
                    <DropdownFilter filterKey={'year'} placeholder={'All'} items={years} filter={selectedFilter} setFilter={setSelectedFilter}/>
                  </div>
                  <div>
                    <label htmlFor="flat-type-select">Flat Type: </label>
                    <DropdownFilter filterKey={'flatTypes'} placeholder={'All'} items={flatTypes} filter={selectedFilter} setFilter={setSelectedFilter}/>
                  </div>
                </div>
                <Resale_Flat_Hdb data={filteredHDBData} selectedFilter={selectedFilter} />
              </div>
              <div>
                <p className="text-2xl font-bold pb-3">Mature vs. Non Mature Median Price</p>
                {/* <p className="text-md text-justify pb-5">The graph shows the median price of the different flat types in the mature and non-mature areas across the year. You can toggle the flat types filter to see the trend of the median prices across the years.</p> */}
                <label htmlFor="flat-type-select">Flat Type: </label>
                <DropdownFilterFlat filterKey={'flatTypes'} placeholder={'All'} items={flatTypes} filter={selectedMedianFlatType} setFilter={setSelectedMedianFlatType}/>
                <MedianMaturityPriceChart
                  data={filteredMedianAdjustedPrices}
                  selectedFilter={selectedMedianFlatType}
                />
              </div>
              <div>
                <p className="text-2xl font-bold pb-3">Years to Pay Off Flat</p>
                {/* <p className="text-md text-justify pb-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p> */}
                {/* <br/>
                <br/>
                <br/>
                <br/> */}
                <OwnershipTimeChart
                  incomeData={filteredIncomeData}
                  hdbData={filterHdbFlat}
                  selectedFilter="All" // Change to pass the entire selectedFilter object
                />
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
        style={{ backgroundColor: "#eae6d6ff" }}
        className="content-center relative"
      >
        <div className="flex justify-center">
          <div className="w-3/4">
            <p className="text-3xl font-bold pb-5 text-center">
              The Decision Making Process
            </p>
            {/* <p className="text-lg text-justify pb-10">
              Our tool will provide you with a comprehensive overview of the
              prices of homes in different estates, and help you make the best
              decision on where to buy your home. By using our tool, you will be
              able to compare the prices of homes across different estates in
              Singapore, and make an informed decision based on your preferences
              and budget.
            </p> */}
            <div className="grid grid-cols-2 gap-10">
              <div>
                <p className="text-2xl font-bold pb-3">Amenities with Most Time Spent</p>
                <Treemap />
              </div>
              <div>
                <p className="text-2xl font-bold pb-3">Feature Importance</p>
                <MultilineChart />
              </div>
            </div>
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
        style={{ backgroundColor: "#fdfaecff" }}
        className="content-center"
      >
        <div className="flex justify-center">
          <div className="w-3/4">
            <p className="text-3xl font-bold pb-5 text-center">
              The Solution
            </p>
            <p className="text-lg text-justify pb-10">
              Our tool will provide you with a comprehensive overview of the
              prices of homes in different estates, and help you make the best
              decision on where to buy your home. By using our tool, you will be
              able to compare the prices of homes across different estates in
              Singapore, and make an informed decision based on your preferences
              and budget.
            </p>
            <div className="text-center">
              <Button onClick={handleDashboardButton} >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </CustomContainer>
    </>
  );
}
