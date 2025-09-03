const  transporter  = require("../config/EmailConfig")
const otpVerifyModel=require('../model/otpModel')

const sendEmailVerificationOTP=async(req, user)=>{
    // Generate a random 4-digit number
  const otp = Math.floor(1000 + Math.random() * 9000);

  // Save OTP in Database
  const gg=await new otpVerifyModel({ userId: user._id, otp: otp }).save();
  console.log('hh',gg);
  

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'doramypet4@gmail.com',
    to: user.email,
    subject: "OTP - Verify your account",
   html: `
    <div style="font-family: Arial, sans-serif; line-height:1.6; max-width:600px; margin:0 auto; padding:20px; border:1px solid #eaeaea; border-radius:10px; background-color:#ffffff;">
      <h2 style="text-align:center; color:#2c3e50;">🔐 Email Verification</h2>
      <p style="font-size:16px; color:#333;">
        Hello <strong>${user.userName}</strong>,
      </p>
      <p style="font-size:15px; color:#555;">
        Thank you for signing up. To complete your registration, please use the following One-Time Password (OTP) to verify your email address:
      </p>

      <div style="text-align:center; margin:30px 0;">
        <span style="display:inline-block; font-size:28px; letter-spacing:8px; font-weight:bold; color:#ffffff; background-color:#007bff; padding:12px 24px; border-radius:8px;">
          ${otp}
        </span>
      </div>

      <p style="font-size:15px; color:#555;">
        This OTP will expire in <strong>15 minutes</strong>. If you did not request this, please ignore this email.
      </p>

      <hr style="border:none; border-top:1px solid #eee; margin:20px 0;" />

      <p style="font-size:13px; color:#888; text-align:center;">
        © ${new Date().getFullYear()} Your App Name. All rights reserved.
      </p>
    </div>
  `
  });

  return otp
}


module.exports=sendEmailVerificationOTP