import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Stack } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token')
  const userId = sessionStorage.getItem('userId')
  const logout = () => {
    // Clear session, localStorage, or whatever you're using
    sessionStorage.clear();
    // Remove all query cache
    queryClient.clear();
    // Redirect to login
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1d0944ff' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center">
          <CodeIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ textDecoration: 'none', color: '#fff' }}
          >
            Tech Quiz
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>


          {
            token ? (
              <>
                <Button color="inherit" component={Link} to={`/profile/${userId}`}>
                  Pofile
                </Button>
                <Button color="inherit" component={Link} to={`/startQuiz`}>
                  Quiz
                </Button>
                <Button color="inherit" component={Link} to={`/quiz-result`}>
                  Quiz Result
                </Button>
                <Button color="inherit" onClick={logout}>
                  <i className="fas fa-sign-out-alt"></i>{''}
                  Logout
                </Button>

              </>
            )

              : (
                <>

                  <Button color="inherit" component={Link} to="/register">
                    Register
                  </Button>
                  <Button color="inherit" component={Link} to="/login">
                    Login
                  </Button>
                </>

              )
          }



        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;