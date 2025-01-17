const isDevelopment = process.env.NODE_ENV === 'development';

// In development, use full URL, in production use relative path to work with nginx proxy
export const API_URL = isDevelopment ? 'http://localhost:8084' : '';