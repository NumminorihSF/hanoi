const INVALID_TOWER_PUSH = 'Can\'t place ring to current tower';

const rings = 'rings';

export default class Tower {
  constructor() {
    this[rings] = [];
  }

  push(size) {
    if (this[rings].length > 0) {
      if (size > this.getTopSize()) throw new Error(INVALID_TOWER_PUSH);
      if (size === this.getTopSize()) throw new Error(INVALID_TOWER_PUSH);
    }
    this[rings].push(size);

    return this;
  }

  pop() {
    return this[rings].pop();
  }

  get size() {
    return this[rings].length;
  }

  getState() {
    return this[rings].map(ring => ({ size: ring }));
  }

  getTopSize() {
    return this[rings][this[rings].length - 1];
  }
}
