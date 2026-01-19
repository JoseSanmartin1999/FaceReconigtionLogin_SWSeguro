import { IUserRepository } from "../../core/repositories/IUserRepository.js";
import { User } from "../../core/entities/User.js";
import { pool } from "../../infrastructure/database/PostgresConfig.js";

export class PostgresUserRepository implements IUserRepository {
    async create(user: User): Promise<void> {
        const query = `
            INSERT INTO users (username, password_hash, face_descriptor)
            VALUES ($1, $2, $3)
        `;
        const values = [
            user.props.username,
            user.props.passwordHash,
            user.props.faceDescriptor // Postgres maneja bien arrays de JS a FLOAT8[]
        ];
        await pool.query(query, values);
    }

    async findByUsername(username: string): Promise<User | null> {
        const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (res.rows.length === 0) return null;

        const row = res.rows[0];
        return new User({
            id: row.id,
            username: row.username,
            passwordHash: row.password_hash,
            faceDescriptor: row.face_descriptor,
            createdAt: row.created_at
        });
    }

    async exists(username: string): Promise<boolean> {
        const res = await pool.query('SELECT 1 FROM users WHERE username = $1', [username]);
        return res.rows.length > 0;
    }
}