# Semigroups and monoids

### Semigroups

#### Closed
A function is closed when the return type is the same as the input(s) type.

1 + 2 + 6 is closed because this will always return an integer:
(1 + 2) + 6
1 + (2 + 6)

10 / 4 / 2 is not closed since a decimal can be returned depending on the order of operations:
(10 / 4) / 2

#### Associative
A function is associative when the order of operations does not matter for the result. The result is always the same.

1 + 2 + 6 is associative

10 / 4 / 2 is not associative:
(10 / 4) / 2 != 10 / (4 / 2)

Note: when a function is closed and associative, it is parallel (IE it can be broken down and evaluated in parallel).

#### Creating semigroup data

const sum = x => ({
    x,
    concat: other =>
        sum(x + other.x)
})

sum(3).concat(sum(5)) // sum(8)

const product = x => ({
    x,
    concat: other =>
        product(x * other.x)
})

product(3).concat(product(5)) // product(15)

const any = x => ({
    x,
    concat: other =>
        any(x || other.x)
})

any(false).concat(any(true)) // any(true)
