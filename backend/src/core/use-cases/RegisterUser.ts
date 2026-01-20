import { User } from "../entities/User.js";
import { IUserRepository } from "../repositories/IUserRepository.js";
import bcrypt from "bcrypt";

export class RegisterUser {
    // Inyección de dependencias (SOLID: D)
    constructor(private userRepository: IUserRepository) { }

    async execute(
        username: string,
        passwordPlain: string,
        faceDescriptor: number[],
        role: 'admin' | 'user' = 'user' // Role opcional, por defecto 'user'
    ): Promise<void> {
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
            faceDescriptor,
            role // Incluir el rol
        });

        // 4. Persistencia
        await this.userRepository.create(newUser);
    }
}