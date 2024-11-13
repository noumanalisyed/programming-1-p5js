/*
App Design Explanation

This snooker simulation application is designed to provide an interactive and realistic experience of playing snooker. 
The design choices, particularly the use of mouse-based controls, aim to make the game intuitive and enjoyable. Below is a 
detailed explanation of the design and the unique extensions implemented.

1. **Mouse-Based Cue Function**:
   - **Design Choice**: The cue function is mouse-based to leverage the natural and intuitive nature of mouse interactions. 
   By dragging and releasing the mouse, players can easily control the direction and power of their shots, similar to real-life cue sports.
   - **How It Works**: 
     - **Aiming**: The player can adjust the cue's angle using the left and right arrow keys. This simulates the physical motion of aiming in snooker.
     - **Power Control**: The lever on the screen represents the cue's power. Players can drag the lever with the mouse to set the desired power. 
     This dragging motion mimics the backward motion of pulling the cue stick in real snooker.
     - **Shooting**: Upon releasing the mouse button, the cue ball is struck with the set power and direction, calculated using the angle and force vectors.

2. **Collision Detection**:
   - **Design Choice**: Matter.js, a 2D physics engine, is used for accurate collision detection and response. This ensures that the interactions between balls, 
   pockets, and table cushions are realistic.
   - **Implementation**: The physics engine handles the collisions and updates the positions of the balls in each frame, creating a seamless and natural movement.

3. **Arrangement of Balls**:
   - **Initial Setup**: The balls are initially arranged in their traditional snooker positions. The red balls form a pyramid, 
   and the colored balls are placed at predefined spots.
   - **Random Arrangement**: To enhance the gameplay experience, a function allows random arrangement of red balls on the table. This feature adds variety and 
   challenges, making each game unique.

5. **User Interface and Experience**:
   - **Visuals**: The table, balls, and cues are rendered using p5.js, providing a visually appealing and smooth graphical experience.
   - **Interaction**: The combination of keyboard and mouse controls ensures that the game is accessible and easy to play, catering to both casual and serious players.

In conclusion, the app's design focuses on realism, interactivity, and variety. The mouse-based cue function provides an intuitive way to control the game, 
while the extensions such as random ball arrangement and reset functionality introduce unique and engaging elements to the traditional snooker experience. 
These design choices aim to offer a comprehensive and enjoyable snooker simulation for players of all levels.

*/

//matter js global variables
let GameEngine = Matter.Engine,
  GameWorld = Matter.World,
  GameBodies = Matter.Bodies,
  GameBody = Matter.Body,
  GameEvents = Matter.Events;

//game global variables
let trayX, trayY;
let cueBallInTray = true;
let cueBallDragging = false;

const totalRedBalls = 15;
const totalColourBalls = 6;
const canvasWidth = 800;
const canvasHeight = 400;
const tableLength = 800;
const tableWidth = 400;
let offsetX = (canvasWidth - tableLength) / 2;
let offsetY = (canvasHeight - tableWidth) / 2;
let cueBallStartPosition = { x: offsetX + 150, y: offsetY + 230 };
const cusionColor = "#491C01";

const cusionThickness = 10;
const ballRadius = tableWidth / 36 / 2;
const pocketRadius = ballRadius * 1.5;
const tableCenterY = tableWidth / 2;
const dRadius = tableWidth / 6.2;
//we define an array of objects to hold the colour balls info
const colourBalls = [
  {
    color: "yellow",
    value: 2,
    startingPos: { x: offsetX + 160, y: offsetY + tableCenterY + dRadius },
  },
  {
    color: "lightgreen",
    value: 3,
    startingPos: { x: offsetX + 160, y: offsetY + tableCenterY - dRadius },
  },
  {
    color: "brown",
    value: 4,
    startingPos: { x: offsetX + 160, y: offsetY + 200 },
  },
  {
    color: "blue",
    value: 5,
    startingPos: { x: offsetX + 400, y: offsetY + 200 },
  },
  {
    color: "pink",
    value: 6,
    startingPos: { x: offsetX + 560, y: offsetY + 200 },
  },
  {
    color: "black",
    value: 7,
    startingPos: { x: offsetX + 730, y: offsetY + 200 },
  },
];
const colourBallsMap = new Map(
  colourBalls.map((ball) => [
    ball.color,
    { value: ball.value, startingPos: ball.startingPos },
  ])
);
let engine, world;
let balls = [];
let table;
let cue;
let cnv;
let cueBall;
let pockets = [];
let cueAngle = 0;
let cuePower = 0;
let cueLength = 200;
let maxCuePower = 0.012;
let lever;
let leverPos = { x: 20, y: 300 };
let leverHeight = 100;
let lastBallInPocket = null;

