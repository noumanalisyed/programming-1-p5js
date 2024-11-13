let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Events = Matter.Events;

let engine;
let world;
let balls = [];
let table;
let cueStatus =[true,false,false,false,false,
                    false,false,false,false,false,
                    false,false,false,false,false];
function setup() {
    createCanvas(800, 400);

    // Initialize Matter.js engine and world
    engine = Engine.create();
    world = engine.world;

    // Create snooker table boundaries
    table = new Table();
    // Create balls
    balls.push(new Ball(width / 2, height / 2, cueStatus[1])); // Cue ball
    for (let i = 1; i < 16; i++) {
        let x = width / 2 + (i % 4) * 30;
        let y = height / 2 + floor(i / 4) * 30;
        balls.push(new Ball(x, y,cueStatus[i]));
    }

    // Run the engine
    Engine.run(engine);
}

function draw() {
    background(0, 128, 0);

    // Render the table
    table.show();

    // Render the balls
    for (let ball of balls) {
        ball.show();
    }
}
function mousePressed() {
    let cueBall = balls[0];
    let force = p5.Vector.sub(createVector(cueBall.body.position.x, cueBall.body.position.y), createVector(mouseX, mouseY));
    force.mult(0.0005);
    cueBall.applyForce(force);
}