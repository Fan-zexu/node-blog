const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

// GET /signout 登出
router.get('/', checkLogin, function (req, res, next) {
  // 清空 session.user
  req.session.user = null
  // 写入flash
  req.flash('success', '登出成功')
  // 跳转主页
  res.redirect('/posts')
})

module.exports = router