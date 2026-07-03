import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const queryClient = useQueryClient();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.get('/auth/me')
                .then(({ data }) => setUser(data))
                .catch(() => localStorage.removeItem('token'))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }

        const handleLogout = () => setUser(null);
        window.addEventListener('auth:logout', handleLogout);
        return () => window.removeEventListener('auth:logout', handleLogout);
    }, []);

    const login = useCallback(async (emailOrLogin, password) => {
        // Определяем, логин это или email
        const isEmail = emailOrLogin.includes('@');
        const payload = isEmail
            ? { email: emailOrLogin, password }
            : { login: emailOrLogin, password };
        const { data } = await api.post('/auth/login', payload);
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return data;
    }, []);

    const register = useCallback(async (login, name, email, password, passwordConfirmation) => {
        const { data } = await api.post('/auth/register', {
            login, name, email, password, password_confirmation: passwordConfirmation,
        });
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return data;
    }, []);

    const logout = useCallback(async () => {
        await api.post('/auth/logout');
        localStorage.removeItem('token');
        setUser(null);
        queryClient.clear();
    }, [queryClient]);

    const fetchUser = useCallback(async () => {
        try {
            const { data } = await api.get('/auth/me');
            setUser(data);
        } catch {
            localStorage.removeItem('token');
            setUser(null);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be inside AuthProvider');
    return ctx;
}
