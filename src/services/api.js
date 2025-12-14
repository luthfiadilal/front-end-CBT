import axios from 'axios';
import authService from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/cbt';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = authService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = authService.getRefreshToken();
                if (refreshToken) {
                    const response = await axios.post(`${API_BASE_URL}/refresh-token`, {
                        refresh_token: refreshToken
                    });

                    const { token, refresh_token: newRefreshToken } = response.data.data;

                    authService.setTokens(token, newRefreshToken);

                    // Update header in the original request
                    originalRequest.headers.Authorization = `Bearer ${token}`;

                    // Retry the original request
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // If refresh fails, fully logout
                await authService.logout();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // If 401 and no retry or retry failed already
        if (error.response?.status === 401) {
            await authService.logout();
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;
