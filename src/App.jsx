import {  
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import Overview from "@/pages/Overview";
import Dashboard from "@/pages/Dashboard";


function App() {
  const location = useLocation()
  return (
    <Routes location={location} key={location.pathname}>
      <Route index element={<Overview />}></Route>
      <Route path="/dashboard" element={<Dashboard />}></Route>
    </Routes>
  )
}

export default App
