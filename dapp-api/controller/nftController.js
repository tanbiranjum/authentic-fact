const NFT = require('../model/NFT')
const User = require('../model/User')

exports.createNFT = async (req, res, next) => {
  const nft = await NFT.create({
    userId: req.body.userId,
    postId: req.body.postId,
    nftId: req.body.nftId,
    uri: req.body.uri,
  })
  res.status(200).json({
    status: 'success',
    nft,
  })
}

exports.getNftByUser = async (req, res, next) => {
  const nft = await NFT.find({
    userId: req.params.id,
  }).populate('postId')

  res.status(200).json({
    status: 'success',
    nft,
  })
}

exports.getAllNFT = async (req, res, next) => {
  const nft = await NFT.find()

  res.status(200).json({
    status: 'success',
    nft,
  })
}

exports.getNFT = async (req, res, next) => {
  const nft = await NFT.findOne({
    postId: req.params.id,
  })
  if (nft) {
    res.status(200).json({
      status: 'success',
      nft,
    })
  }
}

exports.deleteNft = async (req, res, next) => {
  const doc = await NFT.findByIdAndDelete(req.params.id)
  if (!doc) {
    return next('No document found with that ID')
  }

  res.status(204).json({
    status: 'success',
    data: null,
  })
}
