export default class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  get angle() {
    return Math.atan2(this.y, this.x);
  }

  set angle(angle) {
    const magnitude = this.magnitude;
    this.x = Math.cos(angle) * magnitude;
    this.y = Math.sin(angle) * magnitude;
  }

  get magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  set magnitude(magnitude) {
    const angle = this.angle;
    this.x = Math.cos(angle) * magnitude;
    this.y = Math.sin(angle) * magnitude;
  }

  minus(other) { // -
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  add(other) { // +=
    this.x += other.x;
    this.y += other.y;
  }
}