let windowWidth = 300;
let windowHeight = 300;

function setup() {
    createCanvas(windowWidth, windowHeight);
    noFill();
    stroke(255);
    strokeWeight(8);
}

function draw() {
    background(32);

    circle(0, 0, 300);
    circle(300, 0, 300);
    circle(0, 300, 300);
    circle(300, 300, 300);

    circle(150, 0, 300);
    circle(150, 300, 300);
    circle(0, 150, 300);
    circle(300, 150, 300);

    circle(150, 150, 300);
    circle(150, 150, 150);
}