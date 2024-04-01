import './Overview.css'
import Nav from '@/components/ui/nav'
import { Button } from "@/components/ui/button"
import MultilineChart from '@/components/d3/multilineChart.jsx'
import { Recommend } from '@/components/d3/recommend'
import Treemap from '@/components/d3/treemap'

const preferences = {
  bus: 4,
  school: 1,
  mall: 2,
  supermarket: 1,
  cbd: 0,
  hawker: 1,
  park: 1,
  mrt: 2
}

const filter = {
  min_price: 0,
  max_price: 1500000,
  min_remaining_lease: 0,
  region: 'West',
  flat_type: '3 ROOM'
}



export default function Overview() {
  // console.log(Recommend(preferences, filter))
  return (
    <>
      <Nav activePage='overview'/>
      <div className = "overview">
        <h1>Finding Home is Difficult</h1>
        <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p>
        <p>Take a look at the choropleth below. Hover on any area, and you will see that houses are EXPENSIVE.</p>
        <Button variant="outline">Button</Button>
        <MultilineChart />
        <Treemap/>
      </div>
    </>
  )
}
