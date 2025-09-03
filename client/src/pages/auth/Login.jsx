
import React, { useState } from "react";
import {
  Box,
  IconButton,
  TextField,
  Container,
  Button,
  Typography,
  CircularProgress,
  InputAdornment,
  Grid,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { userLogin } from '../../components/Auth/query';
import Swal from 'sweetalert2';
import ReCAPTCHA from "react-google-recaptcha";
const Login = () => {
  const [captchaToken, setCaptchaToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { mutate, isLoading, isError } = useMutation({
    mutationFn: userLogin,
    mutationKey: ['signin'],
    onSuccess: (data) => {
      Swal.fire({
        title: "Welcome!",
        text: "You Login successfully",
        icon: "success"
      });
      sessionStorage.setItem('token', data?.token);
      sessionStorage.setItem('avatar', data?.user?.avatar);
      sessionStorage.setItem('name', data?.user?.userName);
      sessionStorage.setItem("userId", data?.user?._id);
      console.log("login user payload", data);
      navigate('/terms-condition')
     // navigate(`/profile/${data?.user?._id}`);
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Either email or password is wrong!",
      });
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (!captchaToken) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please complete the reCAPTCHA',
      });
      return;
    }
    const payload = {
      email: data.email,
      password: data.password,
      captchaToken: captchaToken, 
    };
    mutate(payload);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 8,
        bgcolor: 'transparent',
        display: 'flex',
        justifyContent: 'center',
        minWidth: { md: '960px' }, // Ensure container is wide enough
        marginTop: 3,
        marginBottom: 2

      }}
    >
      <Box
        sx={{
          bgcolor: 'white',
          boxShadow: 3,
          borderRadius: 2,
          width: '100%',
          maxWidth: '960px', // Limit card width for better appearance
          overflow: 'hidden', // Ensure rounded corners clip content
        }}
      >
        <Grid
          container
          spacing={4}
          alignItems="stretch"
          sx={{
            flexWrap: 'nowrap', // Enforce side-by-side
            '@media (max-width: 959.95px)': {
              flexWrap: 'wrap', // Stack on smaller screens
            },
            minHeight: '500px', // Ensure sufficient height
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
              bgcolor: 'white', // Debug: light green for form
              flexShrink: 0, // Prevent form compression
              minWidth: { md: '400px' }, // Ensure form has enough space
              p: 4,
              mt: 5
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Typography variant="h5" align="center" color="primary" gutterBottom>
                Tech Login
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  variant="outlined"
                  margin="normal"
                  {...register("email", { required: "Email is required" })}
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                  autoComplete="new-email"
                />
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  margin="normal"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 4, message: "Minimum 4 characters required" },
                  })}
                  error={!!errors.password}
                  helperText={errors?.password?.message}
                  autoComplete="new-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />


                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  onChange={(token) => setCaptchaToken(token)}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isLoading}
                  sx={{
                    mt: 2,
                    borderRadius: "50px",
                    bgcolor: "#152147",
                    color: "white",
                    "&:hover": { bgcolor: "rgba(32, 20, 79, 1)" },
                  }}
                >
                  {isLoading ? <CircularProgress size={24} /> : "Login"}
                </Button>
              </form>
              <Box sx={{ textAlign: "center", mt: 1 }}>
                <Typography sx={{ p: 2 }}>
                  New user? Please
                  <Link to="/register" style={{ textDecoration: "none", color: '#1976d2', marginLeft: '4px' }}>
                    Signup
                  </Link>
                </Typography>
                <Typography>Forgot Password ?
                  <Link to="/password-forget" style={{ textDecoration: "none", color: '#1976d2', marginLeft: '4px' }}>
                    Click Here
                  </Link>
                </Typography>
              </Box>
              {isError && (
                <Typography color="error" align="center" sx={{ mt: 2 }}>
                  Invalid Credentials
                </Typography>
              )}
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
              bgcolor: 'rgba(255, 0, 0, 0.1)', // Debug: light red for image
              flexGrow: 1, // Take remaining space
              flexShrink: 1, // Allow compression
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
              }}
            >
              <img
                src="/images/quiz1.svg" // Path for Create React App
                alt="Login Illustration"
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  height: 'auto',
                  objectFit: 'contain', // Compress image to fit
                  borderRadius: '0 8px 8px 0', // Match card's right corners
                }}
                onError={() => console.log('Image failed to load: check path for /images/quiz1.svg')}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Login;