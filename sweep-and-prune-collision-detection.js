class Interval {
  constructor(ball) {
    this.balls = [ball];
  }

  get leftmostPoint() {
    return this.balls[0].leftmostPoint;
  }

  get rightmostPoint() {
    return this.balls[this.balls.length - 1].rightmostPoint;
  }

  add(ball) {
    this.balls.push(ball);
  }

  doesOverlap(ball) {
    return ball.leftmostPoint < this.rightmostPoint;
  }
}

export default class SweepAndPruneCollisionDetection {
  constructor({ canvasSize, ctx }) {
    this.canvasSize = canvasSize;
    this.ctx = ctx;
  }

  update(balls) {
    // Sort balls by x
    balls.sort((a, b) => a.pos.x - b.pos.x);

    // Check for collisions
    const intervals = [];
    let activeInterval;
    balls.forEach((ball) => {
      if (activeInterval?.doesOverlap(ball)) {
        // Collision, add to active interval
        activeInterval.add(ball);
        if (!intervals.includes(activeInterval)) {
          intervals.push(activeInterval);
        }
      } else {
        // No collision, update active range
        activeInterval = new Interval(ball);
      }
    });

    // Draw graphic
    intervals.forEach((interval) => {
      this.ctx.fillStyle = `rgba(255, 0, 0, 0.2)`;
      this.ctx.fillRect(interval.leftmostPoint, 0, interval.rightmostPoint - interval.leftmostPoint, this.canvasSize);
    });

    // Resolve collisions
    intervals.forEach(({ balls }) => {
      // This is just the naive collision detection algorithm
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
    });
  }
}