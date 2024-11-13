class Table {
  constructor() {
    this.cushions = [];
  }

  createCushions() {
    let cushionOptions = { isStatic: true, friction: 0.1, restitution: 0.9 };
    this.cushions.push(Bodies.rectangle(650, 50, 1200, 20, cushionOptions)); // Top
    this.cushions.push(Bodies.rectangle(650, 750, 1200, 20, cushionOptions)); // Bottom
    this.cushions.push(Bodies.rectangle(50, 400, 20, 700, cushionOptions)); // Left
    this.cushions.push(Bodies.rectangle(1250, 400, 20, 700, cushionOptions)); // Right
    World.add(world, this.cushions);
  }

  draw() {
    fill(0, 128, 0);
    rect(50, 50, 1200, 700);
    fill(255);
    this.cushions.forEach(cushion => {
      rectMode(CENTER);
      rect(cushion.position.x, cushion.position.y, cushion.bounds.max.x - cushion.bounds.min.x, cushion.bounds.max.y - cushion.bounds.min.y);
    });
  }
}
