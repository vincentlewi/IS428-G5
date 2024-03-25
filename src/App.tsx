import {  
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import Overview from "@/pages/Overview";
import Recommend from "@/pages/Recommend";


function App() {
  const location = useLocation()
  return (
    <Routes location={location} key={location.pathname}>
      <Route index element={<Overview />}></Route>
      <Route path="/recommend" element={<Recommend />}></Route>
    </Routes>
  )
}

export default App
