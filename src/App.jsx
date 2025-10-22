import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import NavbarResponsive from './components/NavbarResponsive'
import LoginFormResponsive from './components/LoginFormResponsive'
import RegisterFormResponsive from './components/RegisterFormResponsive'
import ReservasResponsive from './components/ReservasResponsive'
import MisReservasResponsive from './components/MisReservasResponsive'
import TorneosResponsive from './components/TorneosResponsive'
import MisTorneosResponsive from './components/MisTorneosResponsive'
import AdminPanel from './components/AdminPanel'
import Home from './components/Home'
import MainPage from './components/MainPage'
import WelcomePageResponsive from './components/WelcomePageResponsive'
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

    // Escuchar evento personalizado de login
    const handleUserLogin = (event) => {
      try {
        const usuarioData = event.detail;
        setUsuario(usuarioData);
        
        // Verificar si es admin usando parseInt
        const adminValue = usuarioData.user?.admin || usuarioData.admin;
        const esAdminUsuario = parseInt(adminValue) === 1;
        setEsAdmin(esAdminUsuario);
      } catch (error) {
        console.error('Error al procesar login:', error);
      }
    };

    // Escuchar evento personalizado de logout
    const handleUserLogout = () => {
      console.log('handleUserLogout - Ejecutando logout');
      setUsuario(null);
      setEsAdmin(false);
      console.log('handleUserLogout - Estado actualizado');
      
      // Forzar un re-render después de un breve delay
      setTimeout(() => {
        console.log('handleUserLogout - Re-render forzado');
        // El estado ya debería estar actualizado
      }, 50);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLogin', handleUserLogin);
    window.addEventListener('userLogout', handleUserLogout);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', handleUserLogin);
      window.removeEventListener('userLogout', handleUserLogout);
    };
  }, []);


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

  // Componente principal que decide qué mostrar
  const RootPage = () => {
    console.log('RootPage - usuario:', usuario);
    console.log('RootPage - esAdmin:', esAdmin);
    
    if (!usuario) {
      console.log('RootPage - Mostrando WelcomePage');
      return <WelcomePageResponsive />;
    }
    console.log('RootPage - Redirigiendo a MainPage');
    return <Navigate to="/MainPage" replace />;
  };

  // Componente de Login con redirección mejorada
  const LoginWithRedirect = () => {
    const navigate = useNavigate();
    
    const handleLoginSuccess = () => {
      // Navegar a MainPage después del login
      navigate('/MainPage', { replace: true });
    };

    return <LoginFormResponsive onLoginSuccess={handleLoginSuccess} />;
  };

  // Componente de Register con redirección
  const Register = () => {
    const navigate = useNavigate();
    
    const handleRegisterSuccess = () => {
      // Navegar al login
      navigate('/login', { replace: true });
    };

    return <RegisterFormResponsive onRegisterSuccess={handleRegisterSuccess} />;
  };

  return (
    <div>
      {usuario && <NavbarResponsive />}
      <div className="container page">
        <Routes>
        <Route path="/login" element={<LoginWithRedirect />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reservas" element={usuario ? <ReservasResponsive /> : <Navigate to="/login" replace />} />
        <Route path="/mis-reservas" element={usuario ? <MisReservasResponsive /> : <Navigate to="/login" replace />} />
        <Route path="/torneos" element={usuario ? <TorneosResponsive /> : <Navigate to="/login" replace />} />
        <Route path="/mis-torneos" element={usuario ? <MisTorneosResponsive /> : <Navigate to="/login" replace />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<RootPage />} />
        <Route path="/MainPage" element={usuario ? <MainPage /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
