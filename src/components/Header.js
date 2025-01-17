import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Box, ListItemIcon } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PeopleIcon from '@mui/icons-material/People';
import TaskIcon from '@mui/icons-material/Task';
import { useAuth } from '../context/AuthContext';

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'ADMIN';

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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
            to="/board" 
            sx={{ mx: 1, px: 2, py: 1 }}
          >
            Tasks Board
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/" 
            sx={{ mx: 1, px: 2, py: 1 }}
          >
            My Tasks
          </Button>
          {isAdmin && (
            <Button
              color="inherit"
              onClick={handleClick}
              endIcon={<ArrowDropDownIcon />}
              sx={{ mx: 1, px: 2, py: 1 }}
            >
              Admin
            </Button>
          )}
          <Button
            color="inherit"
            onClick={handleLogout}
            sx={{ mx: 1, px: 2, py: 1 }}
          >
            Logout
          </Button>
        </Box>
        {isAdmin && (
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 3,
              sx: {
                width: '200px',
                overflow: 'visible',
                mt: 1.5,
                '& .MuiMenuItem-root': {
                  fontSize: '0.875rem',
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem 
              onClick={handleClose} 
              component={RouterLink} 
              to="/users"
              sx={{ 
                py: 1, 
                px: 2,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon>
                <PeopleIcon sx={{ fontSize: '1.25rem' }} />
              </ListItemIcon>
              <Typography variant="body2">User Management</Typography>
            </MenuItem>
            <MenuItem 
              onClick={handleClose} 
              component={RouterLink} 
              to="/tasks-management"
              sx={{ 
                py: 1, 
                px: 2,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon>
                <TaskIcon sx={{ fontSize: '1.25rem' }} />
              </ListItemIcon>
              <Typography variant="body2">Tasks Management</Typography>
            </MenuItem>
          </Menu>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
