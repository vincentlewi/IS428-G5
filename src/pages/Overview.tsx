import './Overview.css'
import Nav from '@/components/ui/nav'
import { Button } from "@/components/ui/button"
import Test from '@/components/d3/test'


export default function Overview() {
  return (
    <>
      <Nav activePage='overview'/>
      <div className = "overview">
        <h1>Finding Home is Difficult</h1>
        <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p>
        <p>Take a look at the choropleth below. Hover on any area, and you will see that houses are EXPENSIVE.</p>
        <Button variant="outline">Button</Button>
        <Test />
      </div>
    </>
  )
}
