import * as d3 from 'd3'

(function () {
  let N = 8;
  let arc = d3.arc()
      .innerRadius(210)
      .outerRadius(310)
      .startAngle(([startAngle, endAngle]) => startAngle)
      .endAngle(([startAngle, endAngle]) => endAngle);
  
  let svg = d3.create('svg')
      .attr('viewBox', '-320 -320 640 640')
      .attr('style', 'max-width: 640px;');
  
  let arcs = svg.selectAll('path')
    .data(Array.from({ length: N }))
    .join('path')
      .attr('stroke', 'black')
      .attr('fill', (d, i) => d3.interpolateRainbow(i / N))
      .attr('d', (d, i) => arc([i / N * 2 * Math.PI, (i + 1) / N * 2 * Math.PI]));
  
  document.body.append(d3.create('div').html('Basic donut shape').node());
  document.body.append(svg.node());
})();
