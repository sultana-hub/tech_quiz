import {
    Box,
    Typography,
    Paper,
    Grid,
    Chip,
    CircularProgress,
    Divider,
    Button,
} from '@mui/material';
import { green, red } from '@mui/material/colors';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchQuizResults } from '../../components/quiz/quizQuery'



const QuizResult = () => {
    const {
        data: results = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryFn: fetchQuizResults,
        queryKey: ['result']

    });

  const groupByCategory = (results) => {
    return results.reduce((acc, curr) => {
        if (!curr.categoryName) return acc; //  Just skip, don't return null
        const category = curr.categoryName;
        if (!acc[category]) acc[category] = [];
        acc[category].push(curr);
        return acc;
    }, {});
};

    const [subjectPage, setSubjectPage] = useState(0); // tracks category index

    if (isLoading) {
        return (
            <Box p={4} textAlign="center">
                <CircularProgress />
                <Typography mt={2}>Loading quiz results...</Typography>
            </Box>
        );
    }

    if (isError) {
        return (
            <Box p={4} textAlign="center" color="error.main">
                <Typography variant="h6">❌ Error loading quiz results</Typography>
                <Typography variant="body2">{error.message}</Typography>
            </Box>
        );
    }

    if (!results || results.length === 0) return <p>No quiz results found.</p>;
    const total = results.length;
    const correct = results.filter((q) => q.isCorrect).length;
    const percentage = total ? Math.round((correct / total) * 100) : 0;

    const grouped = groupByCategory(results);
    const categories = Object.keys(grouped);
    const currentCategory = categories[subjectPage];
    const currentQuestions = grouped[currentCategory] || [];

    const subjectCorrect = currentQuestions.filter((q) => q.isCorrect).length;
    const subjectPercentage = Math.round((subjectCorrect / currentQuestions.length) * 100);

    return (
        <section className="container">
            <Box p={4}>
                <Typography variant="h4" gutterBottom>
                    🧮 Quiz Result Summary
                </Typography>

                <Box mb={3}>
                    <Typography variant="h6">Total Questions: {total}</Typography>
                    <Typography variant="h6" color="success.main">
                        Correct Answers: {correct}
                    </Typography>
                    <Typography variant="h6">
                        Score: {correct}/{total} ({percentage}%)
                    </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Box mb={3}>
                    <Typography variant="h5" gutterBottom color="primary">
                        📘 Subject: {currentCategory}
                    </Typography>
                    <Typography variant="body1" mb={2}>
                        {subjectCorrect}/{currentQuestions.length} correct ({subjectPercentage}%)
                    </Typography>

                    <Grid container spacing={3}>
                        {currentQuestions.map((q, index) => (
                            <Grid item xs={12} md={6} key={q._id}>
                                <Paper elevation={3} sx={{ p: 2 }}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {index + 1}. {q.question}
                                    </Typography>

                                    <Typography mt={1}>
                                        <strong>Your Answer:</strong>{' '}
                                        <Chip
                                            label={q.selectedAnswer}
                                            sx={{
                                                bgcolor: q.isCorrect ? green[100] : red[100],
                                                color: q.isCorrect ? green[800] : red[800],
                                                fontWeight: 'bold',
                                            }}
                                        />
                                    </Typography>

                                    {!q.isCorrect && (
                                        <Typography mt={1}>
                                            <strong>Correct Answer:</strong>{' '}
                                            <Chip label={q.correctAnswer} color="success" />
                                        </Typography>
                                    )}

                                    <Typography mt={1} variant="body2" color="textSecondary">
                                        Submitted at: {new Date(q.submittedAt).toLocaleString()} ({q.timeZone})
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Subject-level Pagination */}
                    <Box mt={4} display="flex" justifyContent="space-between">
                        <Button
                            variant="outlined"
                            disabled={subjectPage === 0}
                            onClick={() => setSubjectPage((prev) => prev - 1)}
                        >
                            ◀️ Previous Subject
                        </Button>
                        <Typography variant="body1">
                            Subject {subjectPage + 1} of {categories.length}
                        </Typography>
                        <Button
                            variant="outlined"
                            disabled={subjectPage === categories.length - 1}
                            onClick={() => setSubjectPage((prev) => prev + 1)}
                        >
                            Next Subject ▶️
                        </Button>
                    </Box>
                </Box>
            </Box>
        </section>
    );
};

export default QuizResult;
