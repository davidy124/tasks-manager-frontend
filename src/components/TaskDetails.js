import React from 'react';
import { useQuery } from 'react-query';
import { useParams, Link as RouterLink, useLocation } from 'react-router-dom';
import { Typography, Paper, Box, Chip, Button } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { getTask } from '../api/tasks';
import Loading from './Loading';

function TaskDetails() {
  const { id } = useParams();
  const location = useLocation();
  const { data: task, isLoading, isError, error } = useQuery(['task', id], () => getTask(id));

  const backPath = location.state?.from || '/';
  const backLabel = backPath === '/' ? 'Back to Board' : 'Back to Tasks';

  if (isLoading) return <Loading />;
  if (isError) return <Typography color="error">Error: {error.message}</Typography>;
  if (!task) return <Typography>No task found.</Typography>;

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', mt: 4, p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>{task.title}</Typography>
        <Box sx={{ mb: 2 }}>
          <Chip label={task.status} color="primary" sx={{ mr: 1 }} />
          <Chip label={task.priority} color="secondary" />
        </Box>
        <Typography variant="subtitle1" gutterBottom>Description:</Typography>
        <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2 }}>
          <ReactMarkdown>{task.description}</ReactMarkdown>
        </Box>
        <Typography variant="subtitle1" gutterBottom>Due Date: {new Date(task.due_date).toLocaleString()}</Typography>
        <Typography variant="subtitle1" gutterBottom>Assignee: {task.assignee}</Typography>
        <Box sx={{ mt: 3 }}>
          <Button 
            component={RouterLink} 
            to={backPath} 
            variant="outlined" 
            sx={{ mr: 2 }}
          >
            {backLabel}
          </Button>
          <Button component={RouterLink} to={`/tasks/edit/${task.id}`} variant="contained" color="primary">
            Edit Task
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default TaskDetails;
