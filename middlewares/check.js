/* 
	当我们操作成功时需要显示一个成功的通知，如登录成功跳转到主页时，需要显示一个 登陆成功 的通知；当我们操作失败时需要显示一个失败的通知，如注册时用户名被占用了，需要显示一个 用户名已占用 的通知。通知只显示一次，刷新后消失，我们可以通过 connect-flash 中间件实现这个功能。
	connect-flash 是基于 session 实现的，它的原理很简单：设置初始值 req.session.flash={}，通过 req.flash(name, value) 设置这个对象下的字段和值，通过 req.flash(name) 获取这个对象下的值，同时删除这个字段，实现了只显示一次刷新后消失的功能
*/
module.exports = {
	checkLogin (req, res, next) {
		if (!req.session.user) {
			req.flash('error', '未登录')
			return res.redirect('/signin')
		}
		next()
	},
	checkNotLogin (req, res, next) {
		if (req.session.user) {
			req.flash('error', '已登录')
			return res.redirect('back')
		}
		next()
	}
}