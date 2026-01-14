import axios from 'axios';
import authService from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/cbt';

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

// Variables to handle concurrency
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {

            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = 'Bearer ' + token;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

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

                    // Process the queue
                    processQueue(null, token);

                    // Retry the original request
                    return api(originalRequest);
                } else {
                    throw new Error("No refresh token available");
                }
            } catch (refreshError) {
                // If refresh fails, reject all queued requests and logout
                processQueue(refreshError, null);

                await authService.logout();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // If 401 and no retry or retry failed already (and not handled by refresh logic above)
        if (error.response?.status === 401 && !originalRequest._ignore401) {
            // Only redirect if we haven't just tried to refresh
            // The catch block above handles the refresh failure redirect
        }

        return Promise.reject(error);
    }
);

export default api;
