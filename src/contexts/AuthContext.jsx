import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/lib/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Check auth status saat component mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            // Check apakah ada token di localStorage
            if (!authService.isAuthenticated()) {
                setLoading(false);
                return;
            }

            // Get user info dari localStorage dulu
            const localUser = authService.getUser();
            if (localUser) {
                setUser(localUser);
            }

            // Verify token dengan server
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
            authService.clearAuth();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const { user: loggedInUser } = await authService.login(email, password);
            setUser(loggedInUser);
            navigate('/');
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.errors?.email?.[0] ||
                'Login gagal. Silakan coba lagi.';
            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
        navigate('/login');
    };

    const value = {
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
