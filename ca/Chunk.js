var Cell = require("./Cell.js");
var material = require("./Material.js");

function Chunk(w, h) {
  this.w = 10;
  this.h = 10;
  this.cells = [];
  this.stable = false;
  this.eng = Matter.Engine.create(document.getElementById("physx"));
  Matter.Engine.run(this.eng);
  console.log("asdf", this.eng.timing.timeScale);
  this.eng.timing.timeScale = 0.1;

  var renderOptions = this.eng.render.options;
  renderOptions.wireframes = true;
  renderOptions.wireframeBackground = "black"
}

Chunk.prototype.setData = function (data) {
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
  this.startEngine();
};


Chunk.prototype.tick = function (delta, tickNo) {
  this.swapsThisTick = 0;
  if (!this.stable) {
    this.cells.forEach(function (cell) {
      cell.tick();
    });
    if (this.swapsThisTick === 0) {
      this.stableIn--;
      if (this.stableIn < 0) {
        this.stable = true;
        console.log("stable as fucking concrete!")
      }
    } else {
      this.stableIn = 20;
    }
  }
};

Chunk.prototype.at = function (xDirty, yDirty) {
  var x = _.parseInt(Math.round(xDirty));
  var y = _.parseInt(Math.round(yDirty));

  if (_.isNaN(x) || _.isNaN(y)) {
    throw new Error("common wtf error: " + x + ":" + y);
  }

  var cell = _.find(this.cells, {
    x: x,
    y: y
  });
  return cell || new Cell(x, y, material.void, this);
};

Chunk.prototype.setMat = function (x, y, mat) {
  var cell = this.at(x, y);
  if (cell.body) Matter.World.remove(this.eng.world, cell.body);
  cell.mat = mat;
  cell.body = mat.makeBody(cell);
  if (cell.body) Matter.World.add(this.eng.world, cell.body);
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
    return true;
  }
  return false;
  /* This is pure madness don't go there!
   if (didSwap) {

   _.forEach(_.union(this.getAdjacent(cellA), [cellA], this.getAdjacent(cellB), [cellB]), function (cell) {
   if (cell.body) {
   Matter.Body.set(cell.body, {position: {x: translate(cell.x), y: translate(cell.y)}});
   }
   });
   console.log(cellA, cellB);
   }
   */
};

Chunk.prototype.gravelVacuumToggle = function (x, y) {
  var mat = this.at(x, y).mat;

  if (mat === material.vacuum) {
    this.setMat(x, y, material.gravel);
  } else {
    this.setMat(x, y, material.vacuum);
  }
};

Chunk.prototype.getAdjacent = function (x, y) {
  if (_.isObject(x)) {
    y = x.y;
    x = x.x;
  }
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
    var body = cell.mat.makeBody(cell);
    //Matter.Body.rotate(body, Math.PI / 1.3);
    rtn.push(body);
    cell.body = body;
  });

  rtn = _.compact(rtn);
  return rtn;
};

Chunk.prototype.resetEngine = function () {
  Matter.World.clear(this.eng.world, false);
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
  this.resetEngine();
};

Chunk.prototype.toEng = function (vec, offsetOpt) {
  var offset = offsetOpt || 0;
  return {
    x: (vec.x * 10) + 20 - 5,
    y: (vec.y * 10) + 20 - 5
  }
};


module.exports = Chunk;