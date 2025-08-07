import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSingleProfile } from '../../components/profile/profileQuery';
import {
    CircularProgress,
    Alert,
    Box,
    Button
} from '@mui/material';

import { imagePath } from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import '../../style/style.css';
const SingleProfile = () => {
    const navigate = useNavigate();
    const userId = sessionStorage.getItem('userId')
    console.log("user id ", userId)
    const { data: profile, isPending, isError, error } = useQuery({
        queryKey: ['profile', userId],
        queryFn: () => getSingleProfile(userId),
    });




    if (isPending) {
        return (
            <Box display="flex" justifyContent="center" mt={5}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        return (
            <Box mt={5}>
                <Alert severity="error">{error.message || 'Something went wrong'}</Alert>
            </Box>
        );
    }

    return (
        <section class="container">
            <a href="/" class="btn btn-light">Back To Home</a>

            <div class="profile-grid my-1">
                {/* <!-- Top --> */}
                <div class="profile-top bg-primary p-2">
                    <img
                        class="round-img my-1"
                        src={imagePath(profile?.data?.profilePic)}
                        alt={profile?.data?.userName}
                    //  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                    <h1>Welcome  {profile?.data?.userName}</h1>

                    <p>Email:{profile?.data?.email}</p>

                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => navigate(`/profile/${userId}/update`)} 
                        style={{ marginTop: '10px' }}
                    >
                        Edit Profile
                    </Button>
                </div>
            </div>
        </section>

    );
};

export default SingleProfile;




