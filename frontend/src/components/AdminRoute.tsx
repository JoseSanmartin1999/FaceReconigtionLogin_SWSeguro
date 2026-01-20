import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ReactNode } from 'react';

/**
 * Componente para proteger rutas que requieren rol de administrador
 * Redirige a /profile si no es admin o a /login si no está autenticado
 */
export function AdminRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated, isAdmin } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (!isAdmin()) {
        return <Navigate to="/profile" replace />;
    }

    return <>{children}</>;
}
