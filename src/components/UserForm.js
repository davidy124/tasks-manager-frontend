import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { createUser, updateUser, getUser } from '../api/users';

function UserForm() {
  const { id } = useParams();
  const isEditMode = !!id;
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: user, isLoading: isUserLoading } = useQuery(['user', id], () => getUser(id), {
    enabled: isEditMode,
    onSuccess: (data) => reset(data),
  });

  const mutation = useMutation(isEditMode ? updateUser : createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      navigate('/users');
    },
  });

  const onSubmit = (data) => {
    if (isEditMode) {
      mutation.mutate({ id, ...data });
    } else {
      mutation.mutate(data);
    }
  };

  if (isEditMode && isUserLoading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        {isEditMode ? 'Edit User' : 'Create New User'}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          margin="normal"
          label="Username"
          defaultValue={user?.username || ''}
          {...register('username', { required: 'Username is required' })}
          error={!!errors.username}
          helperText={errors.username?.message}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          type="email"
          defaultValue={user?.email || ''}
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            }
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? 'Saving...' : (isEditMode ? 'Update User' : 'Create User')}
        </Button>
      </form>
    </Box>
  );
}

export default UserForm;
