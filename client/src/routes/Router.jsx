// src/Router.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Import your pages/components
import Home from '../pages/Home';
import ProtectedRoute from './isAuth'
import Navbar from '../layouts/Navbar';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register'
import NotFound from '../pages/NotFound';
import Footer from '../layouts/Footer';
import SingleProfile from '../pages/profile/SingleProfile'
import EditProfile from '../pages/profile/EditProfile'
import CircularProgress from '@mui/material/CircularProgress';
import OtpVerification from '../pages/auth/OtpVerification'
import StartQuiz from '../pages/quiz/StartQuiz';
import QuizPage from '../pages/quiz/QuizPage';
import QuizResult from '../pages/quiz/QuizResult'
const ErrorPage = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import("../pages/ErrorPage"))

      , 2000);
  });
});

const Router = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={
        <>
          <h3> ...Loading </h3>
          <CircularProgress />;
        </>

      }>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/profiles/profile/:userId" element={<SingleProfile />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp" element={<OtpVerification />} />
          {/* protected route */}
          <Route element={<ProtectedRoute />}>
            {/* user profile */}
            <Route path="/profile/:userId" element={<SingleProfile />} />
            <Route path="/profile/:userId/update" element={<EditProfile />} />
              <Route path="/startQuiz" element={<StartQuiz/>} />
              <Route path="/submitQuiz" element={<QuizPage/>} />
              <Route path="/quiz-result" element={<QuizResult/>}/>
          </Route>
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  );
};

export default Router;