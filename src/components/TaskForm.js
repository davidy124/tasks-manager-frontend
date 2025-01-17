import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Paper,
  Chip,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate, useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { format, addDays } from 'date-fns';
import AddIcon from '@mui/icons-material/Add';
import { createTask, updateTask, getTask } from '../api/tasks';
import Loading from './Loading';
import { useAuth } from '../context/AuthContext';
import AssigneeSelector from './AssigneeSelector';
import AutoDismissAlert from './AutoDismissAlert';

const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'processing', label: 'Processing' },
  { value: 'done', label: 'Done' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

function TaskForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isEditMode = !!id;
  const [assignee, setAssignee] = useState(null);
  const [isAssigneeSelectorOpen, setIsAssigneeSelectorOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const { control, register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'low',
      dueTime: addDays(new Date(), 1),
    }
  });

  const { data: task, isLoading: isTaskLoading } = useQuery(
    ['task', id],
    () => getTask(id),
    {
      enabled: isEditMode,
      onSuccess: (data) => {
        reset({
          ...data,
          dueTime: data.dueTime ? new Date(data.dueTime) : null,
        });
        setTags(data.tags || []);
        if (data.assignee) {
          setAssignee(data.assignee);
        }
      },
    }
  );

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag) && tags.length < 5) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newTag) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const mutation = useMutation(isEditMode ? updateTask : createTask, {
    onSuccess: () => {
      queryClient.invalidateQueries('tasks');
      setShowSuccessAlert(true);
      setTimeout(() => {
        navigate('/tasks-management');
      }, 1500);
    },
  });

  const onSubmit = (data) => {
    const taskData = {
      ...data,
      tags,
      creator: {
        id: user.id
      },
      assignee: {
        id: assignee?.id || user.id
      },
      dueTime: data.dueTime ? format(data.dueTime, 'yyyy-MM-dd\'T\'HH:mm:ss') : null,
    };

    if (isEditMode) {
      mutation.mutate({ taskId: id, updates: taskData });
    } else {
      mutation.mutate(taskData);
    }
  };

  if (isEditMode && isTaskLoading) return <Loading />;

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', mt: 4, mb: 8, px: 2 }}>
      {showSuccessAlert && (
        <AutoDismissAlert
          message={`Task ${isEditMode ? 'updated' : 'created'} successfully!`}
          severity="success"
          duration={1500}
        />
      )}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          {isEditMode ? 'Edit Task' : 'Create New Task'}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            margin="normal"
            label="Title *"
            {...register('title', {
              required: 'Title is required',
              minLength: {
                value: 3,
                message: 'Title must be at least 3 characters'
              },
              maxLength: {
                value: 100,
                message: 'Title must not exceed 100 characters'
              }
            })}
            error={!!errors.title}
            helperText={errors.title?.message}
            placeholder="Enter task title"
          />

          <Box mt={2} mb={2}>
            <Typography variant="subtitle1" gutterBottom>
              Description (Markdown supported)
            </Typography>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <MDEditor
                  value={field.value}
                  onChange={field.onChange}
                  preview="edit"
                />
              )}
            />
          </Box>

          <TextField
            select
            fullWidth
            margin="normal"
            label="Priority"
            defaultValue="low"
            {...register('priority', { required: 'Priority is required' })}
            error={!!errors.priority}
            helperText={errors.priority?.message}
          >
            {priorityOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            margin="normal"
            label="Status"
            defaultValue="todo"
            {...register('status', { required: 'Status is required' })}
            error={!!errors.status}
            helperText={errors.status?.message}
          >
            {statusOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Controller
              name="dueTime"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  label="Due Date & Time"
                  value={field.value}
                  onChange={field.onChange}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth margin="normal" />
                  )}
                />
              )}
            />
          </LocalizationProvider>

          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Assignee
            </Typography>
            <TextField
              fullWidth
              value={assignee?.username || user.username}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <Button onClick={() => setIsAssigneeSelectorOpen(true)}>
                    Change
                  </Button>
                ),
              }}
              sx={{ mb: 1 }}
            />
          </Box>

          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Tags (max 5)
            </Typography>
            <TextField
              fullWidth
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type and press Enter to add tag"
              disabled={tags.length >= 5}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={handleAddTag}
                      disabled={!newTag || tags.length >= 5}
                      size="small"
                    >
                      <AddIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleDeleteTag(tag)}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
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
              {mutation.isLoading ? 'Saving...' : (isEditMode ? 'Update Task' : 'Create Task')}
            </Button>
          </Box>
        </form>
      </Paper>

      <AssigneeSelector
        open={isAssigneeSelectorOpen}
        onClose={() => setIsAssigneeSelectorOpen(false)}
        onSelect={setAssignee}
        currentAssignee={assignee}
      />
    </Box>
  );
}

export default TaskForm;
