let Engine = Matter.Engine;
const Render = Matter.Render;
let World = Matter.World;
let Bodies = Matter.Bodies;
let Body = Matter.Body;
let placingCueBall = true; // Initial state to place the cue ball
let forceMultiplier = 0.01; // Adjust the force multiplier as needed
let cue;

let Constraint = Matter.Constraint;
let Mouse = Matter.Mouse;
let Collision = Matter.Collision;
var MouseConstraint = Matter.MouseConstraint;
let Sleeping = Matter.Sleeping;
let engine;
let world = Engine.world;
let gameStart = false;
let canvas;
let table = new Table();
var ballManager = new BallManager();
var scoreBoard = new PointBoard();
var timer = new Timer();
var sp = new SuperPower();
var hp = new Helper();

let cueStick;
// Define global variables for cue stick
let cueStickLength = 200;
let cueStickThickness = 10;
let cueStickOffset = 50; // Distance from the cue ball
let maxPower = 50;
let power = 0;
let powerIncrement = 1;
let aiming = false; // Variable to track if the player is aiming


// Define the cue ball body (you should replace this with your actual cue ball body)
function setup() {
  console.log('Setup started');
  canvas = createCanvas(1300, 800);
  angleMode(DEGREES);
  background(0);

  // Initialize Matter.js engine and world
  engine = Matter.Engine.create();
  world = engine.world;

  // Setting gravity (make sure engine.world is properly accessed)
  world.gravity.y = 0; // Example, adjust as necessary

  cue = new CueBall(400, 200, 10);
  cueStick = new CueStick();

  // Assuming table.createCushions() is a valid function
  Matter.World.add(world, cue.body);

  console.log('Setup completed');

  // Assuming table.createCushions() is a valid function
  table.createCushions();
  Matter.World.add(world, cue.body);
  Matter.World.add(world, cueStick);

  console.log('Setup completed');
}

function draw() {
  background(0);
  Matter.Engine.update(engine);

  // Assuming table.draw() is a valid function
  table.draw();
  push();
  textSize(36);
  fill("white");
  stroke(255);
  text("SUPER SNOOKER", 450, 50);
  Matter.Engine.update(engine);
  pop();

  if (cue.body) {
    cue.display();
  } else {
    console.error("cue.body is not defined");
  }

  if (cueStick) {
    cueStick.update();
    cueStick.display();
  } else {
    console.error("cueStick is not defined");
  }

  // Assuming timer.drawTimer() is a valid function
  timer.drawTimer();
  Matter.Engine.update(engine);

  // Assuming ballManager is a valid object with necessary functions
  ballManager.detectFalling();
  ballManager.drawBalls();
  ballManager.checkWin();
  ballManager.showTarget();

  // Assuming scoreBoard.showScore() is a valid function
  scoreBoard.showScore();

  if (placingCueBall) {
    // Logic to place the cue ball in the D area
    if (mouseIsPressed) {
      cue.body.position.x = mouseX;
      cue.body.position.y = mouseY;
      if (keyIsPressed && key === ' ') {
        placingCueBall = false; // Finished placing the cue ball
      }
    }
  } else if (cue.notMoving() && !aiming && cue.inField()) {
    cueStick.update();
    cueStick.display();
  }

  if (!ballManager.mode) {
    push();
    textSize(24);
    fill("white");
    text("Please select a mode", 600, 400);
    pop();
  }
}
function mousePressed() {
  if (placingCueBall) {
    // Allow placing the cue ball only in the D area
    const isInDArea = true; // Replace with actual D area check
    if (isInDArea) {
      cue.body.position.x = mouseX;
      cue.body.position.y = mouseY;
    }
  } else {
    // Logic for aiming and shooting the cue stick
    aiming = true;
  }
}

function mouseReleased() {
  if (!placingCueBall && aiming) {
    // Logic for shooting the cue ball
    const force = createVector(mouseX - cue.body.position.x, mouseY - cue.body.position.y);
    const scaledForce = force.mult(forceMultiplier); // Scale down the force
    Matter.Body.applyForce(cue.body, cue.body.position, { x: scaledForce.x, y: scaledForce.y });
    aiming = false;
  }
}

