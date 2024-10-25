import axios from 'axios';

const API_URL = '/api';  // This should be correct

export const getUsers = () => axios.get(`${API_URL}/users`)
  .then(res => res.data)
  .catch(error => {
    console.error('Error fetching users:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw error;
  });

export const getUser = (id) => axios.get(`${API_URL}/users/${id}`).then(res => res.data);

export const createUser = (userData) => axios.post(`${API_URL}/users`, userData)
  .then(res => res.data)
  .catch(error => {
    console.error('Error creating user:', error.response || error);
    throw error;
  });

export const updateUser = ({ id, ...userData }) => axios.put(`${API_URL}/users/${id}`, userData)
  .then(res => res.data)
  .catch(error => {
    console.error('Error updating user:', error.response || error);
    throw error;
  });

export const deleteUser = (id) => axios.delete(`${API_URL}/users/${id}`)
  .then(res => res.data)
  .catch(error => {
    console.error('Error deleting user:', error.response || error);
    throw error;
  });

// Add this function to the existing file
export const searchUsers = (searchTerm) => 
  axios.get(`${API_URL}/users?search=${searchTerm}`).then(res => res.data);
