import { IUserRepository } from "../../core/repositories/IUserRepository.js";
import { User } from "../../core/entities/User.js";
export declare class PostgresUserRepository implements IUserRepository {
    create(user: User): Promise<void>;
    findByUsername(username: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    getAllUsers(): Promise<User[]>;
    exists(username: string): Promise<boolean>;
}
//# sourceMappingURL=PostgresUserRepository.d.ts.map