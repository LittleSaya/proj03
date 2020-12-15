import * as d3 from 'd3'
import aaplBollinger from '../data/aapl-bollinger'

// line chart
(function () {
  let data = d3.csvParse(aaplBollinger, d3.autoType);
  let width = 800, height = 400;
  let margin = { top: 40, bottom: 30, left: 30, right:30 };

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
  
  let tooltip = new Tooltip();
  
  svg.append('g')
      .attr('fill', 'none')
      .attr('pointer-events', 'all');
  
  svg
    .on('mousemove', (event) => {
      let bisector = d3.bisector(d => d.date).center;
      let i = bisector(data, scaleX.invert(event.offsetX));
      let d = data[i];
      tooltip.show({
        x: scaleX(d.date),
        y: scaleY(d.upper),
        date: d3.utcFormat("%b %-d, ’%y")(d.date),
        value: d3.format("$.2f")(d.upper)
      });
    })
    .on('mouseleave', () => {
      tooltip.hide();
    });
  
  // append tooltip as the last element to ensure it's on the top of the chart
  svg.append(() => tooltip.get().node());
  
  document.body.append(d3.create('div').html('Normal line chart with \'title\'').node());
  document.body.append(svg.node());
})();

function Tooltip () {
  // define group element
  // do not forget namespace 'svg'
  let g = d3.create('svg:g')
      .attr('pointer-events', 'none')
      .attr('display', 'none')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'middle');
  
  // add rect as text background
  let rect = g.append('rect')
      .attr('x', -27)
      .attr('width', 54)
      .attr('y', -30)
      .attr('height', 20)
      .attr('fill', 'white');
  
  // add text element for date
  let textDate = g.append('text')
      .attr('y', -22);
  
  // add text element for value
  let textValue = g.append('text')
      .attr('y', -12);
  
  // add a circle
  let circle = g.append('circle')
      .attr('r', 2.5);
  
  // expose function to show the tooltip
  this.show = function ({ x, y, date, value }) {
    g.attr('display', null);
    g.attr('transform', `translate(${x}, ${y})`)
    textDate.text(date);
    textValue.text(value);
  };

  // expose function to hide the tooltip
  this.hide = function () {
    g.attr('display', 'none');
  };

  // expose function to get the tooltip
  this.get = function () {
    return g;
  }
}
