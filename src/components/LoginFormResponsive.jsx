import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../api/config.js';

const LoginFormResponsive = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [screenSize, setScreenSize] = useState('desktop');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState(null);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setUserData(null);

    try {
      const data = await apiPost('login.php', {
        email: formData.email,
        password: formData.password
      });

      if (data.status === 'ok') {
        setMessage('Login exitoso! Redirigiendo al menú principal...');
        setUserData(data);
        localStorage.setItem('usuario', JSON.stringify(data));
        
        // Disparar evento personalizado para notificar el cambio de estado
        window.dispatchEvent(new CustomEvent('userLogin', { detail: data }));
        
        // Redirigir al menú principal después de 1 segundo
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess();
          }
        }, 1000);
      } else {
        setMessage(data.message || 'Error en el login');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const getFormConfig = () => {
    switch (screenSize) {
      case 'mobile':
        return {
          containerPadding: '5px',
          cardPadding: '15px 12px',
          cardBorderRadius: '10px',
          cardMaxWidth: '90%',
          titleSize: '1rem',
          subtitleSize: '0.7rem',
          inputPadding: '6px 8px',
          inputFontSize: '0.7rem',
          buttonPadding: '6px 12px',
          buttonFontSize: '0.7rem',
          linkFontSize: '0.6rem',
          messageFontSize: '0.6rem'
        };
      case 'tablet':
        return {
          containerPadding: '8px',
          cardPadding: '18px 15px',
          cardBorderRadius: '12px',
          cardMaxWidth: '350px',
          titleSize: '1.2rem',
          subtitleSize: '0.8rem',
          inputPadding: '8px 10px',
          inputFontSize: '0.75rem',
          buttonPadding: '8px 15px',
          buttonFontSize: '0.75rem',
          linkFontSize: '0.65rem',
          messageFontSize: '0.65rem'
        };
      default:
        return {
          containerPadding: '10px',
          cardPadding: '20px 18px',
          cardBorderRadius: '15px',
          cardMaxWidth: '350px',
          titleSize: '1.4rem',
          subtitleSize: '0.9rem',
          inputPadding: '10px 12px',
          inputFontSize: '0.8rem',
          buttonPadding: '10px 18px',
          buttonFontSize: '0.8rem',
          linkFontSize: '0.7rem',
          messageFontSize: '0.7rem'
        };
    }
  };

  const config = getFormConfig();

  return (
    <div style={{
      minHeight: '100vh',
      height: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: config.containerPadding,
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
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: config.cardBorderRadius,
        padding: config.cardPadding,
        boxShadow: '0 25px 50px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.2)',
        textAlign: 'center',
        maxWidth: config.cardMaxWidth,
        width: '100%',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Logo/Icono */}
        <div style={{
          fontSize: screenSize === 'mobile' ? '60px' : screenSize === 'tablet' ? '80px' : '100px',
          marginBottom: screenSize === 'mobile' ? '20px' : '30px',
          animation: 'bounce 2s ease-in-out infinite',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
        }}>
          🏓
        </div>
        
        {/* Título */}
        <h1 style={{
          fontSize: config.titleSize,
          fontWeight: '800',
          marginBottom: '15px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: '1.2',
          letterSpacing: '-0.02em'
        }}>
          Iniciar Sesión
        </h1>
        
        {/* Subtítulo */}
        <p style={{
          fontSize: config.subtitleSize,
          color: '#555',
          marginBottom: screenSize === 'mobile' ? '25px' : '35px',
          lineHeight: '1.6'
        }}>
          Accede a tu cuenta para gestionar reservas y torneos
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: screenSize === 'mobile' ? '20px' : '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333',
              fontSize: config.inputFontSize
            }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: config.inputPadding,
                border: '2px solid #e9ecef',
                borderRadius: '12px',
                fontSize: config.inputFontSize,
                transition: 'all 0.3s ease',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: screenSize === 'mobile' ? '25px' : '30px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333',
              fontSize: config.inputFontSize
            }}>
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: config.inputPadding,
                border: '2px solid #e9ecef',
                borderRadius: '12px',
                fontSize: config.inputFontSize,
                transition: 'all 0.3s ease',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading 
                ? 'linear-gradient(135deg, #ccc 0%, #999 100%)' 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: config.buttonPadding,
              border: 'none',
              borderRadius: '12px',
              fontSize: config.buttonFontSize,
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: screenSize === 'mobile' ? '20px' : '25px',
              boxShadow: loading 
                ? 'none' 
                : '0 8px 25px rgba(102, 126, 234, 0.4)'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.6)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
              }
            }}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Mensaje */}
        {message && (
          <div style={{
            padding: screenSize === 'mobile' ? '12px 15px' : '15px 20px',
            borderRadius: '10px',
            marginBottom: screenSize === 'mobile' ? '20px' : '25px',
            fontSize: config.messageFontSize,
            fontWeight: '500',
            backgroundColor: userData ? '#d4edda' : '#f8d7da',
            color: userData ? '#155724' : '#721c24',
            border: `1px solid ${userData ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            {message}
          </div>
        )}

        {/* Enlaces */}
        <div style={{
          padding: screenSize === 'mobile' ? '15px' : '20px',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
          borderRadius: '15px',
          border: '1px solid rgba(102, 126, 234, 0.1)'
        }}>
          <p style={{
            margin: 0,
            color: '#666',
            fontSize: config.linkFontSize,
            fontWeight: '500'
          }}>
            ¿No tienes cuenta? <a 
              href="/register" 
              style={{ 
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
            >Regístrate aquí</a>
          </p>
        </div>
      </div>

      {/* CSS para animaciones */}
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

export default LoginFormResponsive;
