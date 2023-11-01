const {toUpper, view, over, lensProp, compose} = require('ramda')

const L = {
  _0: lensProp(0),
  name: lensProp('name'),
  street: lensProp('street'),
  address: lensProp('address')
}

const users = [{address: {street: {name: 'Maple'}}}]

// Allows us to jump into a nested structure through composition of properties
let res = view(compose(L.address, L.street), users[0])
console.log(res)

// Allows us to modify a nested structure through composition of properties
// Also notice how the lense composes backwards. This is based on how they are created behind the scenes,
// so it looks like we are evaluating in a reverse order of what we would expect
const addrStreetName = compose(L._0, L.address, L.street, L.name)
res = over(addrStreetName, toUpper, users)
console.log(res[0])

// Notice how at the end we updated the property, but did it in an immutable way, creating a new object at the end
