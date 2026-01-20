import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';

// Componente de navegación interno que usa el contexto
function Navigation() {
  const { isAuthenticated, username, role, isAdmin, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-2xl sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo y título */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
              <span className="text-3xl">🔐</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">FaceAuth System</h1>
              <p className="text-xs text-blue-100">Autenticación Biométrica Segura</p>
            </div>
          </div>

          {/* Menú de navegación */}
          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <Link
                to="/"
                className="text-white hover:text-blue-100 font-semibold transition-colors px-4 py-2 rounded-xl hover:bg-white/10"
              >
                Iniciar Sesión
              </Link>
            ) : (
              <>
                {/* Badge de usuario */}
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{role === 'admin' ? '👑' : '👤'}</span>
                    <div className="text-left">
                      <p className="text-white font-bold text-sm">{username}</p>
                      <p className="text-blue-100 text-xs">
                        {role === 'admin' ? 'Administrador' : 'Usuario'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Links según rol */}
                {isAdmin() ? (
                  <Link
                    to="/admin"
                    className="bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl hover:bg-white/30 transition-all font-semibold border border-white/30 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    📊 Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/profile"
                    className="bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl hover:bg-white/30 transition-all font-semibold border border-white/30 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    👤 Mi Perfil
                  </Link>
                )}

                {/* Botón cerrar sesión */}
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  🚪 Salir
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// Componente de rutas que usa el contexto de auth
function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Login />} />

      {/* Ruta de registro - SOLO PARA ADMINISTRADORES */}
      <Route
        path="/register"
        element={
          <AdminRoute>
            <Register />
          </AdminRoute>
        }
      />

      {/* Rutas protegidas (requieren autenticación) */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />

      {/* Rutas admin (requieren autenticación + rol admin) */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* Ruta por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Componente principal
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
          <Navigation />

          <main className="container mx-auto px-4">
            <AppRoutes />
          </main>

          <footer className="text-center p-8 mt-12">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200">
                <p className="text-gray-700 font-semibold mb-2">
                  🔒 Sistema de Autenticación Biométrica
                </p>
                <p className="text-sm text-gray-600">
                  Proyecto Seguro - NIST SSDF & SOLID Architecture
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Sistema de Perfiles: Administrador & Usuario • Tecnología FaceNet 128D
                </p>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;