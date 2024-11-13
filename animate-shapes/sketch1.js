let windowWidth = 300;
let windowHeight = 300;

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    background(0,0,255);

    fill(0,64,255);
    rect(50,50,250,250);

    fill(0,128,255);
    rect(100,100,200,200);

    fill(0,192,255);
    rect(150,150,150,150);

    fill(0,255,255);
    rect(200,200,100,100);
}