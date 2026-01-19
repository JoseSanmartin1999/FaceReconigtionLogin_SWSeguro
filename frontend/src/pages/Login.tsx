import React, { useState } from 'react';
import axios from 'axios';
import * as faceapi from 'face-api.js';
import { FaceScanner } from '../components/FaceScanner';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isStep1Complete, setIsStep1Complete] = useState(false);
    const [savedDescriptor, setSavedDescriptor] = useState<number[] | null>(null);

    const handleStep1 = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Validamos contraseña en el backend
            const response = await axios.post('http://localhost:3000/api/auth/login', { username, password });
            setSavedDescriptor(response.data.savedDescriptor);
            setIsStep1Complete(true);
        } catch (error) {
            alert("Usuario o contraseña incorrectos");
        }
    };

    const handleFaceMatch = (currentDescriptor: number[]) => {
        if (!savedDescriptor) return;

        // Comparación matemática (Distancia Euclidiana)
        const distance = faceapi.euclideanDistance(currentDescriptor, savedDescriptor);
        
        // Umbral estándar: 0.6 (menor es más parecido)
        if (distance < 0.6) {
            alert("✅ Acceso concedido. ¡Bienvenido!");
            // Aquí guardarías el token JWT y redireccionarías
        } else {
            alert("❌ Rostro no coincide. Intenta de nuevo.");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-gray-50 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Inicio de Sesión</h2>

            {!isStep1Complete ? (
                <form onSubmit={handleStep1} className="space-y-4">
                    <input type="text" placeholder="Usuario" className="w-full p-2 border" onChange={e => setUsername(e.target.value)} />
                    <input type="password" placeholder="Contraseña" className="w-full p-2 border" onChange={e => setPassword(e.target.value)} />
                    <button className="w-full bg-blue-600 text-white py-2 rounded">Siguiente</button>
                </form>
            ) : (
                <div className="text-center">
                    <p className="mb-4 text-blue-600 font-medium">Paso 2: Verificación Facial</p>
                    <FaceScanner onDescriptorGenerated={handleFaceMatch} />
                </div>
            )}
        </div>
    );
};

export default Login;