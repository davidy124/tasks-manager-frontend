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
  Checkbox,
  Button,
  CircularProgress
} from '@mui/material';
import { searchUsers } from '../api/users';

function AssigneeSelector({ open, onClose, onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const { data: users, isLoading, error } = useQuery(
    ['searchUsers', searchTerm],
    () => searchUsers(searchTerm),
    {
      enabled: searchTerm.length > 2,
    }
  );

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelect = (user) => {
    setSelectedUser(user);
  };

  const handleConfirm = () => {
    if (selectedUser) {
      onSelect(selectedUser);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Assignee</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Search users"
          fullWidth
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
        />
        {isLoading && <CircularProgress />}
        {error && <p>Error: {error.message}</p>}
        {users && (
          <List>
            {users.map((user) => (
              <ListItem key={user.id} dense button onClick={() => handleSelect(user)}>
                <Checkbox
                  edge="start"
                  checked={selectedUser && selectedUser.id === user.id}
                  tabIndex={-1}
                  disableRipple
                />
                <ListItemText primary={user.username} secondary={user.email} />
              </ListItem>
            ))}
          </List>
        )}
        <Button onClick={handleConfirm} color="primary" disabled={!selectedUser}>
          Confirm
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default AssigneeSelector;
