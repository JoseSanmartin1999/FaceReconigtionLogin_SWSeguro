import { IUserRepository } from "../repositories/IUserRepository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// backend/src/core/use-cases/LoginUser.ts
export class LoginUser {
    constructor(private userRepository: IUserRepository) { }

    // Eliminamos 'incomingDescriptor' de los parámetros
    async execute(username: string, passwordPlain: string) {
        const user = await this.userRepository.findByUsername(username);
        if (!user) {
            throw new Error("Credenciales inválidas.");
        }

        const isPasswordValid = await bcrypt.compare(passwordPlain, user.props.passwordHash);
        if (!isPasswordValid) {
            throw new Error("Credenciales inválidas.");
        }

        const token = jwt.sign(
            { id: user.props.id, username: user.props.username },
            process.env.JWT_SECRET || 'secret_key_123',
            { expiresIn: '1h' }
        );

        // Devolvemos el descriptor guardado para que el Front lo compare
        return {
            token,
            savedDescriptor: user.props.faceDescriptor
        };
    }
}