function setup() {
  cnv = createCanvas(canvasWidth, canvasHeight);
  offsetX = (cnv.width - tableLength) / 2;
  offsetY = (cnv.height - tableWidth) / 2;
  cnv.position((windowWidth - width) / 2, (windowHeight - height) / 2);
  console.log(cnv);

  textSize(22);
  textAlign(CENTER, CENTER);

  // Initialize Matter.js
  engine = GameEngine.create();
  world = engine.world;
  engine.world.gravity.y = 0;

  // Create the table and balls
  createTable();
  createPockets();

  arrangeBalls();

  lever = new Lever(leverPos.x, leverPos.y, leverHeight);

  createCueBallInTray();
  document
    .getElementById("place-button")
    .addEventListener("click", placeCueBall);

  GameEvents.on(engine, "collisionStart", handleCollision);
}

function draw() {
  GameEngine.update(engine);

  drawTable();
  drawPockets();

  for (let ball of balls) {
    noStroke();
    ball.draw();
  }

  if (!cueBallInTray) {
    drawCue();
  }
  fill(0);
  // text("cueAngle: " + cueAngle, 100, 100);
  // text("cuePower: " + cuePower, 100, 150);
  lever.draw();
  updateCuePower();
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    cueAngle -= 0.1;
  } else if (keyCode === RIGHT_ARROW) {
    cueAngle += 0.1;
  } else if (key === "1") {
    resetTable();
  } else if (key === "2") {
    arrangeBallsRandomPosRedsOnly();
  } else if (key === "3") {
    arrangeBallsRandomPos();
  }
}

function mousePressed() {
  if (keyIsDown(CONTROL)) {
    // Checking if the cue ball is clicked
    if (
      dist(mouseX, mouseY, cueBall.body.position.x, cueBall.body.position.y) <
      cueBall.radius
    ) {
      cueBallDragging = true;
    }
  }
  lever.startDrag(mouseX, mouseY);
}

function mouseDragged() {
  if (cueBallDragging) {
    // Drag the cue ball within the table boundaries
    let newX = constrain(
      mouseX,
      50 + cueBall.radius,
      tableLength - 50 - cueBall.radius
    );
    let newY = constrain(
      mouseY,
      50 + cueBall.radius,
      tableWidth - 50 - cueBall.radius
    );
    GameBody.setPosition(cueBall.body, { x: newX, y: newY });
    GameBody.setStatic(cueBall.body, true);
    cueBall.body.position.x = constrain(
      mouseX,
      50 + cueBall.radius,
      tableLength - 50 - cueBall.radius
    );
    cueBall.body.position.y = constrain(
      mouseY,
      50 + cueBall.radius,
      tableWidth - 50 - cueBall.radius
    );
  } else {
    // Existing lever dragging logic
    lever.drag(mouseX, mouseY);
  }
}

