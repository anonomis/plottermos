var Cell = require("./Cell.js");
var material = require("./Material.js");


function Chunk(w, h, data) {
  this.w = 10;
  this.h = 10;
  this.cells = [];
  _.times(this.w, function (x) {
    _.times(this.h, function (y) {
      var symbol = data[y] && data[y][x];
      if (!symbol) {
        symbol = 0;
      }
      var mat = material._dataTransform(symbol);
      this.cells.push(new Cell(x, y, mat, this));
    }, this);
  }, this);
}

Chunk.prototype.tick = function (delta, tickNo) {
  this.swapsThisTick = 0;
  this.cells.forEach(function (cell) {
    cell.tick();
  });
  if (this.swapsThisTick > 0) {
    this.resetEngine();
  }
};

Chunk.prototype.at = function (x, y) {
  var x = _.parseInt(x);
  var y = _.parseInt(y);
  var cell = _.find(this.cells, {x: x, y: y});
  return cell || new Cell(x, y, material.void, this);
};

Chunk.prototype.setMat = function (x, y, mat) {
  this.at(x, y).mat = mat;
};

Chunk.prototype.sw = function (cellA, cellB) {
  if (cellB.mat.canSwap(cellA.mat)) {
    if (!cellA.mat) throw new Error("Undefined cell material");
    if (!cellB.mat) throw new Error("Undefined this cell material");
    var newMat = cellA.mat;
    cellA.mat = cellB.mat;
    cellB.mat = newMat;
    var newBody = cellA.body;
    cellA.body = cellB.body;
    cellB.body = newBody;
    cellA.busy = true;
    cellB.busy = true;
    this.swapsThisTick++;
  }
  _.forEach(cellA.getAdjacent, function (adj) {
    if (cellB.mat.canSwap(adj.mat)) {
      if (!adj.mat) throw new Error("Undefined cell material");
      if (!cellB.mat) throw new Error("Undefined this cell material");
      var newMat = adj.mat;
      adj.mat = cellB.mat;
      cellB.mat = newMat;
      var newBody = adj.body;
      adj.body = cellB.body;
      cellB.body = newBody;
      adj.busy = true;
      cellB.busy = true;
      this.swapsThisTick++;
    }
  });
};

Chunk.prototype.gravelVacuumToggle = function (x, y) {
  console.log("asdf");
  var mat = this.at(x, y).mat;

  console.log(mat, x, y);
  console.log(mat);
  if (mat === material.vacuum) {
    this.setMat(x, y, material.gravel);
  } else {
    this.setMat(x, y, material.vacuum);
  }
};

Chunk.prototype.getAdjacent = function (x, y) {
  return {
    up: this.at(x, y - 1),
    do: this.at(x, y + 1),
    le: this.at(x - 1, y),
    ri: this.at(x + 1, y),
    ul: this.at(x + 1, y - 1),
    ur: this.at(x - 1, y - 1),
    ll: this.at(x - 1, y + 1),
    lr: this.at(x + 1, y + 1)
  }
};

Chunk.prototype.draw = function (ctx) {
  ctx.time = new Date().getTime();
  ctx.clearRect(0, 0, ctx.W, ctx.H);
  this.cells.forEach(function (cell) {
    if (cell.mat.draw) cell.mat.draw(ctx, cell);
  });
  this.cells.forEach(function (cell) {
    cell.busy = false;
  });
};


Chunk.prototype.makePhysicsRaster = function () {
  var rtn = [];
  this.cells.forEach(function (cell) {
    var body;
    if (cell.mat !== material.vacuum) {
      body = Matter.Bodies.rectangle(
        (cell.x * 10) + 15,
        (cell.y * 10) + 15,
        10,
        10,
        {
          isStatic: cell.mat !== material.gravel,
          friction: 0.4,
          chamfer: {
            radius: 3
          }
        }
      );
    } else {
      body = null;
    }
    //Matter.Body.rotate(body, Math.PI / 1.3);
    rtn.push(body);
    cell.body = body;
  });

  rtn = _.compact(rtn);
  console.log("raster size", rtn.length);
  return rtn;
};

Chunk.prototype.resetEngine = function () {
  Matter.World.clear(this.eng.world, true);
  var wallS = Matter.Bodies.rectangle(50, 115, 140, 10, {
    isStatic: true
  });
  var wallW = Matter.Bodies.rectangle(5, 60, 10, 100, {
    isStatic: true
  });
  var wallE = Matter.Bodies.rectangle(115, 60, 10, 100, {
    isStatic: true
  });
  var wallN = Matter.Bodies.rectangle(50, 5, 140, 10, {
    isStatic: true
  });
  var mesh = _.union([wallS, wallW, wallE, wallN], this.makePhysicsRaster());
  Matter.World.add(this.eng.world, mesh);
};

Chunk.prototype.startEngine = function () {
  var eng = Matter.Engine.create(document.getElementById("physx"));
  this.eng = eng;
  this.resetEngine();
  Matter.Engine.run(eng);
  return eng;
};

module.exports = Chunk;