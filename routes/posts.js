const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

// GET /posts 文章页
// 	/posts?auth=xxx
router.get('/', function (req, res, next) {
	res.send('主页')
})

// POST /posts/create 发表文章，权限
router.post('/create', checkLogin, function (req, res, next) {
	res.send('发表文章')
})

// GET /posts/create 发表文章页
router.get('/create', checkLogin, function (req, res, next) {
	res.send('发表文章页')
})

// GET /posts/:postId 文章详情页
router.get('/:postId', function (req, res, next) {
	res.send('文章详情页')
})

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, function (req, res, next) {
	res.send('更新文章页')
})

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, function (req, res, next) {
	res.send('更新文档')
})

// GET /posts/:postId/remove 删除文章
router.get('/:postId/remove', checkLogin, function (req, res, next) {
	res.send('删除文章')
})

module.exports = router