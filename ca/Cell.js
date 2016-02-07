var material = require("./Material.js");

function Cell(x, y, mat, chunk) {
  this.x = x;
  this.y = y;
  this.mat = mat || material.vacuum;
  this.chunk = chunk;
  return this;
}

Cell.prototype.tick = function () {
  if (this.busy) return;
  if (this.mat.tick) this.mat.tick(this);
};
Cell.prototype.accepts = function (cell) {
  if (this.busy || cell.busy) return false;
  var accepts = this.mat.accepts(cell.mat);
  return accepts;
};
Cell.prototype.isStable = function () {
  return this.stable || this.mat.stable;
};

module.exports = Cell;