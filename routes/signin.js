const express = require('express')
const sha1 = require('sha1')
const router = express.Router()
const UserModel = require('../models/users')

const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signin 登录页
router.get('/', checkNotLogin, function (req, res, next) {
	res.render('signin')
})

// POST /signin 用户登录
router.post('/', checkNotLogin, function (req, res, next) {
	// 获取用户名，密码
	const {name, password} = req.fields
	// 校验
	try {
		if (!name.length) {
			throw new Error('请填写用户名')
		}
		if (!password.length) {
			throw new Error('请填写密码')
		}
	} catch (e) {
		req.flash('error', e.message)
		return res.redirect('back')
	}

	UserModel.getUserByName(name)
		.then((user) => {
			// 检查用户是否存在
			if (!user) {
				req.flash('error', '用户不存在')
				return res.redirect('back')
			}
			// 检查密码是否匹配
			if (sha1(password) !== user.password) {
				req.flash('error', '密码错误')
				return res.redirect('back')
			}
			req.flash('success', '登陆成功')
			// 写入session.user，删除密码等敏感信息
			delete user.password
			req.session.user = user
			// 跳转主页
			return res.redirect('/posts')
		})
		.catch(next)
})

module.exports = router