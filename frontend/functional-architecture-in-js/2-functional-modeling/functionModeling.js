const { List } = require('immutable-ext')

const toUpper = x => x.toUpperCase();
const exclaim = x => x.concat("!")

const Fn = run => ({
    run,
    chain: f => Fn(x => f(run(x)).run(x)),
    map: f => Fn(x => f(run(x))),
    concat: other => Fn(x => run(x).concat(other.run(x)))
})

Fn.ask = Fn(x => x);
Fn.of = x => Fn(() => x);

let res = Fn(toUpper)
    // y is the original that we passed in
    .chain(upper => Fn(y => [y, exclaim(upper)]))
    .run("hi")
console.log(res)

// We can use the concept to resolve initial variables when we need to. For example a config.
res = Fn.of("hello")
    .map(toUpper)
    .chain(upper => Fn(config => [config, exclaim(upper)]))
console.log(res.run({ port: 3000 }))

// We can then make it more clear we are requesting our global config by using "ask"
// rather than pulling something out of thin air in a constructor, we can "ask" for the global state instead

// So this is equivalent to the above
res = Fn.of("hello")
    .map(toUpper)
    .chain(upper => Fn.ask.map(config => [config, exclaim(upper)]))
console.log(res.run({ port: 3000 }))

// Remarks: This is the "Reader" monad and can be used to chain execution.
// It is neat because it basically creates dependency injection without needing a framework.
// We can "ask" to resolve anything in our run config at any point. So in our case, we could have a db connection, web config, verbiage, etc.


// The endo functor

// only works for functions with the same type of input as the output
// a => a
// String -> String

// Note how map does not exist here because we cannot map to a new type. The return must be the same
const Endo = run => ({
    run,
    concat: other => Endo(x => other.run(run(x)))
})
Endo.empty = () => Endo(x => x)

res = List([toUpper, exclaim]).foldMap(Endo, Endo.empty()).run('hello endo') // HELLO ENDO!
console.log(res)

// contramap
// Allows you to change arguments before it arrives at a function.
// Unlike map which you change the output after a function

// (acc, a) -> acc
const Reducer = run => ({
    run,
    contramap: f => Reducer((acc, x) => run(acc, f(x))),
    concat: other => Reducer((acc, x) => other.run(run(acc, x), x))
})

// Ex)
Reducer(login.contramap(payload => payload.user))
.concat(Reducer(changePage).contramap(payload => payload.currentPage))
.run(state, {user: {}, currentPage: {}})

