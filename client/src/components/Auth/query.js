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
    const res = await axiosInstance.post(endPoints.otpVerify, otpAndEmail);
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
