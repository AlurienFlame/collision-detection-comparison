import QuadTree from "./quad-tree.js";

export default class QuadTreeCollisionDetection {
  constructor(canvasSize, ctx) {
    this.canvasSize = canvasSize;
    this.ctx = ctx;
  }

  update(balls) {
    const quad = new QuadTree(0, 0, this.canvasSize, this.canvasSize);
    balls.forEach(ball => {
      quad.insert(ball);
    });
    quad.draw(this.ctx);

    balls.forEach(ball => {
      const nearbyBalls = quad.queryRect(ball.pos.x - ball.radius, ball.pos.y - ball.radius, ball.radius * 2, ball.radius * 2)
      nearbyBalls.forEach(otherBall => {
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