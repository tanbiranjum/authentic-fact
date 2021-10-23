const express = require('express')
const authController = require('../controller/authController')
const nftController = require('../controller/nftController')

const router = express.Router()

router.route('/').get(nftController.getAllNFT).post(nftController.createNFT)

router.route('/:id').get(nftController.getNFT)

router.route('/user/:id').get(nftController.getNftByUser)

module.exports = router
