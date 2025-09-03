
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { userRegister } from '../../components/Auth/query';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  Container,
  Button,
  Typography,
  TextField,
  Box,
  IconButton,
  InputAdornment,
  Grid,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ReCAPTCHA from "react-google-recaptcha";
const Register = () => {
  const navigate = useNavigate();
  const [captchaToken, setCaptchaToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: userRegister,
    onSuccess: () => {
      Swal.fire({
        title: 'Good job!',
        text: 'You registered successfully!',
        icon: 'success',
      });
      navigate('/otp');
    },
    onError: () => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
    },
  });

  const onSubmit = (data) => {
    if (data.password !== data.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Passwords do not match!',
      });
      return;
    }
    if (!data.profilePic) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Profile picture required',
      });
      return;
    }
    if (!captchaToken) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please complete the reCAPTCHA',
      });
      return;
    }
    const formData = new FormData();
    formData.append('userName', data.userName);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('profilePic', data.profilePic[0]);
    formData.append('captchaToken', captchaToken); //  Send captcha token
    mutate(formData);
    reset();
  };
  // #6e45e2
  return (
    <Container
      maxWidth="100%"
      sx={{
        py: 8,
        display: 'flex',
        justifyContent: 'center',
        minWidth: { md: '960px' },

      }}
    >
      <Box
        sx={{
          bgcolor: 'white',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)', // Enhanced shadow
          borderRadius: 3,
          width: '100%',
          // maxWidth: '960px',
          overflow: 'hidden',
        }}
      >
        <Grid
          container
          spacing={4}
          alignItems="stretch"
          sx={{
            flexWrap: 'nowrap',
            '@media (max-width: 959.95px)': {
              flexWrap: 'wrap',
            },
            minHeight: '500px',
          }}
        >
          {/* Left side: Form (uncompressed) */}
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            sx={{
              display: 'flex',
              alignItems: 'stretch',
              bgcolor: 'white', // Debug: light green
              flexShrink: 0,
              minWidth: { md: '400px' },
              p: 4,
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Typography
                variant="h4"
                align="center"
                sx={{
                  color: '#0b1948',
                  fontWeight: 'bold',
                  mb: 3,
                  letterSpacing: '1px',
                }}
              >
                Tech Registration
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <TextField
                  fullWidth
                  label="Name"
                  name="userName"
                  variant="outlined"
                  margin="normal"
                  {...register('userName', { required: 'Name is required' })}
                  error={!!errors.userName}
                  helperText={errors.userName?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      '&:hover': { boxShadow: '0 0 8px rgba(110, 69, 226, 0.5)' },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  variant="outlined"
                  margin="normal"
                  {...register('email', { required: 'Email is required' })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      '&:hover': { boxShadow: '0 0 8px rgba(110, 69, 226, 0.5)' },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  margin="normal"
                  autoComplete="new-password"
                  {...register('password', {
                    required: 'Password is required',
                    pattern: {
                      value: /^(?=.*[a-zA-Z0-9])(?=.*[^a-zA-Z0-9]).{8,}$/,
                      message: 'Password must be at least 8 characters long , alphanumeric , and at least one special character',
                    },
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      '&:hover': { boxShadow: '0 0 8px rgba(110, 69, 226, 0.5)' },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  variant="outlined"
                  margin="normal"
                  autoComplete="new-password"
                  {...register('confirmPassword', {
                    required: 'Confirm Password is required',
                    validate: (val) => val === watch('password') || 'Passwords do not match',
                  })}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      '&:hover': { boxShadow: '0 0 8px rgba(110, 69, 226, 0.5)' },
                    },
                  }}
                />
                <Box sx={{ mt: 2 }}>
                  <input
                    type="file"
                    {...register('profilePic', {
                      required: 'Profile picture is required',
                    })}
                    accept="image/*"
                    style={{ display: 'block', margin: '16px 0' }}
                  />
                  {errors.profilePic && (
                    <Typography color="error" variant="caption">
                      {errors.profilePic.message}
                    </Typography>
                  )}
                </Box>

                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  onChange={(token) => setCaptchaToken(token)}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isPending}
                  sx={{
                    mt: 2,
                    borderRadius: '50px',
                    bgcolor: '#23154aff', // Vibrant purple
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '12px 0',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: '#5533cc',
                      transform: 'scale(1.02)',
                      boxShadow: '0 0 12px rgba(110, 69, 226, 0.7)',
                    },
                  }}
                >
                  {isPending ? 'Registering...' : 'Register'}
                </Button>
              </form>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography>
                  Existing user?{' '}
                  <Button
                    onClick={() => navigate('/login')}
                    sx={{
                      color: '#6e45e2',
                      fontWeight: 'bold',
                      '&:hover': { color: '#5533cc' },
                    }}
                  >
                    Login
                  </Button>
                </Typography>
              </Box>
            </Box>
          </Grid>
          {/* Right side: Compressed Image */}
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            sx={{
              display: 'flex',
              alignItems: 'stretch',
              bgcolor: 'rgba(255, 0, 0, 0.1)', // Debug: light red
              flexGrow: 1,
              flexShrink: 1,
              minWidth: { md: '300px' },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                minHeight: { xs: '300px', md: '500px' },
                minWidth: '100px',
                zIndex: 1,
              }}
            >
              <img
                src="/images/quiz1.svg"
                alt="Registration Illustration"
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  height: 'auto',
                  minWidth: '100px',
                  minHeight: '100px',
                  objectFit: 'contain',
                  borderRadius: '0 12px 12px 0',
                  display: 'block',
                  visibility: 'visible',
                  zIndex: 2,

                }}
                onLoad={() => console.log('Image loaded successfully: /images/quiz1.svg')}
                onError={() => console.log('Image failed to load: /images/quiz1.svg')}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Register;