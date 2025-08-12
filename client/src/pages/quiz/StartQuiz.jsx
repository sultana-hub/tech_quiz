// // StartQuiz.jsx
// import { useState } from 'react';
// import { useMutation,useQuery } from '@tanstack/react-query';
// import { MenuItem, Select, Button, Typography, Box, TextField } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import { startQuiz ,allCategories} from '../../components/quiz/quizQuery';
// import { useForm } from 'react-hook-form'

// const timeZones = Intl.supportedValuesOf('timeZone');

// const StartQuiz = () => {
//     const { register, handleSubmit, formState: { errors } } = useForm();
//     const navigate = useNavigate();

//     const startQuizMutation = useMutation({
//         mutationFn: startQuiz,
//         onSuccess: (data) => {
//             if (data?.status && Array.isArray(data?.questions)) {
//                 console.log("response question", data)
//                 localStorage.setItem('quizData', JSON.stringify(data?.questions));
//                 localStorage.setItem('timeZone', data?.timeZone); // use submitted value
//                 navigate('/submitQuiz');
//             }
//             else {
//                 console.error("Quiz start failed: Invalid or missing questions");
//             }
//         },
//         onError: (err) => {
//             console.error('Quiz start failed:', err);
//         }
//     });

// const {data:categories}=useQuery({
//     queryKey:['category'],
//     queryFn:allCategories
// })
//  console.log("categories fetched",categories?.data)

//     const onSubmit = (data) => {
//         startQuizMutation.mutate(data);
//     };



//     return (
//         <section className="container" style={{ marginBottom: "300px", marginTop: "150px" }}>
//             <Box component="form" onSubmit={handleSubmit(onSubmit)} p={3}>
//                 <Typography variant="h5" mb={2}>Enter Your Time Zone</Typography>

//                 <TextField
//                     fullWidth
//                     select
//                     label="Choose Subject"
//                     {...register('categoryName', { required: 'Subject is required' })}
//                     error={Boolean(errors.categoryName)}
//                     helperText={errors.categoryName?.message}
//                 >
//                     {categories?.data?.map((cat) => (
//                         <MenuItem key={cat._id} value={cat.categoryName}>
//                             {cat.categoryName}
//                         </MenuItem>
//                     ))}
//                 </TextField>


//                 <TextField
//                     fullWidth
//                     label="Time Zone"
//                     placeholder="e.g. Asia/Kolkata"
//                     {...register('timeZone', { required: 'Time zone is required' })}
//                     error={Boolean(errors.timeZone)}
//                     helperText={errors.timeZone?.message}
//                 />

//                 <Button
//                     variant="contained"
//                     type="submit"
//                     sx={{ mt: 3 }}
//                     disabled={startQuizMutation.isLoading}
//                 //    onClick={()=> navigate('/submitQuiz')}
//                 >
//                     Start Quiz
//                 </Button>
//             </Box>
//         </section>
//     );
// }
// export default StartQuiz



// import { useState } from 'react';
// import { useMutation, useQuery } from '@tanstack/react-query';
// import { MenuItem, Button, Typography, Box, TextField } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import { startQuiz, allCategories } from '../../components/quiz/quizQuery';
// import { useForm } from 'react-hook-form';

// const timeZones = Intl.supportedValuesOf('timeZone');

// const StartQuiz = () => {
//     const { register, handleSubmit, formState: { errors }, setValue } = useForm({
//         defaultValues: {
//             categoryName: '',
//             timeZone: ''
//         }
//     });
//     const navigate = useNavigate();

//     const startQuizMutation = useMutation({
//         mutationFn: startQuiz,
//         onSuccess: (data) => {
//             if (data?.status && Array.isArray(data?.questions)) {
//                 localStorage.setItem('quizData', JSON.stringify(data.questions));
//                 localStorage.setItem('timeZone', data.timeZone);
//                 localStorage.setItem('subject',data?.categoryName)
//                 navigate('/submitQuiz');
//             } else {
//                 console.error("Quiz start failed: Invalid or missing questions");
//             }
//         },
//         onError: (err) => {
//             console.error('Quiz start failed:', err);
//         }
//     });

//     const { data: categories, isLoading } = useQuery({
//         queryKey: ['category'],
//         queryFn: allCategories,
//         onSuccess: (data) => {
//             if (data?.data?.length > 0) {
//                 setValue('categoryName', data.data[0].categoryName); // Set default value
//             }
//         }
//     });

//     const onSubmit = (data) => {
//         startQuizMutation.mutate(data);
//     };

//     return (
//         <section className="container" style={{ marginBottom: "300px", marginTop: "150px" }}>
//             <Box component="form" onSubmit={handleSubmit(onSubmit)} p={3}>
//                 <Typography variant="h5" mb={2}>Enter Your Time Zone</Typography>

