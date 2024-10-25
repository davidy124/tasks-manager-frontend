import axios from 'axios';

const API_URL = '/api';  // This should be correct

export const getTasks = () => axios.get(`${API_URL}/tasks`).then(res => res.data);

export const getTask = (id) => axios.get(`${API_URL}/tasks/${id}`).then(res => res.data);

export const createTask = (taskData) => axios.post(`${API_URL}/tasks`, taskData).then(res => res.data);

export const updateTask = ({ taskId, updates }) => axios.put(`${API_URL}/tasks/${taskId}`, updates).then(res => res.data);

export const deleteTask = (taskId) => axios.delete(`${API_URL}/tasks/${taskId}`).then(res => res.data);
