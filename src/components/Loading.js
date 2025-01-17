import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

function Loading({ message = 'Loading...', fullScreen = false }) {
  const styles = fullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 9999,
  } : {
    minHeight: '200px',
  };

  return (
    <Box 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center"
      {...styles}
    >
      <CircularProgress size={40} />
      {message && (
        <Typography
          variant="body1"
          sx={{ mt: 2, color: 'text.secondary' }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
}

export default Loading;
