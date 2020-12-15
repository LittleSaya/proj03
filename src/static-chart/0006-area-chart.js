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

  // area1: fixed y0
  let area1 = d3.area()
      .x(d => scaleX(d.date))
      .y0(scaleY(0))
      .y1(d => scaleY(d.close));
  
  // area2: y0 = lower, y1 = upper
  let area2 = d3.area()
      .x(d => scaleX(d.date))
      .y0(d => scaleY(d.lower))
      .y1(d => scaleY(d.upper));
  
  let xAxis = g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(scaleX).ticks(width / 80).tickSizeOuter(0));
  
  let yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(scaleY).ticks(height / 40))
      .call(g => g.select(".domain").remove());
  
  // svg1 using area1
  let svg1 = d3.create('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);
  
  svg1.append('g')
      .call(xAxis);
  
  svg1.append('g')
      .call(yAxis);
  
  svg1.append('path')
      .attr('d', area1(data))
      .attr('fill', 'steelblue');
  
  // svg2 using area2
  let svg2 = d3.create('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);
  
  svg2.append('g')
      .call(xAxis);
  
  svg2.append('g')
      .call(yAxis);
  
  svg2.append('path')
      .attr('d', area2(data))
      .attr('fill', 'steelblue');
  
  document.body.append(d3.create('div').html('Area chart 1').node());
  document.body.append(svg1.node());
  document.body.append(d3.create('div').html('Area chart 2').node());
  document.body.append(svg2.node());
})();
