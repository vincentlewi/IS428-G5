import './Overview.css'
import Nav from '@/components/ui/nav'
import { Button } from "@/components/ui/button"
import Map from '@/components/d3/map';
import CustomContainer from '@/components/ui/customContainer';
import ScrollIntoView from 'react-scroll-into-view';
import { ArrowBigDown } from 'lucide-react';
import { Wave } from 'react-animated-text';
import { useNavigate } from 'react-router-dom';

import { Recommend } from '@/components/d3/recommend'

const preferences = {
  bus: 4,
  school: 1,
  mall: 2,
  supermarket: 1,
  cbd: 0,
  hawker: 1,
  park: 1,
  mrt: 2
}

const filter = {
  min_price: 0,
  max_price: 1500000,
  min_remaining_lease: 0,
  region: 'West',
  flat_type: '3 ROOM'
}

export default function Overview() {
  const navigate = useNavigate();

  const handleDashboardButton = () => {
    navigate('./recommend');
  }

  console.log(Recommend(preferences, filter))
  return (
    <>
      <Nav activePage='overview'/>
      <CustomContainer style = {{backgroundColor: '#deebf7'}} className="content-center relative">
        <div className="flex justify-center content-center">
          <div className="grid grid-cols-2 gap-4 h-80 w-2/3 content-center">
            <div className="text-center content-center">
              <p className="font-bold text-5xl pb-5">
                Housing in Singapore
              </p>
              <p className="text-3xl">
                Finding the right home in Singapore
              </p>
            </div>
            <div className="flex justify-content content-center">
              <img src="https://hecksrealty.com/wp-content/uploads/2020/02/SingaporeDistrictCode-MapDemarcation624x350-1.png" className="w-4/5"/>
            </div>
          </div>
          <div className="absolute bottom-20 text-center align-center">
            <ScrollIntoView selector="#sg-scene">
              <button>
                {/* <p className="text-lg pb-3">Let us tell you the story</p> */}
                <Wave text="Let us tell you the story" effect="jump" effectDirection="up" speed={30} effectChange={0.5} effectDuration={0.5}/>
                <p className="flex justify-center"><ArrowBigDown /></p>
              </button>
            </ScrollIntoView>
          </div>
        </div>
      </CustomContainer>

      <CustomContainer id="sg-scene" style = {{backgroundColor: '#c6dbef'}} className="content-center relative">
        <div className="flex justify-center">
          <div className="w-3/4">
            <p className="text-3xl font-bold pb-5">The Singapore Scene</p>
            <img src="https://helpcodenow.files.wordpress.com/2019/06/map_white_bg.png" width="600" className="float-right pl-20"/>
            <p className="text-lg text-justify pt-5 pb-10">In Singapore, the general trend has been that resale prices are higher in mature estates, particularly in central areas, as illustrated in the graph. However, as Singapore's development has progressed rapidly over the years, we have observed significant price increases in locations such as Sengkang and Punggol, even though they are far from the downtown area. The continued development in these areas is gradually transforming them into more mature estates.</p>
            <img src="https://marketplace.canva.com/EAFWCND-WvI/1/0/1600w/canva-white-%26-blue-modern-line-chart-graph-8kIrqnT9H-0.jpg" width="550" className="float-left pr-20"/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <p className="text-3xl font-bold pb-5">The Problem</p>
            <p className="text-lg text-justify">Throughout the years, the price disparity between homes in mature and non-mature estates has fluctuated, with the gap narrowing since 2019. This trend suggests that as estates across Singapore mature and the difference in prices diminishes, the decision-making process for young Singaporeans who have just graduated from university regarding where to buy becomes more complex. How should they determine which location to choose for their home purchase</p>
          </div>
          <div className="absolute bottom-5 text-center align-center">
            <ScrollIntoView selector="#further-data">
              <button>
                {/* <p className="text-lg pb-3">Let us tell you the story</p> */}
                <Wave text="Further into the Data" effect="jump" effectDirection="up" speed={30} effectChange={0.5} effectDuration={0.5}/>
                <p className="flex justify-center"><ArrowBigDown /></p>
              </button>
            </ScrollIntoView>
          </div>
        </div>
      </CustomContainer>

      <CustomContainer id="further-data" style = {{backgroundColor: '#9ecae1'}} className="content-center relative">
        <div className="flex justify-center">
          <div className="w-3/4">
            <p className="text-3xl font-bold pb-5 text-center">Further into the Data</p>
            <p className="text-lg text-justify pb-10">Our team has developed a tool that will help you make the best decision on where to buy your home. By using our tool, you will be able to compare the prices of homes across different estates in Singapore, and make an informed decision based on your preferences and budget. Our tool will provide you with a comprehensive overview of the prices of homes in different estates, and help you make the best decision on where to buy your home.</p>
            <div className="grid grid-cols-3 gap-10">
              <div>
                <p className="text-2xl font-bold pb-3">Graph 1</p>
                <p className="text-md text-justify pb-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <img src="https://learn.microsoft.com/en-us/power-bi/visuals/media/power-bi-line-charts/line-chart-6.png"/>
              </div>
              <div>
                <p className="text-2xl font-bold pb-3">Graph 2</p>
                <p className="text-md text-justify pb-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <img src="https://learn.microsoft.com/en-us/power-bi/visuals/media/power-bi-line-charts/power-bi-line.png"/>
              </div>
              <div>
                <p className="text-2xl font-bold pb-3">Graph 3</p>
                <p className="text-md text-justify pb-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <img src="https://www.tableau.com/sites/default/files/2021-09/Line%20Chart%201%20-%20Good%20-%20900x650.png"/>
              </div>
            </div>
          </div>
          <div className="absolute bottom-5 text-center align-center">
            <ScrollIntoView selector="#decision-making">
              <button>
                {/* <p className="text-lg pb-3">Let us tell you the story</p> */}
                <Wave text="The Decision Making Process" effect="jump" effectDirection="up" speed={30} effectChange={0.5} effectDuration={0.5}/>
                <p className="flex justify-center"><ArrowBigDown /></p>
              </button>
            </ScrollIntoView>
          </div>
        </div>
      </CustomContainer>

      <CustomContainer id="decision-making" style = {{backgroundColor: '#6baed6'}} className="content-center relative">
        <div className="flex justify-center">
          <div className="w-3/4">
            <p className="text-3xl font-bold pb-5 text-center">The Decision Making Process</p>
            <p className="text-lg text-justify pb-10">Our tool will provide you with a comprehensive overview of the prices of homes in different estates, and help you make the best decision on where to buy your home. By using our tool, you will be able to compare the prices of homes across different estates in Singapore, and make an informed decision based on your preferences and budget.</p>
            <img src="https://datavizcatalogue.com/methods/images/top_images/line_graph.png" width="100%"/>
          </div>
          <div className="absolute bottom-5 text-center align-center">
            <ScrollIntoView selector="#solution">
              <button>
                {/* <p className="text-lg pb-3">Let us tell you the story</p> */}
                <Wave text="The Solution" effect="jump" effectDirection="up" speed={30} effectChange={0.5} effectDuration={0.5}/>
                <p className="flex justify-center"><ArrowBigDown /></p>
              </button>
            </ScrollIntoView>
          </div>
        </div>
      </CustomContainer>

      <CustomContainer id="solution" style = {{backgroundColor: '#08306b'}} className="content-center">
        <div className="flex justify-center">
          <div className="w-3/4">
            <p className="text-3xl font-bold pb-5 text-center text-zinc-50">The Solution</p>
            <div className="flex justify-center">
              <img src="https://i.redd.it/2kga3e4v4dx71.png" width="50%" className="pb-5"/>
            </div>
            <p className="text-lg text-justify pb-10 text-zinc-50">Our tool will provide you with a comprehensive overview of the prices of homes in different estates, and help you make the best decision on where to buy your home. By using our tool, you will be able to compare the prices of homes across different estates in Singapore, and make an informed decision based on your preferences and budget.</p>
            <div className="text-center">
              <Button onClick={handleDashboardButton} variant='outline'>
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </CustomContainer>

      {/* <div className = "overview">
        <h1 id="section">Finding Home is Difficult</h1>
        <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p>
        <p>Take a look at the choropleth below. Hover on any area, and you will see that houses are EXPENSIVE.</p>
        <Button variant="outline">Button</Button>
        <Test />
      </div>} */}
    </>
  )
}
