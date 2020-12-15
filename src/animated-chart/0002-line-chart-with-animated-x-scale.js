import * as d3 from 'd3'
import aaplBollinger from '../data/aapl-bollinger'

// line chart
(function () {
  // data and chart size
  let data = d3.csvParse(aaplBollinger, d3.autoType);
  let width = 800, height = 400;
  let margin = { top: 40, bottom: 40, left: 40, right:0 };

  // predefine domains
  let domains = [
    d3.extent(data, d => d.date),
    [new Date(2009, 0, 1), new Date(2010, 0, 1)],
    [new Date(2010, 0, 1), new Date(2011, 0, 1)],
    [new Date(2011, 0, 1), new Date(2012, 0, 1)]
  ];
  let domainIndex = 0;

  // draw the initial chart
  let scaleX = d3.scaleUtc()
      .domain(d3.extent(data, d => d.date))
      .range([margin.left, width - margin.right]);
  
  let xAxis = (g, scale = scaleX) => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(scale).ticks(width / 80).tickSizeOuter(0));
  
  let scaleY = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.upper)])
      .range([height - margin.bottom, margin.top]);
  
  let yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(scaleY).ticks(height / 40))
      .call(g => g.select(".domain").remove());
  
  let line = d3.line()
      .x(d => scaleX(d.date))
      .y(d => scaleY(d.upper));
  
  // draw svg
  let svg = d3.create('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);
  
  // save the x axis
  let gx = svg.append('g').call(xAxis, scaleX);
  svg.append('g').call(yAxis);
  // save the path
  let path = svg.append('path')
      .attr('d', line(data))
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', '1.5')
      .attr('stroke-miterlimit', '1');
  
  document.body.append(d3.create('div').html('Line chart with animated x scale').node());
  document.body.append(svg.node());

  setInterval(() => {
    domainIndex = ++domainIndex % domains.length;
    let t = svg.transition().duration(1000);
    scaleX.domain(domains[domainIndex]);
    gx.transition(t).call(xAxis, scaleX);
    path.transition(t).attr('d', line(data));
  }, 2000);
})();
