function BallManager() {
  this.balls = {
    red: [],
    color: [],
  };
  let numerator = 400;
  let denominator = 40
  this.foul = false;
  let won = false;
  this.foulMessage = "";
  let consecColor = 0;
  let target = "Red Ball";
  this.redBallIn = false;
  let ballCollided;
  //mode for the balls to be organized
  this.mode;
  //information of the colored balls
  this.coloredBalls = {
    pink: {
      x: 720,
      y: 310 - 800 / 72,
      value: 6,
    },
    blue: {
      x: 600,
      y: 310 - 800 / 72,
      value: 5,
    },
    black: {
      x: 900,
      y: 310 - 800 / 72,
      value: 7,
    },
    brown: {
      x: 360,
      y: 310 - 800 / 72,
      value: 4,
    },
    green: {
      x: 360,
      y: 250 + 370 / 3,
      value: 3,
    },
    yellow: {
      x: 360,
      y: 100 + 370 / 3,
      value: 2,
    },
  };

  //changes the mode and creates the balls
  this.setMode = (mode) => {
    this.mode = mode;
    createBalls(mode);
  };

  //creates specifically red balls with the patterns
  const createRedBalls = () => {
    let startingX = 725;
    let startingY = 305;
    const radius = numerator / denominator;
    let gap = 4;
    //creates the pyramid pattern for the red ball
    for (var i = 0; i < 6; i++) {
      let ypos = startingY - i * radius;
      for (var j = 0; j < i; j++) {
        createBall(
          startingX + i * (radius + gap),
          ypos + 2 * j * radius,
          "red",
          1
        );
      }
    }
  };
  //creates a ball and adds it to the appropriate array
  //and the world
  const createBall = (x, y, color, value) => {
    let ball = new Ball(x, y, color, value);
    this.balls[color == "red" ? "red" : "color"].push(ball);
    World.add(engine.world, [ball.object]);
  };

  //creates the balls with positions based on the mode
  const createBalls = (mode) => {
    //certain balls are awake so that placement doesn't overlap
    //especially on the modes that require random placement
    switch (mode) {
      case "ordered":
        createRedBalls();
        for (color in this.coloredBalls) {
          createBall(
            this.coloredBalls[color]["x"],
            this.coloredBalls[color]["y"],
            color,
            this.coloredBalls[color]["value"]
          );
        }
        break;
      case "unordered":
        //set all balls awake so they dont overlap
        for (let i = 0; i < 15; i++) {
          //randomly place the red balls
          createBall(random(250, 950), random(150, 400), "red", 1);
          Sleeping.set(this.balls["red"][i]["object"], false);
        }
        for (var i = 0; i < Object.keys(this.coloredBalls).length; i++) {
          let color = Object.keys(this.coloredBalls)[i];
          //randomly place the colored balls
          createBall(
            random(250, 950),
            random(150, 400),
            color,
            this.coloredBalls[color]["value"]
          );
          Sleeping.set(this.balls["color"][i]["object"], false);
        }
        break;
      case "partial":
        
        for (let i = 0; i < 15; i++) {
          createBall(random(250, 950), random(150, 400), "red", 1);
          //set red balls awake so they dont overlap
          Sleeping.set(this.balls["red"][i]["object"], false);
        }
        for (var i = 0; i < Object.keys(this.coloredBalls).length; i++) {
          let color = Object.keys(this.coloredBalls)[i];
          createBall(
            this.coloredBalls[color]["x"],
            this.coloredBalls[color]["y"],
            color,
            this.coloredBalls[color]["value"]
          );
        }
    }
  };
  //changes the sleep state of the balls
  this.setBallsSleep = (asleep) => {
    for (type in this.balls) {
      for (ball of this.balls[type]) {
        Sleeping.set(ball.object, asleep);
      }
    }
  };
  //draws the balls in the balls object
  this.drawBalls = () => {
    for (balltype in this.balls) {
      for (ball of this.balls[balltype]) {
        push();
        fill(ball.color);
        noStroke();
        hp.drawVertices(ball.object.vertices);
        pop();
      }
    }
  };

  //detects the balls going into holes
  this.detectFalling = () => {
    //iterates through the balls and checks if they're in field
    for (balltype in this.balls) {
      for (ball of this.balls[balltype]) {
        if (ball.object.position.y <= 106 || ball.object.position.y >= 494) {
          if (ball.color == "red") {
            this.redBallIn = true;
            //if its red remove it from the array
            removeBall(this.balls.red, this.balls.red.indexOf(ball));
            target = "Colored Ball";
          } else {
            //removes the original ball from the object
            removeBall(this.balls.color, this.balls.color.indexOf(ball));
            //in one turn adds the number of consecutive color balls that fell
            consecColor++;
            //if its greater or equal to two put a prompt
            if (consecColor >= 2) {
              this.foul = true;
              this.foulMessage = "Two Consecutive Colored balls fell";
            }
            //adds the ball back if there are still reds on the table
            if (this.balls.red.length != 0) {
              createBall(
                this.coloredBalls[ball.color].x,
                this.coloredBalls[ball.color].y,
                ball.color,
                ball.value
              );
            } else {
              target = "Red Ball";
            }
            if (this.balls.red.length == 0 && this.balls.color.length == 0) {
              won = true;
            }
            this.redBallIn = false;
          }
          //adds the value of the ball pocketed IF there is no foul
          scoreBoard.addScore(this.foul ? 0 : ball.value);
        }
      }
    }
  };

  const removeBall = (array, index) => {
    //removes the ball from the world
    World.remove(engine.world, [array[index].object]);
    //removes it from the array
    array.splice(index, 1);
  };
  //detects collision between the white ball and the red or colored
  this.detectCollision = (cue) => {
    for (balltype in this.balls) {
      for (ball of this.balls[balltype]) {
        if (Collision.collides(cue, ball.object)) {
          if (ball.color == "red") {
            redBallCollided();
          } else {
            coloredBallsCollided();
          }
          target = "Red ball";
        }
      }
    }
  };

  this.drawFoul = () => {
    //draws the foul by making it red if there is a foul
    push();
    textSize(24);
    stroke(this.foul ? "red" : 0);
    fill(this.foul ? "red" : 0);
    //gives the description based on the foul message
    text("Foul: " + this.foulMessage, 450, 700);
    pop();
  };
  //code that runs if red ball is hit
  const redBallCollided = () => {
    //checks if its a legal or non legal hit
    if ((this.redBallIn || ballCollided == "color") && !this.foul) {
      this.foul = true;
      this.foulMessage = "Red ball Hit";
      scoreBoard.addScore(-4);
    }
    this.redBallIn = false;
    ballCollided = "red";
  };
  //code that runs if a colored ball is hit
  const coloredBallsCollided = () => {
    //checks if its a legal or non legal hit
    if (!this.redBallIn && this.balls.red.length != 0 && !this.foul) {
      this.foul = true;
      this.foulMessage = "Coloured ball Hit";
      scoreBoard.addScore(-4);
    }
    this.redBallIn = false;
    ballCollided = "color";
  };
  //startsa new turn by resetting to default variables
  this.newTurn = () => {
    this.foul = false;
    this.foulMessage = "";
    ballCollided = "";
    consecColor = 0;
    this.setBallsSleep(true);
  };

  //checks for a win and draws if player has cleared the table
  this.checkWin = () => {
    if (won) {
      push();
      textSize(40);
      stroke(won ? "green" : 0);
      fill(won ? "green" : 0);
      text("You Win!", 400, 700);
      pop();
      setTimeout(() => {
        noLoop();
      }, 1000);
    }
  };

  //shows the target ball
  this.showTarget = () => {
    push();
    textSize(20);
    stroke(255);
    fill("white");
    text("Target: " + target, 900, 50);
    pop();
  };
}
