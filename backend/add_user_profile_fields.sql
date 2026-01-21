-- Migración: Agregar campos de perfil de usuario (nombre, apellido, email)
-- Fecha: 2026-01-20
-- Descripción: Expande la tabla users con información personal del usuario

BEGIN;

-- 1. Agregar columnas nuevas con DEFAULT temporal para datos existentes
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS first_name VARCHAR(100) NOT NULL DEFAULT 'Sin nombre',
ADD COLUMN IF NOT EXISTS last_name VARCHAR(100) NOT NULL DEFAULT 'Sin apellido',
ADD COLUMN IF NOT EXISTS email VARCHAR(255) NOT NULL DEFAULT 'temp@temp.com';

-- 2. Crear índice para búsquedas por email
CREATE INDEX IF NOT EXISTS idx_email ON users(email);

-- 3. Agregar constraint de email único (después de actualizar datos temporales)
-- Nota: Si hay usuarios existentes con emails temporales, primero actualizarlos manualmente
DO $$
BEGIN
    -- Actualizar emails temporales para que sean únicos
    UPDATE users 
    SET email = 'user' || id || '@temporary.com'
    WHERE email = 'temp@temp.com';
    
    -- Agregar constraint de unicidad
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_email' AND conrelid = 'users'::regclass
    ) THEN
        ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);
    END IF;
END $$;

-- 4. Agregar validación básica de formato de email
ALTER TABLE users
DROP CONSTRAINT IF EXISTS check_email_format;

ALTER TABLE users
ADD CONSTRAINT check_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- 5. Agregar comentarios a las columnas para documentación
COMMENT ON COLUMN users.first_name IS 'Nombre(s) del usuario';
COMMENT ON COLUMN users.last_name IS 'Apellido(s) del usuario';
COMMENT ON COLUMN users.email IS 'Correo electrónico único del usuario';

COMMIT;

-- Verificación de la migración
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
