import { IUserRepository } from "../repositories/IUserRepository.js";
export declare class RegisterUser {
    private userRepository;
    constructor(userRepository: IUserRepository);
    execute(username: string, passwordPlain: string, firstName: string, lastName: string, email: string, faceDescriptor: number[], role?: 'admin' | 'user'): Promise<void>;
}
//# sourceMappingURL=RegisterUser.d.ts.map