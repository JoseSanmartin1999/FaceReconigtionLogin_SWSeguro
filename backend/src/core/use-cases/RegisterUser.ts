import { User } from "../entities/User.js";
import { IUserRepository } from "../repositories/IUserRepository.js";
import bcrypt from "bcrypt";
import { validatePasswordStrength } from "../utils/passwordValidator.js";
import { validateEmail, normalizeEmail } from "../utils/emailValidator.js";

export class RegisterUser {
    // Inyección de dependencias (SOLID: D)
    constructor(private userRepository: IUserRepository) { }

    async execute(
        username: string,
        passwordPlain: string,
        firstName: string,
        lastName: string,
        email: string,
        faceDescriptor: number[],
        role: 'admin' | 'user' = 'user'
    ): Promise<void> {
        // 1. Validar y normalizar email
        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            throw new Error(emailValidation.error!);
        }
        const normalizedEmail = normalizeEmail(email);

        // 2. Verificar que el email no exista
        const emailExists = await this.userRepository.existsByEmail(normalizedEmail);
        if (emailExists) {
            throw new Error('El email ya está registrado en el sistema.');
        }

        // 3. Validar nombres (no vacíos)
        if (!firstName || firstName.trim().length === 0) {
            throw new Error('El nombre es requerido.');
        }

        if (firstName.trim().length > 100) {
            throw new Error('El nombre es demasiado largo (máximo 100 caracteres).');
        }

        if (!lastName || lastName.trim().length === 0) {
            throw new Error('El apellido es requerido.');
        }

        if (lastName.trim().length > 100) {
            throw new Error('El apellido es demasiado largo (máximo 100 caracteres).');
        }

        // 4. Verificar si el usuario ya existe (por username)
        const userExists = await this.userRepository.exists(username);
        if (userExists) {
            throw new Error("El nombre de usuario ya está en uso.");
        }

        // 5. Validar fortaleza de contraseña (NIST SSDF: PW.1)
        const passwordValidation = validatePasswordStrength(passwordPlain);
        if (!passwordValidation.isValid) {
            throw new Error(
                `Contraseña no cumple con los requisitos de seguridad:\n${passwordValidation.errors.join('\n')}`
            );
        }

        // 6. Seguridad (NIST SSDF): Hashing de contraseña (Rondas: 12)
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(passwordPlain, saltRounds);

        // 7. Crear entidad con todos los campos
        const newUser = new User({
            username,
            passwordHash,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: normalizedEmail,
            faceDescriptor,
            role
        });

        // 8. Persistencia
        await this.userRepository.create(newUser);
    }
}