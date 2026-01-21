import { RegisterUser } from '../../core/use-cases/RegisterUser.js';
import { LoginUser } from '../../core/use-cases/LoginUser.js';
import { PostgresUserRepository } from '../../infrastructure/repositories/PostgresUserRepository.js';
// Instanciamos las dependencias una sola vez
const userRepository = new PostgresUserRepository();
const registerUserUseCase = new RegisterUser(userRepository);
const loginUserUseCase = new LoginUser(userRepository);
export class AuthController {
    // MÉTODO: REGISTRO (DEPRECADO - Usar /api/users/register desde AdminDashboard)
    async register(req, res) {
        try {
            const { username, password, firstName, lastName, email, faceDescriptor } = req.body;
            console.log('📥 Registro recibido:', {
                username,
                firstName,
                lastName,
                email,
                hasPassword: !!password,
                hasFaceDescriptor: !!faceDescriptor,
                descriptorLength: faceDescriptor?.length,
                descriptorType: Array.isArray(faceDescriptor) ? 'array' : typeof faceDescriptor
            });
            if (!username || !password || !firstName || !lastName || !email || !faceDescriptor) {
                return res.status(400).json({
                    error: "Faltan campos obligatorios: username, password, firstName, lastName, email, faceDescriptor"
                });
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
            // Ejecutar RegisterUser con todos los campos
            await registerUserUseCase.execute(username, password, firstName, lastName, email, faceDescriptor, 'user' // Role por defecto
            );
            console.log('✅ Usuario registrado exitosamente:', username);
            res.status(201).json({ message: "Usuario registrado con éxito." });
        }
        catch (error) {
            console.error('❌ Error en registro:', error.message);
            res.status(400).json({ error: error.message });
        }
    }
    // MÉTODO: LOGIN
    async login(req, res) {
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
        }
        catch (error) {
            // NIST SSDF: No dar pistas de si falló el usuario o la contraseña por seguridad
            res.status(401).json({ error: "Credenciales inválidas." });
        }
    }
}
//# sourceMappingURL=AuthController.js.map