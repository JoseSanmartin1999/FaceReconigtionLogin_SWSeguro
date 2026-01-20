import { IUserRepository } from "../repositories/IUserRepository.js";
export declare class LoginUser {
    private userRepository;
    constructor(userRepository: IUserRepository);
    execute(username: string, passwordPlain: string): Promise<{
        token: string;
        userId: string | undefined;
        username: string;
        role: "admin" | "user";
        faceDescriptor: number[];
    }>;
}
//# sourceMappingURL=LoginUser.d.ts.map