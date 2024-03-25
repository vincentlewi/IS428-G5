// Set dimensions and margins for the chart
const margin = { top: 70, right: 30, bottom: 40, left: 80 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

// Parse the year into a date format
const parseYear = d3.timeParse("%Y");

// Set up the scales
const xScale = d3.scaleTime().range([0, width]);
const yScale = d3.scaleLinear().range([height, 0]);

// Line generator
const line = d3.line()
  .x(d => xScale(d.year))
  .y(d => yScale(d.median_adjusted_price));

// Append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Load and process the data
d3.csv("test5.csv").then(data => {
  // Process the data
  data.forEach(d => {
    d.year = parseYear(d.year);
    d.adjusted_price = +d.adjusted_price;
  });

  // Group data by 'town_classification' and 'year' and calculate median 'adjusted_price'
  const groupedData = d3.rollups(data, 
                                  v => d3.median(v, d => d.adjusted_price),
                                  d => d.year, d => d.town_classification)
                        .map(([year, values]) => ({ year, values: Object.fromEntries(values) }));

  // Create a flat array suitable for line generator
  const matureData = groupedData.map(d => ({
    year: d.year,
    median_adjusted_price: d.values["Mature"]
  }));

  const nonMatureData = groupedData.map(d => ({
    year: d.year,
    median_adjusted_price: d.values["Non-Mature"]
  }));

  // Set the domains for the scales
  xScale.domain(d3.extent(groupedData, d => d.year));
  yScale.domain([0, d3.max([...matureData, ...nonMatureData], d => d.median_adjusted_price)]);

  // Draw the line for mature estates
  svg.append("path")
    .datum(matureData)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", line);

  // Draw the line for non-mature estates
  svg.append("path")
    .datum(nonMatureData)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 1.5)
    .attr("d", line);

  // Add X axis
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

  // Add Y axis
  svg.append("g")
    .call(d3.axisLeft(yScale));

    
      // Add gridlines for X axis
  function make_x_gridlines() {   
    return d3.axisBottom(xScale).ticks(5)
}
// Add gridlines for Y axis
function make_y_gridlines() {   
    return d3.axisLeft(yScale).ticks(5)
}

// Add the X gridlines
svg.append("g")     
    .attr("class", "grid")
    .attr("transform", "translate(0," + height + ")")
    .call(make_x_gridlines()
        .tickSize(-height)
        .tickFormat("")
    )

// Add the Y gridlines
svg.append("g")     
    .attr("class", "grid")
    .call(make_y_gridlines()
        .tickSize(-width)
        .tickFormat("")
    )

// Add the title to the chart
svg.append("text")
    .attr("x", (width / 2))             
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style("text-decoration", "underline")  
    .text("Adjusted Median Price: Mature vs Non-Mature");

// Create the legend
var legend = svg.selectAll(".legend")
    .data(["Mature", "Non-Mature"])
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

// Draw legend colored rectangles
legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d, i) { return i === 0 ? "steelblue" : "red"; });

// Draw legend text
legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d; });

    
});




