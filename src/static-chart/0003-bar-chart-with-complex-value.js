import * as d3 from 'd3'

(function () {
  let width = 420;

  let data = [{
    name: 'Apple',
    value: 13
  }, {
    name: 'Orange',
    value: 23
  }, {
    name: 'Banana',
    value: 30
  }, {
    name: 'Grape',
    value: 31
  }, {
    name: 'Watermelon',
    value: 35
  }];
  
  let scaleX = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .range([0, width]);
  
  let scaleY = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, 20 * data.length]);
  
  let svg = d3.create('svg')
      .attr("width", width)
      .attr("height", scaleY.range()[1])
      .attr("font-family", "sans-serif")
      .attr("font-size", "10")
      .attr("text-anchor", "end");
  
  let bar = svg.selectAll('g')
    .data(data)
    .join('g')
      .attr('transform', d => `translate(0, ${scaleY(d.name)})`);
  
  bar.append('rect')
      .attr("fill", "steelblue")
      .attr("width", d => scaleX(d.value))
      .attr("height", scaleY.bandwidth() - 1);
  
  bar.append("text")
      .attr("fill", "white")
      .attr("x", d => scaleX(d.value) - 3)
      .attr("y", scaleY.bandwidth() / 2)
      .attr("dy", "0.35em")
      .text(d => d.value);
  
  document.body.append(d3.create('div').html('bar chart with complex value').node());
  document.body.append(svg.node());
})();
