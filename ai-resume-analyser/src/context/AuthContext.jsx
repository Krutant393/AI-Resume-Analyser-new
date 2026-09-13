import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const data = await authApi.getMe();
            if (data && data.user) {
                setUser(data.user);
            } else {
                setUser(null);
                setToken(null);
                localStorage.removeItem('token');
            }
        } catch (error) {
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const data = await authApi.login({ email, password });
        if (data.token) {
            localStorage.setItem('token', data.token);
            setToken(data.token);
        }
        if (data.user) {
            setUser(data.user);
        }
        return data;
    };

    const signup = async (fullname, email, password) => {
        const data = await authApi.register({ fullname, email, password });
        if (data.token) {
            localStorage.setItem('token', data.token);
            setToken(data.token);
        }
        if (data.user) {
            setUser(data.user);
        }
        return data;
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!user,
                loading,
                login,
                signup,
                logout,
                checkAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
