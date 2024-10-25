import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate, useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { format } from 'date-fns';
import { createTask, updateTask, getTask } from '../api/tasks';
import { getUser } from '../api/users';
import Loading from './Loading';
import AssigneeSelector from './AssigneeSelector';

function TaskForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const { control, register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
  const [assignee, setAssignee] = useState(null);
  const [isAssigneeSelectorOpen, setIsAssigneeSelectorOpen] = useState(false);

  const { data: task, isLoading: isTaskLoading } = useQuery(['task', id], () => getTask(id), {
    enabled: isEditMode,
    onSuccess: (data) => {
      reset({
        ...data,
        due_date: data.due_date ? new Date(data.due_date) : null,
      });
      if (data.assignee) {
        loadAssignee(data.assignee);
      }
    },
  });

  const loadAssignee = async (assigneeId) => {
    try {
      const userData = await getUser(assigneeId);
      setAssignee(userData);
    } catch (error) {
      console.error('Error loading assignee:', error);
    }
  };

  const mutation = useMutation(isEditMode ? updateTask : createTask, {
    onSuccess: () => {
      queryClient.invalidateQueries('tasks');
      navigate('/tasks-management');
    },
  });

  const onSubmit = (data) => {
    const taskData = {
      ...data,
      assignee: assignee ? assignee.id : null,
      due_date: data.due_date ? format(data.due_date, "yyyy-MM-dd'T'HH:mm:ss'Z'") : null,
    };
    if (isEditMode) {
      mutation.mutate({ taskId: id, updates: taskData });
    } else {
      mutation.mutate(taskData);
    }
  };

  const handleAssigneeSelect = (selectedUser) => {
    setAssignee(selectedUser);
    setValue('assignee', selectedUser.id);
  };

  if (isEditMode && isTaskLoading) return <Loading />;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ maxWidth: 800, margin: 'auto', mt: 4, mb: 8, px: 2 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
            {isEditMode ? 'Edit Task' : 'Create New Task'}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              margin="normal"
              label="Title"
              {...register('title', { required: 'Title is required' })}
              error={!!errors.title}
              helperText={errors.title?.message}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
              <InputLabel id="priority-label">Priority</InputLabel>
              <Controller
                name="priority"
                control={control}
                defaultValue=""
                rules={{ required: 'Priority is required' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="priority-label"
                    label="Priority"
                    error={!!errors.priority}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                )}
              />
              {errors.priority && <Typography color="error">{errors.priority.message}</Typography>}
            </FormControl>
            <Controller
              name="due_date"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <DateTimePicker
                  {...field}
                  label="Due Date"
                  renderInput={(params) => <TextField {...params} fullWidth margin="normal" sx={{ mb: 2 }} />}
                />
              )}
            />
            <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
              <InputLabel id="status-label">Status</InputLabel>
              <Controller
                name="status"
                control={control}
                defaultValue=""
                rules={{ required: 'Status is required' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="status-label"
                    label="Status"
                    error={!!errors.status}
                  >
                    <MenuItem value="todo">To Do</MenuItem>
                    <MenuItem value="doing">Doing</MenuItem>
                    <MenuItem value="done">Done</MenuItem>
                  </Select>
                )}
              />
              {errors.status && <Typography color="error">{errors.status.message}</Typography>}
            </FormControl>
            <Box mt={2} mb={2}>
              <Typography variant="subtitle1" gutterBottom>
                Description (Markdown supported)
              </Typography>
              <Controller
                name="description"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <MDEditor
                    value={field.value}
                    onChange={field.onChange}
                    preview="edit"
                  />
                )}
              />
            </Box>
            <Box mt={2} mb={2}>
              <Typography variant="subtitle1" gutterBottom>
                Assignee
              </Typography>
              <TextField
                fullWidth
                value={assignee ? assignee.username : ''}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ mb: 1 }}
              />
              <Button variant="outlined" onClick={() => setIsAssigneeSelectorOpen(true)}>
                Select Assignee
              </Button>
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, mb: 2, py: 1.5 }}
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? 'Saving...' : (isEditMode ? 'Update Task' : 'Create Task')}
            </Button>
          </form>
        </Paper>
        <AssigneeSelector
          open={isAssigneeSelectorOpen}
          onClose={() => setIsAssigneeSelectorOpen(false)}
          onSelect={handleAssigneeSelect}
        />
      </Box>
    </LocalizationProvider>
  );
}

export default TaskForm;
