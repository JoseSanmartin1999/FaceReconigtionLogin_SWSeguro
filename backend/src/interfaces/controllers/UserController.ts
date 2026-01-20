import { Response } from 'express';
import { AuthenticatedRequest } from '../../infrastructure/security/authMiddleware.js';
import { GetUserProfile } from '../../core/use-cases/GetUserProfile.js';
import { RegisterUser } from '../../core/use-cases/RegisterUser.js';
import { PostgresUserRepository } from '../../infrastructure/repositories/PostgresUserRepository.js';

// Instanciar dependencias
const userRepository = new PostgresUserRepository();
const getUserProfileUseCase = new GetUserProfile(userRepository);
const registerUserUseCase = new RegisterUser(userRepository);

export class UserController {

    /**
     * Obtener perfil del usuario autenticado
     * Ruta: GET /api/users/profile (protegida con authMiddleware)
     */
    async getProfile(req: AuthenticatedRequest, res: Response) {
        try {
            if (!req.userId) {
                return res.status(401).json({ error: 'No autenticado' });
            }

            const profile = await getUserProfileUseCase.execute(req.userId);
            res.status(200).json(profile);
        } catch (error: any) {
            console.error('Error al obtener perfil:', error.message);
            res.status(404).json({ error: error.message });
        }
    }

    /**
     * Listar todos los usuarios (solo administradores)
     * Ruta: GET /api/users/all (protegida con authMiddleware + requireAdmin)
     */
    async getAllUsers(req: AuthenticatedRequest, res: Response) {
        try {
            const users = await userRepository.getAllUsers();

            // No enviar información sensible
            const usersInfo = users.map(user => ({
                id: user.props.id,
                username: user.props.username,
                role: user.props.role,
                createdAt: user.props.createdAt
            }));

            res.status(200).json({ users: usersInfo });
        } catch (error: any) {
            console.error('Error al listar usuarios:', error.message);
            res.status(500).json({ error: 'Error al obtener usuarios' });
        }
    }

    /**
     * Registrar nuevo usuario (solo administradores)
     * Ruta: POST /api/users/register (protegida con authMiddleware + requireAdmin)
     */
    async registerUserByAdmin(req: AuthenticatedRequest, res: Response) {
        try {
            const { username, password, faceDescriptor, role } = req.body;

            console.log('📥 Admin registrando usuario:', {
                username,
                role,
                hasPassword: !!password,
                hasFaceDescriptor: !!faceDescriptor,
                descriptorLength: faceDescriptor?.length
            });

            // Validación
            if (!username || !password || !faceDescriptor) {
                return res.status(400).json({ error: 'Faltan campos obligatorios' });
            }

            if (!Array.isArray(faceDescriptor) || faceDescriptor.length !== 128) {
                return res.status(400).json({
                    error: `El descriptor facial debe ser un array de 128 números. Recibido: ${Array.isArray(faceDescriptor) ? faceDescriptor.length : 'no es array'}`
                });
            }

            // Validar role
            const userRole = role || 'user';
            if (userRole !== 'admin' && userRole !== 'user') {
                return res.status(400).json({ error: 'Role inválido. Debe ser "admin" o "user"' });
            }

            await registerUserUseCase.execute(username, password, faceDescriptor, userRole);

            console.log(`✅ Usuario "${username}" registrado con role "${userRole}" por admin "${req.username}"`);
            res.status(201).json({
                message: `Usuario ${username} registrado exitosamente con rol ${userRole}`
            });
        } catch (error: any) {
            console.error('❌ Error en registro por admin:', error.message);
            res.status(400).json({ error: error.message });
        }
    }
}
