import * as d3 from 'd3';
import { useState, useEffect } from 'react';

interface Preferences {
  bus: number,
  school: number,
  mall: number,
  supermarket: number,
  cbd: number,
  hawker: number,
  park: number,
  mrt: number
}

interface Filter {
  min_price: number,
  max_price: number,
  min_remaining_lease: number,
  region: string,
  flat_type: string,
}

export function Recommend( preferences : Preferences , filter: Filter ) {

  // State to store the top houses once they have been computed
  const [topHouses, setTopHouses] = useState([{}]);

  useEffect(() => {
    // Load CSV data and compute scores for each house
    d3.csv('/datasets/hdb/hdb_available_cleaned.csv').then(data => {
      const scoredHouses = data.map(house => {
        if (+house['resale_price'] < filter.min_price || 
            +house['resale_price'] > filter.max_price || 
            +house['remaining_lease'] < filter.min_remaining_lease || 
            house['region'] !== filter.region || 
            house['flat_type'] !== filter.flat_type) {
          return({
            ...house,
            price_per_sqm: +house['resale_price'] / +house['floor_area_sqm'],
            score: 0
          })
        } else {
          const log_bus = Math.log(+house['bus_within_0.5'] + 1);
          const log_school = Math.log(+house['school_within_2.0'] + 1);
          const log_mall = Math.log(+house['mall_within_2.0'] + 1);
          const log_supermarket = Math.log(+house['supermarket_within_0.5'] + 1);
          const log_cbd = Math.log(+house['cbd_distance'] + 1);
          const log_hawker = Math.log(+house['hawker_distance'] + 1);
          const log_park = Math.log(+house['park_distance'] + 1);
          const log_mrt = Math.log(+house['mrtlrt_distance'] + 1);
          return({ 
            ...house,
            price_per_sqm: +house['resale_price'] / +house['floor_area_sqm'],
            score: preferences.bus * (log_bus / 2.772588722239781) +
                   preferences.school * (log_school / 2.833213344056216) +
                   preferences.mall * (log_mall / 1.791759469228055) +
                   preferences.supermarket * (log_supermarket / 1.0986122886681098) +
                   preferences.cbd * (2.6561072220310518 - log_cbd) +
                   preferences.hawker * (0.4868281744936002 - log_hawker) +
                   preferences.park * (0.5096731599345877 - log_park) +
                   preferences.mrt * (0.4227980215034163 - log_mrt)
          })
        }
      });

      // Sort houses by score in descending order and take the top 10
      const topScoringHouses = scoredHouses.sort((a, b) => b.score - a.score).slice(0, 10);
      
      // Then, from these top scoring houses, sort by price per sqm to get the cheapest
      const topCheapestHouses = topScoringHouses.sort((a, b) => a.price_per_sqm - b.price_per_sqm).slice(0, 3);

      // Update state with top 3 houses
      if (topCheapestHouses[0].score == 0) {
        // return exception
        setTopHouses([false])
      } else {
        setTopHouses(topCheapestHouses);
      }
    }).catch(error => console.error("Failed to load and process the CSV data", error));
  }, [preferences, filter]);

  // Since the component function must return synchronously,
  // and fetching and computing scores is asynchronous,
  // we cannot return the top houses immediately.
  // Thus, we return the state that will eventually contain the top houses.
  
  return topHouses;
}