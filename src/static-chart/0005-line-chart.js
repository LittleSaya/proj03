import * as d3 from 'd3'
import aaplBollinger from './data/aapl-bollinger'

// line chart
(function () {
  let data = d3.csvParse(aaplBollinger, d3.autoType);
  let width = 800, height = 400;
  let margin = { top: 40, bottom: 40, left: 40, right:0 };

  let scaleX = d3.scaleUtc()
      .domain(d3.extent(data, d => d.date))
      .range([margin.left, width - margin.right]);
  
  let scaleY = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.upper)])
      .range([height - margin.bottom, margin.top]);
  
  let line = d3.line()
      .x(d => scaleX(d.date))
      .y(d => scaleY(d.upper));
  
  let xAxis = g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(scaleX).ticks(width / 80).tickSizeOuter(0));
  
  let yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(scaleY).ticks(height / 40))
      .call(g => g.select(".domain").remove());
  
  let svg = d3.create('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);
  
  svg.append('g')
      .call(xAxis);
  
  svg.append('g')
      .call(yAxis);
  
  svg.append('path')
      .attr('d', line(data))
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', '1.5')
      .attr('stroke-miterlimit', '1');
  
  document.body.append(d3.create('div').html('Normal line chart').node());
  document.body.append(svg.node());
})();
