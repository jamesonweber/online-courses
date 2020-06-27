### What is a function

Every function is a single valued collection of pairs:

This:
(-2 => -1)
(0, => 0)
(2 => 1)

Not this:
(1 => d)
(2 => b)
(2 => c) -- Problem

IE: 1 input to 1 output

Functions are:
1) Total
For every input, there is a corresponding output

2) Deterministic
Always receive the same output for a given input

3) No observable side effects
No observable side effects besides computing a value. This includes keeping a log would be a side effect.

Ex)
var xs = [1, 2, 3, 4, 5]

// Not a function
xs.splice(0, 3) // [1,2,3]
xs.splice(0, 3) // [4,5]
xs.splice(0, 3) // []

// Function
xs.slice(0, 3) // [1,2,3]
xs.slice(0, 3) // [1,2,3]
xs.slice(0, 3) // [1,2,3]

Some things which make functions not "functions"
- throwing errors
- mutating an object's property
- external calls (since the call result could be different)
- accessing a global variable for input within the function

#### Advantages
- Reliable
- Portable
- Reusable
- Testable
- Composable
- Properties / contract
  - Makes everything more mathematical

### Currying

#### Associative
add(add(x, y), z) == add(x, add(y, z))

#### Communative
add(x, y) == add (y, x)

#### Identity
add(x, 0) == x

#### Distributive
add(mul(x, y), mul(x, z)) == mul(x, add(y, z))

Currying is the evaluation of a function that takes multiple arguments and transforming it to evaluate in a sequence of functions which each take one argument.

When:
You choose currying when you want to remember an argument. For example a configuration you want tp pass around.

Note: You want to keep the arguments you want to remember in the front

### Composition

Composing is associative (meaning we can move the parentheses around). And we will evaluate right to left in order of the passed in functions.

Note: For left to right evaluation, look into `pipe`. It will do `(f, g) => x => g(f(x))`

The goal is to create pipelines where we pass in an input and there are functions applied to it into a pipeline of data processing.

### Functors
See functors.js for notes with examples on the identity functor.
