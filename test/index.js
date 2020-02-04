const LRU = require('../cjs');

const item1 = ['a', 1];
const item2 = ['b', 2];
const item3 = ['c', 3];
const item4 = ['d', 4];

const lru1 = new LRU(2);
const lru2 = new LRU({max: 2});
const lru3 = new LRU({maxSize: 2, maxAge: 200});

console.assert(lru1.set(...item1) === lru1, 1);
console.assert(lru1.get(item1[0]) === item1[1], 2);
console.assert(lru1.set(...item2) === lru1, 3);
console.assert(lru1.set(...item3) === lru1, 4);
console.assert(lru1.get(item1[0]) === void 0, 5);
console.assert(JSON.stringify([...lru1]) === JSON.stringify([item2, item3]), 6);

lru1.forEach(Object);
lru1.delete(item2[0]);
lru1.forEach(function (value, key, map) {
  console.assert(this === lru2, 7);
  console.assert(map === lru1, 8);
  console.assert(key === item3[0], 9);
  console.assert(value === item3[1], 10);
}, lru2);

for (const [key, value] of lru1) {
  console.assert(key === item3[0], 11);
  console.assert(value === item3[1], 12);
}

for (const [key, value] of lru1.entries()) {
  console.assert(key === item3[0], 11);
  console.assert(value === item3[1], 12);
}

for (const value of lru1.values()) {
  console.assert(value === item3[1], 13);
}

console.assert(lru1.peek(item3[0]) === item3[1], 14);

lru3.set(...item1).set(...item2);

setTimeout(() => {
  lru3.set(...item3);
  console.assert(JSON.stringify([...lru3]) === JSON.stringify([item2, item3]), 15);
  setTimeout(() => {
    lru3.set(...item1).set(...item3);
    console.assert(JSON.stringify([...lru3]) === JSON.stringify([item3, item1]), 16);
    setTimeout(() => {
      console.assert(JSON.stringify([...lru3]) === '[]', 17);
      lru3.set(...item1).set(...item2);
      setTimeout(() => {
        lru3.set(...item3);
        setTimeout(() => {
          lru3.set(...item1);
          const lur4 = new LRU({maxAge: 100});
          console.assert(lur4.peek('any') === void 0, 18);
          lur4.set(...item1);
          setTimeout(() => {
            lur4.set(...item2).set(...item3);
          }, 50);
        }, 0);
      }, 50);
    }, 250);
  }, 150);
}, 100);
