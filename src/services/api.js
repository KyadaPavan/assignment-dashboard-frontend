import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const portfolioApi = {
  // Get complete portfolio data
  getPortfolio: async (forceRefresh = false) => {
    try {
      const params = forceRefresh ? { refresh: 'true' } : {};
      const response = await api.get('/portfolio', { params });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch portfolio: ${error.message}`);
    }
  },

  // Get portfolio summary only
  getPortfolioSummary: async () => {
    try {
      const response = await api.get('/portfolio/summary');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch portfolio summary: ${error.message}`);
    }
  },

  // Get sector data only
  getSectorData: async () => {
    try {
      const response = await api.get('/portfolio/sectors');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch sector data: ${error.message}`);
    }
  },

  // Clear cache for fresh data
  clearCache: async () => {
    try {
      const response = await api.delete('/portfolio/cache');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to clear cache: ${error.message}`);
    }
  },

};

export default api;
