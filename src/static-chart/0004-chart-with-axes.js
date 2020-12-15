import * as d3 from 'd3'

// chart with axes
(function () {
  // width and height define outer size of the chart
  let width = 800;
  let height = 400;
  let margin = {top: 20, right: 0, bottom: 30, left: 40};

  let data = [
    { letter: 'A', frequency: 0.08167 },
    { letter: 'B', frequency: 0.01492 },
    { letter: 'C', frequency: 0.02782 },
    { letter: 'D', frequency: 0.04253 },
    { letter: 'E', frequency: 0.12702 },
    { letter: 'F', frequency: 0.02288 },
    { letter: 'G', frequency: 0.02015 },
    { letter: 'H', frequency: 0.06094 },
    { letter: 'I', frequency: 0.06966 },
    { letter: 'J', frequency: 0.00153 },
    { letter: 'K', frequency: 0.00772 },
    { letter: 'L', frequency: 0.04025 },
    { letter: 'M', frequency: 0.02406 },
    { letter: 'N', frequency: 0.06749 },
    { letter: 'O', frequency: 0.07507 },
    { letter: 'P', frequency: 0.01929 },
    { letter: 'Q', frequency: 0.00095 },
    { letter: 'R', frequency: 0.05987 },
    { letter: 'S', frequency: 0.06327 },
    { letter: 'T', frequency: 0.09056 },
    { letter: 'U', frequency: 0.02758 },
    { letter: 'V', frequency: 0.00978 },
    { letter: 'W', frequency: 0.0236 },
    { letter: 'X', frequency: 0.0015 },
    { letter: 'Y', frequency: 0.01974 },
    { letter: 'Z', frequency: 0.00074 }
  ];

  let scaleY = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.frequency)])
      .range([height - margin.bottom, margin.top]);
  
  let scaleX = d3.scaleBand()
      .domain(data.map(d => d.letter))
      .rangeRound([margin.left, width - margin.right])
      .padding(0.1);
  
  let yTitle = g => g.append('text')
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("y", 10)
      .text("↑ Frequency");
  
  let yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(scaleY).ticks(null, "%"))
      .call(g => g.select(".domain").remove());
  
  let xAxis = g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(scaleX).tickSizeOuter(0));
  
  let svg = d3.create('svg')
      .attr('viewBox', [0, 0, width, height])
      .attr('width', width)
      .attr('height', height);
  
  svg.append('g')
      .attr('fill', 'steelblue')
    .selectAll("rect")
    .data(data)
    .join("rect")
      .attr("x", d => scaleX(d.letter))
      .attr("y", d => scaleY(d.frequency))
      .attr("height", d => scaleY(0) - scaleY(d.frequency))
      .attr("width", scaleX.bandwidth());
  
  svg.append('g')
      .call(xAxis);
  
  svg.append('g')
      .call(yAxis);
  
  svg.call(yTitle);
  
  document.body.append(d3.create('div').html('chart with axes').node());
  document.body.append(svg.node());
})();
