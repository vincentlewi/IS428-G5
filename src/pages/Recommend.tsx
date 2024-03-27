import './Recommend.css'
import Nav from '@/components/ui/nav'
import { Button } from "@/components/ui/button"
import TopoMap from '@/components/d3/topoMap'

export default function Recommend() {
  return (
    <>
      <Nav activePage='recommend'/>
      <Button variant="outline">samlekom</Button>
      <TopoMap width={500} height={500}/>
    </>
  )
}
