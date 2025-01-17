import axios from 'axios';

// Add axios interceptor to include the token in all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getTasks = () => axios.get('/api/tasks').then(res => res.data);

export const searchTasks = ({ page = 0, size = 10, ...searchParams }) => 
  axios.post(`/api/tasks/search?offset=${page}&pageSize=${size}`, searchParams)
    .then(res => res.data);

export const getTask = (id) => axios.get(`/api/tasks/${id}?include=assignee`).then(res => res.data);

export const createTask = (taskData) => axios.post('/api/tasks', taskData).then(res => res.data);

export const updateTask = ({ taskId, updates }) => 
  axios.put(`/api/tasks/${taskId}`, updates).then(res => res.data);

export const deleteTask = (taskId) => axios.delete(`/api/tasks/${taskId}`).then(res => res.data);

export const updateTaskStatus = (taskId, status) => 
  axios.put('/api/tasks/status', { 
    id: taskId,
    status: status 
  })
  .then(res => res.data);
