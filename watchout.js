// start slingin' some d3 here.

//globals for score etc.
var highScore = 0;
var userScore = 0;
var numCollisions = 0;
var width = 1500;
var height = 1000;
var updateInterval = 2000;
var numCircles = 50;
var radius = 20;
var enemyMoveTime = 1000;

//insert and svg tag & g tag?
var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .on("mousemove", function(){
              d3.select(".player").attr("cx", d3.mouse(svg[0][0])[0])
                                  .attr("cy", d3.mouse(svg[0][0])[1]);
            });

//define update function
  //draw circles
  //set attributes
  //call transitions
var initialize = function(n){
  //define/insert player
  //define/insert enemies
  for(var i = 0; i < numCircles; i++){
    svg.append("circle")
      .attr("cx", Math.random()*width)
      .attr("cy", Math.random()*height)
      .attr("r", radius)
      .classed("enemy", true);
  }

  svg.append("circle")
    .attr("cx", Math.random()*width)
    .attr("cy", Math.random()*height)
    .attr("r", radius)
    .classed("player", true);
};

initialize(numCircles);

var update = function(){
  var circles = d3.selectAll(".enemy");
  var player = d3.selectAll(".player");

  circles.transition()
    .duration(updateInterval/2)
    .attr("cx", function(){return Math.random()*width;})
    .attr("cy", function(){return Math.random()*height;});

};

//collisions!!
var checkCollisions = function() {
  var player = d3.select(".player");
  var enemies = d3.selectAll(".enemy");

  enemies.each(function(){
    var dx = player.attr("cx") - d3.select(this).attr("cx");
    var dy = player.attr("cy") - d3.select(this).attr("cy");
    var distance = Math.sqrt(dx*dx + dy*dy);
    if (distance < 2*radius) {
      numCollisions++;
      d3.select(".collisions span").text(numCollisions);
      resetScore();
    }
  });
};

var resetScore = function(){
  if (userScore > highScore) {
    highScore = userScore;
    d3.select(".high span").text(highScore);
  }
  userScore = 0;
  d3.select("current span").text(userScore);
};

//setInterval for update
setInterval(update, updateInterval);
setInterval(checkCollisions, 100);

//setInterval for incrementing the score
setInterval(function(){
  userScore++;
  d3.select(".current span").text(userScore);
}, updateInterval/50);





