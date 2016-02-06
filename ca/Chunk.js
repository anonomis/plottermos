var Cell = require("./Cell.js");
var material = require("./Material.js");

function Chunk(w, h, data) {
  this.w = 20;
  this.h = 10;
  this.cells = [];
  _.times(this.w, function (x) {
    _.times(this.h, function (y) {
      var mat = data[y] && data[y][x];
      this.cells.push(new Cell(x, y, material[mat], this));
    }, this);
  }, this);
}

Chunk.prototype.tick = function () {
  this.cells.forEach(function (cell) {
    cell.tick();
  });
};

Chunk.prototype.at = function (x, y) {
  var cell = _.find(this.cells, {x: x, y: y});
  return cell || new Cell(x, y, material[6], this);
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


module.exports = Chunk;