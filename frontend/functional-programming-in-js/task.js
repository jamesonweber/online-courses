const { Task } = require('./types')

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
const fs = require('fs')

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