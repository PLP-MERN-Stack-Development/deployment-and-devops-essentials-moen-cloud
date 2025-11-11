import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data.message || 'Server error occurred');
    } else if (error.request) {
      // Request made but no response
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something else happened
      throw new Error('An unexpected error occurred');
    }
  }
);

/**
 * Get all bugs with optional filters
 */
export const getAllBugs = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.severity) params.append('severity', filters.severity);
    
    const response = await api.get(`/bugs?${params.toString()}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get single bug by ID
 */
export const getBugById = async (id) => {
  try {
    const response = await api.get(`/bugs/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create new bug
 */
export const createBug = async (bugData) => {
  try {
    const response = await api.post('/bugs', bugData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update existing bug
 */
export const updateBug = async (id, bugData) => {
  try {
    const response = await api.put(`/bugs/${id}`, bugData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete bug
 */
export const deleteBug = async (id) => {
  try {
    const response = await api.delete(`/bugs/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get bug statistics
 */
export const getBugStats = async () => {
  try {
    const response = await api.get('/bugs/stats');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export default api;