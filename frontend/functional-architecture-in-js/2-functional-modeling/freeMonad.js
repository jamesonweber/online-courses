const {liftF} = require('../free')
const {Id} = require('../types')
const { taggedSum } = require('daggy')

const Http = taggedSum('Http', {Get: ['url'], Post: ['url', 'body']})

// Elevate get / post into a 'Free' monad
const httpGet = (url) => liftF(Http.Get(url))
const httpPost = (url, body) => liftF(Http.Post(url, body))

// Build an AST of functions to run
const app = () =>
  httpGet('/home')
  .chain(contents => httpPost('/analytics', contents))

// Interpreter that will run the AST
const interpret = x =>
  // cata is short for catamorphism (pattern matching on the type)
  // See https://wiki.haskell.org/Catamorphisms
  x.cata({
    Get: url => Id.of(`contents for ${url}`),
    Post: (url, body) => Id.of(`posted ${body} to ${url}`)
  })

const res = app().foldMap(interpret, Id.of)
console.log(res.extract())