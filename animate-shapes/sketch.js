let windowWidth = 400;
let windowHeight = 420;

let rainbowWidth = 60;
let x = 0;

function setup(){
    createCanvas(windowWidth, windowHeight);
    noStroke();
}

function draw(){
    background(255);
    createHorizontalRainbow();
    //createVerticalRainbow();
}

function createHorizontalRainbow(){
    x = 0;
    fill(255,0,0);
    rect(x,0,rainbowWidth,400);

    x = x + rainbowWidth;
    console.log("x : "+x);
    fill(255,165,0);
    rect(x,0,rainbowWidth,400);

    x = x + rainbowWidth;
    fill(255,255,0);
    rect(x,0,rainbowWidth,400);
    console.log("x : "+x);

    x = x + rainbowWidth;
    fill(0,255,0);
    rect(x,0,rainbowWidth,400);
    console.log("x : "+x);

    x = x + rainbowWidth;
    fill(0,0,255);
    rect(x,0,rainbowWidth,400);
    console.log("x : "+x);

    x = x + rainbowWidth;
    fill(75,0,130);
    rect(x,0,rainbowWidth,400);
    console.log("x : "+x);

    x = x + rainbowWidth;
    fill(148,0,211);
    rect(x,0,rainbowWidth,400);
    console.log("x : "+x);
}
function createVerticalRainbow(){
    fill(255,0,0);
    rect(0,0,400,60);

    fill(255,165,0);
    rect(0,60,400,60);

    fill(255,255,0);
    rect(0,120,400,60);

    fill(0,255,0);
    rect(0,180,400,60);

    fill(0,0,255);
    rect(0,240,400,60);

    fill(75,0,130);
    rect(0,300,400,60);

    fill(148,0,211);
    rect(0,360,400,60);
}