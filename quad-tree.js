export default class QuadTree {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.capacity = 4;
    this.objects = [];
    this.children = [];
  }

  split() {
    // Create children
    this.children = this.children.concat([
      new QuadTree(this.x, this.y, this.width / 2, this.height / 2),
      new QuadTree(this.x + this.width / 2, this.y, this.width / 2, this.height / 2),
      new QuadTree(this.x, this.y + this.height / 2, this.width / 2, this.height / 2),
      new QuadTree(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, this.height / 2)
    ]);
    // Move objects into children
    this.objects.forEach(object => {
      this.children.forEach(child => {
        if (child.spatiallyContains(object)) {
          child.insert(object);
          return;
        }
      });
    });
  }

  insert(object) {
    // Find a leaf node to insert into
    if (this.children.length) {
      this.children.forEach(child => {
        if (child.spatiallyContains(object)) {
          child.insert(object);
        }
      });
      return;
    }

    // If leaf node, insert
    this.objects.push(object);

    // If leaf node full, branch out
    if (this.objects.length > this.capacity) {
      this.split();
    }
  }

  spatiallyContains(object) {
    return object.pos.x >= this.x && object.pos.x < this.x + this.width &&
      object.pos.y >= this.y && object.pos.y < this.y + this.height;
  }

  draw(ctx) {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    this.children.forEach(child => {
      child.draw(ctx);
    });
  }

  queryRect(x, y, width, height) {
    if (!this.children.length) {
      return this.objects;
    }
    return this.children.reduce((result, child) => {
      if (child.spatiallyContains({ pos: { x, y } })) {
        return result.concat(child.queryRect(x, y, width, height));
      }
      return result;
    }, []);
  }
}