import './Dashboard.css'
import Nav from '@/components/ui/nav'
import { Button } from "@/components/ui/button"
import TopoMap from '@/components/d3/topoMap'

export default function Dashboard() {
  return (
    <>
      <Nav activePage='dashboard'/>
      <Button variant="outline">samlekom</Button>
      <TopoMap width={500} height={500}/>
    </>
  )
}
