import axiosInstance from '../../api/axiosInstance'
import { endPoints } from '../../api/url'




export const startQuiz=async(timeZone) =>{
    try {
          const res=await axiosInstance.post(endPoints.startQuiz, timeZone )
          console.log("time zone data",res.data)
          return res.data
    } catch (error) {
         console.error("Error starting quiz:", error.response?.data || error.message);
    throw error;
    } 
    
}


export const submitAnswer = ({ questionId, selectedAnswer, timeZone }) => {
  return axiosInstance.post(endPoints.submitAnswer, {
    questionId,
    selectedAnswer,
    timeZone
  });
};


export const fetchQuizResults = async () => {
  const token = localStorage.getItem('token'); 
  const res = await axiosInstance.get(endPoints.quizResult)
 console.log("quiz result",res.data)
  return res.data;
};