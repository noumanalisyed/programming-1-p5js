
var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Composite = Matter.Composite;
var mouseclicked = 0;

var engine;
var boxA;
var boxB;
var ballA;
var ground;

function setup() {
  createCanvas(800, 600);

  // create an engine
  engine = Engine.create();

  // create two boxes and a ground
  boxA = Bodies.rectangle(400, 200, 80, 80);
  boxB = Bodies.rectangle(450, 50, 80, 80);
  ballA = Bodies.circle(500, 50, 20, 20);
  ground = Bodies.rectangle(400, 610, 810, 60, {
    isStatic: true
  });


  // run the engine
  Engine.run(engine);
}

// Using p5 to render
function draw() {
  // I could ask for everything in the world
  // var bodies = Composite.allBodies(engine.world);


  if (mouseclicked === 1) {
    background(51);

    // add all of the bodies to the world
    World.add(engine.world, [ground, boxA, boxB, ballA]);

    // Basic demo
    // Ground vertices
    var vertices = ground.vertices;
    beginShape();
    fill(127);
    for (var i = 0; i < vertices.length; i++) {
      vertex(vertices[i].x, vertices[i].y);
    }
    endShape();
  }
  // Getting vertices of each object
  var vertices = boxA.vertices;
  fill(255);
  beginShape();
  for (var i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape();

  // boxB vertices
  var vertices = boxB.vertices;
  fill(255);
  beginShape();
  for (var i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape();
// ballA Vertices
  var vertices = ballA.vertices;
  fill(255);
  beginShape();
  for (var i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape();
}
function mouseClicked(){
  if (mouseclicked === 0){
    mouseclicked = 1;
  } else {
    mouseclicked = 0;
  }

}