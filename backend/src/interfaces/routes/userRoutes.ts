import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';
import { authMiddleware } from '../../infrastructure/security/authMiddleware.js';
import { requireAdmin } from '../../infrastructure/security/roleMiddleware.js';

const router = Router();
const userController = new UserController();

/**
 * Ruta protegida: Obtener perfil del usuario autenticado
 * Requiere: Token JWT válido
 */
router.get('/profile', authMiddleware, (req, res) =>
    userController.getProfile(req, res)
);

/**
 * Ruta protegida: Obtener todos los usuarios (solo admin)
 * Requiere: Token JWT válido + rol admin
 */
router.get('/all', authMiddleware, requireAdmin, (req, res) =>
    userController.getAllUsers(req, res)
);

/**
 * Ruta protegida: Registrar nuevo usuario (solo admin)
 * Requiere: Token JWT válido + rol admin
 */
router.post('/register', authMiddleware, requireAdmin, (req, res) =>
    userController.registerUserByAdmin(req, res)
);

export default router;
