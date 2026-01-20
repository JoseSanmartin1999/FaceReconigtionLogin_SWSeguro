import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './interfaces/routes/authRoutes.js';
import userRoutes from './interfaces/routes/userRoutes.js';

dotenv.config();

const app = express();

// Middlewares de seguridad básicos
app.use(cors());
app.use(express.json()); // NIST SSDF: Limitar el tamaño del body si es necesario

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor seguro corriendo en http://localhost:${PORT}`);
});
