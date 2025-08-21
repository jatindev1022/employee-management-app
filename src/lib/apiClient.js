import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Enhanced request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    console.log('📤 Request data:', config.data);
    return config;
  },
  (error) => {
    console.error('💥 Request error:', error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.status} ${response.config.url}`);
    console.log('📥 Response data:', response.data);
    return response;
  },
  (error) => {
    console.error(`💥 ${error.response?.status} ${error.config?.url}`);
    console.error('💥 Error response:', error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('🔄 Unauthorized - redirecting to login');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

const api = {
  get: (url, config = {}) => axiosClient.get(url, config),
  post: (url, data = {}, config = {}) => axiosClient.post(url, data, config),
  put: (url, data = {}, config = {}) => axiosClient.put(url, data, config),
  patch: (url, data = {}, config = {}) => axiosClient.patch(url, data, config),
  delete: (url, config = {}) => axiosClient.delete(url, config),
};

export default api;
