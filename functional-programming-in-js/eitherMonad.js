const _findColor = name =>
    ({ red: "#ff4444", blue: "#3b5998", yellow: "#fff68f" }[name]);

let result = _findColor("redd");
console.log(result); // undefined

// Either is Left and Right together

const Right = x => ({
    chain: f => f(x),
    map: f => Right(f(x)),
    fold: (f, g) => g(x),
    toString: `Right(${x})`
});

// Notice how left will not run the functions
const Left = x => ({
    chain: f => Left(x),
    map: f => Left(x),
    fold: (f, g) => f(x),
    toString: `Left(${x})`
});

const findColor = name => {
    const found = { red: "#ff4444", blue: "#3b5998", yellow: "#fff68f" }[name];
    return found ? Right(found) : Left("Not found");
};

result = findColor("redd");
console.log(result); // Left(not found)

// no color found, but we don't crash on the undefined for to upper
let resultAsFunc = () =>
    findColor("redd")
        .map(x => x.toUpperCase())
        .map(x => x.slice(1))
        .fold(
            () => "no color found",
            c => c
        );

// Note, we could return Either here and make the caller deal with the error as well
console.log(resultAsFunc()); // no color found

const fromNullable = x => (x != null ? Right(x) : Left());

const findColorWithNullable = name => {
    const found = { red: "#ff4444", blue: "#3b5998", yellow: "#fff68f" }[name];
    return fromNullable(found);
};

result = findColorWithNullable("redd");
console.log(result); // Left(not found)
