import { Separator } from "@/components/ui/separator"

interface NavProps {
  activePage: string;
}

export default function Nav(props: NavProps) {
  const activePage = props.activePage

  return (
    <nav className="flex items-center justify-between py-4">
      <div>
        <a href="/" className="text-gray-800">Logo</a>
      </div>
      <div className="flex h-5 items-center space-x-4">
        <a href="/" className={`text-gray-800 ${activePage === 'overview' ? 'font-semibold' : ''}`}>Overview</a>
        <Separator orientation="vertical" />
        <a href="/dashboard" className={`text-gray-800 ${activePage === 'dashboard' ? 'font-semibold' : ''}`}>Find your Ideal Home</a>
      </div>
      <div></div>
    </nav>
  )
}