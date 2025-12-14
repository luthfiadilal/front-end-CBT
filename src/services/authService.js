import api from './api';

const authService = {
    // Login user
    async login(credentials) {
        try {
            const response = await api.post('/login', credentials);
            if (response.data.data?.token) {
                localStorage.setItem('token', response.data.data.token);
                if (response.data.data.refresh_token) {
                    localStorage.setItem('refreshToken', response.data.data.refresh_token);
                }
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
                if (response.data.data.refresh_token) {
                    localStorage.setItem('refreshToken', response.data.data.refresh_token);
                }
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
                localStorage.setItem('profile', JSON.stringify(response.data.data.profile));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Logout user
    async logout() {
        try {
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
                // Inform backend to invalidate (optional depending on implementation)
                await api.post('/logout', { refresh_token: refreshToken }).catch(() => { });
            }
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            localStorage.removeItem('profile');
        }
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

    // Get refresh token
    getRefreshToken() {
        return localStorage.getItem('refreshToken');
    },

    // Set tokens (helper for refresh)
    setTokens(token, refreshToken) {
        localStorage.setItem('token', token);
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        }
    },


    // Update profile
    async updateProfile(profileData) {
        try {
            // ProfileData should be FormData object
            const response = await api.put('/profile', profileData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.data) {
                // Update local storage with new user/profile data
                if (response.data.data.user) {
                    localStorage.setItem('user', JSON.stringify(response.data.data.user));
                }
                if (response.data.data.profile) {
                    localStorage.setItem('profile', JSON.stringify(response.data.data.profile));
                }
            }

            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getToken();
    }
};

export default authService;
