import './Recommend.css'
import Nav from '@/components/ui/nav'
import { Button } from "@/components/ui/button"
import Test from '@/components/d3/test'

export default function Recommend() {
  return (
    <>
      <Nav activePage='recommend'/>
      <Button variant="outline">samlekom</Button>
      <Test />
    </>
  )
}
