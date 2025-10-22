import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const NavbarResponsive = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');

  const usuarioRaw = typeof window !== 'undefined' ? localStorage.getItem('usuario') : null;
  let usuario = null;
  try { usuario = usuarioRaw ? JSON.parse(usuarioRaw) : null; } catch {}
  const esAdmin = usuario && (usuario.user?.admin === '1' || usuario.admin === '1' || usuario.user?.admin === 1 || usuario.admin === 1);

  useEffect(() => {
    const updateScreenSize = () => {
      if (window.innerWidth < 768) {
        setScreenSize('mobile');
      } else if (window.innerWidth < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);

    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      console.log('Navbar - Iniciando logout');
      localStorage.removeItem('usuario');
      console.log('Navbar - localStorage limpiado');
      
      // Disparar evento personalizado para notificar el logout
      window.dispatchEvent(new CustomEvent('userLogout'));
      console.log('Navbar - Evento userLogout disparado');
      
      // También disparar el evento storage para compatibilidad
      window.dispatchEvent(new Event('storage'));
      console.log('Navbar - Evento storage disparado');
      
      // Cerrar menú móvil si está abierto
      setIsMobileMenuOpen(false);
      
      // Esperar un momento para que el estado se actualice antes de navegar
      setTimeout(() => {
        console.log('Navbar - Navegando a /');
        navigate('/', { replace: true });
      }, 100);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = usuario ? (
    <>
      {/* Vista para usuarios regulares */}
      {!esAdmin && (
        <>
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Inicio
          </NavLink>
          <NavLink 
            to="/reservas" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Reservas
          </NavLink>
          <NavLink 
            to="/mis-reservas" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Mis Reservas
          </NavLink>
          <NavLink 
            to="/torneos" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Torneos
          </NavLink>
          <NavLink 
            to="/mis-torneos" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Mis Torneos
          </NavLink>
        </>
      )}
      
      {/* Vista para administradores - Solo Admin */}
      {esAdmin && (
        <NavLink 
          to="/admin" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={closeMobileMenu}
        >
          Admin
        </NavLink>
      )}
      
      {/* Botón de cerrar sesión para todos los usuarios logueados */}
      <button 
        className="btn btn-danger" 
        onClick={handleLogout}
        style={{
              fontSize: screenSize === 'mobile' ? '0.7rem' : '0.8rem',
              padding: screenSize === 'mobile' ? '5px 8px' : '6px 10px'
        }}
      >
        Cerrar sesión
      </button>
    </>
  ) : (
    <>
      <NavLink 
        to="/login" 
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        onClick={closeMobileMenu}
      >
        Iniciar sesión
      </NavLink>
      <NavLink 
        to="/register" 
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        onClick={closeMobileMenu}
      >
        Crear cuenta
      </NavLink>
    </>
  );

  return (
    <div className="navbar" style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div className="navbar-inner" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: screenSize === 'mobile' ? '6px 10px' : '10px 12px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Logo/Brand */}
        <div 
          className="brand" 
          role="banner" 
          onClick={() => {
            navigate('/');
            closeMobileMenu();
          }} 
          style={{ 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <img 
            className="brand-logo" 
            src="/vite.svg" 
            alt="Logo" 
            style={{
              width: screenSize === 'mobile' ? '20px' : '26px',
              height: screenSize === 'mobile' ? '20px' : '26px'
            }}
          />
          <span style={{
            fontSize: screenSize === 'mobile' ? '0.9rem' : '1.1rem',
            fontWeight: 'bold',
            color: '#333'
          }}>
            {screenSize === 'mobile' ? 'Padel Lab' : 'Sistema Lab Padel'}
          </span>
        </div>

        {/* Desktop/Tablet Navigation */}
        {screenSize !== 'mobile' && (
          <div className="nav-links" role="navigation" aria-label="Main" style={{
            display: 'flex',
            alignItems: 'center',
            gap: screenSize === 'tablet' ? '8px' : '10px'
          }}>
            {navLinks}
          </div>
        )}

        {/* Mobile Menu Button */}
        {screenSize === 'mobile' && (
          <button
            onClick={toggleMobileMenu}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {screenSize === 'mobile' && isMobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          borderTop: '1px solid #eee',
          zIndex: 999
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 15px',
            gap: '15px'
          }}>
            {navLinks}
          </div>
        </div>
      )}

      {/* Overlay for mobile menu */}
      {screenSize === 'mobile' && isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 998
          }}
          onClick={closeMobileMenu}
        />
      )}
    </div>
  );
};

export default NavbarResponsive;
