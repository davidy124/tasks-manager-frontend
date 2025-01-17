import axios from 'axios';

export const login = async (credentials) => {
  try {
    const response = await axios.post('/api/auth/login', credentials);
    const token = response.headers['authorization'];
    const userData = response.data;
    
    if (!token) {
      throw new Error('No token received');
    }
    
    return { token, user: userData };
  } catch (error) {
    if (error.response?.status === 403 || error.response?.status === 401) {
      throw new Error('Invalid username or password');
    }
    if (error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    }
    throw new Error('Login failed. Please try again.');
  }
}; 