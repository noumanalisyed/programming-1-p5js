class CueStick {
    constructor() {
        this.position = createVector(400, 200);
        this.length = 100;
        this.width = 5;
    }

    update() {
        // Update the cue stick's position and angle based on user input
        this.position = createVector(mouseX, mouseY);
    }

    display() {
        push();
        stroke(200, 100, 50);
        strokeWeight(this.width);
        line(this.position.x, this.position.y, this.position.x - this.length, this.position.y);
        pop();
    }
}
