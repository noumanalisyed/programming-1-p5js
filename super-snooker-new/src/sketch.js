let Engine = Matter.Engine;
const Render = Matter.Render;
let World = Matter.World;
let Bodies = Matter.Bodies;
let Body = Matter.Body;
let Constraint = Matter.Constraint;
let Mouse = Matter.Mouse;
let Collision = Matter.Collision;
var MouseConstraint = Matter.MouseConstraint;
let Sleeping = Matter.Sleeping;
let engine = Engine.create();
let gameStart = false;
let canvas;
let table = new Table();
let cue = new CueBall();
var ballManager = new BallManager();
var scoreBoard = new PointBoard();
var timer = new Timer();
var sp = new SuperPower();
var hp = new Helper();

// Define global variables for cue stick
let cueStick;
let cueStickLength = 200;
let cueStickThickness = 10;
let cueStickOffset = 50; // Distance from the cue ball
let maxPower = 50;
let power = 0;
let powerIncrement = 1;
let aiming = false; // Variable to track if the player is aiming


// Define the cue ball body (you should replace this with your actual cue ball body)
function setup() {
  canvas = createCanvas(1300, 800);
  angleMode(DEGREES);
  background(0);
  table.createCushions();
  hp.setupMouseInteraction();
  // Initialize Matter.js engine and world (if not already done)
  // Create the cue ball body
  cue.body = Bodies.circle(400, 200, 10, { restitution: 0.9 }); // Example: cue ball at (400, 200) with radius 10 and some bounciness
  World.add(engine.world, cue.body);

  // Initialize the cue stick
  cueStick = new CueStick();

  // Run the Matter.js engine
  World.add(engine.world, cueStick);
  // Run the Matter.js engine
  //Matter.Engine.run(engine);

}

function draw() {
  background(0);
  Engine.update(engine);
  //turn off y gravity so balls dont fall
  engine.gravity.y = 0;
  table.draw();
  push();
  textSize(36);
  fill("white");
  stroke(255);
  text("SUPER SNOOKER", 450, 50);
  pop();
  if (cue.body) {
    // Render and update the cue stick
    cueStick.update();
    cueStick.display();

    // Draw the cue ball (example visualization)
    fill(255);
    ellipse(cue.body.position.x, cue.body.position.y, 20, 20);
  } else {
    console.error("cue.body is not defined");
  }

  // Draw the cue ball (example visualization)
  fill(255);
  ellipse(cue.positionX, cue.positionY, 20, 20);

  timer.drawTimer();

  //if they haven't selected a mode, show text to ask them to
  if (!ballManager.mode) {
    push();
    textSize(24);
    fill("white");
    text(
        'Select Mode with key: "o" for ordered, "u" for unordered, "p" for partially ordered',
        200,
        600
    );
    pop();
  }
  //if they have draw the balls and check if the game has started
  else {
    textSize(14);
    text("mode: " + ballManager.mode, 25, 100);
    ballManager.drawBalls();
    scoreBoard.showScore();
    if (!gameStart) {
      textSize(24);
      stroke(255);
      text("Click anywhere on the D line to place the white ball", 200, 600);
    }
    //if the game has started
    else {
      //draw the time
      timer.startTimer();
      push();
      textSize(24);
      //draw the text telling the user
      //they can restart the game
      fill("white");
      text("press r to restart the game", 200, 600);
      pop();
      //draw the cue
      cue.draw();
      //draw the target to hit
      ballManager.showTarget();
      //if the cue is no longer constrained but still in the field
      if (cue.inField() && !cue.isConstrained) {
        //draw the foul text
        ballManager.drawFoul();
        //detect and collision for the table and the balls
        table.detectCollision(cue.ball);
        ballManager.detectCollision(cue.ball);
        //detect if any of the balls fall
        ballManager.detectFalling();
        //check possible win conditions
        ballManager.checkWin();
        //if the cueball is not moving
        if (cue.notMoving()) {
          //set up the constraint
          cue.setUpConstraint(cue.ball.position.x, cue.ball.position.y);
          //reset all the ball properties
          ballManager.newTurn();
          //deactivate any activated superpowers
          sp.deactivate();
        }
        //if the cue is not in field and its moving ie. not constrained
      } else if (!cue.isConstrained) {
        //decrease the score by 4 since its a foul
        scoreBoard.addScore(-4);
        //remove both the ball and the cue
        World.remove(engine.world, [cue.ball, cue.ballConstraint]);
        //gameStart false so the player can place the cueball anywhere in the D line
        gameStart = false;
      }
    }
  }
}

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
}

function mouseReleased() {
  //if the game hasn't started but a mode has been selected, the user can place a whiteball
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
