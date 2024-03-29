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
import { symbol, symbolCircle, symbolCross, symbolDiamond, symbolSquare, symbolStar, symbolTriangle, symbolWye } from 'd3';
import { FeatureCollection } from 'geojson';
import busIcon from '../../assets/bus.svg'

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

  const createSymbol = (type, size) => {
    return symbol().type(type).size(size)();
  };


  useEffect(() => {
    if (d3Container.current && singaporeGeoJSON && hdbLocations && privateLocations) {
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

      // Plot HDB locations as red circles
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
        .style('fill', 'red');

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
        .style('fill', 'blue');

    //   svg.selectAll('.bus-location')
    //     .data(busLocations)
    //     .join('path')
    //     .attr('class', 'bus-location')
    //     .attr('d', createSymbol(symbolCircle, 7)) // Change the size as needed
    //     .attr('transform', d => `translate(${projection([d.LONGITUDE, d.LATITUDE])})`)
    //     .style('fill', 'green');

    //   svg.selectAll('.bus-icon')
    //     .data(busLocations)
    //     .enter()
    //     .append('image')
    //     .attr('class', 'bus-icon')
    //     .attr('href', '../../assets/bus.svg') // Set the path to your JPG icon file
    //     .attr('width', 10) // Set the icon width
    //     .attr('height', 10) // Set the icon height
    //     .attr('x', d => {
    //     const [x, y] = projection([d.LONGITUDE, d.LATITUDE]);
    //     return x - (10 / 2); // Adjust the x-position for centering
    //     })
    //     .attr('y', d => {
    //     const [x, y] = projection([d.LONGITUDE, d.LATITUDE]);
    //     return y - (10 / 2); // Adjust the y-position for centering
    //     })
    //     .attr('preserveAspectRatio', 'xMidYMid slice'); // This ensures the image is centered and cropped to fit
  
    const busImage = new Image();
    busImage.src = '../../assets/bus.svg';
    busImage.onload = () => {

      svg.selectAll('.bus-icon')
        .data(busLocations)
        .enter()
        .append('image')
        .attr('class', 'bus-icon')
        .attr('href', busImage.src)
        .attr('width', 15) // Set the icon width
        .attr('height', 15) // Set the icon height
        .attr('x', d => {
        const [x, y] = projection([d.LONGITUDE, d.LATITUDE]);
        return x - (10 / 2); // Adjust the x-position for centering
        })
        .attr('y', d => {
        const [x, y] = projection([d.LONGITUDE, d.LATITUDE]);
        return y - (10 / 2); // Adjust the y-position for centering
        })
        .attr('preserveAspectRatio', 'xMidYMid slice')
      };

      svg.selectAll('.hawker-location')
        .data(hawkerLocations)
        .join('path')
        .attr('class', 'hawker-location')
        .attr('d', createSymbol(symbolCircle, 7)) // Change the size as needed
        .attr('transform', d => `translate(${projection([d.LONGITUDE, d.LATITUDE])})`)
        .style('fill', 'orange');


      svg.selectAll('.lrt-location') // Use a different class for these circles
        .data(lrtLocations)
        .join('circle')
        .attr('class', 'lrt-location') // Apply the class here
        .attr('cx', d => {
            const coords = projection([d.LONGITUDE, d.LATITUDE]);
            return coords ? coords[0] : 0;
        })
        .attr('cy', d => {
            const coords = projection([d.LONGITUDE, d.LATITUDE]);
            return coords ? coords[1] : 0;
        })
        .attr('r', '1')
        .style('fill', 'lightblue');

      svg.selectAll('.malls-location') // Use a different class for these circles
        .data(mallsLocations)
        .join('circle')
        .attr('class', 'malls-location') // Apply the class here
        .attr('cx', d => {
            const coords = projection([d.LONGITUDE, d.LATITUDE]);
            return coords ? coords[0] : 0;
        })
        .attr('cy', d => {
            const coords = projection([d.LONGITUDE, d.LATITUDE]);
            return coords ? coords[1] : 0;
        })
        .attr('r', '1')
        .style('fill', 'pink');

      svg.selectAll('.mrt-location') // Use a different class for these circles
        .data(mrtLocations)
        .join('circle')
        .attr('class', 'mrt-location') // Apply the class here
        .attr('cx', d => {
            const coords = projection([d.LONGITUDE, d.LATITUDE]);
            return coords ? coords[0] : 0;
        })
        .attr('cy', d => {
            const coords = projection([d.LONGITUDE, d.LATITUDE]);
            return coords ? coords[1] : 0;
        })
        .attr('r', '2')
        .style('fill', 'white');
        
      svg.selectAll('.parks-location')
        .data(parksLocations)
        .join('path')
        .attr('class', 'parks-location')
        .attr('d', createSymbol(symbolCircle,7)) // Change the size as needed
        .attr('transform', d => `translate(${projection([d.LONGITUDE, d.LATITUDE])})`)
        .style('fill', 'lightgreen');

      svg.selectAll('.schools-location')
        .data(schoolsLocations)
        .join('path')
        .attr('class', 'schools-location')
        .attr('d', createSymbol(symbolCircle,7)) // Change the size as needed
        .attr('transform', d => `translate(${projection([d.LONGITUDE, d.LATITUDE])})`)
        .style('fill', 'cyan');

      svg.selectAll('.supermarkets-location')
        .data(supermarketLocations)
        .join('path')
        .attr('class', 'supermarkets-location')
        .attr('d', createSymbol(symbolCircle, 7)) // Change the size as needed
        .attr('transform', d => `translate(${projection([d.LONGITUDE, d.LATITUDE])})`)
        .style('fill', 'purple');


    }
  }, [singaporeGeoJSON, hdbLocations, privateLocations, busLocations, hawkerLocations,lrtLocations, mallsLocations, mrtLocations,parksLocations, schoolsLocations, supermarketLocations]);

  return (
    <div>
      <div ref={d3Container} />
    </div>
  );
};

export default SingaporeMap;
