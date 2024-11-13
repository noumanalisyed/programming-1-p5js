function SuperPower() {
  //list of powers already used
  let powersUsed = [];
  //list of buttons
  let buttons = [];
  //list of powers, their names, the functions they run when activated
  //and the functions to run after its been deactivated
  this.powers = {
    mass: {
      title: "10X MASS GAINER",
      activated: false,
      activate: () => {
        //increases the mass by 10x
        Body.setMass(cue.ball, cue.ball.mass * 10);
      },
      deactivate: () => {
        //reset the mass back to normal, if mass is smaller than starting mass
  
        Body.setMass(
          cue.ball,
          cue.ball.mass * (cue.ball.mass > 1 ? 1 / 10 : 1)
        );
      },
    },
    shrink: {
      title: "SHRINK RAY",
      activated: false,
      activate: () => {
        //iterates through balls array
        for (type in ballManager.balls) {
          for (ball of ballManager.balls[type]) {
            //makes all balls 33% smaller
            Body.scale(ball.object, 2 / 3, 2 / 3);
          }
        }
      },
      deactivate: () => {
        for (type in ballManager.balls) {
          for (ball of ballManager.balls[type]) {
            //resets the area back to normal, if the area is smaller than starting
            if (ball.object.area < 91) {
              Body.scale(ball.object, 3 / 2, 3 / 2);
            }
          }
        }
      },
    },
    points: {
      title: "DOUBLE POINTS",
      activated: false,
      activate: () => {
        //iterates through all balls and doubles their values
        for (type in ballManager.balls) {
          for (ball of ballManager.balls[type]) {
            ball.value *= 2;
          }
        }
      },
      deactivate: () => {
        //resets the points of all balls,
        for (type in ballManager.balls) {
          for (ball of ballManager.balls[type]) {
            //except colored balls that returns after being pocketed
            if (
              ball.color == "red" ||
              ball.value != ballManager.coloredBalls[ball.color].value
            ) {
              ball.value *= 1 / 2;
            }
          }
        }
      },
    },
    align: {
      title: "LINE 'EM UP",
      activated: false,
      activate: () => {
        //array of objects that contain the x y coordinates of the balls
        let positions = [
          { x: 220, y: 120 },
          { x: 600, y: 120 },
          { x: 980, y: 120 },
          { x: 220, y: 480 },
          { x: 600, y: 480 },
          { x: 980, y: 480 },
        ];
        //counter to only have 6 balls for the 6 pockets be moved
        let counter = 0;
        for (type in ballManager.balls) {
          for (ball of ballManager.balls[type]) {
            //randomly assigns balls based on a 70% and 50% probability for the red
            //and color respectively
            if (random() > (ball.color == "red" ? 0.7 : 0.5) && counter < 6) {
              let vector = positions[counter];
              Body.setPosition(ball.object, { x: vector.x, y: vector.y });
              counter++;
            }
          }
        }
      },
      deactivate: () => {
        return false;
      },
    },
  };
  //function that makes the button and its functionality
  const makeButton = (power, y) => {
    const button = createButton(power.title);
    //add button to the button array
    buttons.push(button);
    //places the button 
    button.position(25, y);
    //if the power has been used, deactivate the button
    if (powersUsed.includes(power)) {
      button.attribute("disabled", true);
    }
    //give onclick event listener to button
    button.mousePressed(function () {
      power.activate();
      power.activated = true;
      button.attribute("disabled", true);
      powersUsed.push(power);
    });
  };

  //functions that places the button on the screen
  this.placeButtons = () => {
    let y = 200;
    //hides the previously created buttons to avoid weird visual overlap effect
    for (button of buttons) {
      button.hide();
    }
    for (power in this.powers) {
      y += 50;
      makeButton(this.powers[power], y);
    }
  };
  //deactivates the powers
  this.deactivate = () => {
    for (power in this.powers) {
      //run the deactivate function of the power that is activated
      if (this.powers[power].activated) {
        this.powers[power].deactivate();
        this.powers[power].activated = false;
      }
    }
  };
}
