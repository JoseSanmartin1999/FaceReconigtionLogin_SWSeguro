import { User } from "../../core/entities/User.js";
import { pool } from "../../infrastructure/database/PostgresConfig.js";
export class PostgresUserRepository {
    async create(user) {
        const query = `
            INSERT INTO users (
                username, 
                password_hash, 
                face_descriptor, 
                role,
                first_name,
                last_name,
                email
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        const values = [
            user.props.username,
            user.props.passwordHash,
            user.props.faceDescriptor,
            user.props.role,
            user.props.firstName,
            user.props.lastName,
            user.props.email
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
            role: row.role,
            firstName: row.first_name,
            lastName: row.last_name,
            email: row.email,
            createdAt: row.created_at
        });
    }
    async findById(id) {
        const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (res.rows.length === 0)
            return null;
        const row = res.rows[0];
        return new User({
            id: row.id,
            username: row.username,
            passwordHash: row.password_hash,
            faceDescriptor: row.face_descriptor,
            role: row.role,
            firstName: row.first_name,
            lastName: row.last_name,
            email: row.email,
            createdAt: row.created_at
        });
    }
    async findByEmail(email) {
        const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (res.rows.length === 0)
            return null;
        const row = res.rows[0];
        return new User({
            id: row.id,
            username: row.username,
            passwordHash: row.password_hash,
            faceDescriptor: row.face_descriptor,
            role: row.role,
            firstName: row.first_name,
            lastName: row.last_name,
            email: row.email,
            createdAt: row.created_at
        });
    }
    async getAllUsers() {
        const res = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
        return res.rows.map(row => new User({
            id: row.id,
            username: row.username,
            passwordHash: row.password_hash,
            faceDescriptor: row.face_descriptor,
            role: row.role,
            firstName: row.first_name,
            lastName: row.last_name,
            email: row.email,
            createdAt: row.created_at
        }));
    }
    async exists(username) {
        const res = await pool.query('SELECT 1 FROM users WHERE username = $1', [username]);
        return res.rows.length > 0;
    }
    async existsByEmail(email) {
        const res = await pool.query('SELECT 1 FROM users WHERE email = $1', [email]);
        return res.rows.length > 0;
    }
    async getAllFaceDescriptors() {
        const res = await pool.query('SELECT id, username, face_descriptor FROM users');
        return res.rows.map(row => ({
            userId: row.id,
            username: row.username,
            faceDescriptor: row.face_descriptor
        }));
    }
}
//# sourceMappingURL=PostgresUserRepository.js.map