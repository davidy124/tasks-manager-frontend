import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Link,
  TextField,
  Button,
  Grid,
  MenuItem,
  Collapse,
  IconButton,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import FilterListIcon from '@mui/icons-material/FilterList';
import { format } from 'date-fns';
import { searchTasks } from '../api/tasks';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import CustomPagination from '../components/CustomPagination';
import AddIcon from '@mui/icons-material/Add';

const priorityColors = {
  low: 'success',
  medium: 'warning',
  high: 'error'
};

const statusOptions = [
  { value: '', label: 'All' },
  { value: 'todo', label: 'To Do' },
  { value: 'processing', label: 'Processing' },
  { value: 'done', label: 'Done' },
];

function TaskList() {
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      titleKeyword: '',
      status: '',
      createTimeStart: null,
      createTimeEnd: null,
      dueTimeStart: null,
      dueTimeEnd: null,
      assigneeId: user.id,
    }
  });

  const [searchParams, setSearchParams] = useState({
    assigneeId: user.id,
  });

  const { data, isLoading, isError, error } = useQuery(
    ['tasks', searchParams, page, rowsPerPage],
    () => searchTasks({ 
      ...searchParams, 
      offset: page, 
      pageSize: rowsPerPage
    }),
    {
      keepPreviousData: true,
    }
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onSubmit = (formData) => {
    const searchData = {
      assigneeId: user.id,
    };

    if (formData.titleKeyword) {
      searchData.titleKeyword = formData.titleKeyword;
    }
    if (formData.status) {
      searchData.status = formData.status;
    }
    if (formData.createTimeStart) {
      searchData.createTimeStart = format(formData.createTimeStart, 'yyyy-MM-dd');
    }
    if (formData.createTimeEnd) {
      searchData.createTimeEnd = format(formData.createTimeEnd, 'yyyy-MM-dd');
    }
    if (formData.dueTimeStart) {
      searchData.dueTimeStart = format(formData.dueTimeStart, 'yyyy-MM-dd');
    }
    if (formData.dueTimeEnd) {
      searchData.dueTimeEnd = format(formData.dueTimeEnd, 'yyyy-MM-dd');
    }

    setSearchParams(searchData);
    setPage(0);
  };

  const handleReset = () => {
    reset({
      titleKeyword: '',
      status: '',
      createTimeStart: null,
      createTimeEnd: null,
      dueTimeStart: null,
      dueTimeEnd: null,
      assigneeId: user.id,
    });
    setSearchParams({ assigneeId: user.id });
    setPage(0);
  };

  if (isLoading) return <Loading />;
  if (isError) return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', mt: 4, p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" component="div">
          My Tasks
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={RouterLink}
            to="/tasks/new"
          >
            New Task
          </Button>
          <IconButton onClick={() => setShowFilters(!showFilters)} color="primary">
            <FilterListIcon />
          </IconButton>
        </Box>
      </Box>

      <Collapse in={showFilters}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Title Keyword"
                    {...register('titleKeyword')}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Status"
                    {...register('status')}
                  >
                    {statusOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="createTimeStart"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        value={value}
                        onChange={onChange}
                        label="Create Date From"
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="createTimeEnd"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        value={value}
                        onChange={onChange}
                        label="Create Date To"
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="dueTimeStart"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        value={value}
                        onChange={onChange}
                        label="Due Date From"
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="dueTimeEnd"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        value={value}
                        onChange={onChange}
                        label="Due Date To"
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button onClick={handleReset} variant="outlined">
                      Reset
                    </Button>
                    <Button type="submit" variant="contained">
                      Search
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </LocalizationProvider>
          </form>
        </Paper>
      </Collapse>

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Due Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.content.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Link
                      component={RouterLink}
                      to={`/tasks/${task.id}`}
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
                  <TableCell>
                    {new Date(task.dueTime).toLocaleDateString()}
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
    </Box>
  );
}

export default TaskList; 