import { IUserRepository } from "../repositories/IUserRepository.js";

export class GetUserProfile {
    constructor(private userRepository: IUserRepository) { }

    async execute(userId: string) {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        // Retornar solo información pública (sin password_hash ni face_descriptor)
        return {
            id: user.props.id!,
            username: user.props.username,
            firstName: user.props.firstName,
            lastName: user.props.lastName,
            fullName: user.fullName,
            email: user.props.email,
            role: user.props.role,
            createdAt: user.props.createdAt
        };
    }
}
