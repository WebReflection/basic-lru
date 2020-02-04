const {now} = Date;
const {defineProperties} = Object;
const {iterator} = Symbol;

export default class LRU extends Map {

  // constructor overload, same lru signature
  constructor(options) {
    const n = typeof options === 'number';
    const _max = (n ? options : (options.max || options.maxSize)) || Infinity;
    const _maxAge = n ? 0 : (options.maxAge || 0);
    defineProperties(super(), {
      _dropExpired: {value: this._dropExpired.bind(this)},
      _timer: {writable: true, value: 0},
      _count: {writable: true, value: 0},
      _max: {value: _max},
      _maxAge: {value: _maxAge}
    });
  }

  // same Map signature overloads
  get(key) {
    const entry = super.get(key);
    if (entry !== void 0) {
      entry.time = now();
      return entry.value;
    }
  }
  set(key, value) {
    const {_max, _maxAge} = this;
    const ages = _maxAge !== 0;
    if (this.size === _max && !this.has(key)) {
      if (ages)
        this._dropExpired();
      if (!ages || this.size === _max)
        this._dropCount();
    }
    if (ages) {
      clearTimeout(this._timer);
      this._timer = setTimeout(this._dropExpired, _maxAge + 1);
    }
    return super.set(key, {
      count: this._count++,
      time: now(),
      value
    });
  }
  forEach(callback, self) {
    return super.forEach(
      ({value}, key) => callback.call(self, value, key, this)
    );
  }

  // extra methods
  peek(key) {
    const entry = super.get(key);
    if (entry !== void 0)
      return entry.value;
  }

  // iterators based overloads
  * entries() {
    yield * this[iterator]();
  }
  * values() {
    for (const [_, {value}] of super[iterator].call(this))
      yield value;
  }
  * [iterator]() {
    for (const [key, {value}] of super[iterator].call(this))
      yield [key, value];
  }

  // private methods (to be moved as #methods)
  _dropCount() {
    const entries = [...super[iterator].call(this)];
    const [[toBeRemoved]] = entries.sort(([_1, entry1], [_2, entry2]) => {
      const prop = entry1.time === entry2.time ? 'count' : 'time';
      return entry1[prop] - entry2[prop];
    });
    this.delete(toBeRemoved);
  }
  _dropExpired() {
    const expiration = now() - this._maxAge;
    super.forEach(({time}, key) => {
      if (time < expiration)
        this.delete(key);
    });
  }
};
