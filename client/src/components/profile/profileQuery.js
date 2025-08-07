import axiosInstance from '../../api/axiosInstance'
import { endPoints } from '../../api/url'




export const getSingleProfile=async(userId)=>{
    const response = await axiosInstance.get(`${endPoints.profileById}${userId}`)
    console.log("Single profile",response.data)
    return response.data
}

export const editProfile = async (userId, formData) => {
  try {
    const response = await axiosInstance.put(
      `api/user/profile/${userId}/update`,
      formData
    );
    console.log("Profile updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error.response?.data || error.message);
    throw error;
  }
};

