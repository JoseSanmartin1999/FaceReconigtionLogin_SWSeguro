import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface UserProfile {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    role: 'admin' | 'user';
    createdAt?: Date;
}

const UserProfile = () => {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/users/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setProfile(response.data);
                setLoading(false);
            } catch (err: any) {
                setError(err.response?.data?.error || 'Error al cargar el perfil');
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    const handleLogout = () => {
        console.log('🚪 [UserProfile] Botón de logout presionado');
        logout();
        console.log('  → Redirigiendo a /');
        navigate('/');
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto mt-10 p-6 text-center">
                <div className="inline-block">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                    <p className="mt-4 text-gray-600 font-medium">Cargando tu perfil...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto mt-10">
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl shadow-xl p-8 border-2 border-red-200">
                    <div className="text-center mb-6">
                        <span className="text-6xl">⚠️</span>
                    </div>
                    <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">Error al Cargar Perfil</h2>
                    <p className="text-red-700 text-center mb-6">{error}</p>
                    <button
                        onClick={handleLogout}
                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all shadow-lg"
                    >
                        Volver al Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 px-4">
            {/* Header con gradiente */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
                <div className="flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-5xl">👤</span>
                            <h1 className="text-4xl font-bold">Mi Perfil</h1>
                        </div>
                        <p className="text-blue-100 ml-16">Bienvenido de vuelta, {profile?.username} 👋</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transform hover:scale-105 transition-all border border-white/30 shadow-lg"
                    >
                        🚪 Cerrar Sesión
                    </button>
                </div>
            </div>

            {profile && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card de Información Personal */}
                    <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-xl border border-blue-100 hover:shadow-2xl transition-shadow">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                                <span className="text-2xl">📋</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Información Personal</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <p className="text-sm font-semibold text-gray-500 mb-1">ID de Usuario</p>
                                <p className="text-gray-800 font-mono text-sm">{profile.id}</p>
                            </div>

                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <p className="text-sm font-semibold text-gray-500 mb-1">Nombre Completo</p>
                                <p className="text-2xl font-bold text-gray-800">{profile.fullName}</p>
                                <p className="text-sm text-gray-500 mt-1">({profile.firstName} {profile.lastName})</p>
                            </div>

                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <p className="text-sm font-semibold text-gray-500 mb-1">Email</p>
                                <p className="text-lg text-gray-800 flex items-center gap-2">
                                    📧 {profile.email}
                                </p>
                            </div>

                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <p className="text-sm font-semibold text-gray-500 mb-1">Nombre de Usuario</p>
                                <p className="text-xl font-bold text-gray-800">{profile.username}</p>
                            </div>

                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <p className="text-sm font-semibold text-gray-500 mb-2">Rol de Usuario</p>
                                <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${profile.role === 'admin'
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                                    }`}>
                                    {profile.role === 'admin' ? '👑 Administrador' : '✨ Usuario'}
                                </span>
                            </div>

                            {profile.createdAt && (
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                    <p className="text-sm font-semibold text-gray-500 mb-1">Fecha de Registro</p>
                                    <p className="text-gray-800 flex items-center gap-2">
                                        📅 {new Date(profile.createdAt).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cards de Estado */}
                    <div className="space-y-6">
                        {/* Reconocimiento Facial */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl shadow-xl border-2 border-green-200 hover:shadow-2xl transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex-shrink-0">
                                    <span className="text-3xl">✅</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-green-800 mb-2">
                                        Reconocimiento Facial Activo
                                    </h3>
                                    <p className="text-green-700 leading-relaxed">
                                        Tu rostro ha sido registrado exitosamente en el sistema de autenticación biométrica.
                                    </p>
                                    <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        Estado: Activo
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Información de Seguridad */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-xl border-2 border-blue-200 hover:shadow-2xl transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex-shrink-0">
                                    <span className="text-3xl">🔐</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-blue-800 mb-2">
                                        Seguridad Avanzada
                                    </h3>
                                    <ul className="text-blue-700 space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 mt-0.5">🔹</span>
                                            <span>Autenticación de doble factor activa</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 mt-0.5">🔹</span>
                                            <span>Tecnología FaceNet 128D</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 mt-0.5">🔹</span>
                                            <span>Datos biométricos cifrados</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 mt-0.5">🔹</span>
                                            <span>Conforme a estándares NIST SSDF</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Badge de Verificación */}
                        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-2xl shadow-xl border-2 border-yellow-200">
                            <div className="text-center">
                                <div className="inline-block p-4 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full mb-3">
                                    <span className="text-4xl">🏆</span>
                                </div>
                                <h3 className="text-lg font-bold text-yellow-800 mb-1">
                                    Cuenta Verificada
                                </h3>
                                <p className="text-sm text-yellow-700">
                                    Identidad confirmada mediante reconocimiento facial
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
