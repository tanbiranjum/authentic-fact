const express = require("express")
const authController = require("../controller/authController")
const userController = require('../controller/userController')

const router = express.Router()

router.post('/signup', authController.signUp)
router.get('/signinweb3', authController.signInWeb3)
router.post('/login', authController.login)
router.get('/logout', authController.logout)
router.get('/isLoggedIn', authController.isLoggedIn)

router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword)

router.patch('/updatePassword', authController.updatePassword)
router.patch('/updateUser', userController.updateUser)

router.route('/:id').get(userController.getUser)
module.exports = router