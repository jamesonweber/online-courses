// https://codepen.io/drboolean/pen/qeqpgB?editors=0010

// Definitions
const Endo = run =>
({
    run,
    concat: other => Endo(x => other.run(run(x)))
})

Endo.empty = () => Endo(x => x)


// Ex1: 
// =========================

const classToClassName = html =>
    html.replace(/class\=/ig, 'className=')

const updateStyleTag = html =>
    html.replace(/style="(.*)"/ig, 'style={{$1}}')

const htmlFor = html =>
    html.replace(/for=/ig, 'htmlFor=')



const ex1 = html =>
	// htmlFor(updateStyleTag(classToClassName(html))) //rewrite using Endo
    // Same as List([htmlFor, updateStyleTag, classToClassName]).foldMap(Endo, Endo.empty()).run(html)
	[htmlFor, updateStyleTag, classToClassName]
		.reduce((acc, x) => acc.concat(Endo(x)), Endo.empty())
		.run(html)

QUnit.test("Ex1", assert => {
	const template = `
		<div class="awesome" style="border: 1px solid red">
			<label for="name">Enter your name: </label>
			<input type="text" id="name" />
		</div>
	`
	const expected = `
		<div className="awesome" style={{border: 1px solid red}}>
			<label htmlFor="name">Enter your name: </label>
			<input type="text" id="name" />
		</div>
	`

	assert.deepEqual(expected, ex1(template))
})



// Ex2: model a predicate function :: a -> Bool and give it contramap() and concat(). i.e. make the test work
// =========================
const Pred = run => // undefined; // todo
	  ({
		  run,
		  contramap: f => Pred(x => run(f(x))),
		  concat: other => Pred(x => run(x) && other.run(x))
	  })

QUnit.test("Ex2: pred", assert => {
	const p = Pred(x => x > 4).contramap(x => x.length).concat(Pred(x => x.startsWith('s')))
	const result = ['scary', 'sally', 'sipped', 'the', 'soup'].filter(p.run)
	assert.deepEqual(result, ["scary", "sally", 'sipped'])
})


// Ex3: 
// =========================
const extension = file => file.name.split('.')[1]

const matchesAny = regex => str =>
    str.match(new RegExp(regex, 'ig'))

const matchesAnyP = pattern => Pred(matchesAny(pattern)) // Pred(str => Bool)

// TODO: rewrite using matchesAnyP. Take advantage of contramap and concat
const ex3 = file =>
	// matchesAny('txt|md')(extension(file)) && matchesAny('functional')(file.contents)
	matchesAnyP('txt|md').contramap(extension)
		.concat(matchesAnyP('functional').contramap(f => f.contents))
		.run(file)


QUnit.test("Ex3", assert => {
	const files = [
		{name: 'blah.dll', contents: '2|38lx8d7ap1,3rjasd8uwenDzvlxcvkc'},
		{name: 'intro.txt', contents: 'Welcome to the functional programming class'},
		{name: 'lesson.md', contents: 'We will learn about monoids!'},
		{name: 'outro.txt', contents: 'Functional programming is a passing fad which you can safely ignore'}
	]

	assert.deepEqual([files[1], files[3]], files.filter(ex3))
})
