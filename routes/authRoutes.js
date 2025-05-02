const express = require('express')
const router = express.Router()
const {
    registerUser,
    loginUser,
    resetPassword,
    forgotPassword,
    resetPasswordWithToken
} = require('../controllers/authController')



router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/resetPassword', resetPassword)
router.post('/forgotPassword', forgotPassword)
router.post('/resetPassword/:token', resetPasswordWithToken)

module.exports = router
