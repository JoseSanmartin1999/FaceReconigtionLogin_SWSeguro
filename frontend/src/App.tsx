import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Barra de Navegación */}
        <nav className="bg-white shadow-lg p-4 mb-8">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-blue-600">FaceAuth System</h1>
            <div className="space-x-4">
              <Link to="/" className="text-gray-600 hover:text-blue-500 font-medium">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Registro</Link>
            </div>
          </div>
        </nav>

        {/* Contenedor de Páginas */}
        <main className="container mx-auto px-4">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>

        <footer className="text-center p-8 text-gray-400 text-sm">
          Proyecto Seguro - NIST SSDF & SOLID Architecture
        </footer>
      </div>
    </Router>
  );
}

export default App;