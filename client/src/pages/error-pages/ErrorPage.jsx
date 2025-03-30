import React from 'react';
// import { useSelector } from 'react-redux';
import { Box, Typography, Button, Container } from '@mui/material';

const ErrorPage = ({ error,onRetry }) => {
  // Get the error from Redux store
//   const error = useSelector((state) => state.auth.error);

  return (
    <Container maxWidth="sm">
      <Box
        textAlign="center"
        py={5}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h2" color="error" gutterBottom>
          Something went wrong!
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {error?.message || 'An unexpected error occurred. Please try again later.'}
        </Typography>
        <Button variant="contained" color="primary" onClick={onRetry} sx={{ mt: 3 }}>
          Retry
        </Button>
      </Box>
    </Container>
  );
};

export default ErrorPage;
