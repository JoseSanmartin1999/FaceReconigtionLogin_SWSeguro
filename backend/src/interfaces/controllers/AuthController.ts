import { Request, Response } from 'express';
import { RegisterUser } from '../../core/use-cases/RegisterUser.js';
import { LoginUser } from '../../core/use-cases/LoginUser.js';
import { PostgresUserRepository } from '../../infrastructure/repositories/PostgresUserRepository.js';

// Instanciamos las dependencias una sola vez
const userRepository = new PostgresUserRepository();
const registerUserUseCase = new RegisterUser(userRepository);
const loginUserUseCase = new LoginUser(userRepository);

export class AuthController {

    // MÉTODO: REGISTRO
    async register(req: Request, res: Response) {
        try {
            const { username, password, faceDescriptor } = req.body;

            console.log('📥 Registro recibido:', {
                username,
                hasPassword: !!password,
                hasFaceDescriptor: !!faceDescriptor,
                descriptorLength: faceDescriptor?.length,
                descriptorType: Array.isArray(faceDescriptor) ? 'array' : typeof faceDescriptor
            });

            if (!username || !password || !faceDescriptor) {
                return res.status(400).json({ error: "Faltan campos obligatorios." });
            }

            // NIST SSDF: Validación de integridad del vector facial
            if (!Array.isArray(faceDescriptor) || faceDescriptor.length !== 128) {
                console.error('❌ Descriptor inválido:', {
                    isArray: Array.isArray(faceDescriptor),
                    length: faceDescriptor?.length
                });
                return res.status(400).json({
                    error: `El descriptor facial debe ser un array de 128 números. Recibido: ${Array.isArray(faceDescriptor) ? faceDescriptor.length : 'no es array'}`
                });
            }

            await registerUserUseCase.execute(username, password, faceDescriptor);
            console.log('✅ Usuario registrado exitosamente:', username);
            res.status(201).json({ message: "Usuario registrado con éxito." });
        } catch (error: any) {
            console.error('❌ Error en registro:', error.message);
            res.status(400).json({ error: error.message });
        }
    }

    // MÉTODO: LOGIN (Única declaración corregida)
    async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;

            // Validación básica de presencia de datos
            if (!username || !password) {
                return res.status(400).json({ error: "Nombre de usuario y contraseña requeridos." });
            }

            // El caso de uso maneja la verificación de Hash (Bcrypt) y generación de JWT
            const result = await loginUserUseCase.execute(username, password);

            // Retornamos el token y el descriptor guardado para que el Frontend compare con la cámara
            res.status(200).json(result);
        } catch (error: any) {
            // NIST SSDF: No dar pistas de si falló el usuario o la contraseña por seguridad
            res.status(401).json({ error: "Credenciales inválidas." });
        }
    }
}