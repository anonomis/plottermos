console.clear();
console.log("boot3");
window.log = console.log;
window._ = require("lodash");
require("./Interaction.js");
var Cell = require("./Cell.js");
var material = require("./Material.js");

// Get Canvas & Context
var canvas = document.getElementById("layer1");
var ctx = canvas.getContext("2d");

// Resize Canvas 
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var W = ctx.canvas.width;
var H = ctx.canvas.height;

// Define drawGrid function
function drawGrid(options) {

  var ctx = options.theContext || false;

  if (!ctx) return;

  var bkg = options.background || "#2554C7";
  var maj = options.majorColor || "#3BB9FF";
  var min = options.minorColor || "#306EFF";
  var txt = options.colorOfNum || "#FFFFFF";
  var num = options.displayNum || true;

  ctx.font = "10px Verdana";
  ctx.fillStyle = bkg;
  ctx.fillRect(0, 0, W, H);
  ctx.lineWidth = 1;

  for (var x = 0; x < W; x += 10) {
    ctx.beginPath();
    ctx.fillStyle = txt;
    ctx.strokeStyle = min;
    if (x % 50 == 0) {
      ctx.strokeStyle = maj;
      num && ctx.fillText(x, x, 10);
    }
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }

  for (var y = 0; y < H; y += 10) {
    ctx.beginPath();
    ctx.fillStyle = txt;
    ctx.strokeStyle = min;
    if (y % 50 == 0) {
      ctx.strokeStyle = maj;
      num && y && ctx.fillText(y, 0, y + 8);
    }
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

}

// Call drawGrid, passing options
drawGrid({
  theContext: ctx,
  // majorColor : "#F00",
  // minorColor : "#BA4",
  // background : "#F15",
  // displayNum : false,
  // colorOfNum : "#FFF"
});


var data = [
  [1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 7, 7, 7, 7, 7, 0, 1],
  [1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 2, 2, 2, 1],
  [0, 2, 1, 0, 1, 1, 1, 7, 7, 7, 7, 0, 0, 1],
  [0, 2, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1]
];

var Chunk = require('./Chunk.js');

var canvas = document.getElementById("layer2");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");


var draw = function (data) {
  ctx.time = new Date().getTime();
  ctx.clearRect(0, 0, W, H);
  data.cells.forEach(function (cell) {
    if (cell.mat.draw) cell.mat.draw(ctx, cell);
  });
  data.cells.forEach(function (cell) {
    cell.busy = false;
  });
};

var physTick = function () {
  // internal chunk pysics
  world.tick();
  //
  draw(world);
};

var world;
var init = function () {
  world = new Chunk(10, 10, data);
  draw(world);
};
init();

var running = true;
var time = 0;
var run = function () {
  var tick = function () {
    time++;
    if (time % 300 === 0) {
      init();
    } else {
      physTick();
    }
    if (running) {
      _.delay(tick, 100);
    }
  };
  tick();
};

run();


module.exports;
