import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import SimpleHeader from '../components/SimpleHeader';

function Login() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();

  const mutation = useMutation(
    login,
    {
      onSuccess: ({ token, user }) => {
        setAuth(token, user);
        navigate('/board', { replace: true });
      },
      onError: (error) => {
        reset(
          { password: '' }, 
          { keepValues: true }
        );
      },
    }
  );

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const getErrorMessage = () => {
    if (mutation.error?.response?.status === 403) {
      return 'Invalid username or password';
    }
    return 'Login failed. Please try again.';
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <SimpleHeader />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 64px)',
          p: 3,
          pt: { xs: 4, sm: 8 },
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400,
          }}
        >
          <Typography variant="h5" component="h1" gutterBottom textAlign="center">
            Login
          </Typography>
          {mutation.isError && (
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
              onClose={() => mutation.reset()}
            >
              {getErrorMessage()}
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <TextField
              fullWidth
              margin="normal"
              label="Username"
              {...register('username', { required: 'Username is required' })}
              error={!!errors.username}
              helperText={errors.username?.message}
              disabled={mutation.isLoading}
              autoFocus
            />
            <TextField
              fullWidth
              margin="normal"
              type="password"
              label="Password"
              autoComplete="new-password"
              {...register('password', { required: 'Password is required' })}
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={mutation.isLoading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}

export default Login;