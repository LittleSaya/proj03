import * as d3 from 'd3'

// create a bar chart using html
(function () {
  let data = [1, 2, 3, 4, 5, 6];
  
  let scale = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .range([0, 420]);
  
  let div = d3.create("div")
      .style("font", "10px sans-serif")
      .style("text-align", "right")
      .style("color", "white");
  
  div.selectAll('div')
    .data(data)
    .join('div')
      .style("background", "steelblue")
      .style("padding", "3px")
      .style("margin", "1px")
      .style("width", d => `${scale(d)}px`)
      .text(d => d);
  
  document.body.append(d3.create('div').html('create a bar chart using html').node());
  document.body.append(div.node());
})();
