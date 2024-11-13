function CueBall() {
  this.ball;
  this.ballConstraint;
  this.isConstrained = false;

  //creates the ball object
  this.setUpCueBall = (x, y) => {
    this.ball = Bodies.circle(x, y, 400 / 72, {
      friction: 0.7,
      restitution: 0.95,
    });
    Body.setMass(this.ball, this.ball.mass *= 2)
    World.add(engine.world, [this.ball]);
  };

  //creates the constraint
  this.setUpConstraint = (x, y) => {
    this.ballConstraint = Constraint.create({
      pointA: { x: x, y: y },
      bodyB: this.ball,
      stiffness: 0.01,
      damping: 0.0001,
    });
    this.isConstrained = true;
    document.getElementsByTagName("BODY")[0].style["pointer-events"] = "auto";
    World.add(engine.world, [this.ballConstraint]);
  };

  //removes the constraint when ball is released
  this.removeConstraint = (constraint) => {
    setTimeout(() => {
      Body.setVelocity(this.ball, {
        x: limitVelocity(this.ball.velocity.x),
        y: limitVelocity(this.ball.velocity.y),
      });
      constraint.bodyB = null;
      constraint.pointA = { x: 0, y: 0 };
      this.isConstrained = false;
      World.remove(engine.world, [constraint]);
    }, 100);
    document.getElementsByTagName("BODY")[0].style["pointer-events"] = "none";
  };

  //draws constraints
  const drawConstraint = (constraint) => {
    push();
    var offsetA = constraint.pointA;
    var posA = { x: 0, y: 0 };
    if (constraint.bodyA) {
      posA = constraint.bodyA.position;
    }
    var offsetB = constraint.pointB;
    var posB = { x: 0, y: 0 };
    if (constraint.bodyB) {
      posB = constraint.bodyB.position;
    }
    strokeWeight(3);
    stroke("#B99976");
    line(
        posA.x + offsetA.x,
        posA.y + offsetA.y,
        posB.x + offsetB.x,
        posB.y + offsetB.y
    );
    pop();
  };

  //function to help limit velocity of cue ball
  function limitVelocity(velocity) {
    return velocity > 0 ? min(velocity, 20) : max(velocity, -20);
  }

  //draws the cue ball
  this.draw = () => {
    push();
    fill("white");
    hp.drawVertices(this.ball.vertices);
    stroke(0);
    strokeWeight(3);
    drawConstraint(this.ballConstraint);
    pop();
  };

  //checks whether the cue ball is moving, returns boolean
  this.notMoving = () => {
    if (
        Math.abs(this.ball.velocity.x) <= 0.05 &&
        Math.abs(this.ball.velocity.y) < 0.05
    )
      return true;
  };

  //check whether the cue ball is in field, returns boolean
  this.inField = () => {
    return cue.ball.position.y >= 106 && cue.ball.position.y <= 494;
  };
}