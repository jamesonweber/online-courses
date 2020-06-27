// It'd be nice to dot chain this... We can do this with functors
const nextCharForNumberString = str => {
    const trimmed = str.trim();
    const number = parseInt(trimmed);
    const nextNumber = new Number(number + 1);
    return String.fromCharCode(nextNumber);
};

let result = nextCharForNumberString(" 64 ");
console.log(result); // A

// Create box and dot chain it (this is the identity functor)
// Note: this could be done with composition, but lets use a functor for now
//
// Box is a functor because it has a map method. In math, it is a functor because
// of the box type, as well as the map function.
//
// Note: we are abstracting away function calling. In the map is where we execute
// the function, so we can handle different types of functions such as async or error handling.

const Box = x => ({
    map: f => Box(f(x)),
    fold: f => f(x),
    toString: `Box(${x})`
});

// Note, the following still uses state, it updates x. However it is controlled single
// state, we overwrite the previous state with the new state.

const nextCharForNumberStringWithBox = str =>
    Box(str)
        .map(x => x.trim())
        .map(trimmed => parseInt(trimmed))
        .map(number => new Number(number + 1))
        // Use fold to break out of the box
        .fold(String.fromCharCode);

result = nextCharForNumberStringWithBox(" 64 ");
console.log(result); // A

const first = xs => xs[0];

const halfTheFirstLargeNumber = xs => {
    const found = xs.filter(x => x >= 20);
    const answer = first(found) / 2;
    return `The answer is ${answer}`;
};

result = halfTheFirstLargeNumber([1, 4, 50]);
console.log(result); // 25

const halfTheFirstLargeNumberWithBox = xs =>
    Box(xs)
        .map(xs => xs.filter(x => x >= 20))
        .map(found => first(found) / 2)
        .fold(answer => `The answer is ${answer}`);

result = halfTheFirstLargeNumberWithBox([0, 4, 50]);
console.log(result); // 25

// Note: we can define compose in terms of box. Box is strictly more powerful as a functor.

const boxCompose = (f, g) => x =>
    Box(x)
        .map(g)
        .fold(f);
