import axios from 'axios';

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getUsers = () => axios.get('/api/users', {
  headers: getAuthHeader()
}).then(res => res.data);

export const getUser = (id) => axios.get(`/api/users/${id}`, {
  headers: getAuthHeader()
}).then(res => res.data);

export const createUser = (userData) => axios.post('/api/users', userData, {
  headers: getAuthHeader()
})
  .then(res => res.data)
  .catch(error => {
    console.error('Error creating user:', error.response || error);
    throw error;
  });

export const updateUser = ({ id, ...userData }) => axios.put(`/api/users/${id}`, userData, {
  headers: getAuthHeader()
})
  .then(res => res.data)
  .catch(error => {
    console.error('Error updating user:', error.response || error);
    throw error;
  });

export const deleteUser = (id) => axios.delete(`/api/users/${id}`, {
  headers: getAuthHeader()
})
  .then(res => res.data)
  .catch(error => {
    console.error('Error deleting user:', error.response || error);
    throw error;
  });

export const searchUsers = (username) => 
  axios.get(`/api/users/search?username=${encodeURIComponent(username)}`, {
    headers: getAuthHeader()
  }).then(res => res.data);

export const updateUserPassword = (userId, { oldPassword, newPassword }) => 
  axios.post(`/api/users/${userId}/password`, 
    { oldPassword, newPassword },
    { headers: getAuthHeader() }
  )
  .then(res => res.data)
  .catch(error => {
    if (error.response?.status === 403) {
      throw new Error('Current password is incorrect');
    }
    throw error;
  });
