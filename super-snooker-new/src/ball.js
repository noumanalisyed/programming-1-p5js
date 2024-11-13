function Ball(x, y, color, value) {
  //returns an object with the matter js body, the ball's color, and the value
  let numerator = 400;
  let denominator = 40;
  return {
    object: Bodies.circle(x, y, numerator / denominator, {
      isSleeping: true,
      //disables mouse interaction with the red and colored balls
      collisionFilter: { category: 0x0002 },
      restitution: 0.9,
      friction: 0.7,
    }),
    color: color,
    value: value,
  };
}
