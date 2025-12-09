import api from './api';

const authService = {
    // Login user
    async login(credentials) {
        try {
            const response = await api.post('/login', credentials);
            if (response.data.data?.token) {
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
                localStorage.setItem('profile', JSON.stringify(response.data.data.profile));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Register user
    async register(userData) {
        try {
            const response = await api.post('/register', userData);
            if (response.data.data?.token) {
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
                localStorage.setItem('profile', JSON.stringify(response.data.data.profile));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Logout user
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('profile');
    },

    // Get current user
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Get token
    getToken() {
        return localStorage.getItem('token');
    },

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getToken();
    }
};

export default authService;
