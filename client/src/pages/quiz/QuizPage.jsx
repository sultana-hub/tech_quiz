


import { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [totalTime, setTotalTime] = useState(0);
    const [timeLeft, setTimeLeft] = useState(null);
    const timeZone = localStorage.getItem('timeZone');
    const subject = localStorage.getItem('subject');

    const timerIdRef = useRef(null);
    const submittingRef = useRef(false);

    const submitAnswerMutation = useMutation({
        mutationFn: submitAnswer,
        onSuccess: (res) => {
            console.log('Answer submitted:', res.data)
            queryClient.invalidateQueries(["result"]);
        },
        onError: (err) => console.error('Error submitting answer:', err),
    });

    // Load questions and set initial timer
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('quizData'));
        console.log('quizData from localStorage:', data);

        if (data && data.length > 0) {
            const enrichedData = data.map((q, idx) => ({
                ...q,
                localId: q._id || `local-${idx}`,
            }));

            setQuestions(enrichedData);

            const totalDuration = enrichedData.reduce((sum, q) => {
                const dur = Number(q.duration);
                return sum + (isNaN(dur) || dur < 10 ? 30 : dur);
            }, 0);

            setTotalTime(totalDuration);
            setTimeLeft(totalDuration); // ⏳ start fresh timer
        }
    }, []);

    // Timer countdown effect
    useEffect(() => {
        if (timeLeft === null || hasSubmitted) return;

        if (timeLeft > 0) {
            timerIdRef.current = setTimeout(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && !submittingRef.current) {
            console.log("⏰ Timer hit 0. Submitting automatically...");
            handleSubmitQuiz(true);
        }

        return () => clearTimeout(timerIdRef.current);
    }, [timeLeft, hasSubmitted]);

    const handleOptionChange = (questionId, option) => {
        setAnswers((prev) => ({ ...prev, [questionId]: option }));
    };

    const handleSubmitQuiz = async (isTimeout = false) => {
        // prevent double execution
        if (hasSubmitted || submittingRef.current) return;
        submittingRef.current = true;

        clearTimeout(timerIdRef.current);
        setHasSubmitted(true);
        setTimeLeft(null);

        // submit each answer
        for (const question of questions) {
            const selectedAnswer = answers[question._id];
            if (selectedAnswer) {
                await submitAnswerMutation.mutateAsync({
                    questionId: question._id,
                    selectedAnswer,
                    timeZone,
                });
            }
        }


        // Invalidate cache so result page gets fresh data
        queryClient.invalidateQueries({ queryKey: ['result'] });
        // feedback
        if (isTimeout) {
            alert("⏰ Time’s up! Quiz submitted automatically.");
        } else {
            alert("✅ Quiz submitted successfully.");
        }

        navigate("/quiz-result");
    };

    if (!questions.length) return <Typography>Loading Quiz...</Typography>;

    return (
        <section className="container">
            <Typography>Subject: {subject}</Typography>
            <Typography variant="subtitle2" color="textSecondary">
                Total quiz time: {Math.floor(totalTime / 60)} minutes
            </Typography>
            <Typography variant="h6" sx={{ color: timeLeft < 10 ? 'red' : 'green' }}>
                ⏳ Time left: {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
                {String(timeLeft % 60).padStart(2, '0')}
            </Typography>

            <Box p={3}>
                <Typography variant="h4" gutterBottom>Quiz</Typography>
                {questions.map((q, index) => (
                    <Box key={q._id} mb={4}>
                        <Typography variant="h6">{index + 1}. {q.question}</Typography>
                        <RadioGroup
                            value={answers[q._id] || ''}
                            onChange={(e) => handleOptionChange(q._id, e.target.value)}
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
                    onClick={() => handleSubmitQuiz(false)}
                    disabled={Object.keys(answers).length !== questions.length}
                >
                    Submit Quiz
                </Button>
            </Box>
        </section>
    );
};

export default QuizPage;
