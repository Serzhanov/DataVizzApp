import axios from 'axios';

// Create an instance of Axios with custom configuration
const api = axios.create({
  baseURL: 'http://127.0.0.1:5000', // Set the base URL for API requests
  headers: {
    'Content-Type': 'application/json', // Set default headers for all requests
    // Add any other default headers as needed
  },
});

// Add request interceptors
api.interceptors.request.use(
  config => {
    // Perform any modifications before sending the request
    // For example, you can add authentication tokens or handle request errors
    return config;
  },
  error => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Add response interceptors
api.interceptors.response.use(
  response => {
    // Handle successful responses
    // For example, you can handle common response statuses or modify the response data
    return response;
  },
  error => {
    // Handle response errors
    return Promise.reject(error);
  }
);

export default api;