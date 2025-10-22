import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MainPage = () => {
  const [screenSize, setScreenSize] = useState('desktop');

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

  const getGridConfig = () => {
    switch (screenSize) {
      case 'mobile':
        return {
          columns: '1fr',
          gap: '8px',
          padding: '10px 8px',
          cardPadding: '12px',
          titleSize: '1.1rem',
          subtitleSize: '0.8rem',
          cardTitleSize: '0.9rem',
          cardTextSize: '0.7rem'
        };
      case 'tablet':
        return {
          columns: 'repeat(2, 1fr)',
          gap: '10px',
          padding: '15px 12px',
          cardPadding: '14px',
          titleSize: '1.3rem',
          subtitleSize: '0.9rem',
          cardTitleSize: '1rem',
          cardTextSize: '0.75rem'
        };
      default:
        return {
          columns: 'repeat(3, 1fr)',
          gap: '12px',
          padding: '18px 15px',
          cardPadding: '16px',
          titleSize: '1.4rem',
          subtitleSize: '1rem',
          cardTitleSize: '1.1rem',
          cardTextSize: '0.8rem'
        };
    }
  };

  const config = getGridConfig();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      padding: config.padding
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: screenSize === 'mobile' ? '30px' : '50px'
        }}>
          <h1 style={{
            fontSize: config.titleSize,
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '15px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            🏓 Sistema de Gestión de Padel
          </h1>
          <p style={{
            fontSize: config.subtitleSize,
            color: '#666',
            margin: 0,
            lineHeight: '1.6'
          }}>
            Bienvenido al sistema de gestión de reservas y torneos de padel
          </p>
        </div>

        {/* Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: config.columns,
          gap: config.gap,
          marginBottom: '30px'
        }}>
          <Link to="/reservas" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: config.cardPadding,
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              border: '1px solid #e9ecef',
              cursor: 'pointer',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            }}>
              <h3 style={{
                fontSize: config.cardTitleSize,
                fontWeight: 'bold',
                color: '#333',
                margin: '0 0 10px 0'
              }}>
                📅 Reservas
              </h3>
              <p style={{
                fontSize: config.cardTextSize,
                color: '#666',
                margin: 0,
                lineHeight: '1.5',
                flex: 1
              }}>
                Gestiona tus reservas de canchas de padel
              </p>
            </div>
          </Link>

          <Link to="/mis-reservas" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: config.cardPadding,
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              border: '1px solid #e9ecef',
              cursor: 'pointer',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            }}>
              <h3 style={{
                fontSize: config.cardTitleSize,
                fontWeight: 'bold',
                color: '#333',
                margin: '0 0 10px 0'
              }}>
                📋 Mis Reservas
              </h3>
              <p style={{
                fontSize: config.cardTextSize,
                color: '#666',
                margin: 0,
                lineHeight: '1.5',
                flex: 1
              }}>
                Ve y gestiona tus reservas existentes
              </p>
            </div>
          </Link>

          <Link to="/torneos" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: config.cardPadding,
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              border: '1px solid #e9ecef',
              cursor: 'pointer',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            }}>
              <h3 style={{
                fontSize: config.cardTitleSize,
                fontWeight: 'bold',
                color: '#333',
                margin: '0 0 10px 0'
              }}>
                🏆 Torneos
              </h3>
              <p style={{
                fontSize: config.cardTextSize,
                color: '#666',
                margin: 0,
                lineHeight: '1.5',
                flex: 1
              }}>
                Participa en torneos y competiciones
              </p>
            </div>
          </Link>

          <Link to="/mis-torneos" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: config.cardPadding,
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              border: '1px solid #e9ecef',
              cursor: 'pointer',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            }}>
              <h3 style={{
                fontSize: config.cardTitleSize,
                fontWeight: 'bold',
                color: '#333',
                margin: '0 0 10px 0'
              }}>
                🏅 Mis Torneos
              </h3>
              <p style={{
                fontSize: config.cardTextSize,
                color: '#666',
                margin: 0,
                lineHeight: '1.5',
                flex: 1
              }}>
                Ve los torneos en los que estás inscrito
              </p>
            </div>
          </Link>

          <Link to="/admin" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: config.cardPadding,
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              border: '1px solid #e9ecef',
              cursor: 'pointer',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            }}>
              <h3 style={{
                fontSize: config.cardTitleSize,
                fontWeight: 'bold',
                color: '#333',
                margin: '0 0 10px 0'
              }}>
                ⚙️ Panel Admin
              </h3>
              <p style={{
                fontSize: config.cardTextSize,
                color: '#666',
                margin: 0,
                lineHeight: '1.5',
                flex: 1
              }}>
                Gestiona usuarios, torneos y reservas
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
