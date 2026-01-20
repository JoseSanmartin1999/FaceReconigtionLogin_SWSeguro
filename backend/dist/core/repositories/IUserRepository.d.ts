import { User } from "../entities/User.js";
export interface IUserRepository {
    create(user: User): Promise<void>;
    findByUsername(username: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    getAllUsers(): Promise<User[]>;
    exists(username: string): Promise<boolean>;
}
//# sourceMappingURL=IUserRepository.d.ts.map