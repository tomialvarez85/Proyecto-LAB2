import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const WelcomePageResponsive = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');

  useEffect(() => {
    // Animación de entrada
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Detectar tamaño de pantalla
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

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateScreenSize);
    };
  }, []);

  // Configuraciones responsive
  const config = {
    mobile: {
      containerPadding: '5px',
      cardPadding: '18px 12px',
      cardBorderRadius: '12px',
      cardMaxWidth: '95%',
      iconSize: '30px',
      titleSize: '1.2rem',
      subtitleSize: '0.8rem',
      subtitleMargin: '15px',
      gridColumns: '1fr',
      gridGap: '8px',
      gridMargin: '15px',
      cardPaddingInner: '12px 10px',
      cardBorderRadiusInner: '10px',
      iconSizeInner: '1.5rem',
      titleSizeInner: '0.9rem',
      textSizeInner: '0.7rem',
      buttonPadding: '10px 15px',
      buttonFontSize: '0.8rem',
      buttonGap: '10px',
      buttonMargin: '15px',
      linkPadding: '10px',
      linkFontSize: '0.7rem'
    },
    tablet: {
      containerPadding: '8px',
      cardPadding: '25px 18px',
      cardBorderRadius: '15px',
      cardMaxWidth: '400px',
      iconSize: '45px',
      titleSize: '1.6rem',
      subtitleSize: '0.9rem',
      subtitleMargin: '18px',
      gridColumns: 'repeat(2, 1fr)',
      gridGap: '10px',
      gridMargin: '18px',
      cardPaddingInner: '14px 12px',
      cardBorderRadiusInner: '12px',
      iconSizeInner: '1.8rem',
      titleSizeInner: '0.95rem',
      textSizeInner: '0.75rem',
      buttonPadding: '12px 18px',
      buttonFontSize: '0.85rem',
      buttonGap: '12px',
      buttonMargin: '18px',
      linkPadding: '12px',
      linkFontSize: '0.75rem'
    },
    desktop: {
      containerPadding: '10px',
      cardPadding: '30px 22px',
      cardBorderRadius: '20px',
      cardMaxWidth: '450px',
      iconSize: '55px',
      titleSize: '1.8rem',
      subtitleSize: '1rem',
      subtitleMargin: '20px',
      gridColumns: 'repeat(3, 1fr)',
      gridGap: '12px',
      gridMargin: '20px',
      cardPaddingInner: '16px 12px',
      cardBorderRadiusInner: '12px',
      iconSizeInner: '2rem',
      titleSizeInner: '1rem',
      textSizeInner: '0.8rem',
      buttonPadding: '12px 22px',
      buttonFontSize: '0.9rem',
      buttonGap: '12px',
      buttonMargin: '20px',
      linkPadding: '12px',
      linkFontSize: '0.8rem'
    }
  };

  const currentConfig = config[screenSize];

  return (
    <div style={{ 
      minHeight: '100vh',
      height: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: currentConfig.containerPadding,
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
        backgroundSize: screenSize === 'mobile' ? '30px 30px' : '50px 50px',
        animation: 'float 20s ease-in-out infinite',
        zIndex: 0
      }} />
      
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: screenSize === 'mobile' ? '60px' : '100px',
        height: screenSize === 'mobile' ? '60px' : '100px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        animation: 'pulse 3s ease-in-out infinite',
        zIndex: 0
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '5%',
        width: screenSize === 'mobile' ? '40px' : '60px',
        height: screenSize === 'mobile' ? '40px' : '60px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        animation: 'pulse 4s ease-in-out infinite',
        zIndex: 0
      }} />

      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: currentConfig.cardBorderRadius,
        padding: currentConfig.cardPadding,
        boxShadow: '0 25px 50px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.2)',
        textAlign: 'center',
        maxWidth: currentConfig.cardMaxWidth,
        width: '100%',
        position: 'relative',
        zIndex: 1,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        margin: screenSize === 'mobile' ? '10px' : '20px'
      }}>
        {/* Logo/Icono con animación */}
        <div style={{
          fontSize: currentConfig.iconSize,
          marginBottom: screenSize === 'mobile' ? '20px' : '30px',
          animation: 'bounce 2s ease-in-out infinite',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
        }}>
          🏓
        </div>
        
        {/* Título principal con gradiente mejorado */}
        <h1 style={{
          fontSize: currentConfig.titleSize,
          fontWeight: '800',
          marginBottom: '15px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: '1.2',
          letterSpacing: '-0.02em',
          padding: screenSize === 'mobile' ? '0 10px' : '0'
        }}>
          Sistema de Gestión de Padel
        </h1>
        
        {/* Subtítulo mejorado */}
        <p style={{
          fontSize: currentConfig.subtitleSize,
          color: '#555',
          marginBottom: currentConfig.subtitleMargin,
          lineHeight: '1.7',
          fontWeight: '400',
          maxWidth: screenSize === 'mobile' ? '100%' : '500px',
          margin: screenSize === 'mobile' ? '0 auto 30px auto' : `0 auto ${currentConfig.subtitleMargin} auto`,
          padding: screenSize === 'mobile' ? '0 10px' : '0'
        }}>
          Gestiona reservas de canchas, participa en torneos y conecta con otros jugadores de padel
        </p>
        
        {/* Características principales con diseño mejorado */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: currentConfig.gridColumns,
          gap: currentConfig.gridGap,
          marginBottom: currentConfig.gridMargin,
          padding: screenSize === 'mobile' ? '0 10px' : '0'
        }}>
          <div style={{
            padding: currentConfig.cardPaddingInner,
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderRadius: currentConfig.cardBorderRadiusInner,
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
              fontSize: currentConfig.iconSizeInner, 
              marginBottom: '15px',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}>📅</div>
            <h3 style={{ 
              margin: '0 0 12px 0', 
              color: '#333', 
              fontSize: currentConfig.titleSizeInner,
              fontWeight: '600'
            }}>Reservas</h3>
            <p style={{ 
              margin: 0, 
              color: '#666', 
              fontSize: currentConfig.textSizeInner,
              lineHeight: '1.5'
            }}>
              Reserva canchas de padel fácilmente
            </p>
          </div>
          
          <div style={{
            padding: currentConfig.cardPaddingInner,
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderRadius: currentConfig.cardBorderRadiusInner,
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
              fontSize: currentConfig.iconSizeInner, 
              marginBottom: '15px',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}>🏆</div>
            <h3 style={{ 
              margin: '0 0 12px 0', 
              color: '#333', 
              fontSize: currentConfig.titleSizeInner,
              fontWeight: '600'
            }}>Torneos</h3>
            <p style={{ 
              margin: 0, 
              color: '#666', 
              fontSize: currentConfig.textSizeInner,
              lineHeight: '1.5'
            }}>
              Participa en competiciones
            </p>
          </div>
          
          <div style={{
            padding: currentConfig.cardPaddingInner,
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderRadius: currentConfig.cardBorderRadiusInner,
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
              fontSize: currentConfig.iconSizeInner, 
              marginBottom: '15px',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}>👥</div>
            <h3 style={{ 
              margin: '0 0 12px 0', 
              color: '#333', 
              fontSize: currentConfig.titleSizeInner,
              fontWeight: '600'
            }}>Comunidad</h3>
            <p style={{ 
              margin: 0, 
              color: '#666', 
              fontSize: currentConfig.textSizeInner,
              lineHeight: '1.5'
            }}>
              Conecta con otros jugadores
            </p>
          </div>
        </div>
        
        {/* Botones de acción mejorados */}
        <div style={{
          display: 'flex',
          gap: currentConfig.buttonGap,
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: currentConfig.buttonMargin
        }}>
          <Link 
            to="/login" 
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: currentConfig.buttonPadding,
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: currentConfig.buttonFontSize,
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
              padding: currentConfig.buttonPadding,
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: currentConfig.buttonFontSize,
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
          padding: currentConfig.linkPadding,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
          borderRadius: '15px',
          border: '1px solid rgba(102, 126, 234, 0.1)'
        }}>
          <p style={{
            margin: 0,
            color: '#666',
            fontSize: currentConfig.linkFontSize,
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

export default WelcomePageResponsive;
