import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../lib/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await axios.get('/user');
            setUser(response.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        // Get CSRF cookie first (required for SPA auth)
        await axios.get('/sanctum/csrf-cookie', { baseURL: '' });

        const response = await axios.post('/login', { email, password });
        setUser(response.data.user);
        return response.data;
    };

    const register = async (name, email, password, password_confirmation) => {
        await axios.get('/sanctum/csrf-cookie', { baseURL: '' });

        const response = await axios.post('/register', {
            name,
            email,
            password,
            password_confirmation
        });
        setUser(response.data.user);
        return response.data;
    };

    const logout = async () => {
        await axios.post('/logout');
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
