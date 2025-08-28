const httpStatusCode = require("../helper/httpStatusCode");
const sendEmailVerificationOTP = require("../helper/sendOtpVerify");
const { hashedPassword, comparePassword } = require("../middleware/auth");
const { UserModel, userValidation, loginValidation } = require("../model/user");
const jwt = require('jsonwebtoken')
const transporter = require('../config/EmailConfig')
const OtpModel = require('../model/otpModel')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose');
const logger=require('../helper/logger')
class UsersAuthController {

    //for register
    async register(req, res) {
        try {
            const { userName, email, password } = req.body;

            const userData = {
                userName, // match with Joi schema (change if needed)
                email,
                password,
                profilePic: req.file ? req.file.path : null
            };

            // Validate user input
            const { error } = userValidation.validate(userData);
            if (error) {
                logger.error("error occured", error);
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: error.message
                });
            }

            // Check for duplicate email
            // const isExistingUser = await UserModel.findOne({ email });
            const userWithEmail = await UserModel.aggregate([
                {
                    $match: {
                        email: req.body.email
                    }
                },
                {
                    $limit: 1
                }
            ])
            const isExistingUser = userWithEmail[0]
            if (isExistingUser) {
                return res.status(httpStatusCode.Conflict).json({
                    status: false,
                    message: "Email already exists"
                });
            }

            // Hash the password (assuming async function)
            const hashed = await hashedPassword(password);

            // Create and save user
            const user = new UserModel({
                userName,
                email,
                password: hashed,
                profilePic: userData.profilePic
            });

            const data = await user.save();

            // Send email verification (if async)
            await sendEmailVerificationOTP(req, user);

