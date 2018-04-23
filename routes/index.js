module.exports = function (app) {
	app.get('/', (req, res) => {
		res.redirect('/posts')
	})
	app.use('/signup', require('./signup'))
	app.use('/signin', require('./signin'))
	app.use('/signout', require('./signout'))
	app.use('/posts', require('./posts'))	
	app.use('/comments', require('./comments'))
	// 404
	app.use((req, res) => {
		if (!res.headersSent) { // 一个表示HTTP头信息是否已发送的布尔值。
			res.status(404).render('404')
		}
	})
}