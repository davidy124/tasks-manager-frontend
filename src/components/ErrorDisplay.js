import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';

function ErrorDisplay({ error, resetError }) {
  const navigate = useNavigate();

  const errorMessage = error?.response?.data?.message || error?.message || 'An unexpected error occurred';

  const handleGoBack = () => {
    if (resetError) {
      resetError();
    }
    navigate(-1);
  };

  const handleGoHome = () => {
    if (resetError) {
      resetError();
    }
    navigate('/');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        p: 3
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 500,
          width: '100%',
          textAlign: 'center'
        }}
      >
        <ErrorOutlineIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h5" gutterBottom color="error">
          Error
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, whiteSpace: 'pre-wrap' }}>
          {errorMessage}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="outlined" onClick={handleGoBack}>
            Go Back
          </Button>
          <Button variant="contained" onClick={handleGoHome}>
            Go to Home
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default ErrorDisplay; 