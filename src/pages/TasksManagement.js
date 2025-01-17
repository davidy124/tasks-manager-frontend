import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Button,
  Box,
  Link,
  Chip
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { searchTasks, deleteTask } from '../api/tasks';
import Loading from '../components/Loading';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';
import CustomPagination from '../components/CustomPagination';

const priorityColors = {
  low: 'success',
  medium: 'warning',
  high: 'error'
};

function TasksManagement() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const { data, isLoading, isError, error } = useQuery(
    ['tasks', page, rowsPerPage],
    () => searchTasks({ offset: page, pageSize: rowsPerPage }),
    {
      keepPreviousData: true,
    }
  );

  const deleteMutation = useMutation(deleteTask, {
    onSuccess: () => {
      queryClient.invalidateQueries('tasks');
    },
  });

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      deleteMutation.mutate(taskToDelete.id);
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) return <Loading />;
  if (isError) return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', mt: 4, p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" component="div">
          Tasks Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/tasks/new"
        >
          New Task
        </Button>
      </Box>
      <Paper elevation={3}>
        <TableContainer>
          <Table aria-label="tasks table">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Assignee</TableCell>
                <TableCell align="center">Operations</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.content.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Link
                      component={RouterLink}
                      to={`/tasks/${task.id}`}
                      state={{ from: '/tasks-management' }}
                      color="inherit"
                      underline="hover"
                    >
                      {task.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={task.status} 
                      size="small"
                      color={task.status === 'done' ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={task.priority} 
                      size="small"
                      color={priorityColors[task.priority]}
                    />
                  </TableCell>
                  <TableCell>{task.assignee?.username}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      component={RouterLink}
                      to={`/tasks/edit/${task.id}`}
                      color="primary"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(task)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <CustomPagination
          count={data?.totalElements || 0}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message={`Are you sure you want to delete task "${taskToDelete?.title}"? This action cannot be undone.`}
        confirmButtonText="Delete Task"
      />
    </Box>
  );
}

export default TasksManagement;
