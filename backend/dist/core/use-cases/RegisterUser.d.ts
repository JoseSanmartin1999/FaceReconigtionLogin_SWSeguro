import { IUserRepository } from "../repositories/IUserRepository.js";
export declare class RegisterUser {
    private userRepository;
    constructor(userRepository: IUserRepository);
    execute(username: string, passwordPlain: string, faceDescriptor: number[]): Promise<void>;
}
//# sourceMappingURL=RegisterUser.d.ts.map