import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaceScanner } from '../components/FaceScanner';

interface User {
    id: string;
    username: string;
    role: 'admin' | 'user';
    createdAt?: string;
}

const AdminDashboard = () => {
    const { token, username, logout } = useAuth();
    const navigate = useNavigate();

    // Estado para lista de usuarios
    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

    // Estado para registro de nuevo usuario
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newRole, setNewRole] = useState<'admin' | 'user'>('user');
    const [faceDescriptor, setFaceDescriptor] = useState<number[] | null>(null);
    const [registering, setRegistering] = useState(false);

    // Cargar lista de usuarios al montar
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/users/all', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUsers(response.data.users);
            setLoadingUsers(false);
        } catch (err: any) {
            console.error('Error al cargar usuarios:', err);
            alert('Error al cargar la lista de usuarios');
            setLoadingUsers(false);
        }
    };

    const handleDescriptorGenerated = (descriptor: number[]) => {
        setFaceDescriptor(descriptor);
    };

    const handleRegisterUser = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!faceDescriptor) {
            alert('⚠️ Por favor, espera a que se detecte un rostro válido');
            return;
        }

        setRegistering(true);

        try {
            await axios.post(
                'http://localhost:3000/api/users/register',
                {
                    username: newUsername,
                    password: newPassword,
                    faceDescriptor: faceDescriptor,
                    role: newRole
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            alert(`✅ Usuario "${newUsername}" registrado exitosamente con rol "${newRole}"`);

            // Limpiar formulario
            setNewUsername('');
            setNewPassword('');
            setNewRole('user');
            setFaceDescriptor(null);

            // Recargar lista de usuarios
            fetchUsers();
        } catch (err: any) {
            alert(`❌ Error: ${err.response?.data?.error || 'Error al registrar usuario'}`);
        } finally {
            setRegistering(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const adminCount = users.filter(u => u.role === 'admin').length;
    const userCount = users.filter(u => u.role === 'user').length;

    return (
        <div className="max-w-7xl mx-auto mt-8 px-4 pb-8">
            {/* Header con gradiente mejorado */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden">
                {/* Decoración de fondo */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-5xl">👑</span>
                            <h1 className="text-4xl font-bold">Dashboard de Administrador</h1>
                        </div>
                        <p className="text-purple-100 ml-16 text-lg">Bienvenido, {username} • Panel de Control</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transform hover:scale-105 transition-all border border-white/30 shadow-lg"
                    >
                        🚪 Cerrar Sesión
                    </button>
                </div>

                {/* Estadísticas rápidas */}
                <div className="grid grid-cols-3 gap-4 mt-6 relative z-10">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <p className="text-purple-100 text-sm">Total Usuarios</p>
                        <p className="text-3xl font-bold">{users.length}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <p className="text-purple-100 text-sm">Administradores</p>
                        <p className="text-3xl font-bold">{adminCount}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <p className="text-purple-100 text-sm">Usuarios Normales</p>
                        <p className="text-3xl font-bold">{userCount}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                {/* Formulario de Registro - 2 columnas */}
                <div className="xl:col-span-2">
                    <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-2xl shadow-xl border border-purple-100 sticky top-4">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                                <span className="text-2xl">➕</span>
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Registrar Usuario
                            </h2>
                        </div>

                        <form onSubmit={handleRegisterUser} className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    👤 Nombre de Usuario
                                </label>
                                <input
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                                    placeholder="Ej: johndoe123"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    🔑 Contraseña
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                                    placeholder="Mínimo 6 caracteres"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    🎭 Rol de Usuario
                                </label>
                                <select
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value as 'admin' | 'user')}
                                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-white cursor-pointer"
                                >
                                    <option value="user">👤 Usuario Normal</option>
                                    <option value="admin">👑 Administrador</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    📸 Reconocimiento Facial
                                </label>
                                <div className="bg-white p-4 rounded-xl border-2 border-gray-200 shadow-inner">
                                    <FaceScanner onDescriptorGenerated={handleDescriptorGenerated} />
                                </div>
                                {faceDescriptor && (
                                    <div className="mt-2 p-3 bg-green-50 border-2 border-green-200 rounded-xl">
                                        <p className="text-sm text-green-700 font-semibold flex items-center gap-2">
                                            <span className="text-xl">✅</span>
                                            Rostro capturado correctamente
                                        </p>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={registering || !faceDescriptor}
                                className={`w-full py-4 text-white font-bold rounded-xl transition-all transform ${registering || !faceDescriptor
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                {registering ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="animate-spin">⏳</span>
                                        Registrando...
                                    </span>
                                ) : (
                                    'Registrar Usuario →'
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Lista de Usuarios - 3 columnas */}
                <div className="xl:col-span-3">
                    <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-xl border border-blue-100">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                                    <span className="text-2xl">👥</span>
                                </div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                    Usuarios Registrados
                                </h2>
                            </div>
                            <button
                                onClick={fetchUsers}
                                className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 font-medium transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                            >
                                🔄 Actualizar
                            </button>
                        </div>

                        {loadingUsers ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
                                <p className="mt-4 text-gray-600 font-medium">Cargando usuarios...</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2">
                                {users.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                                        <span className="text-6xl mb-4 block">👤</span>
                                        <p className="text-gray-500 font-medium">No hay usuarios registrados</p>
                                    </div>
                                ) : (
                                    users.map((user, index) => (
                                        <div
                                            key={user.id}
                                            className="group p-4 bg-white rounded-xl border-2 border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all transform hover:scale-[1.01]"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-2xl">
                                                            {user.role === 'admin' ? '👑' : '👤'}
                                                        </span>
                                                        <span className="font-bold text-lg text-gray-800">
                                                            {user.username}
                                                        </span>
                                                        <span className={`px-3 py-1 text-xs rounded-full font-bold shadow-sm ${user.role === 'admin'
                                                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                                                : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                                                            }`}>
                                                            {user.role === 'admin' ? 'ADMIN' : 'USER'}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 font-mono ml-11">
                                                        ID: {user.id}
                                                    </p>
                                                    {user.createdAt && (
                                                        <p className="text-xs text-gray-400 mt-1 ml-11 flex items-center gap-1">
                                                            📅 {new Date(user.createdAt).toLocaleDateString('es-ES', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
