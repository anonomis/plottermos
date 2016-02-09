var bodyMakers = {
  fallingCircle: function (cell) {
    var vec = cell.chunk.toEng(cell, 5);
    return Matter.Bodies.circle(vec.x, vec.y, 4.5, {
      isStatic: false,
      friction: 0.4,
      chamfer: {
        radius: 3
      },
      render: {
        strokeStyle: 'red',
        lineWidth: 1
      }
    })
  },
  fallingSquare: function (cell) {
    var vec = cell.chunk.toEng(cell, 5);
    var width = 9;
    return Matter.Bodies.rectangle(vec.x - width, vec.y + width, width, width, {
      isStatic: false,
      friction: 0.4,
      chamfer: {
        radius: 3
      }
    })
  },
  solidSquare: function (cell) {
    var vec = cell.chunk.toEng(cell, 5);
    return Matter.Bodies.rectangle(vec.x, vec.y, 10, 10, {
      isStatic: true,
      friction: 0.4,
      chamfer: {
        radius: 3
      }
    });
  },
  sharpSolidSquare: function (cell) {
    var vec = cell.chunk.toEng(cell, 5);
    return Matter.Bodies.rectangle(vec.x, vec.y, 10, 10, {
      isStatic: true,
      friction: 0.4
    });
  }
};

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
    },
    makeBody: function (cell) {
      return null;
    }
  },
  gravel: {
    name: "gravel",
    canSwap: function (mat) {
      return false;
    },
    tick: function (cell, adj) {
      if (cell.body) {
        var physPos = cell.body.position;
        var physCell = cell.chunk.at((physPos.x - 15) / 10, (physPos.y - 15) / 10);

        if (physCell !== cell) {
          var swapSucessfull = cell.chunk.sw(cell, physCell);
          if (swapSucessfull) return;
          var materialBellow = adj.do.mat;
          if (!cell.chunk.sw(cell, physCell) && materialBellow.eq(materialDict.vacuum)) {
            //console.log(cell);
            //Matter.Body.setVelocity(cell.body, {
            //  x: -cell.body.velocity.x,
            //  y: cell.body.velocity.y
            //});
            //Matter.Body.setInertia(cell.body, cell.body.inverseInertia);
            Matter.Body.setPosition(cell.body, cell.chunk.toEng(cell))
          }
        }
      }
    },
    draw: function (ctx, cell) {
      if (cell) {
        ctx.fillStyle = "#aaa";
      } else {
        ctx.fillStyle = "#777";
      }
      ctx.fillRect(cell.x * 10, cell.y * 10, 10, 10);
    },
    makeBody: bodyMakers.fallingCircle
  },
  solid: {
    name: "solid",
    draw: function (ctx, cell) {
      ctx.fillStyle = "#333";
      ctx.fillRect(cell.x * 10, cell.y * 10, 10, 10);
    },
    tick: function (cell) {
      if (cell.body) {
        var physPos = cell.body.position;
        var physCell = cell.chunk.at((physPos.x - 15) / 10, (physPos.y - 15) / 10)
        if (physCell !== cell) {
          cell.chunk.sw(cell, physCell);
        }
      }
    },
    canSwap: function (mat) {
      return false;
    },
    stable: true,
    makeBody: bodyMakers.fallingSquare
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
      if ((Math.ceil(ctx.time / 2) - cell.x) % 3 !== 0) {
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
      if (adj.up.body && adj.up.body.motion === 0) {
        Matter.Body.setVelocity(adj.up.body, {
          x: -0.5,
          y: 1
        });
      }
    },
    stable: false,
    makeBody: bodyMakers.sharpSolidSquare
  }
};

_.forEach(materialDict, function (v, k) {
  materialDict[k].eq = function (a) {
    return k === a.name;
  }
});


module.exports = materialDict;