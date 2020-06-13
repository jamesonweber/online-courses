const { curry } = require("ramda");

// Examples of modifying inputs to pass into the add function
const add = (x, y) => x + y;

const toPair = f => ([x, y]) => f(x, y);

var result = toPair(add)([1, 2]);
console.log(result);

const fromPair = f => (x, y) => f([x, y]);

result = fromPair(toPair(add))(1, 3);
console.log(result);

const flip = f => (y, x) => f(x, y);

result = flip(add)(1, 4);
console.log(result);

// Currying
// Note ramda will curry for functions of any length. This one does two
// const curry = f => x => y => f(x, y);

const curriedAdd = curry(add);

const increment = curriedAdd(1);

result = increment(2);
console.log(result);

const uncurry = f => (x, y) => f(x)(y);

const modulo = curry((x, y) => y % x);

const isOdd = modulo(2); // (2, y) => 2 % y

console.log(isOdd(4));
console.log(isOdd(5));

const filter = curry((f, xs) => xs.filter(f));

const getOdds = filter(isOdd);

result = getOdds([1, 2, 3, 4, 5]);
console.log(result);

const replace = curry((regex, replacement, str) =>
    str.replace(regex, replacement)
);

const replaceVowels = replace(/[AEIOU]/gi, "!");

result = replaceVowels("Hey I have words");
console.log(result);
