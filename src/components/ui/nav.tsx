import { Separator } from "@/components/ui/separator"
import { Button } from "./button";

interface NavProps {
  activePage: string;
}

export default function Nav({activePage}: NavProps) {
  return (
    <nav className="flex items-center justify-between py-4 px-4 sticky top-0 z-40 bg-white">
      <div>
        {/* <a href="/" className="text-gray-800">Logo</a> */}
        <img src="/logoFull.png" alt="logo" className="h-8 ms-4 scale-150" />
      </div>
      <div className="flex h-5 items-center space-x-4">
        <a href="/" className={`text-gray-800 ${activePage === 'overview' ? 'font-semibold' : ''}`}>Overview</a>
        <Separator orientation="vertical" />
        <a href="/dashboard" className={`text-gray-800 ${activePage === 'dashboard' ? 'font-semibold' : ''}`}>Dashboard</a>
      </div>
      <div className="invisible">
        <img src="/logoFull.png" alt="logo" className="h-8 ms-4 scale-150" />
      </div>
    </nav>
  )
}