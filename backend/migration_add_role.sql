-- Script de migración para agregar columna 'role' a la tabla users
-- Ejecutar este script para actualizar la base de datos existente

-- Conectarse a la base de datos
\c face_auth_db;

-- Agregar columna 'role' si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'role'
    ) THEN
        ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user' NOT NULL;
    END IF;
END $$;

-- Agregar constraint para validar valores permitidos
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'users_role_check'
    ) THEN
        ALTER TABLE users 
        ADD CONSTRAINT users_role_check 
        CHECK (role IN ('admin', 'user'));
    END IF;
END $$;

-- Actualizar usuarios existentes para tener rol 'user' si no tienen ninguno
UPDATE users SET role = 'user' WHERE role IS NULL;

-- Crear índice para búsquedas rápidas por rol
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Ver estructura actualizada
\d users;

-- Mensaje de éxito
SELECT 'Migración completada: columna role agregada exitosamente!' as mensaje;
