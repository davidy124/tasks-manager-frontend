import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { createUser, updateUser, getUser } from '../api/users';
import Loading from './Loading';

function UserForm() {
  const { id } = useParams();
  const isEditMode = !!id;
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      username: '',
      role: 'USER',
    }
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: user, isLoading: isUserLoading } = useQuery(
    ['user', id],
    () => getUser(id),
    {
      enabled: isEditMode,
      onSuccess: (data) => {
        reset({
          username: data.username,
          role: data.role,
        });
      },
    }
  );

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
    return <Loading />;
  }

  return (
    <Box sx={{ maxWidth: 500, margin: 'auto', mt: 4, px: 2 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          {isEditMode ? 'Edit User' : 'Create New User'}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            {...register('username', { 
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters'
              }
            })}
            error={!!errors.username}
            helperText={errors.username?.message}
          />

          <FormControl 
            fullWidth 
            margin="normal"
            error={!!errors.role}
          >
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              label="Role"
              defaultValue="USER"
              {...register('role', { required: 'Role is required' })}
            >
              <MenuItem value="USER">User</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
            </Select>
            {errors.role && (
              <FormHelperText>{errors.role.message}</FormHelperText>
            )}
          </FormControl>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/users')}
              sx={{ flex: 1 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ flex: 1 }}
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? 'Saving...' : (isEditMode ? 'Update User' : 'Create User')}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default UserForm;
