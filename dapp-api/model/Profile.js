const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
    },
    avatar: {
      type: String,
      default: 'avatar.png'
    },
    bio: {
      type: String,
      default: 'Bio',
    },
    education: [
      {
        school: {
          type: String,
        },
        university: {
          type: String,
        },
        degree: {
          type: String,
        },
      },
    ],
    status: {
      type: String,
      default: 'single',
    },
    city: {
      type: String,
      required: true,
    },
  },
  {
    //Each time the data is outputted as JSON/Object then virtuals will be true
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Profile = mongoose.model('Profile', userProfileSchema);

module.exports = Profile;