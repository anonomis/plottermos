var material = require("./Material.js");

function Cell(x, y, mat, chunk) {
  this.x = x;
  this.y = y;
  this.mat = mat || material[0];
  this.chunk = chunk;
  return this
}

Cell.prototype.tick = function () {
  if (this.busy) return;
  if (this.mat.tick) this.mat.tick(this);
};
Cell.prototype.swap = function (cell) {
  var newMat = cell.mat;
  cell.mat = this.mat;
  this.mat = newMat;
  cell.busy = true;
  this.busy = true;
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