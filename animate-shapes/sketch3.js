
let windowWidth = 400;
let windowHeight = 400;

function setup() {
    createCanvas(windowWidth, windowHeight);

    strokeWeight(32);
    strokeCap(SQUARE);
    noFill();
    noLoop();
}

function draw() {
    background(32);

    // Inner Most Circle with 2 arcs
    stroke(random(255),random(255),random(255));
    arc(200,200,64,64,0,PI);
    stroke(random(255),random(255),random(255));
    arc(200,200,64,64,PI,0);

    // Inner Circle at 2nd level with 3 arcs
    stroke(random(255),random(255),random(255));
    arc(200,200,160,160,PI/6,PI*5/6);

    stroke(random(255),random(255),random(255));
    arc(200,200,160,160,PI*5/6,PI*3/2);

    stroke(random(255),random(255),random(255));
    arc(200,200,160,160,PI*3/2,PI/6);

}