            return res.status(httpStatusCode.Create).json({
                status: true,
                message: "User created successfully. OTP sent to your email.",
                data
            });

        } catch (error) {
            logger.error("error occured", error);
            console.log('Register Error:', error);
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: error.message
            });
        }
    }



    async verifyEmail(req, res) {
        try {
            const { email, otp } = req.body;

            if (!email || !otp) {
                return res.status(400).json({ status: false, message: "All fields are required" });
            }

            // Use aggregation to fetch the user (returns array)
            const userWithEmail = await UserModel.aggregate([
                { $match: { email } },
                { $limit: 1 }
            ]);

            const user = userWithEmail[0];

            if (!user) {
                return res.status(404).json({ status: false, message: "Email doesn't exist" });
            }

            if (user.isVerified) {
                return res.status(400).json({ status: false, message: "Email is already verified" });
            }

            const emailVerification = await OtpModel.findOne({ userId: user._id, otp });

            if (!emailVerification) {
                // Optionally resend OTP if not verified
                if (!user.isVerified) {
                    await sendEmailVerificationOTP(req, user);
                    return res.status(400).json({ status: false, message: "Invalid OTP, new OTP sent to your email" });
                }
                return res.status(400).json({ status: false, message: "Invalid OTP" });
            }

            const expirationTime = new Date(emailVerification.createdAt.getTime() + 15 * 60 * 1000);
            if (new Date() > expirationTime) {
                await sendEmailVerificationOTP(req, user);
                return res.status(400).json({ status: false, message: "OTP expired, new OTP sent to your email" });
            }

            //  Use updateOne to set isVerified true
            await UserModel.updateOne(
                { _id: user._id },
                { $set: { isVerified: true } }
            );

            //  Delete OTP entries for this user
            await OtpModel.deleteMany({ userId: user._id });

            return res.status(200).json({ status: true, message: "Email verified successfully" });

        } catch (error) {
            logger.error("error occured", error);
            console.error(error);
            return res.status(500).json({ status: false, message: "Unable to verify email, please try again later" });
        }
    }


    //resend otp 
    async resendOtp(req, res) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    status: false,
                    message: "Email is required",
                });
            }

            const user = await UserModel.findOne({ email });

            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: "User not found with this email",
                });
            }

            if (user.isVerified) {
                return res.status(400).json({
                    status: false,
                    message: "Email is already verified",
                });
            }

            // Optional: Remove existing OTPs for the user
            await OtpModel.deleteMany({ userId: user._id });

            // Send new OTP
            await sendEmailVerificationOTP(req, user);

            return res.status(200).json({
                status: true,
                message: "New OTP sent to your email successfully",
            });

        } catch (error) {
            logger.error("error occured", error);
            console.error("Resend OTP error:", error);
            return res.status(500).json({
                status: false,
                message: "Unable to resend OTP. Please try again later.",
            });
        }

    }


    //login
    async login(req, res) {
        try {
            const { email, password } = req.body

            const loginData = { email, password }

            const { error } = loginValidation.validate(loginData)

            if (error) {
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: error.message
                });
            }
            // const user = await UserModel.findOne({ email })
            const userWithEmail = await UserModel.aggregate([
                {
                    $match: { email: req.body.email }
                },
                {
                    $limit: 1 // optional but improves performance
                }
            ]);
            const user = userWithEmail[0];

            if (!user) {
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: "user not found"
                })
            }
            // Check if user verified
            if (!user.isVerified) {
                return res.status(401).json({ status: false, message: "Your account is not verified" });
            }
            const ismatch = comparePassword(password, user.password)
            if (!ismatch) {
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: "invalid password"
                })
            }
            const token = jwt.sign({
                _id: user._id,
                userName: user.userName,
                email: user.email
            }, process.env.JWT_SECRET_KEY, { expiresIn: "2h" })

            return res.status(httpStatusCode.Ok).json({
                status: true,
                message: "user login successfully",
                user: {
                    _id: user._id,
                    userName: user.userName,
                    email: user.email
                },
                token: token
            })


        } catch (error) {
            logger.error("error occured", error);
            console.log(error);

        }
    }


    //dashboard
    async dashboard(req, res) {
        try {
            return res.status(httpStatusCode.Ok).json({
                status: true,
                message: "Welcome to user dashboard",
                data: req.user
            })

        } catch (error) {
            logger.error("error occured", error);
            console.log(error);

        }
    }

    //profile
    async getProfile(req, res) {
        try {
            const userId = req.params.userId
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid user ID"
                });
            }
            const user = await UserModel.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(userId)
                    }
                },
                {
                    $limit: 1
                },
                {
                    $project: {
                        password: 0 // hide password field
                    }
                }
            ]);

            if (!user.length) {
                return res.status(httpStatusCode.NotFound).json({
                    status: false,
                    message: "User not found"
                });
            }

            return res.status(httpStatusCode.Ok).json({
                status: true,
                message: "Welcome to user profile",
                data: user[0]
            });

        } catch (error) {
            logger.error("error occured", error);
            console.error("Get Profile Error:", error);
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: "Failed to fetch profile"
            });
        }
    }



    async profileUpdate(req, res) {
        try {
            const userId = req.params.userId;

            const updatePayload = {
                userName: req.body.userName,
                email: req.body.email,
                profilePic: req.file ? req.file.path : undefined
            };

            // Validating with Joi
            const { error, value } = userValidation.validate(updatePayload);
            if (error) {
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: error.message
                });
            }

            // Cleaning undefined fields
            const updateFields = {};
            if (value.userName) updateFields.userName = value.userName;
            if (value.email) updateFields.email = value.email;
            if (value.profilePic) updateFields.profilePic = value.profilePic;

            // Checking if email is being updated and already exists
            if (updateFields.email) {
                const existing = await UserModel.aggregate([
                    { $match: { email: updateFields.email, _id: { $ne: new mongoose.Types.ObjectId(userId) } } },
                    { $limit: 1 }
                ]);
                if (existing.length > 0) {
                    return res.status(httpStatusCode.Conflict).json({
                        status: false,
                        message: "Email already in use by another account"
                    });
                }
            }

            // Applying update
            await UserModel.updateOne(
                { _id: new mongoose.Types.ObjectId(userId) },
                { $set: updateFields }
            );

            // Get updated user (without password)
            const updatedUser = await UserModel.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(userId) } },
                { $project: { password: 0 } }
            ]);

            return res.status(httpStatusCode.Ok).json({
                status: true,
                message: "Profile updated successfully",
                data: updatedUser[0]
            });

        } catch (error) {
            logger.error("error occured", error);
            console.error("Profile Update Error:", error);
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: "Something went wrong while updating profile"
            });
        }
    }






    /**update password  not using this*/
    async updatePassword(req, res) {
        try {
            const user_id = req.body.user_id;
            const { password } = req.body;
            if (!password) {
                return res.status(400).json({
                    message: 'Password is required'
                });
            }
            const userdata = await UserModel.findOne({ _id: user_id });
            if (userdata) {
                const newPassword = await hashedPassword(password);
                const updateuser = await UserModel.findOneAndUpdate({ _id: user_id },
                    {
                        $set: {
                            password: newPassword
                        }
                    });
                res.status(200).json({
                    message: 'Password updated successfully',

                });
            } else {
                res.status(400).json({
                    message: 'password not updated'
                });
            }

        } catch (err) {
            logger.error("error occured", err);
            console.log(err);
        }
    }


    //reset password link

    async forgetPasswordLink(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ status: false, message: "Email field is required" });
            }
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(200).json({ success: true, message: "Password reset email sent (if account exists)" });
            }
            // Generate token for password reset
            const secret = user._id + process.env.WT_SECRET_KEY;
            const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '20m' });
            // Reset Link and this link generate by frontend developer
            const resetLink = `${process.env.FRONTEND_HOST}/reset-password/${user._id}/${token}`;
            //console.log(resetLink);
            // Send password reset email  
            await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: user.email,
                subject: "Password Reset Link",
                html: `
                       <p>Hello ${user.userName},</p>
                       <p>Please <a href="${resetLink}">click here</a> to reset your password.</p>
                       <p>Or copy and paste this link in your browser:</p>
                       <p><a href="${resetLink}">${resetLink}</a></p>
                    `

            });
            // Send success response
            res.status(200).json({ status: true, message: "Password reset email sent. Please check your email." });

        } catch (error) {
            logger.error("error occured", error);
            console.log(error);
            res.status(500).json({ status: false, message: "Unable to send password reset email. Please try again later." });

        }
    }

    //reset password

    async resetPassword(req, res) {

        try {
            const { password, confirm_password } = req.body;
            const { id, token } = req.params;
            const user = await UserModel.findById(id);
            if (!user) {
                return res.status(404).json({ status: false, message: "User not found" });
            }
            // Validate token check 
            const new_secret = user._id + process.env.WT_SECRET_KEY;
            jwt.verify(token, new_secret);

            if (!password || !confirm_password) {
                return res.status(400).json({ status: false, message: "New Password and Confirm New Password are required" });
            }

            if (password !== confirm_password) {
                return res.status(400).json({ status: false, message: "New Password and Confirm New Password don't match" });
            }
            // Generate salt and hash new password
            const salt = await bcrypt.genSalt(10);
            const newHashPassword = await bcrypt.hash(password, salt);

            // Update user's password
            await UserModel.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } });

            // Send success response
            res.status(200).json({ status: true, message: "Password reset successfully" });

        } catch (error) {
            return res.status(500).json({ status: false, message: "Unable to reset password. Please try again later." });
        }
    }


    // Change password when logged in
    async changePassword(req, res) {
        try {
            const userId = req.user._id; // comes from auth middleware (JWT in headers)
            const { currentPassword, newPassword, confirmPassword } = req.body;

            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ status: false, message: "User not found" });
            }

            // verify current password
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ status: false, message: "Current password is incorrect" });
            }

            // confirm match
            if (newPassword !== confirmPassword) {
                return res.status(400).json({ status: false, message: "Passwords do not match" });
            }

            // hash and save
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            await user.save();

            res.status(200).json({ status: true, message: "Password updated successfully" });
        } catch (err) {
            logger.error("error occured", error);
            console.error("Change password error:", err.message);
            res.status(500).json({ status: false, message: "Something went wrong" });
        }
    }


}


module.exports = new UsersAuthController()