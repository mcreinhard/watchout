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
var enemies = [];

var Enemy = function(cx, cy){
  this.cx = cx || Math.random()*width;
  this.cy = cy || Math.random()*height;
  this._playerOverlap = false; // deal with initial overlap?
};

Enemy.prototype.setPlayerOverlap = function(value) {
  if (!this._playerOverlap && value) {
    numCollisions++;
    d3.select(".collisions span").text(numCollisions);
    resetScore();
  }
  this._playerOverlap = value;
};

Enemy.prototype.setPosition = function(x, y){
  this.cx = x || Math.random()*width;
  this.cy = y || Math.random()*height;
};

//insert and svg tag & g tag?
var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .on("mousemove", function(){
              d3.select(".player").attr("cx", d3.mouse(svg[0][0])[0])
                                  .attr("cy", d3.mouse(svg[0][0])[1]);
              d3.selectAll(".enemy").data(enemies, function(d, i) {return i;})
                                 .each(function(d) {
                                   checkCollision(d3.select(this), d);
                                  });
            });

//define update function
  //draw circles
  //set attributes
  //call transitions
var initialize = function(){
  //define/insert player
  //define/insert enemies
  for (var i = 0; i < numCircles; i++) {
    enemies.push(new Enemy());
  }

  svg.selectAll("circle")
    .data(enemies, function(d, i) {return i;})
    .enter().append("circle")
      .attr("cx", function(d){return d.cx;})
      .attr("cy", function(d){return d.cy;})
      .attr("r", radius)
      .classed("enemy", true);

  svg.append("circle")
    .attr("cx", Math.random()*width)
    .attr("cy", Math.random()*height)
    .attr("r", radius)
    .classed("player", true);
};

initialize();

var update = function(){
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].setPosition();
  }
  var circles = d3.selectAll(".enemy");
  circles.data(enemies, function(d, i) {return i;})
        .transition()
          .duration(updateInterval/2)
          .tween("custom", collisionTween);
};

var collisionTween = function(d) {
  // debugger;
  var enemy = d3.select(this);
  var xStart = parseFloat(enemy.attr('cx'));
  var yStart = parseFloat(enemy.attr('cy'));
  var xEnd = d.cx;
  var yEnd = d.cy;
  return function(t){
    var xNext = xStart + (xEnd-xStart)*t;
    var yNext = yStart + (yEnd-yStart)*t;
    // console.log("At time: ", t, "  New next: ", xNext, ", ", yNext);
    enemy.attr("cx", xNext);
    enemy.attr("cy", yNext);
    checkCollision(enemy, d);
  };
};

//collisions!!
var checkCollision = function(enemy, d) {
  var player = d3.select(".player");
  var dx = player.attr("cx") - enemy.attr("cx");
  var dy = player.attr("cy") - enemy.attr("cy");
  var distance = Math.sqrt(dx*dx + dy*dy);
  if (distance < 2*radius) {
    d.setPlayerOverlap(true);
  } else {
    d.setPlayerOverlap(false);
  }
};

var resetScore = function(){
  if (userScore > highScore) {
    highScore = userScore;
    d3.select(".high span").text(highScore);
  }
  userScore = 0;
  d3.select(".current span").text(userScore);
};

//setInterval for update
setInterval(update, updateInterval);
//setInterval(checkCollisions, 100);

//setInterval for incrementing the score
setInterval(function(){
  userScore++;
  d3.select(".current span").text(userScore);
}, updateInterval/50);





