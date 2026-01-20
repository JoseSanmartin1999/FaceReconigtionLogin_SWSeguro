import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Interface para extender Request de Express con información del usuario autenticado
 */
export interface AuthenticatedRequest extends Request {
    userId?: string;
    username?: string;
    role?: 'admin' | 'user';
}

/**
 * Middleware de autenticación JWT
 * Verifica el token JWT del header Authorization y agrega información del usuario al request
 */
export const authMiddleware = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        // Obtener token del header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'No se proporcionó token de autenticación' });
            return;
        }

        const token = authHeader.substring(7); // Remover 'Bearer '

        // Verificar token
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET no está configurado');
        }

        const decoded = jwt.verify(token, jwtSecret) as {
            userId: string;
            username: string;
            role: 'admin' | 'user';
        };

        // Agregar información del usuario al request
        req.userId = decoded.userId;
        req.username = decoded.username;
        req.role = decoded.role;

        next();
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ error: 'Token expirado' });
        } else if (error.name === 'JsonWebTokenError') {
            res.status(401).json({ error: 'Token inválido' });
        } else {
            res.status(500).json({ error: 'Error en la autenticación' });
        }
    }
};
