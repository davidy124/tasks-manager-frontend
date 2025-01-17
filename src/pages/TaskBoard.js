import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Box, Typography, Card, CardContent, Chip, Grid, Link, Avatar, Tooltip, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { searchTasks, updateTaskStatus } from '../api/tasks';
import Loading from '../components/Loading';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import ErrorDisplay from '../components/ErrorDisplay';
import { useAuth } from '../context/AuthContext';
import AutoDismissAlert from '../components/AutoDismissAlert';

const columns = [
  { id: 'todo', title: 'To Do', color: '#ff9800' },
  { id: 'processing', title: 'Processing', color: '#2196f3' },
  { id: 'done', title: 'Done', color: '#4caf50' }
];

const priorityColors = {
  low: '#8bc34a',
  medium: '#ffc107',
  high: '#f44336'
};

function TaskBoard() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: tasksData, isLoading, isError, error } = useQuery(
    ['tasks', user.id],
    () => searchTasks({ assigneeId: user.id, pageSize: 100 }),
    {
      select: (data) => data.content,
    }
  );

  const tasks = Array.isArray(tasksData) ? tasksData : [];

  const updateTaskMutation = useMutation(
    ({ taskId, status }) => updateTaskStatus(taskId, status),
    {
      onMutate: async ({ taskId, status }) => {
        await queryClient.cancelQueries(['tasks', user.id]);

        const previousData = queryClient.getQueryData(['tasks', user.id]);

        queryClient.setQueryData(['tasks', user.id], old => {
          if (!old || !old.content) return old;
          return {
            ...old,
            content: old.content.map(task =>
              task.id === taskId ? { ...task, status } : task
            )
          };
        });

        return { previousData };
      },
      onError: (err, variables, context) => {
        queryClient.setQueryData(['tasks', user.id], context.previousData);
      },
      onSettled: () => {
        queryClient.invalidateQueries(['tasks', user.id]);
      },
    }
  );

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { draggableId, source, destination } = result;
    const task = tasks.find(t => t.id === draggableId);

    if (source.droppableId !== destination.droppableId) {
      updateTaskMutation.mutate({
        taskId: task.id,
        status: destination.droppableId
      });
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <ErrorDisplay error={error} />;

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      {tasks.length === 0 && (
        <AutoDismissAlert
          message="No tasks found. Create a new task to get started!"
          severity="info"
          duration={5000}
        />
      )}
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
        Task Board
      </Typography>
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={3}>
          {columns.map(column => (
            <Grid item xs={12} md={4} key={column.id}>
              <Box sx={{ backgroundColor: 'white', borderRadius: 2, p: 2, height: '100%', boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  textTransform: 'uppercase', 
                  fontWeight: 'bold', 
                  color: column.color,
                  borderBottom: `2px solid ${column.color}`,
                  paddingBottom: 1
                }}>
                  {column.title}
                </Typography>
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{ minHeight: 500 }}
                    >
                      {tasks
                        .filter(task => task.status === column.id)
                        .map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{ 
                                  mb: 2, 
                                  '&:last-child': { mb: 0 },
                                  transition: 'box-shadow 0.3s',
                                  '&:hover': {
                                    boxShadow: 6,
                                  }
                                }}
                              >
                                <CardContent>
                                  <Link 
                                    component={RouterLink} 
                                    to={`/tasks/${task.id}`} 
                                    state={{ from: '/board' }} 
                                    color="inherit" 
                                    underline="hover"
                                  >
                                    <Typography variant="h6" gutterBottom>{task.title}</Typography>
                                  </Link>
                                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Chip 
                                      label={task.priority} 
                                      size="small" 
                                      sx={{ 
                                        backgroundColor: priorityColors[task.priority],
                                        color: 'white',
                                        fontWeight: 'bold'
                                      }} 
                                    />
                                    <Tooltip title={new Date(task.dueTime).toLocaleString()}>
                                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                        <Typography variant="caption">
                                          {new Date(task.dueTime).toLocaleDateString()}
                                        </Typography>
                                      </Box>
                                    </Tooltip>
                                  </Box>
                                  {task.assignee && (
                                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                                      <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'primary.main' }}>
                                        <PersonIcon sx={{ fontSize: 16 }} />
                                      </Avatar>
                                      <Typography variant="body2">{task.assignee.username}</Typography>
                                    </Box>
                                  )}
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </Box>
            </Grid>
          ))}
        </Grid>
      </DragDropContext>
    </Container>
  );
}

export default TaskBoard;
