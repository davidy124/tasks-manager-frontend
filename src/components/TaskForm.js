import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { createTask, updateTask, getTask } from '../api/tasks';
import Loading from './Loading';

function TaskForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const { control, register, handleSubmit, formState: { errors }, reset } = useForm();

  const { data: task, isLoading: isTaskLoading } = useQuery(['task', id], () => getTask(id), {
    enabled: isEditMode,
    onSuccess: (data) => reset(data),
  });

  const mutation = useMutation(isEditMode ? updateTask : createTask, {
    onSuccess: () => {
      queryClient.invalidateQueries('tasks');
      navigate('/tasks-management');
    },
  });

  const onSubmit = (data) => {
    if (isEditMode) {
      mutation.mutate({ taskId: id, updates: data });
    } else {
      mutation.mutate(data);
    }
  };

  if (isEditMode && isTaskLoading) return <Loading />;

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        {isEditMode ? 'Edit Task' : 'Create New Task'}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          margin="normal"
          label="Title"
          defaultValue={task?.title || ''}
          {...register('title', { required: 'Title is required' })}
          error={!!errors.title}
          helperText={errors.title?.message}
        />
        <TextField
          select
          fullWidth
          margin="normal"
          label="Status"
          defaultValue={task?.status || 'todo'}
          {...register('status', { required: 'Status is required' })}
          error={!!errors.status}
          helperText={errors.status?.message}
        >
          <MenuItem value="todo">To Do</MenuItem>
          <MenuItem value="doing">Doing</MenuItem>
          <MenuItem value="done">Done</MenuItem>
        </TextField>
        <Box mt={2} mb={2}>
          <Typography variant="subtitle1" gutterBottom>
            Description (Markdown supported)
          </Typography>
          <Controller
            name="description"
            control={control}
            defaultValue={task?.description || ''}
            render={({ field }) => (
              <MDEditor
                value={field.value}
                onChange={field.onChange}
                preview="edit"
              />
            )}
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? 'Saving...' : (isEditMode ? 'Update Task' : 'Create Task')}
        </Button>
      </form>
    </Box>
  );
}

export default TaskForm;
