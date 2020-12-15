import * as d3 from 'd3'

const alphabet = [ ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ" ];
const width = 800;
const height = 400;

(function () {
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr('width', width)
      .attr('height', height)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .style("display", "block");
  
  let text = svg.selectAll('text');

  (function change () {
    const t = svg.transition().duration(750);
    text = text
      .data(randomLetters(), d => d)
      .join(
        // initial state of enter elements: y = -7, stroke = white
        enter => enter.append('text')
            .attr('y', -7)
            .attr('dy', '0.35em')
            .attr("x", (d, i) => i * 17)
            .attr('stroke', 'white')
            .text(d => d),
        update => update,
        // final state of exit elements: y = 41, stroke = white, use a transition with duration of 750ms
        exit => exit.call(text => text.transition(t).remove().attr('y', 41).attr('stroke', 'white'))
      )
      // final state of enter and update elements, x, y, stroke = black, use a transition with duration of 750ms
      .call(
        text => text.transition(t)
            .attr('y', 17)
            .attr("x", (d, i) => i * 17)
            .attr('stroke', 'black')
      ),
    setTimeout(change, 3000);
  })();

  document.body.append(d3.create('div').html('Join and selection').node());
  document.body.append(svg.node());
})();

function randomLetters () {
  return d3.shuffle(alphabet.slice())
      .slice(Math.floor(Math.random() * 10) + 5)
      .sort(d3.ascending);
}
