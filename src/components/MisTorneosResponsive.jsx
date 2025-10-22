import React, { useState, useEffect } from 'react';

const MisTorneosResponsive = () => {
  const [torneos, setTorneos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [screenSize, setScreenSize] = useState('desktop');
  const [abandonando, setAbandonando] = useState(false);

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

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        const usuarioData = JSON.parse(usuarioGuardado);
        console.log('Datos del usuario en MisTorneos:', usuarioData);
        setUsuario(usuarioData);
        const userId = usuarioData.user?.id || usuarioData.id;
        console.log('ID del usuario extraído:', userId);
        cargarMisTorneos(userId);
      } catch (error) {
        console.error('Error al parsear datos del usuario:', error);
        setMessage('Error al cargar datos del usuario');
      }
    } else {
      setMessage('Debes iniciar sesión para ver tus torneos');
    }
  }, []);

  const cargarMisTorneos = async (usuarioId) => {
    try {
      setLoading(true);
      console.log('Cargando mis torneos para usuario:', usuarioId);
      const response = await fetch('/api/mis_torneos.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario_id: usuarioId
        })
      });

      const data = await response.json();
      console.log('Respuesta de mis torneos:', data);

      if (data.status === 'ok') {
        setTorneos(data.torneos || []);
      } else {
        console.error('Error en respuesta de mis torneos:', data);
        setMessage('Error al cargar torneos: ' + (data.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al cargar torneos:', error);
      setMessage('Error de conexión al cargar torneos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    try {
      const [y, m, d] = String(fecha).split('-').map(Number);
      if (!y || !m || !d) return fecha;
      const fechaObj = new Date(y, m - 1, d);
      return fechaObj.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (error) {
      return fecha;
    }
  };

  const abandonarTorneo = async (torneoId) => {
    if (!usuario) {
      setMessage('Debes iniciar sesión para abandonar torneos');
      return;
    }

    // Confirmar abandono
    const confirmar = window.confirm('¿Estás seguro de que quieres abandonar este torneo? Esta acción no se puede deshacer.');
    if (!confirmar) {
      return;
    }

    try {
      setAbandonando(true);
      setMessage('');

      const usuarioId = usuario.user?.id || usuario.id || usuario.user_id || usuario.usuario_id || usuario.ID || usuario.userId;
      
      if (!usuarioId) {
        setMessage('Error: No se pudo obtener el ID del usuario');
        return;
      }

      const response = await fetch('/api/cancelar_inscripcion.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario_id: usuarioId,
          torneo_id: torneoId
        })
      });

      const data = await response.json();
      console.log('Respuesta de abandono:', data);

      if (data.status === 'ok') {
        setMessage('¡Has abandonado el torneo exitosamente!');
        // Recargar torneos
        await cargarMisTorneos(usuarioId);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error: ' + (data.message || 'No se pudo abandonar el torneo'));
      }
    } catch (error) {
      console.error('Error al abandonar torneo:', error);
      setMessage('Error de conexión al abandonar el torneo: ' + error.message);
    } finally {
      setAbandonando(false);
    }
  };

  const getConfig = () => {
    switch (screenSize) {
      case 'mobile':
        return {
          containerPadding: '15px',
          cardPadding: '15px',
          titleSize: '1.5rem',
          subtitleSize: '1rem',
          fontSize: '0.9rem',
          cardTitleSize: '1rem',
          cardTextSize: '0.8rem',
          gridColumns: '1fr',
          gridGap: '15px'
        };
      case 'tablet':
        return {
          containerPadding: '20px',
          cardPadding: '20px',
          titleSize: '1.8rem',
          subtitleSize: '1.1rem',
          fontSize: '1rem',
          cardTitleSize: '1.1rem',
          cardTextSize: '0.9rem',
          gridColumns: 'repeat(2, 1fr)',
          gridGap: '20px'
        };
      default:
        return {
          containerPadding: '30px',
          cardPadding: '25px',
          titleSize: '2rem',
          subtitleSize: '1.2rem',
          fontSize: '1.1rem',
          cardTitleSize: '1.2rem',
          cardTextSize: '1rem',
          gridColumns: 'repeat(3, 1fr)',
          gridGap: '25px'
        };
    }
  };

  const config = getConfig();

  if (!usuario) {
    return (
      <div style={{
        padding: config.containerPadding,
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: config.cardPadding,
          borderRadius: '15px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          maxWidth: '500px',
          width: '100%'
        }}>
          <h2 style={{
            fontSize: config.titleSize,
            color: '#dc3545',
            marginBottom: '15px'
          }}>
            Acceso Denegado
          </h2>
          <p style={{
            fontSize: config.fontSize,
            color: '#666',
            margin: 0
          }}>
            {message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: config.containerPadding,
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: screenSize === 'mobile' ? '30px' : '40px'
        }}>
          <h1 style={{
            fontSize: config.titleSize,
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '10px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            🏅 Mis Torneos
          </h1>
          <p style={{
            fontSize: config.subtitleSize,
            color: '#666',
            margin: 0
          }}>
            Los torneos en los que estás participando
          </p>
        </div>

        {/* Contenido */}
        {loading ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: config.cardPadding,
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: config.fontSize,
              color: '#666'
            }}>
              Cargando tus torneos...
            </div>
          </div>
        ) : torneos.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: config.gridColumns,
            gap: config.gridGap
          }}>
            {torneos.map((torneo, index) => (
              <div key={torneo.id || index} style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                padding: config.cardPadding,
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                border: '1px solid #e9ecef',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }}>
                {/* Badge de estado */}
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: config.cardTextSize,
                  fontWeight: '600'
                }}>
                  Inscrito
                </div>

                <div style={{
                  marginBottom: '15px'
                }}>
                  <h3 style={{
                    fontSize: config.cardTitleSize,
                    fontWeight: 'bold',
                    color: '#333',
                    margin: '0 0 8px 0',
                    lineHeight: '1.3'
                  }}>
                    {torneo.nombre || torneo.titulo}
                  </h3>
                  <p style={{
                    fontSize: config.cardTextSize,
                    color: '#666',
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    {torneo.descripcion || torneo.description || 'Sin descripción'}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{
                      fontSize: '1.2rem'
                    }}>📅</span>
                    <span style={{
                      fontSize: config.cardTextSize,
                      color: '#666',
                      fontWeight: '500'
                    }}>
                      {formatearFecha(torneo.fecha || torneo.fecha_torneo)}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{
                      fontSize: '1.2rem'
                    }}>🏆</span>
                    <span style={{
                      fontSize: config.cardTextSize,
                      color: '#666',
                      fontWeight: '500'
                    }}>
                      Torneo #{torneo.id}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{
                      fontSize: '1.2rem'
                    }}>👥</span>
                    <span style={{
                      fontSize: config.cardTextSize,
                      color: '#666',
                      fontWeight: '500'
                    }}>
                      Pareja: {torneo.pareja_nombre || 'Pendiente'}
                    </span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '10px'
                }}>
                  <button style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px 20px',
                    fontSize: config.cardTextSize,
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                  }}>
                    Ver Detalles
                  </button>
                  <button 
                    onClick={() => abandonarTorneo(torneo.id)}
                    disabled={abandonando}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      color: '#dc3545',
                      border: '2px solid #dc3545',
                      borderRadius: '10px',
                      padding: '12px 20px',
                      fontSize: config.cardTextSize,
                      fontWeight: '600',
                      cursor: abandonando ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      opacity: abandonando ? 0.7 : 1
                    }}
                    onMouseOver={(e) => {
                      if (!abandonando) {
                        e.target.style.backgroundColor = '#dc3545';
                        e.target.style.color = 'white';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!abandonando) {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#dc3545';
                      }
                    }}>
                    {abandonando ? 'Abandonando...' : 'Abandonar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: config.cardPadding,
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '20px'
            }}>
              🏅
            </div>
            <h3 style={{
              fontSize: config.titleSize,
              color: '#333',
              marginBottom: '10px'
            }}>
              No estás inscrito en ningún torneo
            </h3>
            <p style={{
              fontSize: config.fontSize,
              color: '#666',
              margin: 0
            }}>
              Inscríbete en un torneo para comenzar a competir
            </p>
          </div>
        )}

        {/* Mensaje de error */}
        {message && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            borderRadius: '10px',
            fontSize: config.fontSize,
            fontWeight: '500',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb'
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisTorneosResponsive;
