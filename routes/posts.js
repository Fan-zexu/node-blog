const express = require('express')
const router = express.Router()

const PostModel = require('../models/posts')
const checkLogin = require('../middlewares/check').checkLogin

// GET /posts 文章页
// 	/posts?auth=xxx
router.get('/', function (req, res, next) {
	const { author } = req.query
	PostModel.getPosts(author)
		.then((posts) => {
			res.render('posts', {
				posts
			})
		})
		.catch(next)
})

// POST /posts/create 发表文章，权限
router.post('/create', checkLogin, function (req, res, next) {
	const author = req.session.user._id
	const { title, content } = req.fields
	
	// 校验参数
	try {
    if (!title.length) {
      throw new Error('请填写标题')
    }
    if (!content.length) {
      throw new Error('请填写内容')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
	}

	let post = { author, title, content }

	PostModel.create(post)
		.then((result) => {
			// 此 post 是插入 mongodb 后的值，包含 _id
			post = result.ops[0]
			req.flash('success', '发布成功')
			// 发表成功后跳转到该文章页
			return res.redirect(`/posts/${post._id}`)
		})
		.catch(next)
})

// GET /posts/create 发表文章页
router.get('/create', checkLogin, function (req, res, next) {
	res.render('create')
})

// GET /posts/:postId 文章详情页
router.get('/:postId', function (req, res, next) {
	const { postId } = req.params
	Promise.all([
		PostModel.getPostById(postId), // 获取文章详情
		PostModel.incPv(postId) // pv + 1
	])
		.then((result) => {
			const post = result[0]
			if (!post) {
				throw new Error('该文章不存在')
			}
			res.render('post', {
				post
			})
		})
		.catch(next)
})

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, function (req, res, next) {
	const { postId } = req.params
	const author = req.session.user._id // 判断用户权限

	PostModel.getRawPostById(postId)
		.then((post) => {
			console.log(typeof author) // string
			console.log(typeof post.author._id) // object
			if (!post) {
				throw new Error('该文章不存在')				
			}
			if (author.toString() !== post.author._id.toString()) { // 调用toString,统一数据类型
				throw new Error('没有权限')
			}
			res.render('edit', {
				post
			})
		})
})

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, function (req, res, next) {
	const { postId } = req.params
	const { title, content } = req.fields
	const author = req.session.user._id
	// 校验参数
  try {
    if (!title.length) {
      throw new Error('请填写标题')
    }
    if (!content.length) {
      throw new Error('请填写内容')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
	}
	PostModel.getRawPostById(postId)
		.then((post) => {
			if (!post) {
				throw new Error('文章不存在')
			}
			if (author.toString() !== post.author._id.toString()) {
				throw new Error('没有权限')
			}
			
			PostModel.updatePostById(postId, { title, content })
				.then(result => {
					req.flash('success', '编辑成功')
					// 跳转上一页
					res.redirect(`/posts/${postId}`)
				})
				.catch(next)
		})
})

// GET /posts/:postId/remove 删除文章
router.get('/:postId/remove', checkLogin, function (req, res, next) {
	const { postId } = req.params
	const author = req.session.user._id

	PostModel.getRawPostById(postId)
		.then((post) => {
			if (!post) {
				throw new Error('文章不存在')
			}
			if (author.toString() !== post.author._id.toString()) {
				throw new Error('没有权限')
			}
			
			PostModel.deletePostById(postId)
				.then(() => {
					req.flash('success', '删除成功')
					res.redirect('/posts')
				})
				.catch(next)
		})
})

module.exports = router