import * as d3 from 'd3'
import aaplBollinger from './data/aapl-bollinger'

(function () {
  let data = d3.csvParse(aaplBollinger, d3.autoType);
  let width = 800, height = 400;
  let margin = {top: 40, right: 0, left: 40, bottom: 40};

  let scaleX = d3.scaleUtc()
      .domain(d3.extent(data, d => d.date))
      .range([margin.left, width - margin.right]);

  let scaleY = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.upper)])
      .range([height - margin.bottom, margin.top]);
  
  // area: y0 = lower, y1 = upper
  let area = d3.area()
      .x(d => scaleX(d.date))
      .y0(d => scaleY(d.lower))
      .y1(d => scaleY(d.upper));
  
  // get area's upper bound and lower bound line
  let areaUpperBound = area.lineY1();
  let areaLowerBound = area.lineY0();
  
  let xAxis = g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(scaleX).ticks(width / 80).tickSizeOuter(0));
  
  let yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(scaleY).ticks(height / 40))
      .call(g => g.select(".domain").remove());
  
  // svg using area
  let svg = d3.create('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);
  
  svg.append('g')
      .call(xAxis);
  
  svg.append('g')
      .call(yAxis);
  
  // draw area
  svg.append('path')
      .attr('d', area(data))
      .attr('fill', 'grey');
  
  let boundGroup = svg.append('g')
      .attr('fill', 'none')
      .attr('stroke-width', '1.5')
      .attr('stroke-miterlimit', '1');
  
  // draw upper bound
  boundGroup.append('path')
      .attr('d', areaUpperBound(data))
      .attr('stroke', 'red');
  
  // draw lower bound
  boundGroup.append('path')
      .attr('d', areaLowerBound(data))
      .attr('stroke', 'blue');
  
  document.body.append(d3.create('div').html('Area chart with highlighted bounds').node());
  document.body.append(svg.node());
})();
