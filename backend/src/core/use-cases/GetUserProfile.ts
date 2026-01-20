import { User } from "../entities/User.js";
import { IUserRepository } from "../repositories/IUserRepository.js";

/**
 * Caso de uso: Obtener perfil de usuario por ID
 * Retorna la información del usuario sin incluir el password hash
 */
export class GetUserProfile {
    constructor(private userRepository: IUserRepository) { }

    async execute(userId: string): Promise<{
        id: string;
        username: string;
        role: 'admin' | 'user';
        createdAt?: Date | undefined;
    }> {
        // Buscar usuario por ID
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new Error("Usuario no encontrado.");
        }

        // Retornar información sin el password_hash ni face_descriptor (seguridad)
        return {
            id: user.props.id!,
            username: user.props.username,
            role: user.props.role,
            createdAt: user.props.createdAt
        };
    }
}
