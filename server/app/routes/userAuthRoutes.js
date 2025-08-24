
const express = require('express')
const UserAuthController = require('../controller/UsersAuthController')
const { AuthCheck } = require('../middleware/auth')
const userImageUpload = require('../helper/userImageUpload')
const router = express.Router()




/**
 * @openapi
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     description: This endpoint allows you to register a new user with a profile picture.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - email
 *               - password
 *               - profilePic
 *             properties:
 *               userName:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *               profilePic:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/register', userImageUpload.single('profilePic'), UserAuthController.register)


/**
 * @openapi
 * /api/user/verify/email:
 *   post:
 *     summary: Verify user email with OTP
 *     description: Confirms a user's email using the OTP sent to them.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid OTP
 *       500:
 *         description: Server error
 */
router.post('/verify/email', UserAuthController.verifyEmail)
router.post('/resend/otp', UserAuthController.resendOtp)



/**
 * @openapi
 * /api/user/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns a JWT token.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login successful (JWT returned)
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */

router.post('/login', UserAuthController.login)

// /**
//  * @openapi
//  * /api/user/update-password:
//  *   put:
//  *     summary: Change password (logged-in user)
//  *     description: Allows a logged-in user to update their password using JWT authentication.
//  *     tags:
//  *       - Users
//  *     security:
//  *       - xAccessToken: {}   # custom header auth
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - oldPassword
//  *               - newPassword
//  *             properties:
//  *               oldPassword:
//  *                 type: string
//  *                 example: oldpass123
//  *               newPassword:
//  *                 type: string
//  *                 example: newpass123
//  *     responses:
//  *       200:
//  *         description: Password updated successfully
//  *       400:
//  *         description: Invalid request
//  *       401:
//  *         description: Unauthorized (missing or invalid token)
//  *       500:
//  *         description: Server error
//  */

//update password loggedin user
router.put('/update-password', AuthCheck, UserAuthController.changePassword)

//forgot password
router.post('/forget-password-link', UserAuthController.forgetPasswordLink);
router.put('/reset-password/:id/:token', UserAuthController.resetPassword);

/**
 * @swagger
 * /api/user/profile/{userId}:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile fetched
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

router.get('/profile/:userId', AuthCheck, UserAuthController.getProfile)

/**
 * @swagger
 * /api/user/profile/{userId}/update:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 example: John Updated
 *               profilePic:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.put('/profile/:userId/update/', AuthCheck, userImageUpload.single('profilePic'), UserAuthController.profileUpdate)


module.exports = router