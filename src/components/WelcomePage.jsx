import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animación de entrada
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh',
      height: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      margin: 0,
      boxSizing: 'border-box'
    }}>
      {/* Elementos decorativos de fondo */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        animation: 'float 20s ease-in-out infinite',
        zIndex: 0
      }} />
      
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: '100px',
        height: '100px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        animation: 'pulse 3s ease-in-out infinite',
        zIndex: 0
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '5%',
        width: '60px',
        height: '60px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        animation: 'pulse 4s ease-in-out infinite',
        zIndex: 0
      }} />

      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: window.innerWidth < 768 ? '20px' : '30px',
        padding: window.innerWidth < 768 ? '40px 20px' : window.innerWidth < 1024 ? '50px 30px' : '60px 40px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.2)',
        textAlign: 'center',
        maxWidth: window.innerWidth < 768 ? '95%' : window.innerWidth < 1024 ? '600px' : '700px',
        width: '100%',
        position: 'relative',
        zIndex: 1,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        margin: window.innerWidth < 768 ? '10px' : '20px'
      }}>
        {/* Logo/Icono con animación */}
        <div style={{
          fontSize: window.innerWidth < 768 ? '60px' : window.innerWidth < 1024 ? '80px' : '100px',
          marginBottom: window.innerWidth < 768 ? '20px' : '30px',
          animation: 'bounce 2s ease-in-out infinite',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
        }}>
          🏓
        </div>
        
        {/* Título principal con gradiente mejorado */}
        <h1 style={{
          fontSize: window.innerWidth < 768 ? '1.8rem' : window.innerWidth < 1024 ? '2.5rem' : '3rem',
          fontWeight: '800',
          marginBottom: '15px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: '1.2',
          letterSpacing: '-0.02em',
          padding: window.innerWidth < 768 ? '0 10px' : '0'
        }}>
          Sistema de Gestión de Padel
        </h1>
        
        {/* Subtítulo mejorado */}
        <p style={{
          fontSize: window.innerWidth < 768 ? '1rem' : window.innerWidth < 1024 ? '1.1rem' : '1.3rem',
          color: '#555',
          marginBottom: window.innerWidth < 768 ? '30px' : '50px',
          lineHeight: '1.7',
          fontWeight: '400',
          maxWidth: window.innerWidth < 768 ? '100%' : '500px',
          margin: window.innerWidth < 768 ? '0 auto 30px auto' : '0 auto 50px auto',
          padding: window.innerWidth < 768 ? '0 10px' : '0'
        }}>
          Gestiona reservas de canchas, participa en torneos y conecta con otros jugadores de padel
        </p>
        
        {/* Características principales con diseño mejorado */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 768 ? '1fr' : window.innerWidth < 1024 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: window.innerWidth < 768 ? '15px' : '25px',
          marginBottom: window.innerWidth < 768 ? '30px' : '50px',
          padding: window.innerWidth < 768 ? '0 10px' : '0'
        }}>
          <div style={{
            padding: '30px 20px',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderRadius: '20px',
            border: '1px solid rgba(102, 126, 234, 0.1)',
            transition: 'all 0.3s ease',
            cursor: 'default',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 15px 30px rgba(102, 126, 234, 0.2)';
            e.currentTarget.style.borderColor = '#667eea';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.1)';
          }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '15px',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}>📅</div>
            <h3 style={{ 
              margin: '0 0 12px 0', 
              color: '#333', 
              fontSize: '1.2rem',
              fontWeight: '600'
            }}>Reservas</h3>
            <p style={{ 
              margin: 0, 
              color: '#666', 
              fontSize: '0.95rem',
              lineHeight: '1.5'
            }}>
              Reserva canchas de padel fácilmente
            </p>
          </div>
          
          <div style={{
            padding: '30px 20px',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderRadius: '20px',
            border: '1px solid rgba(102, 126, 234, 0.1)',
            transition: 'all 0.3s ease',
            cursor: 'default',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 15px 30px rgba(102, 126, 234, 0.2)';
            e.currentTarget.style.borderColor = '#667eea';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.1)';
          }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '15px',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}>🏆</div>
            <h3 style={{ 
              margin: '0 0 12px 0', 
              color: '#333', 
              fontSize: '1.2rem',
              fontWeight: '600'
            }}>Torneos</h3>
            <p style={{ 
              margin: 0, 
              color: '#666', 
              fontSize: '0.95rem',
              lineHeight: '1.5'
            }}>
              Participa en competiciones
            </p>
          </div>
          
          <div style={{
            padding: '30px 20px',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderRadius: '20px',
            border: '1px solid rgba(102, 126, 234, 0.1)',
            transition: 'all 0.3s ease',
            cursor: 'default',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 15px 30px rgba(102, 126, 234, 0.2)';
            e.currentTarget.style.borderColor = '#667eea';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.1)';
          }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '15px',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}>👥</div>
            <h3 style={{ 
              margin: '0 0 12px 0', 
              color: '#333', 
              fontSize: '1.2rem',
              fontWeight: '600'
            }}>Comunidad</h3>
            <p style={{ 
              margin: 0, 
              color: '#666', 
              fontSize: '0.95rem',
              lineHeight: '1.5'
            }}>
              Conecta con otros jugadores
            </p>
          </div>
        </div>
        
        {/* Botones de acción mejorados */}
        <div style={{
          display: 'flex',
          gap: '25px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '30px'
        }}>
          <Link 
            to="/login" 
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '18px 40px',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1.1rem',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
              display: 'inline-block',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px) scale(1.05)';
              e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.6)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
            }}
          >
            🚀 Iniciar Sesión
          </Link>
          
          <Link 
            to="/register" 
            style={{
              background: 'transparent',
              color: '#667eea',
              padding: '18px 40px',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1.1rem',
              border: '2px solid #667eea',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'inline-block',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
              e.target.style.color = 'white';
              e.target.style.transform = 'translateY(-3px) scale(1.05)';
              e.target.style.borderColor = 'transparent';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#667eea';
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.borderColor = '#667eea';
            }}
          >
            ✨ Registrarse
          </Link>
        </div>
        
        {/* Texto adicional mejorado */}
        <div style={{
          padding: '20px',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
          borderRadius: '15px',
          border: '1px solid rgba(102, 126, 234, 0.1)'
        }}>
          <p style={{
            margin: 0,
            color: '#666',
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            ¿Ya tienes cuenta? <Link to="/login" style={{ 
              color: '#667eea', 
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.color = '#5a6fd8';
              e.target.style.textDecoration = 'underline';
            }}
            onMouseOut={(e) => {
              e.target.style.color = '#667eea';
              e.target.style.textDecoration = 'none';
            }}
            >Inicia sesión aquí</Link>
          </p>
        </div>
      </div>

      {/* CSS para animaciones y estilos globales */}
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow-x: hidden;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

export default WelcomePage;
