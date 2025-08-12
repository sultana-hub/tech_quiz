export const baseUrl = "http://localhost:2001/";

export const endPoints = {
  register: "api/user/register",
  login: "api/user/login",
  profileById: "api/user/profile/",
  editProfile: "api/user/profile/:userId/update",
  otpEmailVerify:"api/user/verify/email",
  resendOtp:"api/user/resend/otp",
  startQuiz:"api/quiz/start",
  submitAnswer:"api/answer/create",
  quizResult:"api/quiz/result",
  categories:"api/categories"
};
