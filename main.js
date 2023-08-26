import Vector2 from './vector2.js';
import NaiveCollisionDetection from './naive-collision-detection.js';
import QuadTree from './quad-tree-collision-detection.js';
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const balls = [];
const canvasSize = 600;
const ballCount = 100;
let collisionDetection;

class Ball {
  constructor() {
    this.pos = new Vector2(Math.random() * 500 + 50, Math.random() * 500 + 50);
    this.vel = new Vector2(Math.random() * 10 - 5, Math.random() * 10 - 5);
    this.radius = Math.random() * 2 + 3;
    this.color = `rgb(255, ${Math.random() * 255}, ${Math.random() * 255})`;
  }
}

function setup() {
  for (let i = 0; i < ballCount; i++) {
    balls.push(new Ball());
  }
  collisionDetection = new NaiveCollisionDetection();
}

function update() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);

  // Collisions
  collisionDetection.update(balls);

  balls.forEach(ball => {
    // Wall bounce
    if (ball.pos.x - ball.radius < 0 || ball.pos.x + ball.radius > canvasSize) {
      ball.vel.x *= -1;
    }

    if (ball.pos.y - ball.radius < 0 || ball.pos.y + ball.radius > canvasSize) {
      ball.vel.y *= -1;
    }

    // Apply velocity
    ball.pos.add(ball.vel);

    // Draw
    ctx.beginPath();
    ctx.arc(ball.pos.x, ball.pos.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
  });

  const quad = new QuadTree(0, 0, canvasSize, canvasSize);
  balls.forEach(ball => {
    quad.insert(ball);
  });
  quad.draw(ctx);

}

setup();
setInterval(update, 50);