function mouseReleased() {
  if (cueBallDragging) {
    cueBallDragging = false;
    GameBody.setStatic(cueBall.body, false);
  } else {
    if (cueBallInTray) return;
    stopBody(cueBall.body);
    if (cueBall.body.speed > 0.1) return;
    //setting a maxforce to prevent the ball from going out of the table
    let maxForce = 0.005;
    if (mouseButton === LEFT) {
      let force = p5.Vector.fromAngle(cueAngle).mult(cuePower / 2);

      let forceMagnitude = force.mag();
      console.log(forceMagnitude);

      if (forceMagnitude > maxForce) {
        force = force.normalize().mult(maxForce);
      }

      GameBody.applyForce(cueBall.body, cueBall.body.position, {
        x: force.x,
        y: force.y,
      });
      cuePower = 0;
      lever.reset();
    }
  }
}
//create the cue ball tray
function createCueBallInTray() {
  if (cueBallInTray) {
    // Recreate or reposition the cue ball visually in the tray
    let cueBallDiv = document.getElementById("cue-ball");
    cueBallDiv.style.display = "block"; // Make sure the cue ball is visible
    cueBallDiv.style.left = "35px"; // Centered in the tray
    cueBallDiv.style.top = "35px"; // Centered in the tray
  }
}
//places the cue ball inside the table
function placeCueBall() {
  if (cueBallInTray) {
    document.getElementById("cue-ball").style.display = "none";

    cueBall = new Ball(
      world,
      cueBallStartPosition.x,
      cueBallStartPosition.y,
      ballRadius,
      "white",
      0
    );
    cueBall.setFixedPos(offsetX + 150, offsetY + 230);
    cueBall.body.frictionAir = 0.005;
    balls.push(cueBall);
    cueBallInTray = false;
  }
}
//defines necessary parameters for the table
function createTable() {
  let tableOptions = { isStatic: true, restitution: 0.9 };
  table = [
    GameBodies.rectangle(
      offsetX + tableLength / 2,
      offsetY + cusionThickness / 2,
      tableLength,
      cusionThickness,
      tableOptions
    ), // top
    GameBodies.rectangle(
      offsetX + tableLength / 2,
      offsetY + tableWidth - cusionThickness / 2,
      tableLength,
      cusionThickness,
      tableOptions
    ), // bottom
    GameBodies.rectangle(
      offsetX + cusionThickness / 2,
      offsetY + tableWidth / 2,
      cusionThickness,
      tableWidth,
      tableOptions
    ), // left
    GameBodies.rectangle(
      offsetX + tableLength - cusionThickness / 2,
      offsetY + tableWidth / 2,
      cusionThickness,
      tableWidth,
      tableOptions
    ), // right
  ];
  GameWorld.add(world, table);
}
//draws the table with cusions
function drawTable() {
  fill("green"); // Green color
  rect(
    offsetX + tableLength / 2,
    offsetY + tableWidth / 2,
    tableLength,
    tableWidth
  );

  stroke(255); // White color for the lines
  strokeWeight(2);
  const bulkLineDistance = tableLength / 5;
  line(
    offsetX + bulkLineDistance,
    offsetY + cusionThickness / 2,
    offsetX + bulkLineDistance,
    offsetY + tableWidth - cusionThickness / 2
  );

  noFill();

  arc(
    offsetX + bulkLineDistance,
    offsetY + tableCenterY,
    dRadius * 2,
    dRadius * 2,
    HALF_PI,
    -HALF_PI
  );

  fill(cusionColor);
  for (let part of table) {
    rectMode(CENTER);
    stroke(0);
    strokeWeight(0);
    rect(
      part.position.x,
      part.position.y,
      part.bounds.max.x - part.bounds.min.x,
      part.bounds.max.y - part.bounds.min.y
    );
  }
}
// creates the pockets
function createPockets() {
  let pocketPositions = [
    { x: offsetX + cusionThickness, y: offsetY + cusionThickness },
    { x: offsetX + tableLength / 2, y: offsetY + cusionThickness },
    {
      x: offsetX + tableLength - cusionThickness,
      y: offsetY + cusionThickness,
    },
    { x: offsetX + cusionThickness, y: offsetY + tableWidth - cusionThickness },
    { x: offsetX + tableLength / 2, y: offsetY + tableWidth - cusionThickness },
    {
      x: offsetX + tableLength - cusionThickness,
      y: offsetY + tableWidth - cusionThickness,
    },
  ];

  for (let pos of pocketPositions) {
    let pocket = GameBodies.circle(pos.x, pos.y, pocketRadius, {
      isStatic: true,
      render: { fillStyle: "black" },
    });
    pockets.push(pocket);
    GameWorld.add(world, pocket);
  }
}
//this function is responsible to draw the pockets
function drawPockets() {
  fill("black");
  stroke("yellow");
  strokeWeight(1);
  for (let pocket of pockets) {
    ellipse(pocket.position.x, pocket.position.y, pocketRadius * 2);
  }
}
//keystroke 1 function
function arrangeBalls() {
  balls = [];
  let rows = 5;
  let startX = colourBallsMap.get("pink").startingPos.x + 58;
  let startY = colourBallsMap.get("pink").startingPos.y - 22;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col <= row; col++) {
      let x = startX + col * (ballRadius * 2);
      let y = startY + (row - col / 2) * (ballRadius * 2);
      let rotatedX = 2 * startX - x;
      let color = "red";
      let ball = new Ball(world, rotatedX, y, ballRadius, color, 1);
      balls.push(ball);
    }
  }

  for (let colBol of colourBalls) {
    let ball = new Ball(
      world,
      colBol.startingPos.x,
      colBol.startingPos.y,
      ballRadius,
      colBol.color,
      colBol.value
    );
    ball.setFixedPos(colBol.startingPos.x, colBol.startingPos.y);
    balls.push(ball);
  }
}
//This function resets the whole table
function resetTable() {
  // Clear the existing balls from the world
  balls.forEach((ball) => {
    GameWorld.remove(world, ball.body);
  });

  balls = []; // Clear the balls array

  // Recreate the balls in their initial positions
  let rows = 5;
  let startX = colourBallsMap.get("pink").startingPos.x + 58;
  let startY = colourBallsMap.get("pink").startingPos.y - 22;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col <= row; col++) {
      let x = startX + col * (ballRadius * 2);
      let y = startY + (row - col / 2) * (ballRadius * 2);
      let rotatedX = 2 * startX - x;
      let color = "red";
      let ball = new Ball(world, rotatedX, y, ballRadius, color, 1);
      balls.push(ball);
    }
  }

  for (let colBol of colourBalls) {
    let ball = new Ball(
      world,
      colBol.startingPos.x,
      colBol.startingPos.y,
      ballRadius,
      colBol.color,
      colBol.value
    );
    balls.push(ball);
  }
}
//KeyStroke 2 action

