import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import Reservas from './components/Reservas'
import MisReservas from './components/MisReservas'
import Torneos from './components/Torneos'
import MisTorneos from './components/MisTorneos'
import AdminPanel from './components/AdminPanel'
import Home from './components/Home'
import './App.css'

function App() {
  // Inicializar estado con datos del localStorage para evitar redirección en refresh
  const [usuario, setUsuario] = useState(() => {
    try {
      const usuarioGuardado = localStorage.getItem('usuario');
      return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
    } catch (error) {
      console.error('Error al parsear datos del usuario en inicialización:', error);
      return null;
    }
  });
  
  const [esAdmin, setEsAdmin] = useState(() => {
    try {
      const usuarioGuardado = localStorage.getItem('usuario');
      if (usuarioGuardado) {
        const usuarioData = JSON.parse(usuarioGuardado);
        const adminValue = usuarioData.user?.admin || usuarioData.admin;
        return parseInt(adminValue) === 1;
      }
      return false;
    } catch (error) {
      console.error('Error al verificar admin en inicialización:', error);
      return false;
    }
  });

  // Escuchar cambios en localStorage para sincronizar entre pestañas
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const usuarioGuardado = localStorage.getItem('usuario');
        if (usuarioGuardado) {
          const usuarioData = JSON.parse(usuarioGuardado);
          setUsuario(usuarioData);
          
          // Verificar si es admin usando parseInt
          const adminValue = usuarioData.user?.admin || usuarioData.admin;
          const esAdminUsuario = parseInt(adminValue) === 1;
          setEsAdmin(esAdminUsuario);
        } else {
          setUsuario(null);
          setEsAdmin(false);
        }
      } catch (error) {
        console.error('Error al parsear datos del usuario:', error);
        setUsuario(null);
        setEsAdmin(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Componente de Login con redirección
  const Login = () => {
    const navigate = useNavigate();
    
    const handleLoginSuccess = () => {
      // Navegar al menú principal
      navigate('/', { replace: true });
    };

    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  };

  // Componente de Admin con protección
  const Admin = () => {
    if (!usuario) {
      return <Navigate to="/login" replace />;
    }

    if (!esAdmin) {
      return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
          <h2>Panel de Administración</h2>
          <div style={{
            padding: '20px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            Acceso denegado. Esta sección es solo para administradores.
          </div>
        </div>
      );
    }

    return <AdminPanel />;
  };

  // Componente Home protegido
  const HomeProtected = () => {
    if (!usuario) {
      return <Navigate to="/login" replace />;
    }
    return <Home />;
  };

  // Componente de Register con redirección
  const Register = () => {
    const navigate = useNavigate();
    
    const handleRegisterSuccess = () => {
      // Navegar al login
      navigate('/login', { replace: true });
    };

    return <RegisterForm onRegisterSuccess={handleRegisterSuccess} />;
  };

  return (
    <div>
      <Navbar />
      <div className="container page">
        <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reservas" element={usuario ? <Reservas /> : <Navigate to="/login" replace />} />
        <Route path="/mis-reservas" element={usuario ? <MisReservas /> : <Navigate to="/login" replace />} />
        <Route path="/torneos" element={usuario ? <Torneos /> : <Navigate to="/login" replace />} />
        <Route path="/mis-torneos" element={usuario ? <MisTorneos /> : <Navigate to="/login" replace />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<HomeProtected />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
