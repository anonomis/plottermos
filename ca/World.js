function World(w, h) {
  this.w = 3;
  this.h = 3;
  this.chunks = [];

  this.eng = Matter.Engine.create(document.getElementById("physx"));
  Matter.Engine.run(this.eng);
  this.eng.timing.timeScale = 0.1;
  var renderOptions = this.eng.render.options;
  renderOptions.wireframes = true;
  renderOptions.wireframeBackground = "black"
}

World.prototype.makeChunk = function (x,y) {
};