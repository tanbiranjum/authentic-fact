const express = require("express")
const authController = require("../controller/authController")
const postController = require('../controller/postController')

const router = express.Router()

router.route('/')
.get(postController.getAllPosts)
.post(postController.createPost)

router.route('/:id')
.get(postController.getPost)
.post(postController.sharePost)
.patch(postController.rate)

module.exports = router