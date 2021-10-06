// Setup
//==============

// https://codepen.io/drboolean/pen/zYYPmZO?editors=0010

const _ = R;
const { formatMoney } = accounting;

// Example Data
const CARS = [
    {
        name: "Ferrari FF",
        horsepower: 660,
        dollar_value: 700000,
        in_stock: true
    },
    {
        name: "Spyker C12 Zagato",
        horsepower: 650,
        dollar_value: 648000,
        in_stock: false
    },
    {
        name: "Jaguar XKR-S",
        horsepower: 550,
        dollar_value: 132000,
        in_stock: false
    },
    { name: "Audi R8", horsepower: 525, dollar_value: 114200, in_stock: false },
    {
        name: "Aston Martin One-77",
        horsepower: 750,
        dollar_value: 1850000,
        in_stock: true
    },
    {
        name: "Pagani Huayra",
        horsepower: 700,
        dollar_value: 1300000,
        in_stock: false
    }
];

// Exercise 1:
// ============
// use _.compose() to rewrite the function below. Hint: _.prop() is curried.

const isLastInStock = cars => {
    var reversed_cars = _.last(cars);
    return _.prop("in_stock", reversed_cars);
};

const isLastInStockComposed = _.compose(_.prop("in_stock"), _.last);

QUnit.test("Ex1: isLastInStock", assert => {
    assert.deepEqual(isLastInStock(CARS), false);
    assert.deepEqual(isLastInStockComposed(CARS), false);
});

("");

// Exercise 2:
// ============
// use _.compose(), _.prop() and _.head() to retrieve the name of the first car

const nameOfFirstCar = _.compose(_.prop("name"), _.head);

QUnit.test("Ex2: nameOfFirstCar", assert => {
    assert.equal(nameOfFirstCar(CARS), "Ferrari FF");
});

// Exercise 3:
// ============
// Use the helper function _average to refactor averageDollarValue as a composition

const _average = function(xs) {
    return _.reduce(_.add, 0, xs) / xs.length;
}; // <- leave be

const averageDollarValue_ = function(cars) {
    const dollar_values = _.map(_.prop("dollar_value"), cars);
    return _average(dollar_values);
};

var averageDollarValue = _.compose(_average, _.map(_.prop("dollar_value")));

QUnit.test("Ex3: averageDollarValue", assert => {
    assert.equal(averageDollarValue(CARS), 790700);
});

// Exercise 4:
// ============
// Write a function: sanitizeNames() using compose that returns a list of lowercase and underscored names: e.g: sanitizeNames(["Hello World"]) //=> ["hello_world"].

const _underscore = _.replace(/\W+/g, "_"); //<-- leave this alone and use to sanitize

const sanitizeNames = _.compose(
    _.map(_.toLower),
    _.map(_underscore),
    _.map(_.prop("name"))
);

// Note, we can move map to the outside of compose as well which is a law of a functor
const sanitizeNamesBetter = _.map(
    _.compose(_.toLower, _underscore, _.prop("name"))
);

// The rule which always holds when writing functions
// compose(map(f), map(g)) == map(compose(f, g))

QUnit.test("Ex4: sanitizeNames", assert => {
    assert.deepEqual(sanitizeNames(CARS), [
        "ferrari_ff",
        "spyker_c12_zagato",
        "jaguar_xkr_s",
        "audi_r8",
        "aston_martin_one_77",
        "pagani_huayra"
    ]);
    assert.deepEqual(sanitizeNamesBetter(CARS), [
        "ferrari_ff",
        "spyker_c12_zagato",
        "jaguar_xkr_s",
        "audi_r8",
        "aston_martin_one_77",
        "pagani_huayra"
    ]);
});

// Bonus 1:
// ============
// Refactor availablePrices with compose.

const availablePrices = function(cars) {
    const available_cars = _.filter(_.prop("in_stock"), cars);
    return available_cars.map(x => formatMoney(x.dollar_value)).join(", ");
};

const formatDollarValue = _.compose(formatMoney, _.prop("dollar_value"));

// Note the filter and map are combined out of the box (there is logic behind the scenes)
// Check out transducers for more information.

// Also this could be captured in a lower function using a for loop. For loops aren't
// bad, so long as the function which does it is pure.
const availablePricesCompose = _.compose(
    _.join(", "),
    _.map(formatDollarValue),
    _.filter(_.prop("in_stock"))
);

QUnit.test("Bonus 1: availablePrices", assert => {
    assert.deepEqual(availablePrices(CARS), "$700,000.00, $1,850,000.00");
});

// Bonus 2:
// ============
// Refactor to pointfree.

const fastestCar = function(cars) {
    const sorted = _.sortBy(car => car.horsepower, cars);
    const fastest = _.last(sorted);
    return fastest.name + " is the fastest";
};

const append = _.flip(_.concat);

const fastestCarCompose = _.compose(
    // (x) => x.name + ' is the fastest', or
    append(" is the fastest"),
    _.prop("name"),
    _.last,
    _.sortBy(_.prop("horsepower"))
);

QUnit.test("Bonus 2: fastestCar", assert => {
    assert.equal(fastestCar(CARS), "Aston Martin One-77 is the fastest");
    assert.equal(fastestCarCompose(CARS), "Aston Martin One-77 is the fastest");
});
