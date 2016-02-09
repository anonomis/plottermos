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
var data = require('./data.json');

// world create
var world = new Chunk(10, 10);
var init = function () {
  world.setData(data);
  signals.register("click", function (x, y) {
    console.log(this.at(x, y));
  }, world);
};
init();

// world tick
var physTick = function (delta, tickNo) {
  //Matter.Engine.update(eng, delta, 1);
  world.tick(delta, tickNo);
};

// interaction
signals.register(0, physTick, this);
signals.register(32, physTick, this);
signals.register(115, world.resetEngine, world);
//signals.register("click", world.gravelVacuumToggle, world);

// world draw
var canvas = document.getElementById("layer2");
var ctx = canvas.getContext("2d");
ctx.W = canvas.width;
ctx.H = canvas.height;
ctx.imageSmoothingEnabled = false;
window.drawing = true;
var tickNo = 0;
var prev = new Date().getTime();
var run = function () {
  var tick = function () {
    var now = new Date().getTime();
    var delta = now - prev;
    tickNo++;
    if (tickNo % 200 === 0) {
      init();
    } else {
      physTick(delta, tickNo);
      world.draw(ctx);
    }
    if (window.drawing) {
      _.delay(tick, 100);
    }
    prev = now;
  };
  tick();
};
run();
