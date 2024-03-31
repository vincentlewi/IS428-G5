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
  let data: any = await d3.csv('/datasets/hdb/hdb_available_cleaned.csv')
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
      score: preferences.bus * ((Math.log(+house['bus_within_0.5'] + 1) / 2.833213344056216) - 0.489301084236452) / (1.373641807199326 - 0.489301084236452) +
             preferences.school * ((Math.log(+house['school_within_2.0'] + 1) / 2.833213344056216) - 0) / (1.327538613914891 - 0) +
             preferences.mall * ((Math.log(+house['mall_within_2.0'] + 1) / 1.791759469228055) - 0) / (1.859738746970775 - 0) +
             preferences.supermarket * ((Math.log(+house['supermarket_within_0.5'] + 1) / 1.0986122886681098) - 0) / (2.182658338644138 - 0) +
             preferences.cbd * ((2.6918131575504636 - Math.log(+house['cbd_distance'] + 1)) - (-0.35970338335873064)) /  (1.7775188171402796 - (-0.35970338335873064)) +
             preferences.hawker * ((0.5280186725354765 - Math.log(+house['hawker_distance'] + 1)) - (-0.8246116087100726)) / (0.49930002895364245 - (-0.8246116087100726)) +
             preferences.park * ((0.5125843761855321 - Math.log(+house['park_distance'] + 1)) - (-0.7146231004033047)) / (0.4552574209939195 - (-0.7146231004033047	)) +
             preferences.mrt * ((0.43037103127764664 - Math.log(+house['mrtlrt_distance'] + 1)) - (-1.0773561414005774)) / (0.40923204240852556 - (-1.0773561414005774))
    })
  })

  if (scoredHouses.length === 0) {
    return([])
  } else {
    let topScoringHouses = scoredHouses.sort((a, b) => b.score - a.score)
    if (topScoringHouses[0].score != 0) {
      topScoringHouses = topScoringHouses.slice(0, 3);
    }
    const topCheapestHouses = topScoringHouses.sort((a, b) => a.price_per_sqm - b.price_per_sqm).slice(0, 3);
    return(topCheapestHouses);
  }
}