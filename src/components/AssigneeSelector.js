import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  InputAdornment,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import { searchUsers } from '../api/users';

function AssigneeSelector({ open, onClose, onSelect, currentAssignee }) {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: users, isLoading } = useQuery(
    ['searchUsers', searchTerm],
    () => searchUsers(searchTerm),
    {
      enabled: searchTerm.length >= 2,
      staleTime: 5000,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  const handleSelect = (user) => {
    onSelect(user);
    onClose();
    setSearchTerm(''); // Clear search when closing
  };

  const handleClose = () => {
    onClose();
    setSearchTerm(''); // Clear search when closing
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Select Assignee
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          placeholder="Type username to search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: isLoading && (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        {searchTerm.length < 2 ? (
          <Typography color="textSecondary" align="center">
            Type at least 2 characters to search
          </Typography>
        ) : (
          <List sx={{ maxHeight: 300, overflow: 'auto' }}>
            {users?.map((user) => (
              <ListItem
                key={user.id}
                button
                onClick={() => handleSelect(user)}
                selected={currentAssignee?.id === user.id}
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  borderRadius: 1,
                  mb: 0.5,
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.username}
                  secondary={user.role}
                  primaryTypographyProps={{
                    variant: 'subtitle2',
                  }}
                />
              </ListItem>
            ))}
            {users?.length === 0 && (
              <Typography color="textSecondary" align="center">
                No users found
              </Typography>
            )}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default AssigneeSelector;
