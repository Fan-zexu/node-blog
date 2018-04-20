const marked = require('marked')
const Comment = require('../lib/mongo').Comment

Comment.plugin('contentToHtml', {
  afterFindOne (comments) {
    return comments.map(function (comment) {
      comment.content = marked(comment.content)
      return comment
    })
  }
})

module.exports = {
  // 创建一个留言
  create (comment) {
    return Comment.create(comment).exec()
  },
  // 根据文章id，创建时间升序获取留言列表
  getComments (postId) {
    return Comment
      .find({ postId })
      .populate({ path: 'author', model: 'User' })
      .sort({ _id: 1 })
      .addCreatedAt()
      .contentToHtml()
      .exec()
  },
  // 根据留言id，获取留言
  getCommentById (commentId) {
    return Comment
      .findOne({ _id: commentId })
      .addCreatedAt()
      .contentToHtml()
      .exec()
  },
  // 根据留言id，删除留言
  delCommentById (commentId) {
    return Comment
      .deleteOne({ _id: commentId })
      .exec()
  },
  // 根据文章id，删除所有留言
  delCommentsByPostId (postId) {
    return Comment
      .deleteMany({ postId })
      .exec()
  },
  // 根据文章id，获取该文章下的留言数量
  getCommentsCount (postId) {
    return Comment.count({ postId }).exec()
  }
}