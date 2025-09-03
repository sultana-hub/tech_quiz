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
import { resetPassword } from '../../components/Auth/query'
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
const ResetPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate, isLoading, isError } = useMutation({
    mutationFn: resetPassword,
    mutationKey: ['reset'],
    onSuccess: () => {
      Swal.fire("Success", "Password reset successfully!", "success");
      navigate("/login"); // redirect after reset
    },
    onError: (err) => {
      Swal.fire("Error", err.message || "Failed to reset password", "error");
    }
  })



  const onSubmit = (data) => {
    if (data.password !== data.confirm_password ) {
      Swal.fire("Error", "Password and confirm password must be the same!", "error");
      return;
    }

    mutate(
      {
        id,
        token,
        password: data.password,
        confirm_password: data.confirm_password,
      }

    );
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
                Developer Login
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  margin="normal"
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value: /^(?=.*[a-zA-Z0-9])(?=.*[^a-zA-Z0-9]).{8,}$/,
                      message: 'Password must be at least 8 characters long , alphanumeric , and at least one special character',
                    },
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
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  margin="normal"
                  {...register("confirm_password", {
                    required: "Confirm Password is required",
                    minLength: { value: 4, message: "Minimum 4 characters required" },
                  })}
                  error={!!errors.confirm_password }
                  helperText={errors?.confirm_password ?.message}
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
                  {isLoading ? <CircularProgress size={24} /> : "Reset"}
                </Button>
              </form>

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
  )
}

export default ResetPassword