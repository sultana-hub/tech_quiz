// // QuizPage.jsx
// import { useState, useEffect } from 'react';
// import { useMutation } from '@tanstack/react-query';
// import { Box, Typography, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
// import { submitAnswer } from '../../components/quiz/quizQuery'; // 
// const QuizPage = () => {
//     const [questions, setQuestions] = useState([]);
//     const [answers, setAnswers] = useState({});
//     const timeZone = localStorage.getItem('timeZone');

//     useEffect(() => {
//         const data = JSON.parse(localStorage.getItem('quizData'));
//         console.log("quiz data",data)
//         setQuestions(data || []);
//     }, []);

//     const submitAnswerMutation = useMutation({
//         mutationFn: submitAnswer,
//         onSuccess: (res) => {
//             console.log('Answer submitted:', res.data);
//         },
//         onError: (err) => {
//             console.error('Error submitting answer:', err);
//         }
//     });

// const handleSubmitQuiz = async () => {
//   for (const questionId in answers) {
//     const selectedAnswer = answers[questionId];
//     await submitAnswerMutation.mutateAsync({
//       questionId,
//       selectedAnswer,
//       timeZone: timeZone
//     });
//   }
//   alert('Quiz submitted successfully');
// };

//     return (
//           <section class="container">
//         <Box p={3}>
//             <Typography variant="h4" gutterBottom>Quiz</Typography>

//             {questions.map((q, index) => (
//                 <Box key={q._id} mb={4}>
//                     <Typography variant="h6">{index + 1}. {q.question}</Typography>
//                     <RadioGroup
//                         value={answers[q._id] || ''}
//                         onChange={(e) =>
//                             setAnswers({ ...answers, [q._id]: e.target.value })
//                         }
//                     >
//                         {q.options.map((opt) => (
//                             <FormControlLabel
//                                 key={opt}
//                                 value={opt}
//                                 control={<Radio />}
//                                 label={opt}
//                             />
//                         ))}
//                     </RadioGroup>
//                 </Box>
//             ))}

//             <Button variant="contained" onClick={handleSubmitQuiz} disabled={Object.keys(answers).length !== questions.length}>
//                 Submit Quiz
//             </Button>
//         </Box>
//         </section>
//     );
// }
// export default QuizPage


import { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
    Box,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button
} from '@mui/material';
import { submitAnswer } from '../../components/quiz/quizQuery';
import { useNavigate } from 'react-router-dom';
const QuizPage = () => {
    const navigate=useNavigate()
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [totalTime, setTotalTime] = useState(0); // total quiz time
    const [timeLeft, setTimeLeft] = useState(0);
    const timerRef = useRef(null);
    const timeZone = localStorage.getItem('timeZone');

    const submitAnswerMutation = useMutation({
        mutationFn: submitAnswer,
        onSuccess: (res) => {
            console.log('Answer submitted:', res.data);
        },
        onError: (err) => {
            console.error('Error submitting answer:', err);
        }
    });

    // Load questions and calculate total quiz duration
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('quizData'));
        console.log("Loaded quiz data:", data);

        if (data && data.length > 0) {
            setQuestions(data);

            // Log durations
            const durations = data.map((q) => q.duration);
            console.log("Individual question durations:", durations);

            const totalDuration = data.reduce((sum, q) => {
                const duration = Number(q.duration);
                return sum + (isNaN(duration) || duration < 10 ? 30 : duration); // fallback to 60s if invalid
            }, 0);

            setTotalTime(totalDuration);
            setTimeLeft(totalDuration);
        }
    }, []);


    // Global quiz timer countdown
    useEffect(() => {
        if (questions.length === 0 || timeLeft === null || timeLeft <= 0 || hasSubmitted) return;

        const timer = setTimeout(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft, questions, hasSubmitted]);

    //handle auto submisstion at time 0
    useEffect(() => {
        if (timeLeft === 0 && questions.length > 0 && !hasSubmitted) {
            console.log("⏰ Timer hit 0. Submitting automatically...");
            handleSubmitQuiz(true); // call with timeout flag
        }
    }, [timeLeft, questions, hasSubmitted]);


    const handleSubmitQuiz = async (isTimeout = false) => {
        if (hasSubmitted) return; // prevent double submit
        for (const questionId in answers) {
            const selectedAnswer = answers[questionId];
            await submitAnswerMutation.mutateAsync({
                questionId,
                selectedAnswer,
                timeZone,
            });
        }

        setHasSubmitted(true);

        if (isTimeout) {
            alert('⏰ Time’s up! Quiz submitted automatically.');
        } else {
            alert(' Quiz submitted successfully.');
        }

        navigate("/quiz-result")
    };



    if (questions.length === 0) return <Typography>Loading Quiz...</Typography>;

    return (
        <section className="container">
            <Typography variant="subtitle2" color="textSecondary">
                Total quiz time: {Math.floor(totalTime / 60)} minutes
            </Typography>
            <Typography variant="h6" sx={{ color: timeLeft < 10 ? 'red' : 'green' }}>
                ⏳ Time left: {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
                {String(timeLeft % 60).padStart(2, '0')}
            </Typography>
            <Box p={3}>
                <Typography variant="h4" gutterBottom>Quiz</Typography>
                {/* <Typography variant="body1" color="textSecondary" gutterBottom>
                    Time left: {timeLeft}s
                </Typography> */}

                {questions.map((q, index) => (
                    <Box key={q._id} mb={4}>
                        <Typography variant="h6">{index + 1}. {q.question}</Typography>
                        <RadioGroup
                            value={answers[q._id] || ''}
                            onChange={(e) =>
                                setAnswers({ ...answers, [q._id]: e.target.value })
                            }
                        >
                            {q.options.map((opt) => (
                                <FormControlLabel
                                    key={opt}
                                    value={opt}
                                    control={<Radio />}
                                    label={opt}
                                />
                            ))}
                        </RadioGroup>
                    </Box>
                ))}

                <Button
                    variant="contained"
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(answers).length !== questions.length}
                >
                    Submit Quiz
                </Button>
            </Box>
        </section>
    );
};

export default QuizPage;
