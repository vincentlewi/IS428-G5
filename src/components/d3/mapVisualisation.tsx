import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Checkbox } from "@/components/ui/checkbox"
import { FeatureCollection } from 'geojson';
import busIcon from "../../assets/bus.svg";
import mrtIcon from "../../assets/mrt.svg";
import hawkerIcon from "../../assets/hawker.svg";
import supermarketIcon from "../../assets/supermarket.svg";
import mallIcon from "../../assets/mall.svg";
import parkIcon from "../../assets/park.svg";
import schoolIcon from "../../assets/school.svg";
import { SchoolIcon } from 'lucide-react';

type Amenities = {
  hdb: boolean;
  private: boolean;
  bus: boolean;
  hawker: boolean;
  lrt: boolean;
  mall: boolean;
  mrt: boolean;
  park: boolean;
  school: boolean;
  supermarket: boolean;
};


const SingaporeMap = () => {
  const d3Container = useRef<HTMLDivElement>(null);
  const legendContainer = useRef<HTMLDivElement>(null);
  const [singaporeGeoJSON, setSingaporeGeoJSON] = useState<FeatureCollection | null>(null);
  const [hdbLocations, setHdbLocations] = useState<any[]>([]);
  const [privateLocations, setPrivateLocations] = useState<any[]>([]);
  const [busLocations, setBusLocations] = useState<any[]>([]);
  const [hawkerLocations, setHawkerLocations] = useState<any[]>([]);
  const [lrtLocations, setLrtLocations] = useState<any[]>([]);
  const [mallsLocations, setMallsLocations] = useState<any[]>([]);
  const [mrtLocations, setMrtLocations] = useState<any[]>([]);
  const [parksLocations, setParkLocations] = useState<any[]>([]);
  const [schoolsLocations, setSchoolLocations] = useState<any[]>([]);
  const [supermarketLocations, setSupermarketLocations] = useState<any[]>([]);
  


  // Then initialize your state with this type
  const [selectedAmenities, setSelectedAmenities] = useState<Amenities>({
    hdb: true,
    private: true,
    bus: false,
    hawker: false,
    lrt: false,
    mall: false,
    mrt: false,
    park: false,
    school: false,
    supermarket: false,
  });

  const mapKey = JSON.stringify(selectedAmenities);
  

  useEffect(() => {
    // Fetch GeoJSON for Singapore's boundary
    const fetchGeoJson = async () => {
      try {
        const response = await fetch('../../../datasets/singapore-planning-areas-topojson.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data: FeatureCollection = await response.json();
        setSingaporeGeoJSON(data);
      } catch (error) {
        console.error('Error loading GeoJSON:', error);
      }
    };

    // Fetch JSON for HDB locations
    const fetchHdbLocations = async () => {
      try {
        const response = await fetch('../../../datasets/hdb.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setHdbLocations(data);
      } catch (error) {
        console.error('Error loading HDB locations:', error);
      }
    };

    // Fetch JSON for Private locations
    const fetchPrivateLocations = async () => {
        try {
          const response = await fetch('../../../datasets/private.json');
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
          setPrivateLocations(data);
        } catch (error) {
          console.error('Error loading HDB locations:', error);
        }
      };

    // Fetch JSON for Bus locations
    const fetchBusLocations = async () => {
        try {
          const response = await fetch('../../../datasets/bus.json');
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
          setBusLocations(data);
        } catch (error) {
          console.error('Error loading HDB locations:', error);
        }
      };

    const fetchHawkerLocations = async () => {
        try {
            const response = await fetch('../../../datasets/hawker.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setHawkerLocations(data);
        } catch (error) {
            console.error('Error loading HDB locations:', error);
        }
        };
    const fetchLrtLocations = async () => {
        try {
            const response = await fetch('../../../datasets/lrt.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setLrtLocations(data);
        } catch (error) {
            console.error('Error loading HDB locations:', error);
        }
        };
    
    const fetchMallsLocations = async () => {
        try {
            const response = await fetch('../../../datasets/malls.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setMallsLocations(data);
        } catch (error) {
            console.error('Error loading HDB locations:', error);
        }
        };

    const fetchMrtLocations = async () => {
        try {
            const response = await fetch('../../../datasets/mrt.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setMrtLocations(data);
        } catch (error) {
            console.error('Error loading HDB locations:', error);
        }
        };

    const fetchParkLocations = async () => {
        try {
            const response = await fetch('../../../datasets/parks.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setParkLocations(data);
        } catch (error) {
            console.error('Error loading HDB locations:', error);
        }
        };

    const fetchSchoolLocations = async () => {
        try {
            const response = await fetch('../../../datasets/schools.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setSchoolLocations(data);
        } catch (error) {
            console.error('Error loading HDB locations:', error);
        }
        };

    const fetchSupermarketLocations = async () => {
        try {
            const response = await fetch('../../../datasets/supermarkets.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setSupermarketLocations(data);
        } catch (error) {
            console.error('Error loading HDB locations:', error);
        }
        };


    fetchGeoJson();
    fetchHdbLocations();
    fetchPrivateLocations();
    fetchBusLocations();
    fetchHawkerLocations();
    fetchLrtLocations();
    fetchMallsLocations();
    fetchMrtLocations();
    fetchParkLocations();
    fetchSchoolLocations();
    fetchSupermarketLocations();

    return () => {
        if (d3Container.current) {
          d3.select(d3Container.current).select('svg').remove();
        }
      };

  }, []);
  
  const handleAmenityChange = (amenity: keyof Amenities) => {
    setSelectedAmenities(prev => {
      const newState = { ...prev, [amenity]: !prev[amenity] };
      return newState;
    });
  };
  
  
  
  const drawMap = () => {
    d3.select(d3Container.current).selectAll("*").remove();
    if (d3Container.current && singaporeGeoJSON && hdbLocations && privateLocations && hawkerLocations && busLocations && lrtLocations && supermarketLocations && schoolsLocations && mallsLocations && mrtLocations && parksLocations) {
      const width = 1600;
      const height = 1200;

      // Initialize the SVG
      const svg = d3.select(d3Container.current)
        .append('svg')
        .attr('width', width)
        .attr('height', height)

      // Initialize projection and path
      const projection = d3.geoMercator().fitSize([width, height], singaporeGeoJSON);
      const path = d3.geoPath().projection(projection);
      const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("text-align", "center")
        .style("width", "auto")
        .style("min-width", "80px") // Minimum width, adjust as needed
        .style("height", "auto")
        .style("padding", "10px")
        .style("font", "14px Arial, sans-serif") // Larger font size for better readability
        .style("background", "rgba(255, 255, 255, 0.8)") // Semi-transparent white
        .style("border", "1px solid #ddd") // Light grey border
        .style("border-radius", "8px")
        .style("pointer-events", "none")
        .style("color", "#333") // Dark grey text for contrast
        .style("box-shadow", "0px 0px 10px rgba(0,0,0,0.2)") // Subtle shadow for depth
        .style("visibility", "hidden"); // Initially hidden


      // Draw the map
      svg.selectAll('.singapore-map')
        .data(singaporeGeoJSON?.features ?? [])
        .join('path')
        .attr('d', path)
        .style('fill', 'lightgrey')
        .style('stroke', 'black');

      if (selectedAmenities.hdb) {
      svg.selectAll('.hdb-location') // Use a class to target these circles
        .data(hdbLocations)
        .join('circle')
        .attr('class', 'hdb-location') // Apply the class here
        .attr('cx', d => {
          const coords = projection([d.LONGITUDE, d.LATITUDE]);
          return coords ? coords[0] : 0;
        })
        .attr('cy', d => {
          const coords = projection([d.LONGITUDE, d.LATITUDE]);
          return coords ? coords[1] : 0;
        })
        .attr('r', '2')
        .style('fill', 'red')
        .style('visibility', selectedAmenities.hdb ? 'visible' : 'hidden')
        .on('mouseover', (event, d) => {
          tooltip
            .style("visibility", "visible")
            .html(d.QUERY) // assuming d.NAME is where the place's name is stored
            .style("top", (event.pageY + 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on('mousemove', (event) => {
          tooltip
            .style("top", (event.pageY + 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on('mouseout', () => {
          tooltip.style("visibility", "hidden");
        })
      }
      
      if (selectedAmenities.private) {
      svg.selectAll('.private-location') // Use a different class for these circles
        .data(privateLocations)
        .join('circle')
        .attr('class', 'private-location') // Apply the class here
        .attr('cx', d => {
          const coords = projection([d.LONGITUDE, d.LATITUDE]);
          return coords ? coords[0] : 0;
        })
        .attr('cy', d => {
          const coords = projection([d.LONGITUDE, d.LATITUDE]);
          return coords ? coords[1] : 0;
        })
        .attr('r', '2')
        .style('fill', 'blue')
        .style('visibility', selectedAmenities.private ? 'visible' : 'hidden')
        .on('mouseover', (event, d) => {
          tooltip
            .style("visibility", "visible")
            .html(d.QUERY) // assuming d.NAME is where the place's name is stored
            .style("top", (event.pageY + 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on('mousemove', (event) => {
          tooltip
            .style("top", (event.pageY + 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on('mouseout', () => {
          tooltip.style("visibility", "hidden");
        })
     }

      if (selectedAmenities.bus) {
      svg.selectAll('.bus-icon')
        .data(busLocations)
        .enter()
        .append('image')
        .attr('href', busIcon) // URL to your image
        .attr('width', 6)
        .attr('height', 6)
        .attr('x', d => {
          const coords = projection([d.LONGITUDE, d.LATITUDE]);
          return coords ? coords[0] - (6 / 2)  : 0; // Center the image on the x coordinate
        })
        .attr('y', d => {
          const coords = projection([d.LONGITUDE, d.LATITUDE]);
          return coords ? coords[1] - (6 / 2)  : 0;// Center the image on the y coordinate
        })
        .attr('class', 'dot')
        .attr('onerror', "console.log('Error loading this image:', this.href.baseVal)")
        .style('visibility', selectedAmenities.bus ? 'visible' : 'hidden')
        .on('mouseover', (event, d) => {
          tooltip
            .style("visibility", "visible")
            .html(d.QUERY) // assuming d.NAME is where the place's name is stored
            .style("top", (event.pageY + 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on('mousemove', (event) => {
          tooltip
            .style("top", (event.pageY + 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on('mouseout', () => {
          tooltip.style("visibility", "hidden");
        })
      }
        
      if (selectedAmenities.hawker) {
        svg.selectAll('.hawker-icon')
        .data(hawkerLocations)
        .enter()
        .append('image')
        .attr('href', hawkerIcon) // URL to your image
        .attr('width', 10)
        .attr('height', 10)
        .attr('x', d => {
          const coords = projection([d.LONGITUDE, d.LATITUDE]);
          return coords ? coords[0] - (6 / 2)  : 0; // Center the image on the x coordinate
        })
        .attr('y', d => {
          const coords = projection([d.LONGITUDE, d.LATITUDE]);
          return coords ? coords[1] - (6 / 2)  : 0;// Center the image on the y coordinate
        })
        .attr('class', 'dot')
        .attr('onerror', "console.log('Error loading this image:', this.href.baseVal)")
        .style('visibility', selectedAmenities.hawker ? 'visible' : 'hidden')
        .on('mouseover', (event, d) => {
          tooltip
            .style("visibility", "visible")
            .html(d.QUERY) // assuming d.NAME is where the place's name is stored
            .style("top", (event.pageY + 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on('mousemove', (event) => {
          tooltip
            .style("top", (event.pageY + 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on('mouseout', () => {
          tooltip.style("visibility", "hidden");
        })
      }
      if (selectedAmenities.lrt) {
      svg.selectAll('.lrt-icon')
        .data(lrtLocations)
        .enter()
        .append('image')
        .attr('href', mrtIcon) // URL to your image
        .attr('width', 10)
        .attr('height', 10)
        .attr('x', d => {
          const coords = projection([d.LONGITUDE, d.LATITUDE]);
          return coords ? coords[0] - (6 / 2)  : 0; // Center the image on the x coordinate
        })
        .attr('y', d => {
          const coords = projection([d.LONGITUDE, d.LATITUDE]);
          return coords ? coords[1] - (6 / 2)  : 0;// Center the image on the y coordinate
        })
        .attr('class', 'dot')
        .attr('onerror', "console.log('Error loading this image:', this.href.baseVal)")
        .style('visibility', selectedAmenities.lrt ? 'visible' : 'hidden')
        .on('mouseover', (event, d) => {
          tooltip
            .style("visibility", "visible")
            .html(d.QUERY) // assuming d.NAME is where the place's name is stored
            .style("top", (event.pageY + 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on('mousemove', (event) => {
          tooltip
            .style("top", (event.pageY + 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on('mouseout', () => {
          tooltip.style("visibility", "hidden");
        })
      }

      if (selectedAmenities.mall) {
        svg.selectAll('.mall-icon')
        .data(mallsLocations)
        .enter()
        .append('image')
        .attr('href', mallIcon) // URL to your image
        .attr('width', 10)
        .attr('height', 10)
        .attr('x', d => {
          const coords = projection([d.LONGITUDE, d.LATITUDE]);
          return coords ? coords[0] - (6 / 2)  : 0; // Center the image on the x coordinate
        })
        .attr('y', d => {
          const coords = projection([d.LONGITUDE, d.LATITUDE]);
          return coords ? coords[1] - (6 / 2)  : 0;// Center the image on the y coordinate
        })
        .attr('class', 'dot')
        .attr('onerror', "console.log('Error loading this image:', this.href.baseVal)")
        .style('visibility', selectedAmenities.mall ? 'visible' : 'hidden')
        .on('mouseover', (event, d) => {
          tooltip
            .style("visibility", "visible")
            .html(d.QUERY) // assuming d.NAME is where the place's name is stored
            .style("top", (event.pageY + 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on('mousemove', (event) => {
          tooltip
            .style("top", (event.pageY + 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on('mouseout', () => {
          tooltip.style("visibility", "hidden");
        })
      }

      if (selectedAmenities.mrt) {
      svg.selectAll('.mrt-icon')
        .data(mrtLocations)
        .enter()
        .append('image')
        .attr('href', mrtIcon) // URL to your image
        .attr('width', 10)
        .attr('height', 10)
        .attr('x', d => {
          const coords = projection([d.LONGITUDE, d.LATITUDE]);
          return coords ? coords[0] - (6 / 2)  : 0; // Center the image on the x coordinate
        })
        .attr('y', d => {
          const coords = projection([d.LONGITUDE, d.LATITUDE]);
          return coords ? coords[1] - (6 / 2)  : 0;// Center the image on the y coordinate
        })
        .attr('class', 'dot')
        .attr('onerror', "console.log('Error loading this image:', this.href.baseVal)")
        .style('visibility', selectedAmenities.mrt ? 'visible' : 'hidden')
        .on('mouseover', (event, d) => {
          tooltip
            .style("visibility", "visible")
            .html(d.QUERY) // assuming d.NAME is where the place's name is stored
            .style("top", (event.pageY + 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on('mousemove', (event) => {
          tooltip
            .style("top", (event.pageY + 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on('mouseout', () => {
          tooltip.style("visibility", "hidden");
        })
      }

      if (selectedAmenities.park) {
      svg.selectAll('.park-icon')
        .data(parksLocations)
        .enter()
        .append('image')
        .attr('href', parkIcon) // URL to your image
        .attr('width', 10)
        .attr('height', 10)
        .attr('x', d => {
          const coords = projection([d.LONGITUDE, d.LATITUDE]);
          return coords ? coords[0] - (6 / 2)  : 0; // Center the image on the x coordinate
        })
        .attr('y', d => {
          const coords = projection([d.LONGITUDE, d.LATITUDE]);
          return coords ? coords[1] - (6 / 2)  : 0;// Center the image on the y coordinate
        })
        .attr('class', 'dot')
        .attr('onerror', "console.log('Error loading this image:', this.href.baseVal)")
        .style('visibility', selectedAmenities.park ? 'visible' : 'hidden')
        .on('mouseover', (event, d) => {
          tooltip
            .style("visibility", "visible")
            .html(d.QUERY) // assuming d.NAME is where the place's name is stored
            .style("top", (event.pageY + 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on('mousemove', (event) => {
          tooltip
            .style("top", (event.pageY + 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on('mouseout', () => {
          tooltip.style("visibility", "hidden");
        })
      }

      if (selectedAmenities.school) {
      svg.selectAll('.school-icon')
        .data(schoolsLocations)
        .enter()
        .append('image')
        .attr('href', schoolIcon) // URL to your image
        .attr('width', 10)
        .attr('height', 10)
        .attr('x', d => {
          const coords = projection([d.LONGITUDE, d.LATITUDE]);
          return coords ? coords[0] - (6 / 2)  : 0; // Center the image on the x coordinate
        })
        .attr('y', d => {
          const coords = projection([d.LONGITUDE, d.LATITUDE]);
          return coords ? coords[1] - (6 / 2)  : 0;// Center the image on the y coordinate
        })
        .attr('class', 'dot')
        .attr('onerror', "console.log('Error loading this image:', this.href.baseVal)")
        .style('visibility', selectedAmenities.school ? 'visible' : 'hidden')
        .on('mouseover', (event, d) => {
          tooltip
            .style("visibility", "visible")
            .html(d.QUERY) // assuming d.NAME is where the place's name is stored
            .style("top", (event.pageY + 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on('mousemove', (event) => {
          tooltip
            .style("top", (event.pageY + 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on('mouseout', () => {
          tooltip.style("visibility", "hidden");
        })
      }

      if (selectedAmenities.supermarket) {
      svg.selectAll('.supermarket-icon')
        .data(supermarketLocations)
        .enter()
        .append('image')
        .attr('href', supermarketIcon) // URL to your image
        .attr('width', 10)
        .attr('height', 10)
        .attr('x', d => {
          const coords = projection([d.LONGITUDE, d.LATITUDE]);
          return coords ? coords[0] - (6 / 2)  : 0; // Center the image on the x coordinate
        })
        .attr('y', d => {
          const coords = projection([d.LONGITUDE, d.LATITUDE]);
          return coords ? coords[1] - (6 / 2)  : 0;// Center the image on the y coordinate
        })
        .attr('class', 'dot')
        .attr('onerror', "console.log('Error loading this image:', this.href.baseVal)")
        .style('visibility', selectedAmenities.supermarket ? 'visible' : 'hidden')
        .on('mouseover', (event, d) => {
          tooltip
            .style("visibility", "visible")
            .html(d.QUERY) // assuming d.NAME is where the place's name is stored
            .style("top", (event.pageY + 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on('mousemove', (event) => {
          tooltip
            .style("top", (event.pageY + 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on('mouseout', () => {
          tooltip.style("visibility", "hidden");
        })
      }



        return () => {
          svg.selectAll('*').remove();
        }
    }
  }

  const legendItems = [
    { color: 'red', text: 'HDB', type: 'circle' },
    { color: 'blue', text: 'Private', type: 'circle' },
    { color: 'green', text: 'Park', icon: parkIcon, type: 'icon' },
    { color: 'green', text: 'Bus Stop', icon: busIcon, type: 'icon'},
    { color: 'green', text: 'Hawker', icon: hawkerIcon, type: 'icon'},
    { color: 'green', text: 'MRT & LRT', icon: mrtIcon, type: 'icon'},
    { color: 'green', text: 'School', icon: schoolIcon, type: 'icon'},
    { color: 'green', text: 'Malls', icon: mallIcon, type: 'icon'},
    { color: 'green', text: 'Supermarket', icon: supermarketIcon, type: 'icon'},
    
  ];
  const drawLegend = () => {
    d3.select(legendContainer.current).selectAll("*").remove();
    const svgLegend = d3.select(legendContainer.current)
          .append('svg')
          .attr('width', 200)
          .attr('height', legendItems.length * 25 + 20);
    if (legendContainer.current) {
      // Example legend items

      const legend = svgLegend.selectAll('.legend-item')
        .data(legendItems)
        .enter()
        .append('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(10, ${i * 25})`);

      // Append circle for circle type items
      legend.filter(d => d.type === 'circle').append('circle')
      .attr('cx', 9) // Center of the circle in the legend item
      .attr('cy', 9) // Center of the circle in the legend item
      .attr('r', 9) // Radius of the circle
      .attr('fill', d => d.color);

      // Append icon images for icon type items
      legend.filter(d => d.type === 'icon').append('image')
        .attr('href', d => d.icon ?? '')
        .attr('width', 18)
        .attr('height', 18)
        .attr('x', 0)
        .attr('y', 0); // Adjust positioning as needed

      // Append text labels for all items
      legend.append('text')
        .attr('x', 24)
        .attr('y', 9)
        .attr('dy', '.35em')
        .text(d => d.text);
    }
    return () => {
      svgLegend.selectAll('*').remove();
    }
      
    }
    
  
  // [singaporeGeoJSON, hdbLocations, privateLocations, busLocations, hawkerLocations,lrtLocations, mallsLocations, mrtLocations,parksLocations, schoolsLocations, supermarketLocations]
  useEffect(() => {
    drawMap();
  }, [selectedAmenities]); // Add other dependencies as needed

  useEffect(() => {
    if (d3Container.current && singaporeGeoJSON && hdbLocations && privateLocations && hawkerLocations && busLocations && lrtLocations && supermarketLocations && schoolsLocations && mallsLocations && mrtLocations && parksLocations) {
      drawMap();
      drawLegend();
    }
  }, [d3Container.current && singaporeGeoJSON && hdbLocations && privateLocations && hawkerLocations && busLocations && lrtLocations && supermarketLocations && schoolsLocations && mallsLocations && mrtLocations && parksLocations]);
  
  return (
    <div>
        <div>
          {/* Your map and other components here */}
          <div id="tooltip" style={{ position: 'absolute', visibility: 'hidden', padding: '10px', backgroundColor: 'white', border: '1px solid black', borderRadius: '5px', pointerEvents: 'none' }}></div>
        </div>

      <div ref={d3Container} key={mapKey} style={{ width: '100%', height: '100%' }} />
      {Object.entries(selectedAmenities).map(([amenity, isChecked]) => (
        <div key={amenity} className="items-top flex space-x-2">
          <Checkbox
            id={amenity}
            checked={isChecked}
            onCheckedChange={() => handleAmenityChange(amenity as keyof Amenities)}
          />
          <label
            htmlFor={amenity}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Show {amenity}
          </label>
          <div ref={legendContainer} style={{ flexBasis: '20%', padding: '20px' }} />
        </div>
      ))}
      
    </div>
    
    );
  };

export default SingaporeMap;