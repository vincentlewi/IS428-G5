import {  
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Overview from "@/pages/Overview";
import Recommend from "@/pages/Recommend";


function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Overview />}></Route>
        <Route path="/recommend" element={<Recommend />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
