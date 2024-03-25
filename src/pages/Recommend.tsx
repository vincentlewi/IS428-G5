import './Recommend.css'
import Nav from '@/components/ui/nav'
import { Button } from "@/components/ui/button"
import Test from '@/components/d3/Resale_Flat_Hdb'

export default function Recommend() {
  return (
    <>
      <Nav activePage='recommend'/>
      <Button variant="outline">samlekom</Button>
      <Test />
    </>
  )
}
