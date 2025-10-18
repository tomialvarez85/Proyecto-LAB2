import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      // Limpiar localStorage
      localStorage.removeItem('usuario');
      
      // Disparar evento de storage para sincronizar con App.jsx
      window.dispatchEvent(new Event('storage'));
      
      // Redirigir al login
      navigate('/login', { replace: true });
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1>🏓 Sistema de Gestión de Padel</h1>
          <p style={{ fontSize: '18px', color: '#666', margin: '0' }}>
            Bienvenido al sistema de gestión de reservas y torneos de padel
          </p>
        </div>
        <button
          onClick={handleCerrarSesion}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#c82333';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#dc3545';
          }}
        >
          🚪 Cerrar Sesión
        </button>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px',
        marginTop: '30px'
      }}>
        <Link to="/reservas" style={cardLinkStyle}>
          <div style={cardStyle}>
            <h3 style={{ color: '#007bff', marginBottom: '10px' }}>📅 Reservas</h3>
            <p>Gestiona tus reservas de canchas de padel</p>
          </div>
        </Link>
        
        <Link to="/mis-reservas" style={cardLinkStyle}>
          <div style={cardStyle}>
            <h3 style={{ color: '#17a2b8', marginBottom: '10px' }}>📋 Mis Reservas</h3>
            <p>Ve y gestiona tus reservas existentes</p>
          </div>
        </Link>
        
        <Link to="/torneos" style={cardLinkStyle}>
          <div style={cardStyle}>
            <h3 style={{ color: '#28a745', marginBottom: '10px' }}>🏆 Torneos</h3>
            <p>Participa en torneos y competiciones</p>
          </div>
        </Link>
        
        <Link to="/mis-torneos" style={cardLinkStyle}>
          <div style={cardStyle}>
            <h3 style={{ color: '#fd7e14', marginBottom: '10px' }}>🏅 Mis Torneos</h3>
            <p>Ve los torneos en los que estás inscrito</p>
          </div>
        </Link>
        
        <Link to="/admin" style={cardLinkStyle}>
          <div style={cardStyle}>
            <h3 style={{ color: '#dc3545', marginBottom: '10px' }}>⚙️ Panel Admin</h3>
            <p>Gestiona usuarios, torneos y reservas</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

// Estilos para las tarjetas
const cardStyle = {
  padding: '20px',
  backgroundColor: '#f8f9fa',
  border: '1px solid #dee2e6',
  borderRadius: '8px',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  cursor: 'pointer'
};

const cardLinkStyle = {
  textDecoration: 'none',
  color: 'inherit',
  display: 'block'
};

export default Home;
