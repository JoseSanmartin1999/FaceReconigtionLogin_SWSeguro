import React, { useState } from 'react';
import axios from 'axios';
import * as faceapi from 'face-api.js';
import { FaceScanner } from '../components/FaceScanner';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isStep1Complete, setIsStep1Complete] = useState(false);
    const [savedDescriptor, setSavedDescriptor] = useState<number[] | null>(null);
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleStep1 = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validamos contraseña en el backend
            const response = await axios.post('http://localhost:3000/api/auth/login', { username, password });

            // Guardar datos del usuario y descriptor para verificación facial
            setUserData(response.data);
            setSavedDescriptor(response.data.faceDescriptor);
            setIsStep1Complete(true);
        } catch (error) {
            alert("❌ Usuario o contraseña incorrectos");
        } finally {
            setLoading(false);
        }
    };

    const handleFaceMatch = (currentDescriptor: number[]) => {
        if (!savedDescriptor || !userData) return;

        // Comparación matemática (Distancia Euclidiana)
        const distance = faceapi.euclideanDistance(currentDescriptor, savedDescriptor);

        // Umbral estándar: 0.6 (menor es más parecido)
        if (distance < 0.6) {
            // Login exitoso - guardar en contexto
            login(userData.token, userData.userId, userData.username, userData.role);

            // Redirigir según el rol
            if (userData.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/profile');
            }
        } else {
            alert("❌ Rostro no coincide. Intenta de nuevo.");
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Card principal con gradiente */}
                <div className="relative bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl shadow-2xl p-8 border border-blue-100">
                    {/* Decoración de fondo */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-10 -mr-16 -mt-16 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-400 to-pink-400 rounded-full opacity-10 -ml-16 -mb-16 blur-2xl"></div>

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-block p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                                <span className="text-4xl">🔐</span>
                            </div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Inicio de Sesión
                            </h2>
                            <p className="text-gray-600 mt-2">
                                {!isStep1Complete ? 'Ingresa tus credenciales' : 'Verificación Facial'}
                            </p>
                        </div>

                        {!isStep1Complete ? (
                            <form onSubmit={handleStep1} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700 ml-1">
                                        Usuario
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            👤
                                        </span>
                                        <input
                                            type="text"
                                            placeholder="Ingresa tu usuario"
                                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white"
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700 ml-1">
                                        Contraseña
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            🔑
                                        </span>
                                        <input
                                            type="password"
                                            placeholder="Ingresa tu contraseña"
                                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="animate-spin">⏳</span>
                                            Verificando...
                                        </span>
                                    ) : (
                                        'Siguiente →'
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border-2 border-blue-200">
                                    <p className="text-center text-blue-700 font-semibold flex items-center justify-center gap-2">
                                        <span className="text-2xl">📸</span>
                                        Paso 2: Verificación Facial
                                    </p>
                                    <p className="text-center text-sm text-blue-600 mt-2">
                                        Mira a la cámara y mantén tu rostro centrado
                                    </p>
                                </div>

                                <div className="bg-white rounded-xl p-4 shadow-inner">
                                    <FaceScanner onDescriptorGenerated={handleFaceMatch} />
                                </div>

                                <button
                                    onClick={() => setIsStep1Complete(false)}
                                    className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm font-medium transition-colors"
                                >
                                    ← Volver
                                </button>
                            </div>
                        )}

                        {/* Footer info */}
                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-500">
                                🔒 Autenticación de doble factor segura
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;