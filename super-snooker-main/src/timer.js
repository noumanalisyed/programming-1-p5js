function Timer() {
  let minutes = 10;
  let seconds = 0;
  this.startTimer = () => {
    //60 frames per second so runs this func one every second
    if (frameCount % 60 == 0) {
      if (minutes == 0 && seconds == 0) {
        minutes = 0;
        seconds = 0;
        //kills the loop when time is over
        noLoop();
      } else if (seconds == 0) {
        minutes -= 1;
        seconds = 60;
      }
      seconds -= 1;
    }
  };
  //draws the timer
  this.drawTimer = () => {
    push();
    textSize(18);
    fill("white");
    stroke(255);
    //adds a "0" before the minutes and seconds if they're less than 10
    if (minutes + seconds != 0) {
      text(
        `Time left: ${minutes < 10 ? "0" + minutes : minutes}:${
          seconds < 10 ? "0" + seconds : seconds
        }`,
        1050,
        200
      );
    } else {
      text("TIME'S UP!", 1050, 200);
    }

    pop();
  };
}
