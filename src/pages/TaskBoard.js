import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Box, Typography, Card, CardContent } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { getTasks, updateTask } from '../api/tasks';
import Loading from '../components/Loading';

const columns = ['todo', 'doing', 'done'];

function TaskBoard() {
  const queryClient = useQueryClient();
  const { data: tasks, isLoading, isError, error } = useQuery('tasks', getTasks);

  const updateTaskMutation = useMutation(
    ({ taskId, updates }) => updateTask(taskId, updates),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks');
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
        updates: { status: destination.droppableId }
      });
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <Typography color="error">Error: {error.message}</Typography>;
  if (!tasks) return <Typography>No tasks found.</Typography>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box display="flex" justifyContent="space-around" p={2}>
        {columns.map(column => (
          <Box key={column} width="30%">
            <Typography variant="h6" gutterBottom>{column.toUpperCase()}</Typography>
            <Droppable droppableId={column}>
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  minHeight="200px"
                  border="1px dashed grey"
                  borderRadius="4px"
                  p={1}
                >
                  {tasks
                    .filter(task => task.status === column)
                    .map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{ mb: 1 }}
                          >
                            <CardContent>
                              <Typography variant="h6">{task.title}</Typography>
                              <ReactMarkdown>{task.description || ''}</ReactMarkdown>
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
        ))}
      </Box>
    </DragDropContext>
  );
}

export default TaskBoard;
