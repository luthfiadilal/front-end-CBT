import api from './api';

const userService = {
    // Get all users
    async getAllUsers() {
        try {
            const response = await api.get('cbt/users');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Create user (Admin only)
    async createUser(userData) {
        try {
            const response = await api.post('cbt/users', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default userService;
