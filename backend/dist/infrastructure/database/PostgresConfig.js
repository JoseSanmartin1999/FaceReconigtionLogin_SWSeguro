import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const dbConfig = {
    user: process.env.DB_USER || 'admin',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'face_auth_db',
    password: process.env.DB_PASSWORD || 'admin',
    port: 5432,
};
console.log('🔌 Configuración de base de datos:', {
    user: dbConfig.user,
    host: dbConfig.host,
    database: dbConfig.database,
    port: dbConfig.port
});
export const pool = new Pool(dbConfig);
//# sourceMappingURL=PostgresConfig.js.map