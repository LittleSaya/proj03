import * as d3 from 'd3'

(function () {
  let fruits = [
    {name: "🍊", count: 21},
    {name: "🍇", count: 13},
    {name: "🍏", count: 8},
    {name: "🍌", count: 5},
    {name: "🍐", count: 3},
    {name: "🍋", count: 2},
    {name: "🍎", count: 1},
    {name: "🍉", count: 1}
  ];

  let pieArcData = d3.pie()
      .value(d => d.count)
      (fruits);
  
  let arcPie = d3.arc()
      .innerRadius(210)
      .outerRadius(310)
      .padRadius(300)
      .padAngle(2 / 300)
      .cornerRadius(8);
  
  let svg = d3.create('svg')
      .attr('viewBox', '-320 -320 640 640')
      .attr('style', 'max-width: 640px;')
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif');
  
  let groups = svg.selectAll('g')
    .data(pieArcData)
    .join('g');
  
  // in each group we have a path element
  groups.append('path')
      .attr('fill', 'steelblue')
      .attr('d', d => arcPie(d));
  
  // and in each group we have a text element
  let texts = groups.append('text')
      .attr('fill', 'white')
      .attr('transform', d => `translate(${arcPie.centroid(d).join(',')})`)
  
  // in each text we have 2 tspan elements which represent name and value
  texts.append('tspan')
      .attr('x', '0')
      .attr('font-size', '24')
      .html(d => d.data.name);
  texts.append('tspan')
      .attr('x', '0')
      .attr('font-size', '12')
      .attr('dy', '1.3em')
      .html(d => d.value.toLocaleString('en'));
  
  document.body.append(d3.create('div').html('Pie chart').node());
  document.body.append(svg.node());
})();
