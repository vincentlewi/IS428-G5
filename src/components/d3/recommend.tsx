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

export async function Recommend( filter: Filter, preferences : Preferences) {
  // Load CSV data and compute scores for each house
  let data = await d3.csv('/datasets/hdb/hdb_available_cleaned.csv')
  data = data.filter((house) => !(+house['resale_price'] < filter.min_price || 
                                  +house['resale_price'] > filter.max_price || 
                                  +house['remaining_lease'] < filter.min_remaining_lease || 
                                  (filter.region !== 'All' && house['region'] !== filter.region) || 
                                  (filter.flat_type !== 'All' && house['flat_type'] !== filter.flat_type))
  )

  const scoredHouses = data.map(house => {    
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
  })

  if (scoredHouses.length === 0) {
    return([false])
  } else {
    let topScoringHouses = scoredHouses.sort((a, b) => a.score - b.score)
    if (topScoringHouses[0].score > 0) {
      topScoringHouses = topScoringHouses.slice(0, 3);
    }
    const topCheapestHouses = topScoringHouses.sort((a, b) => a.price_per_sqm - b.price_per_sqm).slice(0, 3);
    return(topCheapestHouses);
  }
}