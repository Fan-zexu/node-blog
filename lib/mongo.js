const config = require('config-lite')(__dirname)
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
const Mongolass = require('mongolass')
const mongolass = new Mongolass()
mongolass.connect(config.mongodb)

exports.User = mongolass.model('User', {
	name: {type: 'string', required: true},
	password: {type: 'string', required: true},
	avatar: {type: 'string', required: true},
	bio: {type: 'string', required: true},
	gender: {type: 'string', enum: ['m', 'f', 'x'], default: 'x'}
})

exports.User.index({name: 1}, {unique: true}).exec() // 根据用户名找到用户，用户名全局唯一

// User
// 	.insertOne({name: 'xx', age: 'www'})
// 	.exec()
// 	.then(console.log)
// 	.catch(function (e) {
//     console.error(e)
//     console.error(e.stack)
//   })

// 根据 id 生成创建时间 created_at
// addCreatedAt注册在lib/mongo上，所以针对所有model都有效
mongolass.plugin('addCreatedAt', {
	afterFind: function (results) {
		results.forEach(item => {
			item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
		})
		return results
	},
	afterFindOne: function (result) {
		if (result) {
			result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm')
		}
		return result
	}
})
// 文章模型
exports.Post = mongolass.model('Post', {
	author: { type: Mongolass.Types.ObjectId, required: true },
	title: { type: 'string', required: true },
	content: { type: 'string', required: true },
	pv: { type: 'number', default: 0 }
})

exports.Post.index({ author: 1, _id: -1 }).exec() // 按创建时间降序查看用户的文章列表

// 留言模型
exports.Comment = mongolass.model('Comment', {
	author: { type: Mongolass.Types.ObjectId, require: true },
	content: { type: 'string', require: true },
	postId: { type: Mongolass.Types.ObjectId, require: true }
})

exports.Comment.index({ post: 1, _id: 1 }).exec() // 通过文章id 获取评论列表，按照评论时间升序排列 