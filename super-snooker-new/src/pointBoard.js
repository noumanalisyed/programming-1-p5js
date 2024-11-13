function PointBoard() {
  let score = 0;

  this.addScore = (s) => {
    score += s;
  };

  this.showScore = () => {
    push();
    textSize(24);
    fill("white");
    stroke("white");
    text("Score: " + score, 1050, 400);
  };
}
