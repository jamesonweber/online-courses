const { Id, Task, TaskT, Either, EitherT, FnT } = require('../types')
const _ = require('lodash')

// functor composition allows us to combine functors.
const Compose = (F, G) => {
    const M = fg => ({
        extract: () => fg,
        map: f => M(fg.map(g => g.map(f)))
    })
    M.of = x => M(F.of(G.of(x)))
    return M
}

const TaskEitherCompose = Compose(Task, Either)

TaskEitherCompose.of(2)
.map(two => two * 10)
.map(twenty => twenty + 1)
.extract()
.fork(console.error, either => either.fold(console.error, console.log))

// Note, we can't write chain here since it would require us to come up with the composed functor (which might not be possible)

// Monad transformers
const TaskEither = TaskT(Either)

const users = [{id: 1, name: 'Brian'}, {id: 2, name: 'Marc'}, {id: 3, name: 'Odette'}]
const following = [{user_id: 1, follow_id: 3}, {user_id: 1, follow_id: 2}, {user_id: 2, follow_id: 1}]

const find = (table, query) =>
  TaskEither.lift(Either.fromNullable(_.find(table, query)))

// Notice how we can chain just on either here. We aren't worrying about the Task until the end.
// The monad transformer has removed the Task boiler plate until the end
const app = () =>
find(users, {id: 1}) // Task(Either(User))
.chain(u => find(following, {follow_id: u.id})) // Task(Either(User))
.chain(fo => find(users, {id: fo.user_id})) // Task(Either(User))
.fork(console.error, eu =>
eu.fold(console.error, console.log)
)

app()

// App :: Either(Fn(Task))
const EitherId = EitherT(Id)
const App = FnT(EitherId)

App
.of(2)
.chain(two => App.lift(EitherId.of(two + two)))
.chain(four => App.lift(EitherId.lift(Id.of(four)))) // App(Task(Either))
.map(four => four + 1)
.run()
.fold(console.error, fx => console.log(fx.extract()))
