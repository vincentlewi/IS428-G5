// Corrected code, ensure you include all of this within a script tag or a .js file

// Set dimensions and margins for the chart
const margin = { top: 70, right: 30, bottom: 40, left: 80 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

// Parse the year into a date format
const parseYear = d3.timeParse("%Y");

// Set up the scales
const xScale = d3.scaleTime().range([0, width]);
const yScale = d3.scaleLinear().range([height, 0]);

// Define a color scale for different flat types
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// Line generator
const lineGenerator = d3.line()
  .x(d => xScale(d.year))
  .y(d => yScale(d.ratio));

// Append the svg object to the body of the page
const svg = d3.select("#my_dataviz2")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Load both datasets
Promise.all([
  d3.csv("test5.csv"),
  d3.csv("average_income_by_household.csv")
]).then(([dataset1, dataset2]) => {

  console.log("Dataset 1 Loaded: ", dataset1); // Check initial data from dataset1
  console.log("Dataset 2 Loaded: ", dataset2); // Check initial data from dataset2
  // Process dataset1
 
  dataset1.forEach(d => {
    d.year = parseYear(d.year);
    d.resale_price = +d.resale_price;
  });
  console.log("Dataset 1 Processed: ", dataset1); // Check processed data from dataset1

  // Process dataset2
  dataset2.forEach(d => {
    d.year = parseYear(d.year);
    d.average_household_income = +d.average_household_income;
    d.flat_type = d.flat_type.trim(); // Ensure that flat_type matches between datasets
  });

  // Group dataset1 by 'year' and 'flat_type' to calculate average resale price
  const avgResalePriceByYearAndType = d3.rollups(dataset1,
    v => d3.mean(v, d => d.resale_price),
    d => d.year.getFullYear(), d => d.flat_type
  ).map(([year, types]) => {
    const yearObj = { year: parseYear(year.toString()) };
    types.forEach(([type, avgResalePrice]) => {
      yearObj[type] = avgResalePrice;
    });
    return yearObj;
  });

  // Combine the average resale price data with dataset2 to calculate the ratios
  const combinedData = dataset2.map(d2 => {
    const matchingYearData = avgResalePriceByYearAndType.find(d => d.year.getFullYear() === d2.year.getFullYear());
    if (matchingYearData && matchingYearData[d2.flat_type] !== undefined) {
      return {
        year: d2.year,
        flat_type: d2.flat_type,
        ratio: matchingYearData[d2.flat_type] / d2.average_household_income
      };
    }
    return null; // or handle missing data as appropriate
  }).filter(d => d !== null);

  // Sort combinedData by year for each flat type
  const dataByFlatType = d3.groups(combinedData, d => d.flat_type).map(([flatType, data]) => {
    return { flatType, data: data.sort((a, b) => a.year - b.year) };
  });

  // Calculate the domains for the scales based on combinedData
  xScale.domain(d3.extent(combinedData, d => d.year));
  yScale.domain([0, d3.max(combinedData, d => d.ratio)]);

  // Draw lines for each flat type
dataByFlatType.forEach(({flatType, data}) => {
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", () => colorScale(flatType))
    .attr("stroke-width", 1.5)
    .attr("d", lineGenerator);
});

// Add X axis
svg.append("g")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(xScale));

// Add Y axis
svg.append("g")
  .call(d3.axisLeft(yScale));

// Add gridlines for X axis
function make_x_gridlines() {   
  return d3.axisBottom(xScale).ticks(5);
}
// Add gridlines for Y axis
function make_y_gridlines() {   
  return d3.axisLeft(yScale).ticks(5);
}

// Add the X gridlines
svg.append("g")     
  .attr("class", "grid")
  .attr("transform", `translate(0,${height})`)
  .call(make_x_gridlines()
      .tickSize(-height)
      .tickFormat("")
  );

// Add the Y gridlines
svg.append("g")     
  .attr("class", "grid")
  .call(make_y_gridlines()
      .tickSize(-width)
      .tickFormat("")
  );

// Add the title to the chart
svg.append("text")
  .attr("x", (width / 2))             
  .attr("y", 0 - (margin.top / 2))
  .attr("text-anchor", "middle")  
  .style("font-size", "16px") 
  .style("text-decoration", "underline")  
  .text("Time to Own a House by Flat Type");

// Create the legend
const legend = svg.selectAll(".legend")
  .data(colorScale.domain())
  .enter().append("g")
  .attr("class", "legend")
  .attr("transform", (d, i) => `translate(0,${i * 20})`);

// Draw legend colored rectangles
legend.append("rect")
  .attr("x", width - 18)
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", colorScale);

// Draw legend text
legend.append("text")
  .attr("x", width - 24)
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "end")
  .text(d => d);

});
