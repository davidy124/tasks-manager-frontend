import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography,
  IconButton,
  Button,
  Box,
  Chip,
  Tooltip,
  Link
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import KeyIcon from '@mui/icons-material/Key';
import { getUsers, deleteUser } from '../api/users';
import Loading from '../components/Loading';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';
import UpdatePasswordDialog from '../components/UpdatePasswordDialog';

const roleColors = {
  'ADMIN': 'error',
  'USER': 'primary'
};

function UserManagement() {
  const queryClient = useQueryClient();
  const { data: users, isLoading, isError, error } = useQuery('users', getUsers);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const deleteMutation = useMutation(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
    },
  });

  const isAdminUser = (user) => {
    return user.username === 'admin' && user.role === 'ADMIN';
  };

  const handleDeleteClick = (user) => {
    if (isAdminUser(user)) {
      return;
    }
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete && !isAdminUser(userToDelete)) {
      deleteMutation.mutate(userToDelete.id);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleUpdatePassword = (user) => {
    setSelectedUser(user);
    setPasswordDialogOpen(true);
  };

  if (isLoading) return <Loading />;
  if (isError) return <Typography color="error">Error: {error.message}</Typography>;
  if (!users) return <Typography>No users found.</Typography>;

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" component="div">
          User Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/users/new"
        >
          New User
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="center">Operations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role}
                    color={roleColors[user.role] || 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Link 
                    component={RouterLink} 
                    to={`/users/edit/${user.id}`}
                  >
                    <IconButton color="primary" size="small">
                      <EditIcon />
                    </IconButton>
                  </Link>
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => handleUpdatePassword(user)}
                  >
                    <KeyIcon />
                  </IconButton>
                  <Tooltip title={isAdminUser(user) ? "Admin user cannot be deleted" : ""}>
                    <span>
                      <IconButton 
                        onClick={() => handleDeleteClick(user)} 
                        color="error" 
                        size="small"
                        disabled={isAdminUser(user)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message={`Are you sure you want to delete user "${userToDelete?.username}"? This action cannot be undone.`}
        confirmButtonText="Delete User"
      />
      <UpdatePasswordDialog
        open={passwordDialogOpen}
        onClose={() => {
          setPasswordDialogOpen(false);
          setSelectedUser(null);
        }}
        userId={selectedUser?.id}
        username={selectedUser?.username}
      />
    </Box>
  );
}

export default UserManagement;
