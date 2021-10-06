const { List } = require("immutable-ext");

// Basic semigroup
const sum = x => ({
    x,
    concat: other => sum(x + other.x)
});

console.log(sum(3).concat(sum(5))); // sum(8)

const product = x => ({
    x,
    concat: other => product(x * other.x)
});

console.log(product(3).concat(product(5))); // product(15)

const any = x => ({
    x,
    concat: other => any(x || other.x)
});

console.log(any(false).concat(any(true))); // any(true)

// Add identities to product and sum to make them monoids
product.empty = () => product(1);
sum.empty = () => sum(0);

// In action with reduce
let res = [1, 2, 3, 4, 5].map(sum).reduce((acc, n) => acc.concat(n));
console.log(res); // sum(15)

// the above blows up with the empty set, but we can add a base empty sum to reduce as an initial value so that an empty set works
res = [].map(sum).reduce((acc, n) => acc.concat(n), sum.empty());
console.log(res); // sum(0)

// Add any / all monoids
const all = x => ({
    x,
    concat: other => all(x && other.x)
});

any.empty = () => any(false);
all.empty = () => all(true);

res = [true, false, true]
    .map(any)
    .reduce((acc, n) => acc.concat(n), any.empty());
console.log(res); // any(true)

res = [true, false, true]
    .map(all)
    .reduce((acc, n) => acc.concat(n), all.empty());
console.log(res); // all(false)

// What we just did is equivalent to a foldMap in immutable-ext
res = List([true, false]).foldMap(all, all.empty());
console.log(res); // all(false)

// Now lets checkout functors
// Id functor
const id = x => ({
    map: f => id(f(x)),
    chain: f => f(x),
    extract: () => x,
    concat: o => id(x.concat(o.extract()))
});
id.of = x => id(x);

res = id.of(sum(2)).concat(id.of(sum(3)));
console.log(res.extract()); // sum(5)
