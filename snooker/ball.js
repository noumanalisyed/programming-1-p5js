class Ball {
   /* constructor(x, y) {
        let options = { restitution: 0.9, friction: 0.005, frictionAir: 0.01 };
        this.body = Bodies.circle(x, y, 15, options);
        World.add(world, this.body);
    }*/

/*    show() {
        fill(255);
        push();
        translate(this.body.position.x, this.body.position.y);
        ellipse(0, 0, 30);
        pop();
    }*/
    constructor(x, y, isCueBall = false) {
        let options = { restitution: 0.9, friction: 0.005, frictionAir: 0.01 };
        this.body = Bodies.circle(x, y, 15, options);
        this.isCueBall = isCueBall;
        World.add(world, this.body);
    }

    show() {
        fill(this.isCueBall ? 255 : 255, 0, 0); // White for cue ball, red for others
        push();
        translate(this.body.position.x, this.body.position.y);
        ellipse(0, 0, 30);
        pop();
    }
    applyForce(force) {
        Body.applyForce(this.body, this.body.position, force);
    }
}