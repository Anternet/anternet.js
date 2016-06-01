
class RidMap extends Map {

  constructor(limit) {
    super();

    this.limit = limit;
    this.last = Math.floor(Math.random() * this.limit);
  }

  add(value) {
    const start = this.last;
    if (++this.last > this.limit) this.last = 0;

    while (this.has(this.last)) {
      if (++this.last > this.limit) this.last = 0;

      if (this.last === start) throw new Error('Can\'t add new value; map is full');
    }

    this.set(this.last, value);
    return this.last;
  }
}

module.exports = RidMap;
