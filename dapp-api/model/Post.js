const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Post must belong to a user'],
    unique: false,
  },
  post: {
    type: String,
    required: true,
  },
  media: {
    type: String,
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  sharerName: {
    type: String,
  },
  sharedBy: [
    {
      sharerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      date: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  shareAccess: {
    type: Boolean,
    default: true,
  },
  totalPoint: {
    type: Number,
    default: 0,
  },
  totalRating: {
    type: Number,
    default: 0,
  },
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post
