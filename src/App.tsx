<<<<<<< Updated upstream
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
=======
import "./App.css";
import Nav from "@/components/nav";
import { Button } from "@/components/ui/button";
import Test from "./components/d3/test";
import { data } from "./components/d3/data";
import { Heatmap } from "./components/d3/Heatmap";

function App() {
  return (
    <>
      <Nav />
      <div className="main">
        <h1>Finding Home is Difficult</h1>
        <p>
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.{" "}
        </p>
        <p>
          Take a look at the choropleth below. Hover on any area, and you will
          see that houses are EXPENSIVE.
        </p>
        <Button variant="outline">Button</Button>
        <Heatmap data={data} width={700} height={400} />
        <Test />
>>>>>>> Stashed changes
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
