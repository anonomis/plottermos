var cellSwap = function (cellA, cellB) {
  if (cellB.accepts(cellA)) {
    cellB.swap(cellA);
    return true;
  }
  return false;
};

module.exports = {
  0: {
    name: "vaccum",
    accepts: function (mat) {
      return mat.name !== "vaccum";
    }
  },
  1: {
    name: "gravel",
    accepts: function (mat) {
      return false;
    },
    tick: function (cell) {
      var adj = cell.chunk.getAdjacent(cell.x, cell.y);
      cellSwap(cell, adj.do);
      if (adj.do.stable) {
        cellSwap(cell, adj.ll);
        cellSwap(cell, adj.lr);
      }
      if (adj.do.mat.stable || adj.do.stable) {
        cell.stable = true;
      }
    },
    draw: function (ctx, cell) {
      if (cell.stable) {
        ctx.fillStyle = "#aaa";
      } else {
        ctx.fillStyle = "#777";
      }
      ctx.fillRect(cell.x * 10, cell.y * 10, 10, 10);
    }
  },
  2: {
    name: "solid",
    draw: function (ctx, cell) {
      ctx.fillStyle = "#333";
      ctx.fillRect(cell.x * 10, cell.y * 10, 10, 10);
    },
    accepts: function (mat) {
      return false;
    },
    stable: true
  },
  3: "boulder",
  4: "liquid",
  5: "gas",
  6: {
    name: "void",
    accepts: function (mat) {
      return false;
    },
    stable: true
  },
  7: {
    name: "conveyor",
    draw: function (ctx, cell) {
      if ((Math.ceil(ctx.time / 2) - cell.x) % 3 === 0) {
        ctx.fillStyle = "#333";
      } else {
        ctx.fillStyle = "#300";
      }
      ctx.fillRect(cell.x * 10, cell.y * 10, 10, 10);
    },
    accepts: function (mat) {
      return false;
    },
    tick: function (cell) {
      var adj = cell.chunk.getAdjacent(cell.x, cell.y);
      if (!adj.up.isStable()) {
        cellSwap(adj.up, adj.ul);
      }
    },
    stable: false
  }
};
