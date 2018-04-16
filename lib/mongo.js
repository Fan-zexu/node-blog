const config = require('config-lite')(__dirname)
const Mongolass = require('mongolass')
const mongolass = new Mongolass()

const User = mongolass.model('User', {
	name: {type: 'String'},
	age: {type: 'Number'}
})

// User
// 	.insertOne({name: 'xx', age: 'www'})
// 	.exec()
// 	.then(console.log)
// 	.catch(function (e) {
//     console.error(e)
//     console.error(e.stack)
//   })

mongolass.connect(config.mongodb)