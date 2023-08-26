export default class NaiveCollisionDetection {
  update(balls) {
    balls.forEach(ball => {
      balls.forEach(otherBall => {
        if (ball === otherBall) {
          return;
        }

        const delta = ball.pos.minus(otherBall.pos);

        if (delta.magnitude < ball.radius + otherBall.radius) {
          ball.vel.angle = delta.angle;
        }
      });
    });
  }
}