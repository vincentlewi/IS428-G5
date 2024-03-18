import { Separator } from "@/components/ui/separator"


export default function Nav() {
  return (
    <nav className="flex items-center justify-between py-4">
      <div>
        <p>Logo</p>
      </div>
      <div className="flex h-5 items-center space-x-4">
          <a href="#" className="text-gray-800">Overview</a>
          <Separator orientation="vertical" />
          <a href="#" className="text-gray-800">Find your Ideal Home</a>
        </div>
      <div></div>
    </nav>
  )
}