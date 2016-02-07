// Get Canvas & Context
var canvas = document.getElementById("backdrop");
var ctx = canvas.getContext("2d");


// Resize Canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var W = ctx.canvas.width - 100;
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
