import React, { useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getSingleProfile, editProfile } from '../../components/profile/profileQuery';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

const EditProfile = () => {
    const navigate = useNavigate();
    const { userId } = useParams();

    const { data: profileData, isLoading } = useQuery({
        queryKey: ['profile', userId],
        queryFn: () => getSingleProfile(userId),
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        if (profileData?.data) {
            const { userName } = profileData.data;
              const { email } = profileData?.data;
            reset({
                userName: userName || '',
                email: email || '',
            });
        }
    }, [profileData, reset]);

    const { mutate } = useMutation({
        mutationFn: ({ userId, formData }) => editProfile(userId, formData),
        onSuccess: () => {
            Swal.fire({
                title: 'Success',
                text: 'Profile updated successfully!',
                icon: 'success'
            });
            navigate(`/profile/${userId}`);
        },
        onError: () => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!'
            });
        }
    });

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append('userName', data.userName);
        formData.append('email', data.email);
        if (data.profilePic && data.profilePic[0]) {
            formData.append('profilePic', data.profilePic[0]);
        }

        mutate({ userId, formData });
    };

    return (
        <Container maxWidth="md" sx={{ mb: 25 }}>
            <Typography variant="h4" gutterBottom sx={{ mt: 4 }} color="primary">
                Edit Your Profile
            </Typography>
            <Typography variant="body2" sx={{ mb: 4 }}>* = required fields</Typography>

            <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>

                <TextField
                    fullWidth
                    label="Name"
                    variant="outlined"
                    margin="normal"
                    {...register("userName", { required: "Name is required" })}
                />
                {errors.userName && <p className="text-danger">{errors.userName.message}</p>}

                <TextField
                    fullWidth
                    disabled
                    label="Email"
                    variant="outlined"
                    margin="normal"
                    {...register("email", { required: "Email is required" })}
                />
              
                <div className="form-group">
                    <input
                        type="file"
                        {...register("profilePic")}
                        accept="image/*"
                        className="form-control"
                    />
                    {errors.profilePic && <p className="text-danger">{errors.profilePic.message}</p>}
                </div>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3 }}
                >
                    Update Profile
                </Button>
            </Box>
        </Container>
    );
};

export default EditProfile;



