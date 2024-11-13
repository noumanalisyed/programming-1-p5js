class CueStick {
    constructor() {
        this.angle = 0;
        this.shooting = false;
        this.shootForce = 0;
        this.maxShootForce = 20;
        this.power = 0;
    }

    update() {
        if (aiming && cue.body) {
            // Calculate the angle between the cue ball and the mouse
            let cueBall = cue.body.position; // Get the actual cue ball position from Matter.js body
            this.angle = atan2(mouseY - cueBall.y, mouseX - cueBall.x);

            // Check for power adjustment action
            if (keyIsDown(UP_ARROW)) {
                this.power = constrain(this.power + powerIncrement, 0, maxPower);
            } else if (keyIsDown(DOWN_ARROW)) {
                this.power = constrain(this.power - powerIncrement, 0, maxPower);
            }
        }

        if (this.shooting) {
            this.shooting = false;
            // Apply the shooting force to the cue ball
            let force = p5.Vector.fromAngle(this.angle).mult(this.power);
            console.log("Applying force:", force);
            Body.applyForce(cue.body, { x: cue.body.position.x, y: cue.body.position.y }, { x: force.x, y: force.y });
            this.power = 0;
            aiming = false; // Stop aiming after shooting
        }
    }

    display() {
        if (aiming && cue.body) {
            let cueBall = cue.body.position; // Get the actual cue ball position from Matter.js body
            let offset = cueStickOffset + (this.power / maxPower) * 50;

            push();
            translate(cueBall.x, cueBall.y);
            rotate(this.angle);
            rectMode(CENTER);
            stroke(255);
            fill(150);
            rect(cueStickLength / 2 + offset, 0, cueStickLength, cueStickThickness);
            pop();
        }
    }
}

function keyPressed() {
    // Start aiming mode when the arrow keys are pressed
    if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
        aiming = true;
    }

    // Trigger shooting when ENTER is pressed
    if (keyCode === ENTER && aiming) {
        cueStick.shooting = true;
    }
}