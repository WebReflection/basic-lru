var LRU = (function (exports) {
  'use strict';

  const {now} = Date;
  const {defineProperties} = Object;
  const {iterator} = Symbol;
  const zero = {writable: true, value: 0};

  class LRU extends Map {

    // constructor overload, same lru signature
    constructor(options) {
      const n = typeof options === 'number';
      const _max = (n ? options : (options.max || options.maxSize)) || Infinity;
      const _age = n ? 0 : (options.maxAge || 0);
      defineProperties(super(), {
        _dropExpired: {value: this._dropExpired.bind(this)},
        _dropCount: {value: this._dropCount.bind(this)},
        _max: {value: _max},
        _age: {value: _age},
        _timer: zero,
        _drop: zero,
        _count: zero
      });
    }

    // same Map signature overloads
    get(key) {
      const entry = super.get(key);
      if (entry) {
        entry.time = now();
        return entry.value;
      }
    }
    set(key, value) {
      const {_max, _age} = this;
      if (!this._drop && this.size === _max)
        this._drop = setTimeout(this._dropCount);
      if (_age) {
        clearTimeout(this._timer);
        this._timer = setTimeout(this._dropExpired, _age);
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
      if (entry)
        return entry.value;
    }

    // iterators based overloads
    * entries() {
      yield * this[iterator]();
    }
    * values() {
      for (const [_, {value}] of super[iterator]())
        yield value;
    }
    * [iterator]() {
      for (const [key, {value}] of super[iterator]())
        yield [key, value];
    }

    // private methods (to be moved as #methods)
    _dropCount() {
      this._drop = 0;
      [...super[iterator]()]
        .sort(([_1, entry1], [_2, entry2]) => {
          const prop = entry1.time === entry2.time ? 'count' : 'time';
          return entry2[prop] - entry1[prop];
        })
        .slice(this._max)
        .forEach(([key]) => this.delete(key));
    }
    _dropExpired() {
      const expiration = now() - this._age;
      super.forEach(({time}, key, self) => {
        if (time < expiration)
          self.delete(key);
      });
    }
  }

  exports.default = LRU;

  return exports;

}({}).default);
