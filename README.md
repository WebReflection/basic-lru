# basic-lru

[![Build Status](https://travis-ci.com/WebReflection/basic-lru.svg?branch=master)](https://travis-ci.com/WebReflection/basic-lru) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/basic-lru/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/basic-lru?branch=master)

A lightweight, as in 1.2K, Map based LRU implementation.

```js
import LRU from 'basic-lru';
const LRU = require('basic-lru');
// https://unpkg.com/basic-lru to have LRU globally

// new LRU(maxSize)
const lru = new LRU(100);

// new LRU({max}) or new LRU({maxSize})
const lru = new LRU({max: 1000});

// new LRU({maxAge}) in milliseconds
const lru = new LRU({maxAge: 1000});

// variants
const lru = new LRU({max: 100, maxAge: 1000});
const lru = new LRU({maxSize: 100, maxAge: 1000});
```

### About

This module is a drop-in replacement for any [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) instance, and it's mostly 100% compatible with [lru](https://github.com/chriso/lru), [lru-cache](https://github.com/isaacs/node-lru-cache), [quick-lru](https://github.com/sindresorhus/quick-lru), and [lru-map](https://github.com/bchociej/lru-map) modules.

Differently from other modules, this one has the least amount of LOC, zero dependencies, and it's based on ES2015 class capability to extend the native Map.


### The Map Extend Differences

The only difference from a real Map, beside implementing a classic LRU cache, is the `peek(key)` method, to access an entry without flagging its access time anyhow, and borrowed from other libraries, plus a constructor, also borrowed from other libraries, that accepts either an integer, or an options object with `max`, or `maxSize`, and a `maxAge` property, where all of these are optional too.
