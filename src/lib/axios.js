import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token from localStorage
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // If data is FormData, let browser set Content-Type (multipart/form-data)
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common errors
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // Unauthorized - clear auth and redirect to login
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('auth_user');
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                    console.error('Unauthorized access - please login');
                    break;
                case 403:
                    console.error('Forbidden - you do not have permission');
                    break;
                case 404:
                    console.error('Resource not found');
                    break;
                case 422:
                    // Validation error
                    console.error('Validation error:', error.response.data);
                    break;
                case 500:
                    console.error('Server error - please try again later');
                    break;
                default:
                    console.error('An error occurred:', error.response.data);
            }
        } else if (error.request) {
            console.error('No response received from server');
        } else {
            console.error('Error setting up request:', error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClient;
