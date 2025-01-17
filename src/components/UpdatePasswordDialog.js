import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { updateUserPassword } from '../api/users';

function UpdatePasswordDialog({ open, onClose, userId, username }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  const newPassword = watch('newPassword');

  const mutation = useMutation(
    (data) => updateUserPassword(userId, {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        reset();
        onClose();
      },
    }
  );

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Update Password for {username}</DialogTitle>
        <DialogContent>
          {mutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {mutation.error.message || 'Failed to update password'}
            </Alert>
          )}
          <TextField
            fullWidth
            margin="normal"
            type="password"
            label="Current Password"
            {...register('oldPassword', {
              required: 'Current password is required'
            })}
            error={!!errors.oldPassword}
            helperText={errors.oldPassword?.message}
          />
          <TextField
            fullWidth
            margin="normal"
            type="password"
            label="New Password"
            {...register('newPassword', {
              required: 'New password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
          />
          <TextField
            fullWidth
            margin="normal"
            type="password"
            label="Confirm New Password"
            {...register('confirmPassword', {
              required: 'Please confirm new password',
              validate: value => value === newPassword || 'Passwords do not match'
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default UpdatePasswordDialog; 