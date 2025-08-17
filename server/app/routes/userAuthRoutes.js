
const express=require('express')
const UserAuthController = require('../controller/UsersAuthController')
const { AuthCheck } = require('../middleware/auth')
const userImageUpload=require('../helper/userImageUpload')
const router=express.Router()



router.post('/register',userImageUpload.single('profilePic'),UserAuthController.register)
router.post('/verify/email',UserAuthController.verifyEmail)
router.post('/resend/otp',UserAuthController.resendOtp)
router.post('/login',UserAuthController.login)


//update password loggedin user
router.put('/update-password',AuthCheck,UserAuthController.changePassword)
//forgot password
router.post('/forget-password-link',UserAuthController.forgetPasswordLink);
router.put('/reset-password/:id/:token',UserAuthController.resetPassword);
// router.get('/dashboard',AuthController.dashboard)
// router.post('/update/password',AuthController.updatePassword)

router.get('/profile/:userId',AuthCheck ,UserAuthController.getProfile)
router.put('/profile/:userId/update/', AuthCheck , userImageUpload.single('profilePic') ,UserAuthController.profileUpdate)


module.exports=router