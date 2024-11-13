function PointBoard() {
  let score = 0;
  //adds the score
  this.addScore = (s) => {
    score += s;
  };

  //shows the scoreboard
  this.showScore = () => {
    push();
    textSize(24);
    fill("white");
    stroke("white");
    text("Score: " + score, 1050, 400);
  };
}