/*
function mousePressed() {
  if (placingCueBall) {
    // Allow placing the cue ball only in the D area
    // Placeholder logic for checking D area
    const isInDArea = true; // Replace with actual D area check
    if (isInDArea) {
      cue.body.position.x = mouseX;
      cue.body.position.y = mouseY;
    }
  } else {
    // Logic for aiming and shooting the cue stick
    aiming = true;
  }
}

function mouseReleased() {
  if (!placingCueBall && aiming) {
    // Logic for shooting the cue ball
    // Placeholder logic for shooting
    const force = createVector(mouseX - cue.body.position.x, mouseY - cue.body.position.y);
    Matter.Body.applyForce(cue.body, cue.body.position, force);
    aiming = false;
    if (!gameStart && ballManager.mode) {
      //defines the Dline area that the cue can be placed
      if (dist(mouseX, mouseY, 350, 175 + 370 / 3) < 75 && mouseX < 350) {
        //starts the game
        gameStart = true;
        //draws the cue and the constraint based on the mouse position
        cue.setUpCueBall(mouseX, mouseY);
        cue.setUpConstraint(mouseX, mouseY);
        ballManager.setBallsSleep(true);
        sp.placeButtons();
      }
    } else if (gameStart) {
      //if the game has started and the mode has been selected then remove the constraint
      cue.removeConstraint(cue.ballConstraint);
      //make the balls awake so they can move around
      ballManager.setBallsSleep(false);
    }
  }

}
*/

function keyTyped() {
  //if the game hasn't started yet then the player can change the mode
  if (!gameStart && !ballManager.mode) {
    //used to lowercase to allow both upper and lower case
    if (key.toLowerCase() === "u") {
      ballManager.setMode("unordered");
    }
    if (key.toLowerCase() === "p") {
      ballManager.setMode("partial");
    }
    if (key.toLowerCase() === "o") {
      ballManager.setMode("ordered");
    }
  }
  //at any time the user can press r to restart the game by
  //reloading the window
  if (key.toLowerCase() === "r") {
    window.location.reload();
  }
  console.log('Key pressed: ', keyCode);
  if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
    aiming = true;
  }
  if (keyCode === ENTER && aiming) {
    cueStick.shooting = true;
  }
}



// ----------------------------------------COMMENTARY ----------------------------------------------------

//I designed this snooker app with the idea of emulating the aesthetic of the image given in the coursework instructions.
//I created the table with p5js using their rect and ellipse functions, while making the cushions, and the balls with matter.js
//using their Bodies function. The cue is not a physical cue as seen in snooker, but instead follows a more slingshot style of release,
//this was just another way for me to add uniqueness to my app, however using matter.js, I was able to create collision events only when,
//the cue ball was released. Furthermore, I also found it more intuitive to have a purely mouse based cue, this means that the placement,
// loading, and releasing of the cue is based on the state of the mouse. Functionally, this works by creating a constraint in the middle
//of the cue ball, and removing that constraint when the mouse is released, once the cue ball is no longer moving, create a new constraint
//at the new position of the cue ball.

//For the game mechanics, I used an object-oriented style of programming with constructor functions for the table,
//ball, my extension, etc. For the pockets, I detected falling simply by tracking the y position of each ball, as the cushions would
// stop them from leaving the table at certain heights, and the only way to breach that threshold would be through the p5.js generated
// pockets that don't collide with the matter.js bodies. In my ballManager object I tracked things such as fouls, the target ball,
// as well as all the logic for when a ball collides or falls. I also included a function for the cushion where it lights up when making
// contact with the cue ball.

//For my extensions I implemented three things, starting from the least original I implemented a scoreboard, with both scoring additions
// from the balls being pocketed, but also deductions from foul shots, as well as preventing points from being added if a foul occurred.
// Next, I added a timer that counts down from 10 minutes. If either the timer runs out, or the player clears the table, they can press
// ‘r’ to restart. Finally, I also included “superpowers”. This is under its own object with functions that activate, deactivate,
//and assign their usage through the creation of a button with the p5.js DOM. Some of these powers include, increasing the power of the
// cue by multiplying its mass, making the balls smaller, doubling the points of each ball, and randomly aligning balls to the front of
// each pocket. These powers were my way of giving an arcade feel to an otherwise very professional and technical game. I believe this
//to be unique and “has not been seen in snooker gaming before”, as it is a manipulation of the game’s physics and rules in a way unable
// to be done in real life, and not appropriate for snooker applications which are usually attempting to
//recreate the reality of the game.
