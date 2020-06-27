// https://codepen.io/drboolean/pen/poodxOm?editors=0010

const Box = x => ({
    map: f => Box(f(x)),
    // Note chain and fold are the same in this case, but that is not always true
    chain: f => f(x),
    fold: f => f(x),
    toString: () => `Box(${x})`
});

// Exercise: Box
// Goal: Refactor each example using Box
// Keep these tests passing!
// Bonus points: no curly braces

// Ex1: Using Box, refactor moneyToFloat to be unnested.
// =========================
const moneyToFloat = str => parseFloat(str.replace(/\$/, ""));

const moneyToFloatBox = str =>
    Box(str)
        .map(x => x.replace(/\$/, ""))
        .fold(s => parseFloat(s));

QUnit.test("Ex1: moneyToFloat", assert => {
    assert.equal(String(moneyToFloat("$5.00")), 5);
    assert.equal(String(moneyToFloatBox("$5.00")), 5);
});

// Ex2: Using Box, refactor percentToFloat to remove assignment
// =========================
const percentToFloat = str => {
    const float = parseFloat(str.replace(/\%/, ""));
    return float * 0.01;
};

const percentToFloatBox = str =>
    Box(str)
        .map(x => x.replace(/\%/, ""))
        .map(x => parseFloat(x))
        .fold(x => x * 0.01);

QUnit.test("Ex2: percentToFloat", assert => {
    assert.equal(String(percentToFloat("20%")), 0.2);
    assert.equal(String(percentToFloatBox("20%")), 0.2);
});

// Ex3: Using Box, refactor applyDiscount (hint: each variable introduces a new Box)
// =========================
const applyDiscount = (price, discount) => {
    const cents = moneyToFloat(price);
    const savings = percentToFloat(discount);
    return cents - cents * savings;
};

const applyDiscountBox = (price, discount) =>
    Box(moneyToFloatBox(price)).fold(cents =>
        Box(percentToFloat(discount)).fold(savings => cents - cents * savings)
    );

// Note a monad could concat the boxes together to remove the nesting as well

const applyDiscountBoxMonad = (price, discount) =>
    Box(moneyToFloatBox(price))
        .chain(cents =>
            Box(percentToFloat(discount)).map(
                savings => cents - cents * savings
            )
        ) // Box(Box(x))
        .fold(x => x);

QUnit.test("Ex3: Apply discount", assert => {
    assert.equal(String(applyDiscount("$5.00", "20%")), 4);
    assert.equal(String(applyDiscountBox("$5.00", "20%")), 4);
    assert.equal(String(applyDiscountBoxMonad("$5.00", "20%")), 4);
});
