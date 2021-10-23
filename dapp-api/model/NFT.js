const mongoose = require('mongoose')

const schema = mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    nftId: {
        type: Number,
    },
    uri: String,
    status: {
        type: Boolean,
        default: false
    }
})

const NFT = mongoose.model('NFT', schema)

module.exports = NFT