import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { userRegister } from '../../components/Auth/query';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import {
  Container,
  Button,
  Typography,
  TextField,
  Box,
  IconButton,
  InputAdornment
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: userRegister,
    onSuccess: () => {
      Swal.fire({
        title: "Good job!",
        text: "You registered successfully!",
        icon: "success"
      });
      navigate('/otp'); // redirect after successful registration
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",

      });

    }
  });

  const onSubmit = (data) => {

    if (data.password !== data.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (!data.profilePic) {
      alert('profile picture required')
      return
    }
    // If avatar file is uploaded

    const formData = new FormData();
    formData.append('userName', data.userName);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('profilePic', data.profilePic[0]);
    mutate(formData); // Send as multipart/form-data

    reset();
  };


  return (
    <>

      <Container maxWidth="md">
        <Box sx={{ mt: 5, mb: 3, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}>
          <Typography variant="h5" align="center" gutterBottom color="primary">
            Devloper  Registration
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} id="regisForm" noValidate>
            <div className="form-group">
              <TextField
                fullWidth
                label="Name"
                name="userName"
                variant="outlined"
                margin="normal"
                {...register("userName", { required: "Name is required" })}
              // error={!!errors.userName}
              // // You can also use the helperText prop on TextField
              // helperText={errors.userName ? errors.userName.message : ''}
              />
              {errors.name && <p className="text-danger">{errors.userName.message}</p>}
            </div>



            <div className="form-group">
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                variant="outlined"
                margin="normal"
                {...register("email", { required: "Email is required" })}
              // error={!!errors.email}
              // helperText={errors.email ? errors.email.message : ''}
              />

              {errors.email && <p className="text-danger">{errors.email.message}</p>}
            </div>
            <div className="form-group">
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                margin="normal"
                autoComplete="new-password"

                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 4, message: "Minimum 4 characters required" },
                })}

                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              // error={!!errors.password}
              // helperText={errors.password ? errors.password.message : ''}
              />
              {errors.password && <p className="text-danger">{errors.password.message}</p>}
            </div>
            <div className="form-group">
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                variant="outlined"
                margin="normal"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (val) =>
                    val === watch("password") || "Passwords do not match",
                })}

                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              // error={!!errors.confirmPassword}
              // helperText={errors.confirmPassword ? errors.confirmPassword.message : ''}
              />
              {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword.message}</p>}
            </div>

            
            <div className="form-group">
              <input
                type="file"
                {...register("profilePic", {
                  required: "Profile is required",
                })}
                accept="image/*"
                className="form-control"
              // error={!!errors.profilePic}
              // helperText={errors.profilePic ? errors.profilePic.message : ''}
              />
              {errors.profilePic && <p className="text-danger">{errors.profilePic.message}</p>}

            </div>

            {/* <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2, borderRadius: "50px", bgcolor: "#185758ff", color: "white", "&:hover": { bgcolor: "rgba(65, 50, 107, 1)" } }}
            >
              Register
            </Button> */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isPending}
              sx={{
                mt: 2,
                borderRadius: "50px",
                bgcolor: "#185758ff",
                color: "white",
                "&:hover": { bgcolor: "rgba(65, 50, 107, 1)" }
              }}
            >
              {isPending ? "Registering..." : "Register"}
            </Button>


          </form>
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography>
              Existing user? <Button onClick={() => navigate("/login")}>Login</Button>
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Register;
