function Table() {
  let cushions = [];
  const tableWidth = 800;
  const tableLength = tableWidth / 2;
  const boxWidth = (tableWidth / 72) * 1.5;
  const cushionHeight = 10
  const cushionAngle = 0.05
  //creates the cushions as a trapezoid
  this.createCushions = () => {
    cushions.push(
      Bodies.trapezoid(402, 105, tableLength - boxWidth * 2 - 13, cushionHeight, -0.07, {
        isStatic: true,
        restitution: 1,
      })
    );
    cushions.push(
      Bodies.trapezoid(800, 105, tableLength - boxWidth * 2 - 10, cushionHeight, -cushionAngle, {
        isStatic: true,
        restitution: 1,
      })
    );
    cushions.push(
      Bodies.trapezoid(205, 300, tableLength - boxWidth * 2 + 9, cushionHeight, cushionAngle, {
        isStatic: true,
        angle: Math.PI / 2,
        restitution: 1,
      })
    );
    cushions.push(
      Bodies.trapezoid(403, 495, tableLength - boxWidth * 2 + 9, cushionHeight, cushionAngle, {
        isStatic: true,
        restitution: 1,
      })
    );
    cushions.push(
      Bodies.trapezoid(797, 495, tableLength - boxWidth * 2 + 12, cushionHeight, cushionAngle, {
        isStatic: true,
        restitution: 1,
      })
    );
    cushions.push(
      Bodies.trapezoid(995, 300, tableLength - boxWidth * 2 - 12, cushionHeight, -cushionAngle, {
        isStatic: true,
        angle: Math.PI / 2,
        restitution: 1,
      })
    );
    //adds the cushions to the world
    for (cushion of cushions) {
      World.add(engine.world, [cushion]);
    }
  };

  const drawPlayingField = () => {
    noStroke();
    //playing field
    fill("#4e8834");
    rect(200, 100, tableWidth, tableLength);
  };

  const drawRailing = () => {
    fill("#40230d");
    //left
    rect(185, 100, 15, tableLength);
  
    //top
    rect(200, 85, tableWidth, 15);
   
    //right
    rect(1000, 100, 15, tableLength);

    //bottom
    rect(200, 500, tableWidth, 15);

  };

  const drawYellowBoxes = () => {
    fill("#f1d74a");
    //top left
    rect(185, 85, 25, 25, 15, 0, 0, 0);
    //top mid
    rect(588, 85, 24, 15);
    //top right
    rect(990, 85, 25, 25, 0, 15, 0, 0);
    //bottom left
    rect(185, 490, 25, 25, 0, 0, 0, 15);
    //bottom mid
    rect(588, 500, 24, 15);
    //bottom right
    rect(990, 490, 25, 25, 0, 0, 15, 0);
  };

  const drawHoles = () => {
    fill(0);
    //top left
    ellipse(205, 104, boxWidth);
    //top mid
    ellipse(600, 104, boxWidth);
    //top right
    ellipse(996, 104, boxWidth);
    //bottom left
    ellipse(205, 495, boxWidth);
    //bottom mid
    ellipse(600, 495, boxWidth);
    //bottom right
    ellipse(996, 495, boxWidth);
  };

  const drawDLine = () => {
    fill(255);
    stroke(255);
    line(
      200 + tableWidth / 5,
      100 + 15,
      200 + tableWidth / 5,
      tableLength + 100 - 15
    );
    noFill();
    arc(200 + tableWidth / 5, 175 + 370 / 3, 150, 150, 90, 270);
  };

  this.detectCollision = (cue) => {
    //changes the render of the cushion when colliding with the cue ball
    for (cushion of cushions){
        if(Collision.collides(cue, cushion)){
          cushion.render.visible = false;
        }
        else{
          cushion.render.visible = true;
        }
    }
  }

  const drawCushions = (c) => {
    for (cushion of c) {
      push();
      noStroke();
      //changes the fill between dark n light green, depending on render visibility
      fill(cushion.render.visible ? "#346219":"#69F319");
      hp.drawVertices(cushion.vertices);
      pop();
    }
  };
  this.draw = function () {
    drawPlayingField();
    drawRailing();
    drawYellowBoxes();
    drawHoles();
    drawDLine();
    drawCushions(cushions);
  };
}