function arrangeBallsRandomPosRedsOnly() {
  let redBalls = balls.filter((ball) => ball.value == 1);
  redBalls.forEach((ball) => {
    let randomX = randomIntGenerator(
      pocketRadius * 2,
      tableLength - cusionThickness
    );
    let randomY = randomIntGenerator(
      pocketRadius * 2,
      tableWidth - cusionThickness
    );
    GameBody.setPosition(ball.body, { x: randomX, y: randomY });
  });
}
//KeyStroke 1 action
function arrangeBallsRandomPos() {
  let redBalls = balls.filter((ball) => ball.value >= 1);
  redBalls.forEach((ball) => {
    let randomX = randomIntGenerator(
      pocketRadius * 2,
      tableLength - cusionThickness
    );
    let randomY = randomIntGenerator(
      pocketRadius * 2,
      tableWidth - cusionThickness
    );
    GameBody.setPosition(ball.body, { x: randomX, y: randomY });
  });
}
//increase/decrease cue power
function updateCuePower() {
  cuePower = lever.getPower();
}
//this function handles the drawing of the cue stick
function drawCue() {
  if (cueBall.body.speed < 0.1) {
    push();
    translate(cueBall.body.position.x, cueBall.body.position.y);
    rotate(cueAngle + PI); // Rotate the cue by 180 degrees
    stroke("grey");
    strokeWeight(4);
    line(10, 0, cueLength, 0);
    pop();
  }
}
//this function handles the collision between pockets and balls

function handleCollision(event) {
  let pairs = event.pairs;
  for (let pair of pairs) {
    let { bodyA, bodyB } = pair;
    if (isPocket(bodyA) && isBall(bodyB)) {
      handlePocketCollision(bodyB);
    } else if (isPocket(bodyB) && isBall(bodyA)) {
      handlePocketCollision(bodyA);
    }
  }
}

function isPocket(body) {
  return pockets.includes(body);
}

