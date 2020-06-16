const { compose, curry } = require("ramda");

const toUpper = str => str.toUpperCase();

const exclaim = str => str + "!";

const first = xs => xs[0];

// const compose = (f, g) => x => f(g(x));

const shout = compose(toUpper, exclaim);

let result = shout("tears");

console.log(result);

const shoutFirst = compose(first, compose(toUpper, exclaim));

// With ramda compose, we don't have to nest. It could be:
// const shoutFirst = compose(first, toUpper, exclaim)

result = shoutFirst("tears");

console.log(result);

// Notice how the functions are evaluated right to left

const loudFirst = compose(toUpper, first);
const loudFirstShout = compose(exclaim, loudFirst);

result = loudFirstShout("test");
console.log(result);

// Note: for left to right evaluation, use pipe

// Combining compose and curry

const concat = curry((y, x) => x + y);
const add = curry((x, y) => x + y);

const curryShoutFirst = compose(concat("!"), loudFirst);

result = curryShoutFirst("test");
console.log(result);

// We can also log (this does introduce a side effect though)

const log = curry((tag, x) => (console.log(tag, x), x));
compose(concat("!"), log("here: "), loudFirst)("test");
