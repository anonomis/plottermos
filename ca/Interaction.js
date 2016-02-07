var $ = require("jquery2");

var signals = {
  _keyCode: []
};

var canvas = document.getElementById("layer3");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx3 = canvas.getContext("2d");


function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

var mousePos;
canvas.addEventListener('mousemove', function (evt) {
  var mousePos = getMousePos(canvas, evt);
  ctx3.clearRect(0, 0, canvas.width, canvas.height);
  ctx3.strokeStyle = "#F00";
  var x = Math.ceil((mousePos.x - 10) / 10);
  var y = Math.ceil((mousePos.y - 10) / 10);
  ctx3.strokeRect(x * 10, y * 10, 10, 10);
}, false);


canvas.addEventListener('click', function (evt) {
  var mousePos = getMousePos(canvas, evt);
  var x = Math.abs(Math.ceil((mousePos.x - 10) / 10));
  var y = Math.abs(Math.ceil((mousePos.y - 10) / 10));
  if (_.isFunction(signals.click)) {
    signals.click(x, y);
  }
  console.log("click", x, y);
}, false);

$(window).keypress(function (e) {
  console.log(e.keyCode);
  var action = signals._keyCode[e.keyCode];
  if (action) {
    action(e);
  }
});


module.exports = {
  register: function (signal, func, caller) {
    if (_.isNumber(signal)) {
      signals._keyCode[signal] = function () {
        func.apply(caller, arguments);
      };
    } else {
      signals[signal] = function () {
        func.apply(caller, arguments);
      };
    }
  }
};
