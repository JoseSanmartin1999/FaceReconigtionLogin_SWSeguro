-- Script de configuración para PostgreSQL
-- Ejecutar este script con permisos de superusuario (postgres)

-- Crear la base de datos
CREATE DATABASE face_auth_db;

-- Conectarse a la base de datos
\c face_auth_db;

-- Crear la tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    face_descriptor JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índice para búsquedas rápidas por username
CREATE INDEX idx_username ON users(username);

-- Ver las tablas creadas
\dt;

-- Mensaje de éxito
SELECT 'Base de datos configurada correctamente!' as mensaje;
