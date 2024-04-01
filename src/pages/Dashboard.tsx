import { useEffect, useState } from 'react'
import './Dashboard.css'
import Nav from '@/components/ui/nav'
import Map from '@/components/d3/map'
import DiscoveryRadar from '@/components/d3/radar'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DropdownFilter } from '@/components/filters/dropdownFilter'
import { Recommend } from '@/components/d3/recommend'
import { MultiSlider } from '@/components/filters/multiSlider'
import Slider from '@/components/filters/slider'
import SelectAmenity from '@/components/filters/selectAmenity'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface House {
  LATITUDE: string
  LONGITUDE: string
  address: string
  town: string
  region: string
  flat_type: string
  floor_area_sqm: number
  score: number
  resale_price: number
  remaining_lease: number
  price_per_sqm: number
  'bus_within_0.5': number
  'school_within_2.0': number
  'mall_within_2.0': number
  'supermarket_within_0.5': number
  cbd_distance: number
  hawker_distance: number
  park_distance: number
  mrtlrt_distance: number
} 

const default_houses = [{
  LATITUDE: '0',
  LONGITUDE: '0',
  address: '',
  town: '',
  region: '',
  flat_type: '',
  floor_area_sqm: 0,
  score: 0,
  resale_price: 0,
  remaining_lease: 0,
  price_per_sqm: 0,
  'bus_within_0.5': 0,
  'school_within_2.0': 0,
  'mall_within_2.0': 0,
  'supermarket_within_0.5': 0,
  cbd_distance: 0,
  hawker_distance: 0,
  park_distance: 0,
  mrtlrt_distance: 0
}]

const default_filter = {
  min_price: 0,
  max_price: 1379016,
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

let SGD = new Intl.NumberFormat('en-SG', {
  style: 'currency',
  currency: 'SGD',
  minimumFractionDigits: 0
});

const preferences_alias = ['Not Important', 'Slightly Important', 'Moderately Important', 'Very Important', 'Extremely Important']

export default function Dashboard() {  
  // Recommended houses
  const [topHouses, setTopHouses] = useState<House[]>(default_houses)

  // Filter and preferences
  const [filter, setFilter] = useState(default_filter)
  const [preferences, setPreferences] = useState(default_pref)
  useEffect(() => {
    async function fetchData() {
      const top = await Recommend(filter, preferences)
      setTopHouses(top)
    }
    fetchData()
  }, [filter, preferences])
  
  // Show amenity on map radio button
  const [selectedAmenity, setSelectedAmenity] = useState('')
    
  // Recommended house card
  const cardColor = ['border-blue-400 bg-blue-100', 'border-orange-400 bg-orange-100', 'border-green-400 bg-green-100']
  const [hovered, setHovered] = useState('')
  return (
    <>
      <Nav activePage='dashboard'/>
      <div className='flex align-middle justify-center items-center gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-md">Region:</p>
            <DropdownFilter filterKey={'region'} placeholder={'All'} items={['All', 'Central', 'East', 'North', 'North East', 'West']} filter={filter} setFilter={setFilter}/>
            <p className="text-md pt-2">Flat Type:</p>
            <DropdownFilter filterKey={'flat_type'} placeholder={'All'} items={['All', '1 ROOM', '2 ROOM', '3 ROOM', '4 ROOM', '5 ROOM', 'EXECUTIVE', 'MULTI-GENERATION']} filter={filter} setFilter={setFilter}/>
            <p className="text-md py-2">Price Range:</p>
            <MultiSlider defaultValue={[0, 1379016]} min={0} max={1379016} filter={filter} setFilter={setFilter}/>
            <div className='flex justify-between'>
              <p className="pt-1">S{SGD.format(filter.min_price)}</p>
              <p className="pt-1">S{SGD.format(filter.max_price)}</p>
            </div>
            <div className='flex justify-between'>
              <p className="text-md pb-2">Minimum Remaining Lease:</p>
              <p>{filter.min_remaining_lease}</p>
            </div>
            <Slider filterKey='min_remaining_lease' defaultValue={[0]} min={0} max={99} step={1} filter={filter} setFilter={setFilter}/>
            
          </CardContent>
        </Card>        
        <Map width={800} height={400} points={topHouses} selectedAmenity={selectedAmenity}/>
        <Card>
          <CardHeader>
            <CardTitle>Show Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <SelectAmenity setSelectedAmenity={setSelectedAmenity}/>
          </CardContent>
        </Card>
      </div>
      <div className='flex justify-center pb-5'>
        {Object.keys(preferences).map((pref, index) => (              
          <Card className='mx-1 w-[150px]'>
            <CardHeader className='px-1 py-2'>
              <CardTitle className='text-md'>{pref.toUpperCase()}</CardTitle>
            </CardHeader>
            <CardContent className='px-0 text-center'>
              <Slider filterKey={pref as keyof typeof preferences} defaultValue={[0]} min={0} max={4} step={1} filter={preferences} setFilter={setPreferences}/>
              <span className='text-xs'>{preferences_alias[preferences[pref]]}</span>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className='flex align-middle justify-center items-center gap-4'>
        {!topHouses[0]
        ? <p>Sorry, we couldn't find any house to recommend.</p>
        : topHouses[0].address === ''
          ? <p>Loading...</p>
          : <>
              <div className='mx-10'><DiscoveryRadar options={{variables: [], sets:topHouses}} hovered={hovered}/></div>
              <div>
                {topHouses.map((house, index) => (
                  <Card 
                    key={index} 
                    className={`${cardColor[index]} my-2 py-2`} 
                    onMouseEnter={() => setHovered(`${house.address} ${house.town} ${house.flat_type}`)}
                    onMouseLeave={() => setHovered('')}
                  >
                    <CardHeader className='px-4 py-2'>
                      <CardTitle>#{index + 1} {house.town}</CardTitle>
                      <CardDescription>{house.flat_type} HDB at {house.address}</CardDescription>
                    </CardHeader>
                    <CardContent className='px-4 py-2'>
                      <Button>
                        <Dialog>
                          <DialogTrigger>See More Details</DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className='text-xl'>#{index + 1} {house.town}</DialogTitle>
                              <DialogDescription>{house.flat_type} HDB at {house.address}</DialogDescription>
                              <p><b>Median Price:</b> {SGD.format(Math.round(house.resale_price))}</p>
                              <p><b>Remaining Lease:</b> {+house.remaining_lease} years</p>
                              <p><b>Price per Square Meters:</b> {SGD.format(Math.round(house.price_per_sqm))}</p>
                              <br />
                              <p><b>Bus within 500m:</b> {+house['bus_within_0.5']}</p>
                              <p><b>School within 2km:</b> {+house['school_within_2.0']}</p>
                              <p><b>Mall within 2km:</b> {+house['mall_within_2.0']}</p>
                              <p><b>Supermarkets within 500m:</b> {+house['supermarket_within_0.5']}</p>
                              <p><b>Distance to CBD:</b> {Math.round((+house['cbd_distance'] + Number.EPSILON)*100)/100} km</p>
                              <p><b>Distance to Hawker:</b> {Math.round((+house['hawker_distance'] + Number.EPSILON)*100)/100} km</p>
                              <p><b>Distance to Park:</b> {Math.round((+house['park_distance'] + Number.EPSILON)*100)/100} km</p>
                              <p><b>Distance to MRT/LRT:</b> {Math.round((+house['mrtlrt_distance'] + Number.EPSILON)*100)/100} km</p>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
        }
      </div>
    </>
  )
}
