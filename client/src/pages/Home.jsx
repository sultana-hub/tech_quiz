import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Container, Stack } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      {/* Landing Section */}
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(/images/back1.avif)',
          backgroundSize: 'cover',
          backgroundPosition: 'right center', //  aligns the image to the right
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: '#fff',
        }}
      >
        <Box>
          <Container maxWidth="md" sx={{ padding: 0 }}>
            <Typography variant="h2" fontWeight="bold" gutterBottom sx={{ 
            fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' },
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}>
              Welcome To Tech Quiz
            </Typography>
            <Typography variant="h6" mb={4}>
              Register/Login To Start Quiz
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="contained" color="primary" component={Link} to="/register">
                Sign Up
              </Button>
              <Button variant="outlined" color="inherit" component={Link} to="/login">
                Login
              </Button>
            </Stack>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default Home;


