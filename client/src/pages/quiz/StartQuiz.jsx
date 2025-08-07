// StartQuiz.jsx
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { MenuItem, Select, Button, Typography, Box, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { startQuiz } from '../../components/quiz/quizQuery';
import { useForm } from 'react-hook-form'
const timeZones = Intl.supportedValuesOf('timeZone');

const StartQuiz = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const startQuizMutation = useMutation({
        mutationFn: startQuiz,
        onSuccess: ( data) => {
            if (data?.status && Array.isArray(data?.questions)) {
                console.log("response question", data)
                localStorage.setItem('quizData', JSON.stringify(data?.questions));
                localStorage.setItem('timeZone', data?.timeZone); // use submitted value
                navigate('/submitQuiz');
            }
            else {
                console.error("Quiz start failed: Invalid or missing questions");
            }
        },
        onError: (err) => {
            console.error('Quiz start failed:', err);
        }
    });

    const onSubmit = (data) => {
        startQuizMutation.mutate(data);
    };



    return (
          <section class="container" style={{marginBottom:"300px",marginTop:"150px"}}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} p={3}>
            <Typography variant="h5" mb={2}>Enter Your Time Zone</Typography>

            <TextField
                fullWidth
                label="Time Zone"
                placeholder="e.g. Asia/Kolkata"
                {...register('timeZone', { required: 'Time zone is required' })}
                error={Boolean(errors.timeZone)}
                helperText={errors.timeZone?.message}
            />

            <Button
                variant="contained"
                type="submit"
                sx={{ mt: 3 }}
                disabled={startQuizMutation.isLoading}
            //    onClick={()=> navigate('/submitQuiz')}
            >
                Start Quiz
            </Button>
        </Box>
        </section>
    );
}
export default StartQuiz
