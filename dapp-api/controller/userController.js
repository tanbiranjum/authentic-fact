const User = require('../model/User')
const catchAsync = require('../util/catchAsync')

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return next(new AppError('No user exists with that ID', 404))
  }
  console.log(user)
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  })
})

exports.getAllUser = (req, res, next) => {}

exports.updateUser = (req, res, next) => {
}

exports.createUserProfile = (req, res, next) => {}

exports.getUserProfile = (req, res, next) => {}

exports.updateProfile = (req, res, next) => {}

exports.deactivateProfile = (req, res, next) => {}
