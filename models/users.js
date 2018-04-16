const User = require('../lib/mongo').User

module.exports = {
	// 注册一个用户
	create: function (user) {
		User.create(user).exec()
	}
}