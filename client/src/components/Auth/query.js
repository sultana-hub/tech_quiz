import axiosInstance from "../../api/axiosInstance";
import { endPoints } from "../../api/url";

//register query
export const userRegister = async (formData) => {
  try {
    const res = await axiosInstance.post(endPoints.register, formData);
    console.log(" User registered:", res.data);
    return res.data;
  } catch (error) {
    console.error(" Registration error:", error?.response?.data || error.message);
    throw {
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || "Registration failed"
    };
  }
};


//login query
export const userLogin = async (credentials) => {
  try {
    const res = await axiosInstance.post(endPoints.login, credentials);
    console.log(" User login response:", res);
    return res.data;
  } catch (error) {
    console.error(" Login error:", error?.response?.data || error.message);
    throw {
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || "Login failed"
    };
  }
};

 //otp query

export const otpVerification = async (otpAndEmail) => {
  try {
    const res = await axiosInstance.post(endPoints.otpEmailVerify, otpAndEmail);
    console.log(" OTP verified:", res.data);
    return res.data;
  } catch (error) {
    console.error(" OTP verification error:", error?.response?.data || error.message);
    throw {
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || "OTP verification failed"
    };
  }
};
//resend otp
export const resendOtp = async (emailData) => {
  try {
    const res = await axiosInstance.post('/resend/otp', emailData);
    return res.data;
  } catch (error) {
    console.error(" Resend OTP error:", error?.response?.data || error.message);
    throw {
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || "Failed to resend OTP"
    };
  }
};


export const forgotPassword=async(email)=>{
  try {
    const res=await axiosInstance.post(endPoints.forgetPwd,email)
    return res.data
  } catch (error) {
    console.error(" Resend forget error:", error?.res?.data || error.message);
    throw {
      status: error?.res?.status || 500,
      message: error?.res?.data?.message || "Failed to sent link"
    };
  }
}


export const resetPassword = async ({ id, token, password, confirm_password  }) => {
  try {
    const res = await axiosInstance.put(
      `${endPoints.resetPassword}${id}/${token}`,
      { password, confirm_password  } // send body
    );
    return res.data;
  } catch (error) {
    console.error("Resend password error:", error?.response?.data || error.message);
    throw {
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || "Failed to reset password"
    };
  }
};


// query.js
export const updatePassword = async ({ currentPassword, newPassword, confirmPassword }) => {
  try {
    const res = await axiosInstance.put("/api/user/update-password", {
      currentPassword,
      newPassword,
      confirmPassword
    });
    return res.data;
  } catch (error) {
    throw {
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || "Failed to update password"
    };
  }
};
