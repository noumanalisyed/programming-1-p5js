class CueBall {
  constructor(x, y, r) {
    this.body = Matter.Bodies.circle(x, y, r, { restitution: 1, friction: 0, frictionAir: 0 });
    this.r = r;
    Matter.World.add(world, this.body);
  }

  display() {
    const pos = this.body.position;
    const angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    fill(255);
    ellipse(0, 0, this.r * 2);
    pop();
  }

  notMoving() {
    const velocity = this.body.velocity;
    return Math.abs(velocity.x) < 0.1 && Math.abs(velocity.y) < 0.1;
  }

  inField() {
    const pos = this.body.position;
    return pos.x > 0 && pos.x < width && pos.y > 0 && pos.y < height;
  }
}
