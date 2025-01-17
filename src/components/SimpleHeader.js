import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

function SimpleHeader() {
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Task Manager
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default SimpleHeader; 