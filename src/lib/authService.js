import apiClient from './axios';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const authService = {
    /**
     * Login user dengan email dan password
     */
    login: async (email, password) => {
        try {
            const response = await apiClient.post('/api/login', {
                email,
                password,
            });

            const { access_token, user } = response.data;

            // Store token dan user info di localStorage
            localStorage.setItem(TOKEN_KEY, access_token);
            localStorage.setItem(USER_KEY, JSON.stringify(user));

            return { user, token: access_token };
        } catch (error) {
            // Clear storage jika login gagal
            authService.clearAuth();
            throw error;
        }
    },

    /**
     * Logout user
     */
    logout: async () => {
        try {
            // Call logout endpoint untuk invalidate token di server
            await apiClient.post('/api/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local storage regardless
            authService.clearAuth();
        }
    },

    /**
     * Get current user info dari server
     */
    getCurrentUser: async () => {
        try {
            const response = await apiClient.get('/api/me');
            const user = response.data;

            // Update user info di localStorage
            localStorage.setItem(USER_KEY, JSON.stringify(user));

            return user;
        } catch (error) {
            // Jika gagal get user, clear auth
            authService.clearAuth();
            throw error;
        }
    },

    /**
     * Get token dari localStorage
     */
    getToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },

    /**
     * Get user dari localStorage
     */
    getUser: () => {
        const userStr = localStorage.getItem(USER_KEY);
        if (!userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },

    /**
     * Check apakah user sudah login
     */
    isAuthenticated: () => {
        return !!authService.getToken();
    },

    /**
     * Clear auth data dari localStorage
     */
    clearAuth: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },
};

export default authService;
