import React, { useState, useEffect } from 'react';
import { Alert, Collapse, Box } from '@mui/material';

function AutoDismissAlert({ message, severity = 'info', duration = 3000, show = true }) {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
    if (show) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  return (
    <Box sx={{ width: '100%', position: 'fixed', top: 64, zIndex: 1000 }}>
      <Collapse in={isVisible}>
        <Alert 
          severity={severity}
          sx={{ 
            width: '100%',
            maxWidth: 600,
            margin: '0 auto',
            boxShadow: 3,
          }}
        >
          {message}
        </Alert>
      </Collapse>
    </Box>
  );
}

export default AutoDismissAlert; 