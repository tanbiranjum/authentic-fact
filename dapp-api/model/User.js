const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Enter your name'],
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'Please enter your email address'],
    trim: true,
  },
  publicAddress: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    trim: true,
    required: [true, 'A user must have a password'],
    maxlength: 15,
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password is not the same',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
    select: false,
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Friends',
    },
  ],
  nonce: {
    type: Number,
    default: Date.now()
  }
})

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema)

module.exports = User