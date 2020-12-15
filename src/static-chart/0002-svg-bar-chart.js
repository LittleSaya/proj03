import * as d3 from 'd3'

// create a bar chart using svg
(function () {
  const width = 420;
  let data = [12, 13, 14, 15, 6, 7, 8];
  
  // define x scale
  let scaleX = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .range([0, width]);
  
  // define y scale
  let scaleY = d3.scaleBand()
      .domain(d3.range(data.length))
      .range([0, 20 * data.length]);
  
  // define svg element
  let svg = d3.create("svg")
      .attr("width", width)
      .attr("height", scaleY.range()[1])
      .attr("font-family", "sans-serif")
      .attr("font-size", "10")
      .attr("text-anchor", "end");

  let bar = svg.selectAll("g")
    .data(data)
    .join("g")
      .attr("transform", (d, i) => `translate(0,${scaleY(i)})`);

  bar.append("rect")
      .attr("fill", "steelblue")
      .attr("width", scaleX)
      .attr("height", scaleY.bandwidth() - 1);

  bar.append("text")
      .attr("fill", "white")
      .attr("x", d => scaleX(d) - 3)
      .attr("y", scaleY.bandwidth() / 2)
      .attr("dy", "0.35em")
      .text(d => d);
  
  document.body.append(d3.create('div').html('create a bar chart using svg').node());
  document.body.append(svg.node());
})();
