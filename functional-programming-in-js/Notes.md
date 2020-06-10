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


