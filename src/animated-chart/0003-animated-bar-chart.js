import * as d3 from 'd3'
import usPopulationStateAge from '../data/us-population-state-age'

const data = d3.csvParse(usPopulationStateAge, d3.autoType);
const ages = data.columns.slice(1); // array of age range
const totals = new Map(data.map(d => [d.name, d3.sum(ages, age => d[age])])); // total pop of states
// state name, age range, percentage
const cross = d3.cross(data, ages).map(([d, age]) => ({ name: d.name, age, value: +d[age] / totals.get(d.name) }));
cross.names = data.map(d => d.name);
cross.ages = ages;

let currentAgeIndex = 0;
let currentData = null;
setCurrentData();

const margin = { top: 30, right: 20, bottom: 0, left: 30 };
const width = 800, height = margin.top + 20 * 10;

(function () {
  let svg = d3.create('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);
  
  let xScale = d3.scaleLinear()
      .domain([ 0, d3.max(currentData, d => d.value) ])
      .rangeRound([ margin.left, width - margin.right ]);
  
  let yScale = d3.scaleBand()
      .domain(currentData.map(d => d.name))
      .rangeRound([ margin.top, margin.top + 20 * cross.names.length ]);
  
  let bar = svg.append('g')
      .attr('fill', 'steelblue')
    .selectAll('rect')
    .data(currentData, d => d.name)
    .join('rect')
      .style("mix-blend-mode", "multiply")
      .attr("x", xScale(0))
      .attr("y", d => yScale(d.name))
      .attr("width", d => xScale(d.value) - xScale(0))
      .attr("height", yScale.bandwidth() - 1);
  
  let xAxis = (g, x) => g
      .attr("transform", `translate(0,${margin.top})`)
      .call(d3.axisTop(x).ticks(width / 80, "%"))
      .call(g => (g.selection ? g.selection() : g).select(".domain").remove()); // ?
  
  let yAxis = (g, y) => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickSizeOuter(0));

  let gx = svg.append("g")
      .call(xAxis, xScale);

  let gy = svg.append("g")
      .call(yAxis, yScale);
  
  document.body.append(d3.create('div').html('Animated bar chart').node());
  document.body.append(d3.create('div').attr('id', 'ageRange').html(`age range: ${ages[currentAgeIndex]}`).node());
  document.body.append(svg.node());

  setInterval(() => {
    currentAgeIndex = (currentAgeIndex + 1) % ages.length;
    setCurrentData();
    d3.select('#ageRange').html(`age range: ${ages[currentAgeIndex]}`);

    const t = svg.transition().duration(750);

    gx.transition(t)
        .call(xAxis, xScale.domain([0, d3.max(currentData, d => d.value)]));

    gy.transition(t)
        .call(yAxis, yScale.domain(currentData.map(d => d.name)));

    bar = bar
      .data(currentData, d => d.name)
      .call(
        bar => bar.transition(t)
          .attr("width", d => xScale(d.value) - xScale(0))
          .attr("y", d => yScale(d.name))
      );
  }, 3000);
})();

function setCurrentData () {
  currentData = cross
      .filter(d => d.age === ages[currentAgeIndex])
      .sort((a, b) => d3.descending(a.value, b.value));
}
