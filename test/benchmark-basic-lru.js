// https://github.com/isaacs/node-lru-cache/blob/master/benchmark/index.js

'use strict'

console.log('\x1b[7m Benchmarking \x1b[1mbasic-lru \x1b[0m');

var benchmark = require('benchmark')

// function LRU() { const lru = new Map; lru.peek = lru.get; return lru; }
var LRU = require('../cjs/index.js')

var suite = new benchmark.Suite()

function add(name, fn) {
  suite.add(name, fn)
}

// SET
var lru1 = new LRU({
  max: 1000
})
var lru1Counter = 0

add(' set', function() {
  lru1.set('key' + (lru1Counter++), 'value')
})

// GET and PEEK
var lru2 = new LRU({
  max: 1000
})
var lru2Counter = 0

for (var i = 0; i < 1000; i++)
  lru2.set('key' + i, 'value')

add(' get', function() {
  lru2.get('key' + (lru2Counter++) % 1000)
})

add(' peek', function() {
  lru2.peek('key' + (lru2Counter++) % 1000)
})

// SET with maxAge
var lru3 = new LRU({
  max: 1000,
  maxAge: 1
})
var lru3Counter = 0

add(' set with `maxAge`', function() {
  lru3.set('key' + (lru3Counter++), 'value', 100000)
})

suite
  .on('cycle', (event) => {
    console.log(String(event.target))
    if (event.target.error)
      console.error(event.target.error)
  })
  .run();
