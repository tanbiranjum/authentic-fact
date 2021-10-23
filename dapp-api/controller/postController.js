const User = require('../model/User')
const Post = require('../model/Post')
const catchAsync = require('../util/catchAsync')
const AppError = require('../util/appError')
const mongoose = require('mongoose')

exports.createPost = catchAsync(async (req, res, next) => {
  const newPost = await Post.create({
    user: req.body.user,
    post: req.body.post,
    media: req.body.media,
  })

  res.status(201).json({
    status: 'success',
    data: {
      newPost,
    },
  })
})

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find().populate('user', 'name email').populate('sharedBy').sort({ date: -1 })

  res.status(200).json({
    status: 'success',
    data: {
      postsLength: posts.length,
      posts,
    },
  })
})

exports.getAllAuthenticPosts = catchAsync(async (req, res, next) => {})

exports.rate = async (req, res, next) => {
  const post = await Post.findById(req.params.id)
  post.totalPoint = post.totalPoint * 1 + req.body.totalPoint * 1
  post.totalRating++
  await post.save()
  res.status(200).json({
    status: 'success',
  })
}

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate('user')

  if (!post) {
    return next(new AppError('No post not found with specified id', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  })
})

exports.sharePost = catchAsync(async (req, res, next) => {
  const id = req.params.id
  console.log(req.body)
  const user = await User.findById(req.body.sharerId)
  const post = await Post.findById(id)
  post.sharedBy.push(req.body)
  await post.save()
  post._id = mongoose.Types.ObjectId()
  post.sharerName = user.name
  post.isNew = true
  await post.save()
  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  })
})

exports.updatePost = (req, res, next) => {}

exports.likePost = (req, res, next) => {}

exports.unlikePost = (req, res, next) => {}

exports.commentOnPost = (req, res, next) => {}

exports.deleteCommentOnPost = (req, res, next) => {}
