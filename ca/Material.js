var materialDict = {
  _symbolIndex: {
    0: "vacuum",
    1: "gravel",
    2: "solid",
    7: "conveyor"
  },
  _dataTransform: function (symbol) {
    var mat = materialDict[materialDict._symbolIndex[symbol]];
    if (mat) {
      return materialDict[materialDict._symbolIndex[symbol]];
    } else {
      throw new Error("Unable to look up material with symbol" + symbol);
    }
  },
  vacuum: {
    name: "vacuum",
    canSwap: function (mat) {
      return mat.name !== "vaccum";
    }
  },
  gravel: {
    name: "gravel",
    canSwap: function (mat) {
      return false;
    },
    tick: function (cell) {
      if (cell.body) {
        var physPos = cell.body.position;
        var physCell = cell.chunk.at((physPos.x - 15) / 10, (physPos.y - 15) / 10)
        if (physCell !== cell) {
          cell.chunk.sw(cell, physCell);
          console.log(physPos);
        }
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
  solid: {
    name: "solid",
    draw: function (ctx, cell) {
      ctx.fillStyle = "#333";
      ctx.fillRect(cell.x * 10, cell.y * 10, 10, 10);
    },
    canSwap: function (mat) {
      return false;
    },
    stable: true
  },
  void: {
    name: "void",
    canSwap: function (mat) {
      return false;
    },
    stable: true
  },
  conveyor: {
    name: "conveyor",
    draw: function (ctx, cell) {
      if ((Math.ceil(ctx.time / 2) - cell.x) % 3 === 0) {
        ctx.fillStyle = "#333";
      } else {
        ctx.fillStyle = "#300";
      }
      ctx.fillRect(cell.x * 10, cell.y * 10, 10, 10);
    },
    canSwap: function (mat) {
      return false;
    },
    tick: function (cell) {
      var adj = cell.chunk.getAdjacent(cell.x, cell.y);
      if (!adj.up.isStable()) {
        cell.chunk.sw(adj.up, adj.ul);
      }
    },
    stable: false
  }
};

module.exports = materialDict;