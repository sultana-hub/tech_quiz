
const express=require('express')
const UserAuthController = require('../controller/UsersAuthController')
const { AuthCheck } = require('../middleware/auth')
const userImageUpload=require('../helper/userImageUpload')
const router=express.Router()



router.post('/register',userImageUpload.single('profilePic'),UserAuthController.register)
router.post('/verify/email',UserAuthController.verifyEmail)
router.post('/resend/otp',UserAuthController.resendOtp)
router.post('/login',UserAuthController.login)

// router.post('/reset-password-link',AuthController.resetPasswordLink);
// router.post('/reset-password/:id/:token',AuthController.resetPassword);
// router.get('/dashboard',AuthController.dashboard)
// router.post('/update/password',AuthController.updatePassword)

router.get('/profile/:userId',AuthCheck ,UserAuthController.getProfile)
router.put('/profile/:userId/update/', AuthCheck , userImageUpload.single('profilePic') ,UserAuthController.profileUpdate)


module.exports=router