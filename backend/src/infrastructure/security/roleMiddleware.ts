import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware.js';

/**
 * Middleware de autorización por rol
 * Verifica que el usuario autenticado tenga rol de administrador
 * DEBE usarse después del authMiddleware
 */
export const requireAdmin = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    // Verificar que el usuario esté autenticado
    if (!req.userId || !req.role) {
        res.status(401).json({ error: 'No autenticado' });
        return;
    }

    // Verificar que sea administrador
    if (req.role !== 'admin') {
        res.status(403).json({
            error: 'Acceso denegado. Se requieren privilegios de administrador.'
        });
        return;
    }

    next();
};
