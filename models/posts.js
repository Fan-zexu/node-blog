const marked = require('marked')
const Post = require('../lib/mongo').Post

// 将 post 的 content 从 markdown 转换成 html
// contentToHtml注册在PostModel上，只针对PostModel有效
Post.plugin('contentToHtml', {
  afterFind (posts) {
    posts.forEach((post) => post.content = marked(post.content))
    return posts
  },
  afterFindOne (post) {
    if (post) {
      post.content = marked(post.content)
    }
    return post
  }
})

module.exports = {
  // 创建一篇文章
  create: function (post) {
    return Post.create(post).exec()
  },
  // 通过文章id，获取一篇文章
  getPostById (postId) {
    return Post
      .findOne({ _id: postId })
      .populate({ path: 'author', model: 'User' })
      .addCreatedAt()
      .contentToHtml()
      .exec()
  },
  // 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
  getPosts (author) {
    const query = {}
    if (author) {
      query.author = author
    }
    return Post
      .find(query)
      .populate({ path: 'author', model: 'User' })
      .sort({ _id: -1 })
      .addCreatedAt()
      .contentToHtml()
      .exec()
  },
  // 通过文章 id 给 pv 加 1
  incPv (postId) {
    return Post
      .update({ _id: postId }, { $inc: { pv: 1 } })
      .exec()
  },
  // 通过文章 id 获取一篇原生文章（编辑文章）
  getRawPostById (postId) {
    return Post
      .findOne({ _id: postId })
      .populate({ path: 'author', model: 'User' })
      .exec()
  },
}