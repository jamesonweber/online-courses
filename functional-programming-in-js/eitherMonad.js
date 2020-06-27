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

// Refactoring using Either

const fs = require("fs");

const getPort = () => {
    try {
        const str = fs.readFileSync("config.json");
        const config = JSON.parse(str);
        return config.port;
    } catch (e) {
        return 3000;
    }
};

const tryCatch = f => {
    try {
        return Right(f());
    } catch (e) {
        return Left(e);
    }
};

// Force users to not be able to directly do fs.readFileSync
const readFileSync = path => tryCatch(() => fs.readFileSync(path));

const getPortEither = () =>
    // tryCatch(() => fs.readFileSync(path)) or better yet, ensure try catch is handled
    // whenever we do file reads with a new file reading function
    readFileSync("config.json")
        .map(contents => JSON.parse(contents))
        .map(config => config.port)
        .fold(
            () => 3000,
            x => x
        );

result = getPortEither();
console.log(result); // 3000 since we don't have the file, but we also didn't blow up and handled the error cleanly
