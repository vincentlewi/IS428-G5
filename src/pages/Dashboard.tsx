import './Dashboard.css'
import Nav from '@/components/ui/nav'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Map from '@/components/d3/map'
import { DropdownFilter } from '@/components/ui/dropdownFilter'
import { useEffect, useState } from 'react'
import { Recommend } from '@/components/d3/recommend'
import { MultiSlider } from '@/components/ui/multiSlider'
import { Slider } from '@/components/ui/slider'
import DiscoveryRadar from '@/components/d3/radar'
import SelectAmenity from '@/components/filters/selectAmenity'

const default_filter = {
  min_price: 0,
  max_price: 1e6,
  min_remaining_lease: 0,
  region: 'All',
  flat_type: 'All'
}  
const default_pref = {
  bus: 0,
  school: 0,
  mall: 0,
  supermarket: 0,
  cbd: 0,
  hawker: 0,
  park: 0,
  mrt: 0
}

const preferences_alias = ['Not Important', 'Slightly Important', 'Moderately Important', 'Very Important', 'Extremely Important']

export default function Dashboard() {  
  const [filter, setFilter] = useState(default_filter)
  const [preferences, setPreferences] = useState(default_pref)
  
  const [topHouses, setTopHouses] = useState([{}])

  useEffect(() => {
    async function fetchData() {
      const top = await Recommend(filter, preferences)
      setTopHouses(top)
    }
    fetchData()
  }, [filter, preferences])

  const [selectedAmenity, setSelectedAmenity] = useState('')
  console.log(selectedAmenity)
  return (
    <>
      <Nav activePage='dashboard'/>
      <div className='flex align-middle justify-center items-center gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>Filter here</CardTitle>
            <CardDescription>Filter the houses based on your preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className=''></div>
            Region:
            <DropdownFilter filterKey={'region'} placeholder={'All'} items={['All', 'Central', 'East', 'North', 'North East', 'West']} filter={filter} setFilter={setFilter}/>
            Flat Type:
            <DropdownFilter filterKey={'flat_type'} placeholder={'All'} items={['All', '1 ROOM', '2 ROOM', '3 ROOM', '4 ROOM', '5 ROOM', 'EXECUTIVE', 'MULTI-GENERATION']} filter={filter} setFilter={setFilter}/>
            Price Ranges:
            <MultiSlider defaultValue={[0, 5e6]} min={0} max={5e6} filter={filter} setFilter={setFilter}/>
            Minimum Remaining Lease: {filter.min_remaining_lease}
            <Slider filterKey='min_remaining_lease' defaultValue={[0]} min={0} max={99} filter={filter} setFilter={setFilter}/>
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>        
        <Map width={600} height={600} points={topHouses} selectedAmenity={selectedAmenity}/>
        <Card>
          <CardHeader>
            <CardTitle>Preferences here</CardTitle>
            <CardDescription>Filter the houses based on your preferences</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(preferences).map((pref, index) => (
              <div key={index}>
                <div className='flex justify-between'>
                  <span>{pref}:</span>
                  <span>{preferences_alias[preferences[pref]]}</span>
                </div>                
                <Slider filterKey={pref} defaultValue={[0]} min={0} max={4} step={1} filter={preferences} setFilter={setPreferences}/>
              </div>
            ))}
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
        <SelectAmenity setSelectedAmenity={setSelectedAmenity}/>
      </div>
      <div className='flex align-middle justify-center items-center gap-4'> 
        <DiscoveryRadar options={{variables: [], sets:topHouses}}/>
        {topHouses[0]
        ? topHouses.map((house, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{house.town}</CardTitle>
                <CardDescription>{house.flat_type} HDB at {house.address}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Score: {+house.score}</p>
                <p>Median Price: S${Math.round(house.resale_price)}</p>
                <p>Remaining Lease: {+house.remaining_lease} years</p>
                <p>Price per Square Meters: S${Math.round(house.price_per_sqm)}</p>
                <br />
                <p>Bus within 500m: {+house['bus_within_0.5']}</p>
                <p>School within 2km: {+house['school_within_2.0']}</p>
                <p>Mall within 2km: {+house['mall_within_2.0']}</p>
                <p>Supermarkets within 500m: {+house['supermarket_within_0.5']}</p>
                <p>Distance to CBD: {+house['cbd_distance']}</p>
                <p>Distance to Hawker: {+house['hawker_distance']}</p>
                <p>Distance to Park: {+house['park_distance']}</p>
                <p>Distance to MRT/LRT: {+house['mrtlrt_distance']}</p>
              </CardContent>
              <CardFooter>
                <Button>More Details</Button>
              </CardFooter>
            </Card>
          ))
        : <p>Sorry, we couldn't find any house to recommend.</p>
        }
      </div>
    </>
  )
}
