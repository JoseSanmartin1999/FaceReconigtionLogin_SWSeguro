import { User } from "../entities/User.js";
import bcrypt from "bcrypt";
export class RegisterUser {
    // Inyección de dependencias (SOLID: D)
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(username, passwordPlain, faceDescriptor) {
        // 1. Verificar si el usuario ya existe
        const userExists = await this.userRepository.exists(username);
        if (userExists) {
            throw new Error("El nombre de usuario ya está en uso.");
        }
        // 2. Seguridad (NIST SSDF): Hashing de contraseña (Rondas: 12)
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(passwordPlain, saltRounds);
        // 3. Crear entidad
        const newUser = new User({
            username,
            passwordHash,
            faceDescriptor
        });
        // 4. Persistencia
        await this.userRepository.create(newUser);
    }
}
//# sourceMappingURL=RegisterUser.js.map