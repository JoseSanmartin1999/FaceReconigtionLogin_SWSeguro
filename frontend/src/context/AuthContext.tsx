import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * Interface para el contexto de autenticación
 */
interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    userId: string | null;
    username: string | null;
    role: 'admin' | 'user' | null;
    login: (token: string, userId: string, username: string, role: 'admin' | 'user') => void;
    logout: () => void;
    isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider del contexto de autenticación
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [role, setRole] = useState<'admin' | 'user' | null>(null);

    // Cargar datos de autenticación del localStorage al iniciar
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        const storedUsername = localStorage.getItem('username');
        const storedRole = localStorage.getItem('role') as 'admin' | 'user' | null;

        if (storedToken && storedUserId && storedUsername && storedRole) {
            setToken(storedToken);
            setUserId(storedUserId);
            setUsername(storedUsername);
            setRole(storedRole);
        }
    }, []);

    const login = (newToken: string, newUserId: string, newUsername: string, newRole: 'admin' | 'user') => {
        setToken(newToken);
        setUserId(newUserId);
        setUsername(newUsername);
        setRole(newRole);

        // Guardar en localStorage
        localStorage.setItem('token', newToken);
        localStorage.setItem('userId', newUserId);
        localStorage.setItem('username', newUsername);
        localStorage.setItem('role', newRole);
    };

    const logout = () => {
        setToken(null);
        setUserId(null);
        setUsername(null);
        setRole(null);

        // Limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
    };

    const isAdmin = () => {
        return role === 'admin';
    };

    const isAuthenticated = !!token && !!userId;

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            token,
            userId,
            username,
            role,
            login,
            logout,
            isAdmin
        }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Hook para usar el contexto de autenticación
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
}
