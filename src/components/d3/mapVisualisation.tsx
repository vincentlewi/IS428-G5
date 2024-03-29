import * as d3 from 'd3'
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson'
import sg from '@/assets/map/sg.json'
import { useState, useRef } from 'react'

type MapProps = {
  width: number
  height: number
}

export default function Map({ width, height }: MapProps) {
  const data = sg as FeatureCollection<Geometry, GeoJsonProperties>
  const projection = d3
    .geoMercator()
    .fitSize([width, height], data)
  const geoPathGenerator = d3.geoPath().projection(projection)

  const svgRef = useRef<SVGSVGElement>(null)
  const [lastClicked, setLastClicked] = useState(null)
  const onClickFeature = (feature: any) => {
    // Check if the same feature is clicked twice to reset
    if (feature === lastClicked) {
      resetZoom()
    } else {
      zoomIn(feature)
    }

    // Update the last clicked feature
    setLastClicked(feature === lastClicked ? null : feature)
  }

  const zoomIn = (feature: any) => {
    const bounds = geoPathGenerator.bounds(feature),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
      translate = [width / 2 - scale * x, height / 2 - scale * y]

    d3.select(svgRef.current)
      .selectAll('path')
      .transition()
      .duration(750)
      .attr('transform', `translate(${translate}) scale(${scale})`)
  }

  const resetZoom = () => {
    d3.select(svgRef.current)
      .selectAll('path')
      .transition()
      .duration(750)
      .attr('transform', '')
  }

  const handleMapContainerClick = (event: React.MouseEvent) => {
    // If the clicked element is the map container itself, reset zoom.
    if (event.target === event.currentTarget) {
      resetZoom()
      // Clear the last clicked feature state as well
      setLastClicked(null)
    }
  }

  const allSvgPaths = data.features  
  .map((shape) => {
    const pathData = geoPathGenerator(shape)
    // Ensure pathData does not include "NaN" before creating the path element
    if (pathData && !pathData.includes("NaN")) {
      const [areaColor, setAreaColor] = useState<string>("grey")
      const shapeRef = useRef<SVGPathElement>(null)
      return (
        <path
          ref={shapeRef}
          key={shape.properties?.PLN_AREA_N}
          d={pathData}
          stroke="lightGrey"
          strokeWidth={0.5}
          fill={shape === lastClicked ? "darkerGrey" : areaColor}
          cursor="pointer"
          onMouseOver={() => {setAreaColor("darkerGrey")}}
          onMouseLeave={() => {setAreaColor("grey")}}
          onClick={() => onClickFeature(shape)}
        />
      )
    }
  }).filter(Boolean) // Removes any undefined paths that result from including "NaN"

  return (
    <svg ref={svgRef} width={width} height={height} onClick={handleMapContainerClick}>
      {allSvgPaths}
    </svg>
  )
}
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
      console.log(newState); // Debugging line
      return newState;
    });
  };
  

  
  const drawMap = () => {
    if (d3Container.current && singaporeGeoJSON && hdbLocations && privateLocations && hawkerLocations && busLocations && lrtLocations && supermarketLocations && schoolsLocations && mallsLocations && mrtLocations && parksLocations) {
      const width = 1600;
      const height = 1200;

      // Initialize the SVG
      const svg = d3.select(d3Container.current)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      // Initialize projection and path
      const projection = d3.geoMercator()
        .fitSize([width, height], singaporeGeoJSON);
      const path = d3.geoPath().projection(projection);

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
        .style('visibility', selectedAmenities.hdb ? 'visible' : 'hidden');
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
        .style('visibility', selectedAmenities.private ? 'visible' : 'hidden');
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
          const [x, y] = projection([d.LONGITUDE, d.LATITUDE]);
          return x - (6 / 2); // Center the image on the x coordinate
        })
        .attr('y', d => {
          const [x, y] = projection([d.LONGITUDE, d.LATITUDE]);
          return y - (6 / 2); // Center the image on the y coordinate
        })
        .attr('class', 'dot')
        .attr('onerror', "console.log('Error loading this image:', this.href.baseVal)")
        .style('visibility', selectedAmenities.bus ? 'visible' : 'hidden');
      }
        
      if (selectedAmenities.hawker) {
        svg.selectAll('.hawker-icon')
        .data(hawkerLocations)
        .enter()
        .append('image')
        .attr('href', hawkerIcon) // URL to your image
        .attr('width', 8)
        .attr('height', 8)
        .attr('x', d => {
          const [x, y] = projection([d.LONGITUDE, d.LATITUDE]);
          return x - (8 / 2); // Center the image on the x coordinate
        })
        .attr('y', d => {
          const [x, y] = projection([d.LONGITUDE, d.LATITUDE]);
          return y - (8 / 2); // Center the image on the y coordinate
        })
        .attr('class', 'dot')
        .attr('onerror', "console.log('Error loading this image:', this.href.baseVal)")
        .style('visibility', selectedAmenities.hawker ? 'visible' : 'hidden');
      }
      if (selectedAmenities.lrt) {
      svg.selectAll('.lrt-icon')
        .data(lrtLocations)
        .enter()
        .append('image')
        .attr('href', mrtIcon) // URL to your image
        .attr('width', 8)
        .attr('height', 8)
        .attr('x', d => {
          const [x, y] = projection([d.LONGITUDE, d.LATITUDE]);
          return x - (8 / 2); // Center the image on the x coordinate
        })
        .attr('y', d => {
          const [x, y] = projection([d.LONGITUDE, d.LATITUDE]);
          return y - (8 / 2); // Center the image on the y coordinate
        })
        .attr('class', 'dot')
        .attr('onerror', "console.log('Error loading this image:', this.href.baseVal)")
        .style('visibility', selectedAmenities.lrt ? 'visible' : 'hidden');
      }

      if (selectedAmenities.mall) {
        svg.selectAll('.mall-icon')
        .data(mallsLocations)
        .enter()
        .append('image')
        .attr('href', mallIcon) // URL to your image
        .attr('width', 8)
        .attr('height', 8)
        .attr('x', d => {
          const [x, y] = projection([d.LONGITUDE, d.LATITUDE]);
          return x - (8 / 2); // Center the image on the x coordinate
        })
        .attr('y', d => {
          const [x, y] = projection([d.LONGITUDE, d.LATITUDE]);
          return y - (8 / 2); // Center the image on the y coordinate
        })
        .attr('class', 'dot')
        .attr('onerror', "console.log('Error loading this image:', this.href.baseVal)")
        .style('visibility', selectedAmenities.mall ? 'visible' : 'hidden');
      }

      if (selectedAmenities.mrt) {
      svg.selectAll('.mrt-icon')
        .data(mrtLocations)
        .enter()
        .append('image')
        .attr('href', mrtIcon) // URL to your image
        .attr('width', 8)
        .attr('height', 8)
        .attr('x', d => {
          const [x, y] = projection([d.LONGITUDE, d.LATITUDE]);
          return x - (8 / 2); // Center the image on the x coordinate
        })
        .attr('y', d => {
          const [x, y] = projection([d.LONGITUDE, d.LATITUDE]);
          return y - (8 / 2); // Center the image on the y coordinate
        })
        .attr('class', 'dot')
        .attr('onerror', "console.log('Error loading this image:', this.href.baseVal)")
        .style('visibility', selectedAmenities.mrt ? 'visible' : 'hidden');
      }

      if (selectedAmenities.park) {
      svg.selectAll('.park-icon')
        .data(parksLocations)
        .enter()
        .append('image')
        .attr('href', parkIcon) // URL to your image
        .attr('width', 8)
        .attr('height', 8)
        .attr('x', d => {
          const [x, y] = projection([d.LONGITUDE, d.LATITUDE]);
          return x - (8 / 2); // Center the image on the x coordinate
        })
        .attr('y', d => {
          const [x, y] = projection([d.LONGITUDE, d.LATITUDE]);
          return y - (8 / 2); // Center the image on the y coordinate
        })
        .attr('class', 'dot')
        .attr('onerror', "console.log('Error loading this image:', this.href.baseVal)")
        .style('visibility', selectedAmenities.park ? 'visible' : 'hidden');
      }

      if (selectedAmenities.school) {
      svg.selectAll('.school-icon')
        .data(schoolsLocations)
        .enter()
        .append('image')
        .attr('href', schoolIcon) // URL to your image
        .attr('width', 8)
        .attr('height', 8)
        .attr('x', d => {
          const [x, y] = projection([d.LONGITUDE, d.LATITUDE]);
          return x - (8 / 2); // Center the image on the x coordinate
        })
        .attr('y', d => {
          const [x, y] = projection([d.LONGITUDE, d.LATITUDE]);
          return y - (8 / 2); // Center the image on the y coordinate
        })
        .attr('class', 'dot')
        .attr('onerror', "console.log('Error loading this image:', this.href.baseVal)")
        .style('visibility', selectedAmenities.school ? 'visible' : 'hidden');
      }

      if (selectedAmenities.supermarket) {
      svg.selectAll('.supermarket-icon')
        .data(supermarketLocations)
        .enter()
        .append('image')
        .attr('href', supermarketIcon) // URL to your image
        .attr('width', 8)
        .attr('height', 8)
        .attr('x', d => {
          const [x, y] = projection([d.LONGITUDE, d.LATITUDE]);
          return x - (8 / 2); // Center the image on the x coordinate
        })
        .attr('y', d => {
          const [x, y] = projection([d.LONGITUDE, d.LATITUDE]);
          return y - (8 / 2); // Center the image on the y coordinate
        })
        .attr('class', 'dot')
        .attr('onerror', "console.log('Error loading this image:', this.href.baseVal)")
        .style('visibility', selectedAmenities.supermarket ? 'visible' : 'hidden');
      }

        return () => {
          svg.selectAll('*').remove();
        }
    }
  }
  // [singaporeGeoJSON, hdbLocations, privateLocations, busLocations, hawkerLocations,lrtLocations, mallsLocations, mrtLocations,parksLocations, schoolsLocations, supermarketLocations]
  useEffect(() => {
    drawMap();
  }, [selectedAmenities]); // Add other dependencies as needed

  useEffect(() => {
    if (d3Container.current && singaporeGeoJSON && hdbLocations && privateLocations && hawkerLocations && busLocations && lrtLocations && supermarketLocations && schoolsLocations && mallsLocations && mrtLocations && parksLocations) {
      drawMap();
    }
  }, [d3Container.current && singaporeGeoJSON && hdbLocations && privateLocations && hawkerLocations && busLocations && lrtLocations && supermarketLocations && schoolsLocations && mallsLocations && mrtLocations && parksLocations]);
  
  return (
    <div>
      {/* Render a checkbox for each amenity using your custom Checkbox component */}
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
        </div>
      ))}
      <div ref={d3Container} key={mapKey} style={{ width: '100%', height: '100%' }} />
    </div>
    
    );
  };

export default SingaporeMap;
