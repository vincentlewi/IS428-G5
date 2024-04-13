import {  
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Overview from "@/pages/Overview.tsx";
import Dashboard from "@/pages/Dashboard";
import PopUp from "./components/ui/popUp";


function App() {
  const location = useLocation()
  const [sessionStarted, setSessionStarted] = useState(true);

  useEffect(() => {
    // Check if window is defined and read from localStorage
    if (typeof window !== 'undefined') {
      const initialSessionStatus =
        localStorage.getItem('sessionActive') === 'true';
      setSessionStarted(initialSessionStatus);
    }
  }, []);

  const startSession = () => {
    // Set item in localStorage
    localStorage.setItem('sessionActive', 'true');
    setSessionStarted(true);
  };

  const popupRef = useRef<HTMLDivElement>(null);
  
  return (
    <>
      {!sessionStarted && <PopUp onStartSession={startSession} ref={popupRef} />}
      <Routes location={location} key={location.pathname}>
        <Route index element={<Overview setSessionStarted={setSessionStarted}/>}></Route>
        <Route path="/dashboard" element={<Dashboard setSessionStarted={setSessionStarted}/>}></Route>
      </Routes>
    </>
  )
}

export default App
