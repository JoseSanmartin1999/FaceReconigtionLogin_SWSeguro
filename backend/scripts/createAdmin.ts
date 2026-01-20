#!/usr/bin/env ts-node

/**
 * Script para crear el primer usuario administrador
 * Este script se ejecuta una sola vez para inicializar el sistema con un admin
 */

import { createInterface } from 'readline';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import pg from 'pg';

// Cargar variables de entorno
dotenv.config();

// Configurar pool de PostgreSQL directamente aquí
const { Pool } = pg;
const pool = new Pool({
    user: process.env.DB_USER || 'admin',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'face_auth_db',
    password: process.env.DB_PASSWORD || 'admin',
    port: 5432,
});

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(prompt, (answer) => {
            resolve(answer);
        });
    });
}

async function createAdminUser() {
    try {
        console.log('\n🔐 Creación de Usuario Administrador\n');
        console.log('Este script creará el primer usuario con rol de administrador.');
        console.log('NOTA: El descriptor facial debe ser agregado posteriormente desde el frontend.\n');

        // Solicitar información
        const username = await question('Ingrese nombre de usuario para el admin: ');
        const password = await question('Ingrese contraseña para el admin: ');

        if (!username || !password) {
            console.error('❌ Usuario y contraseña son obligatorios.');
            rl.close();
            process.exit(1);
        }

        // Verificar si el usuario ya existe
        const checkQuery = 'SELECT 1 FROM users WHERE username = $1';
        const checkResult = await pool.query(checkQuery, [username]);

        if (checkResult.rows.length > 0) {
            console.error(`❌ El usuario "${username}" ya existe.`);
            rl.close();
            process.exit(1);
        }

        // Hash de contraseña
        console.log('\n⏳ Procesando...');
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Crear descriptor facial temporal (array de 128 ceros)
        // El usuario deberá registrar su rostro desde el frontend
        const tempDescriptor = new Array(128).fill(0);

        // Insertar usuario administrador
        const insertQuery = `
            INSERT INTO users (username, password_hash, face_descriptor, role)
            VALUES ($1, $2, $3, $4)
            RETURNING id, username, role
        `;
        const result = await pool.query(insertQuery, [
            username,
            passwordHash,
            JSON.stringify(tempDescriptor),
            'admin'
        ]);

        console.log('\n✅ Usuario administrador creado exitosamente:');
        console.log(`   ID: ${result.rows[0].id}`);
        console.log(`   Username: ${result.rows[0].username}`);
        console.log(`   Role: ${result.rows[0].role}`);
        console.log('\n⚠️  IMPORTANTE: Debe registrar su rostro desde la interfaz web para habilitar el reconocimiento facial.\n');

        rl.close();
        await pool.end();
        process.exit(0);
    } catch (error: any) {
        console.error('\n❌ Error al crear usuario administrador:', error.message);
        rl.close();
        await pool.end();
        process.exit(1);
    }
}

createAdminUser();
