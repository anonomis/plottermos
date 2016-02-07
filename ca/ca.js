// comforts
console.clear();
console.log("booot");
window.log = console.log;
window._ = require("lodash");

// imports
require("./Backdrop.js");
var signals = require("./Interaction.js");
var Chunk = require('./Chunk.js');
var material = require('./Material.js');


// world create
var data = [
  [1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 7, 7, 7, 7, 7, 0, 1],
  [1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 2, 2, 2, 1],
  [0, 2, 1, 0, 1, 1, 1, 7, 7, 7, 7, 0, 0, 1],
  [0, 2, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1]
];
var world;
var init = function () {
  world = new Chunk(10, 10, data);
  signals.register("click", world.gravelVacuumToggle, world);
  world.startEngine();
};
init();

// world tick
var physTick = function (delta) {

  //Matter.Engine.update(eng, delta, 1);
  console.log(world.eng.world.bodies[6].position);
  console.log("asdf", delta);
  world.tick();
};
signals.register(0, physTick, this);
signals.register(32, physTick, this);

// world draw
var canvas = document.getElementById("layer2");
var ctx = canvas.getContext("2d");
ctx.W = canvas.width;
ctx.H = canvas.height;
ctx.imageSmoothingEnabled = false;
var draw = function () {
  world.draw(ctx);
};

// runner
window.running = true;
var time = 0;
var prev = new Date().getTime();
var run = function () {
  var tick = function () {
    var now = new Date().getTime();
    var delta = now - prev;
    time++;
    if (time % 100 === 0) {
      init();
    } else {
      physTick(delta);
      draw();
    }
    if (window.running) {
      _.delay(tick, 100);
    }
    prev = now;
  };
  tick();
};
run();
