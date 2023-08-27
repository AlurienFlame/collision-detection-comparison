import Vector2 from './vector2.js';
import NaiveCollisionDetection from './naive-collision-detection.js';
import QuadTreeCollisionDetection from './quad-tree-collision-detection.js';
import SweepAndPruneCollisionDetection from './sweep-and-prune-collision-detection.js';
// TODO: Uniform grid space partitioning
// TODO: KD trees
// TODO: Bounding volume hierarchies
// TODO: Mass based collision

const collisionDetectionAlgorithms = {
  "naive": NaiveCollisionDetection,
  "quad": QuadTreeCollisionDetection,
  "sweep": SweepAndPruneCollisionDetection,
};
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let balls = [];
const canvasSize = 600;
let interval;

// Set up config
let collisionDetection;
const config = {};

function updateConfig(event) {
  config[event.target.name] = parseFloat(event.target.value) || event.target.value;
  setup();
}

document.querySelectorAll("input").forEach(input => {
  input.addEventListener("change", updateConfig);
  config[input.name] = parseFloat(input.value);
});
const algoSelect = document.querySelector("select");
algoSelect.addEventListener("change", updateConfig);
config[algoSelect.name] = algoSelect.value;

class Ball {
  constructor() {
    this.pos = new Vector2(Math.random() * 500 + 50, Math.random() * 500 + 50);
    this.vel = new Vector2(Math.random() * 10 - 5, Math.random() * 10 - 5);
    this.radius = Math.random() * config.ballSizeVariance + config.ballSize;
    this.color = `rgb(255, ${Math.random() * 255}, ${Math.random() * 255})`;
  }

  get leftmostPoint() {
    return this.pos.x - this.radius;
  }

  get rightmostPoint() {
    return this.pos.x + this.radius;
  }
}

function setup() {
  // Create balls
  balls = [];
  for (let i = 0; i < config.ballCount; i++) {
    balls.push(new Ball());
  }

  // Set up collision detection
  collisionDetection = new collisionDetectionAlgorithms[config.collisionDetection]({ canvasSize, ctx });

  // Start animation
  clearInterval(interval);
  interval = setInterval(update, config.mspf);
}

function update() {
  // TODO: profiling - ideally average over several (hundred?) updates, display to user
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
}

setup();