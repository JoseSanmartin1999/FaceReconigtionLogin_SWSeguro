import React, { useState } from 'react';
import axios from 'axios';
import { FaceScanner } from '../components/FaceScanner';
import { useFaceApi } from '../hooks/useFaceApi';

const Register = () => {
    const modelsLoaded = useFaceApi();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [faceDescriptor, setFaceDescriptor] = useState<number[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!faceDescriptor) return alert("Por favor, escanea tu rostro primero.");

        console.log('📤 Enviando registro:', {
            username,
            hasPassword: !!password,
            descriptorLength: faceDescriptor.length
        });

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3000/api/auth/register', {
                username,
                password,
                faceDescriptor
            });
            setMessage(response.data.message);
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || "Error al registrar";
            console.error('❌ Error en registro:', errorMsg);
            setMessage(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (!modelsLoaded) return <p>Cargando modelos de IA... Espere un momento.</p>;

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Registro Seguro</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Usuario"
                    className="w-full p-2 border rounded"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    className="w-full p-2 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
                    <p className="mb-3 font-semibold text-gray-700">Reconocimiento Facial</p>
                    <FaceScanner onDescriptorGenerated={(desc) => setFaceDescriptor(desc)} />
                </div>

                <button
                    type="submit"
                    disabled={loading || !faceDescriptor}
                    className={`w-full py-2 rounded text-white ${loading || !faceDescriptor ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {loading ? 'Procesando...' : 'Finalizar Registro'}
                </button>
            </form>

            {message && <p className="mt-4 text-center font-medium">{message}</p>}
        </div>
    );
};

export default Register;