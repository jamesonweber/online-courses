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

A Semigroup is an algebraic structure that has a set and a binary operation that takes two elements in the set and returns a Semigroup that has an associative operation.

const sum = x => ({
    x,
    concat: other =>
        sum(x + other.x)
})

sum(3).concat(sum(5)) // sum(8)

See semigroupsAndMonoids.js for more definitions

#### Monoid
A monoid is a semigroup with an identity.

An identity is the base element `i` of a semigroup `s` such that when applied to any other element `x` of `s`; `i`.concat(`s(x)`) == `s(x)`.

const product = x => ({
    x,
    concat: other => product(x * other.x)
});
product.empty = () => product(1);

If we wanted to do the entity for sum...
sum.empty = () => sum(0);

##### Intersection
Intersection is a semigroup since we can create concat for it, but it is not a monoid since we cannot create an empty (identity) for it. For example if we applied the empty set to another set, it would result in the empty set.

### Functors
Functors are generic types which map from on category to another
