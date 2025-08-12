
import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      
      sx={{
        backgroundColor: '#2c2929ff',
        color: '#fff',
        py: 2,
        textAlign: 'center',
        mt: 'auto',
      }}
    >
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} Tech Quiz. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;