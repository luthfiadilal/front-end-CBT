import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const currentUser = authService.getCurrentUser();
        const currentProfile = JSON.parse(localStorage.getItem('profile'));

        if (currentUser) {
            setUser(currentUser);
        }
        if (currentProfile) {
            setProfile(currentProfile);
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            // response = { success: true, data: { user, profile, token } }
            if (response.data?.user) {
                setUser(response.data.user);
            }
            if (response.data?.profile) {
                setProfile(response.data.profile);
            }
            return response;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setProfile(null);
    };

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            // Auto login after registration
            if (response.data?.user) {
                setUser(response.data.user);
            }
            if (response.data?.profile) {
                setProfile(response.data.profile);
            }
            return response;
        } catch (error) {
            throw error;
        }
    };

    const value = {
        user,
        profile,
        login,
        logout,
        register,
        isAuthenticated: !!user,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
