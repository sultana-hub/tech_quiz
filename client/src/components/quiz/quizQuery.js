import axiosInstance from '../../api/axiosInstance'
import { endPoints } from '../../api/url'

export const startQuiz = async (timeZone) => {
  try {
    const res = await axiosInstance.post(endPoints.startQuiz, timeZone)
    console.log("time zone data", res.data)
    return res.data
  } catch (error) {
    console.error("Error starting quiz:", error.response?.data || error.message);
    throw error;
  }

}

export const allCategories = async () => {
  try {
    const res = await axiosInstance.get(endPoints.categories)
    console.log("categories", res.data)
    return res.data
  } catch (error) {
    console.error("Error fetching categories:", error.response?.data || error.message);
    throw error;
  }
}

// export const submitAnswer = async ({ questionId, selectedAnswer, timeZone }) => {
//     try {
//         if (!questionId || !selectedAnswer || !timeZone) {
//             throw new Error('Missing required fields: questionId, selectedAnswer, or timeZone');
//         }
//         const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);
//         if (!isValidObjectId(questionId)) {
//             throw new Error('Invalid question ID format');
//         }
//         console.log('Submitting answer:', { questionId, selectedAnswer, timeZone });
//         console.log('Target URL:', `${axiosInstance.defaults.baseURL}${endPoints.submitAnswer}`);
//         const response = await axiosInstance.post(endPoints.submitAnswer, {
//             questionId,
//             selectedAnswer,
//             timeZone,
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error submitting answer:', error.response?.data || error.message);
//         throw error;
//     }
// };



export const submitAnswer = async ({ questionId, selectedAnswer, timeZone }) => {
  try {
    if (!questionId || !timeZone) {
      throw new Error('Missing required fields: questionId or timeZone');
    }

    const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);
    if (!isValidObjectId(questionId)) {
      throw new Error('Invalid question ID format');
    }

    console.log('Submitting answer:', { questionId, selectedAnswer, timeZone });
    console.log('Target URL:', `${axiosInstance.defaults.baseURL}${endPoints.submitAnswer}`);

    const response = await axiosInstance.post(endPoints.submitAnswer, {
      questionId,
      selectedAnswer: selectedAnswer ?? null, // ensure null is sent if unanswered
      timeZone,
    });

    return response.data;
  } catch (error) {
    console.error('Error submitting answer:', error.response?.data || error.message);
    throw error;
  }
};


// export const fetchQuizResults = async () => {
//   try {
//     const token = localStorage.getItem('token');
//     const res = await axiosInstance.get(endPoints.quizResult)
//     console.log("quiz result", res.data)
//     return res.data;

//   } catch (error) {
//     console.error("❌ Error fetching quiz results:", error.response?.data || error.message);
//     throw error;
//   }

// };


export const fetchQuizResults = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await axiosInstance.get(endPoints.quizResult)
    console.log("Raw quiz result response:", res.data);
    // res.data is already an array of questions
    const finalResult = res?.data?.data.map((q) => {
      return {
        question: q.question,
        categoryName: q.categoryName,
        correctAnswer: q.correctAnswer,
        isCorrect:q.isCorrect,
        selectedAnswer: q.selectedAnswer || "Not Attempted",
       submittedAt:q.submittedAt
      };
    });

    console.log("Final filtered result:", finalResult);
    return finalResult;
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    throw error;
  }
};