//                 <TextField
//                     fullWidth
//                     select
//                     label="Choose Subject"
//                     defaultValue=""
//                     {...register('categoryName', { required: 'Subject is required' })}
//                     error={Boolean(errors.categoryName)}
//                     helperText={errors.categoryName?.message}
//                     sx={{ mb: 2 }}
//                 >
//                     {isLoading ? (
//                         <MenuItem disabled>Loading categories...</MenuItem>
//                     ) : categories?.data?.length > 0 ? (
//                         categories.data.map((cat) => (
//                             <MenuItem key={cat._id} value={cat.categoryName}>
//                                 {cat.categoryName}
//                             </MenuItem>
//                         ))
//                     ) : (
//                         <MenuItem disabled>No categories available</MenuItem>
//                     )}
//                 </TextField>

//                 <TextField
//                     fullWidth
//                     select
//                     label="Time Zone"
//                     defaultValue=""
//                     {...register('timeZone', { required: 'Time zone is required' })}
//                     error={Boolean(errors.timeZone)}
//                     helperText={errors.timeZone?.message}
//                     sx={{ mb: 2 }}
//                 >
//                     {timeZones.map((zone) => (
//                         <MenuItem key={zone} value={zone}>
//                             {zone}
//                         </MenuItem>
//                     ))}
//                 </TextField>

//                 <Button
//                     variant="contained"
//                     type="submit"
//                     sx={{ mt: 3 }}
//                     disabled={startQuizMutation.isLoading || isLoading}
//                 >
//                     {startQuizMutation.isLoading ? 'Starting...' : 'Start Quiz'}
//                 </Button>
//             </Box>
//         </section>
//     );
// };

// export default StartQuiz;


import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MenuItem, Button, Typography, Box, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { startQuiz, allCategories } from '../../components/quiz/quizQuery';
import { useForm } from 'react-hook-form';

const timeZones = Intl.supportedValuesOf('timeZone');

const StartQuiz = () => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: {
            categoryIds: '',
            timeZone: ''
        }
    });
    const navigate = useNavigate();

    const startQuizMutation = useMutation({
        mutationFn: startQuiz,
        onSuccess: (data) => {
            if (data?.status && Array.isArray(data?.questions)) {
                localStorage.setItem('quizData', JSON.stringify(data.questions));
                localStorage.setItem('timeZone', data.timeZone);
                localStorage.setItem('subject', data?.categoryName); // store name for display
                navigate('/submitQuiz');
            } else {
                console.error("Quiz start failed: Invalid or missing questions");
            }
        },
        onError: (err) => {
            console.error('Quiz start failed:', err);
        }
    });

    const { data: categories, isLoading } = useQuery({
        queryKey: ['category'],
        queryFn: allCategories,
        onSuccess: (data) => {
            if (data?.data?.length > 0) {
                setValue('categoryId', data.data[0]._id); // set default to first category id
            }
        }
    });

    // const onSubmit = (data) => {
    //      console.log("Submitting to backend:", data);
    //     startQuizMutation.mutate(data); // sends categoryId + timeZone
    // };

    const onSubmit = (data) => {
        const selectedCategory = categories?.data?.find(
            (cat) => cat._id === data.categoryIds
        );

        startQuizMutation.mutate({
            categoryName: selectedCategory?.categoryName, // backend requirement
            categoryId: data.categoryIds, // optional if you want to store ID too
            timeZone: data.timeZone
        });
    };




    return (
        <section className="container" style={{ marginBottom: "300px", marginTop: "150px" }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} p={3}>
                <Typography variant="h5" mb={2}>Enter Your Time Zone</Typography>

                <TextField
                    fullWidth
                    select
                    label="Choose Subject"
                    defaultValue=""
                    {...register('categoryIds', { required: 'Subject is required' })}
                    error={Boolean(errors.categoryIds)}
                    helperText={errors.categoryIds?.message}
                    sx={{ mb: 2 }}
                >
                    {isLoading ? (
                        <MenuItem disabled>Loading categories...</MenuItem>
                    ) : categories?.data?.length > 0 ? (
                        categories.data.map((cat) => (
                            <MenuItem key={cat._id} value={cat._id}>
                                {cat.categoryName}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem disabled>No categories available</MenuItem>
                    )}
                </TextField>

                <TextField
                    fullWidth
                    select
                    label="Time Zone"
                    defaultValue=""
                    {...register('timeZone', { required: 'Time zone is required' })}
                    error={Boolean(errors.timeZone)}
                    helperText={errors.timeZone?.message}
                    sx={{ mb: 2 }}
                >
                    {timeZones.map((zone) => (
                        <MenuItem key={zone} value={zone}>
                            {zone}
                        </MenuItem>
                    ))}
                </TextField>

                <Button
                    variant="contained"
                    type="submit"
                    sx={{ mt: 3 }}
                    disabled={startQuizMutation.isLoading || isLoading}
                >
                    {startQuizMutation.isLoading ? 'Starting...' : 'Start Quiz'}
                </Button>
            </Box>
        </section>
    );
};

export default StartQuiz;
