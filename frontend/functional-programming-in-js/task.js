const { Task } = require('./types')
const fs = require('fs')
const { List, Map } = require('immutable-ext')

// Task is a lazy functor. Notice how it takes a function as input to it's constructor
const t1 = Task((rej, res) => res(2)) // Task(2)
    .map(two => two + 1)

// We can simplify this with 'of' to deal with that boiler plate when
// we are directly supplying a value
Task.of(2) // Task(2)
    .map(two => two + 1)


// We execute the task with fork. This is like fold, except we call it
// fork because it is running the Task (which would otherwise not run by itself).
// Ontop of that, with everything being lazy until we call fork, it makes our execution a data
// structure which won't be executed until we fork it.
t1.fork(console.error, console.log)

// Refactoring Node IO with Task
const appOld = () =>
  fs.readFile('config.json', 'utf-8', (err, contents) => {
    console.log(err, contents)
    if(err) throw err

    const newContents = contents.replace(/3/g, '6')

    fs.writeFile('config1.json', newContents, (err, _) => {
      if(err) throw err
      console.log('success!')
    })
  })

const readFile = (path, enc) => Task(
    (rej, res) => fs.readFile(path, enc, (err, contents) => err ? rej(err) : res(contents))
)

const writeFile = (path, contents) => Task(
    (rej, res) => fs.writeFile(path, contents, (err, contents) => err ? rej(err) : res(contents))
)

const app = () => 
    readFile('config.json', 'utf-8')
    .map(contents => contents.replace(/3/g, '6'))
    .chain(newContents => writeFile('config1.json', newContents))

app().fork(console.error, () => console.log('success!'))

// Transforming and monad patterns
const httpGet = (path, params) =>
  Task.of(`${path}: result`)

const getUser = x => httpGet('/user', {id: x})
const getTimeline = x => httpGet(`/timeline/${x}`, {})
const getAds = () => httpGet('/ads', {})

// This will produce [Promise, Promise, Promise]
[getUser, getTimeline, getAds].map(f => f())

// But we want Promise([])
// We can use Traverse to accomplish this transformation.
// This is very similar to Promise.All
List([getUser, getTimeline, getAds])
    .traverse(Task.of, f => f())
    .fork(console.error, console.log(x.toJS()))


// Additionally we can do this with either
const greaterThan5 = x =>
    x.length > 5 ? Right(x) : Left('not greater than 5')
  
const looksLikeEmail = x =>
    x.match(/@/ig) ? Right(x) : Left('not an email')

const email = "blahh@yadda.com"
// Produces [Either, Either, Either]
let res = [greaterThan5, looksLikeEmail].map(v => v(email))
console.log(res)

res = List([greaterThan5, looksLikeEmail]).traverse(Either.of, v => v(email))
res.fold(console.error, x => console.log(x.toJS()))




// We can also do a natural transformation, which is a principled type transformation

// nt(a.map(f)) == nt(a).map(f)
const eitherToTask = e =>
  e.fold(Task.rejected, Task.of)

const fake = id =>
  ({id: id, name: 'user1', best_friend_id: id + 1})

const Db = ({
  find: id =>
    new Task((rej, res) =>
      setTimeout(() =>
        res(id > 2 ? Right(fake(id)) : Left('not found')),
        100))
})

const send = (code, json) =>
  console.log(`sending ${code}: ${JSON.stringify(json)}`)

Db.find(1) // Task(Either(user))
.chain(eu =>
  eu.fold(e => Task.of(eu),
          u => Db.find(u.best_friend_id)))
.fork(error => send(500, {error}),
      eu => eu.fold(error => send(404, {error}),
                    x => send(200, x)))

// can be 
Db.find(1) // Task(Either(user))
.chain(eitherToTask) // Task(user)
.chain(u => Db.find(u.best_friend_id)) // Task(Either(user))
.chain(eitherToTask) // Task(user)
.fork(error => send(500, {error}), x => send(200, x))
// However, through normalizing, we will loose the 404. This is a trade off with the natural transformation