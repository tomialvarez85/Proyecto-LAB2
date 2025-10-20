import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const usuarioRaw = typeof window !== 'undefined' ? localStorage.getItem('usuario') : null;
  let usuario = null;
  try { usuario = usuarioRaw ? JSON.parse(usuarioRaw) : null; } catch {}
  const esAdmin = usuario && (usuario.user?.admin === '1' || usuario.admin === '1' || usuario.user?.admin === 1 || usuario.admin === 1);

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      localStorage.removeItem('usuario');
      window.dispatchEvent(new Event('storage'));
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="navbar">
      <div className="navbar-inner">
        <div className="brand" role="banner" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img className="brand-logo" src="/vite.svg" alt="Logo" />
          <span>Sistema Lab Padel</span>
        </div>
        <div className="nav-links" role="navigation" aria-label="Main">
          {usuario ? (
            <>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Inicio</NavLink>
              <NavLink to="/reservas" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Reservas</NavLink>
              <NavLink to="/mis-reservas" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Mis Reservas</NavLink>
              <NavLink to="/torneos" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Torneos</NavLink>
              <NavLink to="/mis-torneos" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Mis Torneos</NavLink>
              {esAdmin && (
                <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Admin</NavLink>
              )}
              <button className="btn btn-danger" onClick={handleLogout}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Iniciar sesión</NavLink>
              <NavLink to="/register" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Crear cuenta</NavLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;


