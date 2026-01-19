import { User } from "../../core/entities/User.js";
import { pool } from "../../infrastructure/database/PostgresConfig.js";
export class PostgresUserRepository {
    async create(user) {
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
    async findByUsername(username) {
        const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (res.rows.length === 0)
            return null;
        const row = res.rows[0];
        return new User({
            id: row.id,
            username: row.username,
            passwordHash: row.password_hash,
            faceDescriptor: row.face_descriptor,
            createdAt: row.created_at
        });
    }
    async exists(username) {
        const res = await pool.query('SELECT 1 FROM users WHERE username = $1', [username]);
        return res.rows.length > 0;
    }
}
//# sourceMappingURL=PostgresUserRepository.js.map