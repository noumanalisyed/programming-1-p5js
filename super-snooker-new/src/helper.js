function Helper() {
  this.drawVertices = (vertices) => {
    beginShape();
    for (let i = 0; i < vertices.length; i++) {
      vertex(vertices[i].x, vertices[i].y);
    }
    endShape(CLOSE);
  };

  this.setupMouseInteraction = () => {
    const mouse = Mouse.create(canvas.elt);
    const mouseParams = {
      mouse: mouse,
      constraint: { stiffness: 0.05 },
    };
    mouseConstraint = MouseConstraint.create(engine, mouseParams);
    mouseConstraint.mouse.pixelRatio = pixelDensity();
    mouseConstraint.collisionFilter.mask = 0x0001;
    World.add(engine.world, mouseConstraint);
  };
}