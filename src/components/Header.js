import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Task Manager
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/" 
            sx={{ mx: 1, px: 2, py: 1 }}
          >
            Tasks
          </Button>
          <Button
            color="inherit"
            onClick={handleClick}
            endIcon={<ArrowDropDownIcon />}
            sx={{ mx: 1, px: 2, py: 1 }}
          >
            Admin
          </Button>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              width: '200px',
            },
          }}
        >
          <MenuItem 
            onClick={handleClose} 
            component={RouterLink} 
            to="/users"
            sx={{ py: 1.5, px: 3 }}
          >
            User Management
          </MenuItem>
          <MenuItem 
            onClick={handleClose} 
            component={RouterLink} 
            to="/tasks-management"
            sx={{ py: 1.5, px: 3 }}
          >
            Tasks Management
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
