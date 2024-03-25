// Set dimensions and margins for the chart
const margin = { top: 50, right: 30, bottom: 70, left: 60 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

// Append the svg object to the body of the page
const svg = d3.select("#my_dataviz2")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Define a function to update the chart
function updateChart(selectedYear, data) {
  // Clear previous content
  svg.selectAll("*").remove();

  // Filter the data based on the selected year
  const filteredData = data.filter(d => +d.year === +selectedYear);

  // Count the number of flats by town
  const countByTown = d3.rollups(filteredData, v => v.length, d => d.town)
                        .sort((a, b) => b[1] - a[1]);

  // Color scale
  const color = d3.scaleOrdinal()
    .domain(countByTown.map(d => d[0]))
    .range(d3.schemeTableau10);

  // X axis
  const x = d3.scaleLinear()
    .domain([0, d3.max(countByTown, d => d[1])])
    .range([0, width]);

  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // Y axis
  const y = d3.scaleBand()
    .range([0, height])
    .domain(countByTown.map(d => d[0]))
    .padding(0.1);

  svg.append("g")
    .call(d3.axisLeft(y));

  // Bars
  svg.selectAll("rect")
    .data(countByTown)
    .enter()
    .append("rect")
    .attr("x", x(0))
    .attr("y", d => y(d[0]))
    .attr("width", d => x(d[1]))
    .attr("height", y.bandwidth())
    .attr("fill", d => color(d[0]));

  // Add chart title
  svg.append("text")
    .attr("class", "chart-title")
    .attr("x", (width / 2))
    .attr("y", -20) // Position above the top margin
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("text-decoration", "underline")
    .text("Total Number of Flats Sold by Year");
}

// Load the data and initialize the chart
d3.csv("test5.csv").then(data => {
  // Populate the dropdown and set up the initial chart
  const years = Array.from(new Set(data.map(d => +d.year))).sort();

  const select = d3.select("#year-select")
    .on("change", function() {
      updateChart(this.value, data);
    });

  select.selectAll("option")
    .data(years)
    .enter()
    .append("option")
    .attr("value", d => d)
    .text(d => d);

  // Initialize the chart with the first available year
  updateChart(years[0], data);
});