function isBall(body) {
  return balls.some((ball) => ball.body === body);
}
//this function handles the collision between pockets and balls
function handlePocketCollision(ballBody) {
  const isColoredBall = ballBody.value > 1;

  if (isColoredBall && lastBallInPocket === "colored") {
    promptUser(
      "Two consecutive colored balls fell into the pocket. This is a mistake."
    );
  }
  if (ballBody.value == 0) {
    console.log("cue ball");
    lastBallInPocket = "cue";
    cueBall.resetToFixedPos();
    cueBallInTray = true;
    createCueBallInTray();
    //delete the cue ball
    balls = balls.filter((ball) => ball.body !== ballBody);
    GameWorld.remove(world, ballBody);
  } else if (ballBody.value == 1) {
    console.log("red ball");
    lastBallInPocket = "red";
    balls = balls.filter((ball) => ball.body !== ballBody);
    GameWorld.remove(world, ballBody);
    promptUser("Cue-Red");
  } else if (ballBody.value > 1) {
    console.log("coloured ball");
    promptUser("Cue-Colour");
    lastBallInPocket = "colour";
    let pottedBall = balls.find((ball) => ball.body === ballBody);
    pottedBall.resetToFixedPos();
  }
}
//this function is used to show various prompts to the user/
function promptUser(msg) {
  let div = createDiv(msg);
  div.style("background-color", "red");
  div.style("color", "white");
  div.style("padding", "10px");
  div.style("border-radius", "5px");
  div.style("position", "absolute");

  div.position(200, 200);
  setTimeout(() => div.remove(), 2000);
}

//the ball class has all the necessary properties to create a ball with matter js body
class Ball {
  _restitution = 1;
  _friction = 0.03;
  _frictionAir = 0.003;
  _frictionStatic = 0.35;
  _fixedPos = { x: 0, y: 0 };
  constructor(world, x, y, radius, color, value) {
    this.world = world;
    this.radius = radius;
    this.color = color;
    this.value = value;
    this.options = {
      restitution: this._restitution,
      friction: this._friction,
      frictionAir: this._frictionAir,
      frictionStatic: this._frictionStatic,
    };
    this.body = GameBodies.circle(x, y, radius, this.options);
    this.body.value = value;
    GameWorld.add(this.world, this.body);
  }

  resetToFixedPos() {
    GameBody.setPosition(this.body, this._fixedPos);
    GameBody.setVelocity(this.body, { x: 0, y: 0 });
    GameBody.setAngularVelocity(this.body, 0);

    this.body.force.x = 0;
    this.body.force.y = 0;

    this.body.torque = 0;
  }

  setFixedPos(x, y) {
    this._fixedPos = { x: x, y: y };
  }

  draw() {
    fill(this.color);
    ellipse(this.body.position.x, this.body.position.y, this.radius * 2);
  }

  get position() {
    return this.body.position;
  }
}
//Lever class to create instance of a lever
class Lever {
  constructor(x, y, height) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.initialHandleY = y;
    this.handleY = y;
    this.dragging = false;
  }

  draw() {
    if (cueBallInTray) return;
    if (cueBall && cueBall.body.speed > 0.1) return;
    stroke(255);
    fill(100);
    rect(this.x - 5, this.y - this.height / 2, 10, this.height);
    fill("orange");
    ellipse(this.x, this.handleY, 20, 20);
  }

  isOverHandle(mx, my) {
    return dist(mx, my, this.x, this.handleY) < 10;
  }

  startDrag(mx, my) {
    if (this.isOverHandle(mx, my)) {
      this.dragging = true;
    }
  }

  stopDrag() {
    this.dragging = false;
  }

  drag(mx, my) {
    if (this.dragging) {
      this.handleY = constrain(my, this.y - this.height, this.y);
    }
  }

  getPower() {
    return map(this.handleY, this.y, this.y - this.height, 0, maxCuePower);
  }
  reset() {
    this.handleY = this.initialHandleY;
  }
}

function randomIntGenerator(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function stopBody(body) {
  Matter.Body.setVelocity(body, { x: 0, y: 0 });

  Matter.Body.setAngularVelocity(body, 0);

  body.force.x = 0;
  body.force.y = 0;

  body.torque = 0;
}
