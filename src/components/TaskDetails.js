import React from 'react';
import { useQuery } from 'react-query';
import { useParams, Link as RouterLink, useLocation } from 'react-router-dom';
import { Typography, Paper, Box, Chip, Button } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { getTask } from '../api/tasks';
import Loading from './Loading';

const priorityColors = {
  low: 'success',
  medium: 'warning',
  high: 'error'
};

function TaskDetails() {
  const { id } = useParams();
  const location = useLocation();
  const { data: task, isLoading, isError, error } = useQuery(
    ['task', id],
    () => getTask(id)
  );

  const backPath = location.state?.from || '/';
  const backLabel = backPath === '/' ? 'Back to Tasks' : 'Back to Tasks Management';

  if (isLoading) return <Loading />;
  if (isError) return <Typography color="error">Error: {error.message}</Typography>;
  if (!task) return <Typography>No task found.</Typography>;

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', mt: 4, p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>{task.title}</Typography>
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip 
            label={task.status} 
            color={task.status === 'done' ? 'success' : 'default'} 
          />
          <Chip 
            label={task.priority} 
            color={priorityColors[task.priority]} 
          />
          {task.tags?.map((tag) => (
            <Chip 
              key={tag}
              label={tag}
              variant="outlined"
              size="small"
            />
          ))}
        </Box>
        <Typography variant="subtitle1" gutterBottom>Description:</Typography>
        <Box sx={{ 
          backgroundColor: '#f5f5f5', 
          p: 2, 
          borderRadius: 1, 
          mb: 2,
          '& img': { maxWidth: '100%' },
          '& pre': { 
            backgroundColor: '#e0e0e0',
            padding: '8px',
            borderRadius: '4px',
            overflowX: 'auto'
          },
          '& code': {
            backgroundColor: '#e0e0e0',
            padding: '2px 4px',
            borderRadius: '4px',
          }
        }}>
          <ReactMarkdown>{task.description || ''}</ReactMarkdown>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="subtitle1">
            Created: {new Date(task.createTime).toLocaleString()}
          </Typography>
          <Typography variant="subtitle1">
            Due Date: {new Date(task.dueTime).toLocaleString()}
          </Typography>
          <Typography variant="subtitle1">
            Assignee: {task.assignee?.username}
          </Typography>
          <Typography variant="subtitle1">
            Created by: {task.creator?.username}
          </Typography>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Button 
            component={RouterLink} 
            to={backPath} 
            variant="outlined" 
            sx={{ mr: 2 }}
          >
            {backLabel}
          </Button>
          <Button 
            component={RouterLink} 
            to={`/tasks/edit/${task.id}`} 
            variant="contained" 
            color="primary"
          >
            Edit Task
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default TaskDetails;
