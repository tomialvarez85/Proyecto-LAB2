import React, { useState, useEffect } from 'react';
import { apiPost, buildApiUrl } from '../api/config.js';

const TorneosResponsive = () => {
  const [torneos, setTorneos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [screenSize, setScreenSize] = useState('desktop');
  const [inscribiendo, setInscribiendo] = useState(false);
  const [inscripciones, setInscripciones] = useState([]);

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
        setUsuario(usuarioData);
        cargarTorneos();
        cargarInscripciones();
      } catch (error) {
        console.error('Error al parsear datos del usuario:', error);
        setMessage('Error al cargar datos del usuario');
      }
    } else {
      setMessage('Debes iniciar sesión para ver los torneos');
    }
  }, []);

  const cargarTorneos = async () => {
    try {
      setLoading(true);
      console.log('Cargando torneos...');
      
      const data = await apiPost('torneos.php', {});
      console.log('Respuesta de torneos:', data);

      if (data.status === 'ok') {
        setTorneos(data.torneos || []);
      } else {
        console.error('Error en respuesta de torneos:', data);
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

  const inscribirseTorneo = async (torneoId) => {
    if (!usuario) {
      setMessage('Debes iniciar sesión para inscribirte');
      return;
    }

    // Verificar si el usuario es admin
    const adminStatus = usuario.admin || usuario.user?.admin || usuario.is_admin;
    const esAdmin = adminStatus === 1 || adminStatus === "1" || adminStatus === true;
    
    if (esAdmin) {
      setMessage('Los administradores no pueden inscribirse a torneos');
      return;
    }

    // Confirmar inscripción
    const confirmar = window.confirm('¿Estás seguro de que quieres inscribirte a este torneo?');
    if (!confirmar) {
      return;
    }

    try {
      setInscribiendo(true);
      setMessage('');

      const usuarioId = usuario.user?.id || usuario.id || usuario.user_id || usuario.usuario_id || usuario.ID || usuario.userId;
      
      if (!usuarioId) {
        setMessage('Error: No se pudo obtener el ID del usuario');
        return;
      }

      const requestData = {
        usuario_id: usuarioId,
        torneo_id: torneoId
      };

      const data = await apiPost('inscribir.php', requestData);
      console.log('Respuesta de inscripción:', data);

      if (data.status === 'ok') {
        setMessage('¡Te has inscrito exitosamente al torneo!');
        // Recargar inscripciones
        await cargarInscripciones();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error: ' + (data.message || 'No se pudo inscribir al torneo'));
      }
    } catch (error) {
      console.error('Error al inscribirse:', error);
      console.error('Error details:', error.message);
      setMessage('Error de conexión al inscribirse al torneo: ' + error.message);
    } finally {
      setInscribiendo(false);
    }
  };

  const cargarInscripciones = async () => {
    try {
      const usuarioId = usuario?.user?.id || usuario?.id || usuario?.user_id || usuario?.usuario_id || usuario?.ID || usuario?.userId;
      
      if (!usuarioId) return;

      const data = await apiPost('mis_inscripciones.php', {
        usuario_id: usuarioId
      });
      if (data.status === 'ok') {
        setInscripciones(data.inscripciones || []);
      }
    } catch (error) {
      console.error('Error al cargar inscripciones:', error);
    }
  };

  const estaInscrito = (torneoId) => {
    return inscripciones.some(inscripcion => inscripcion.torneo_id == torneoId);
  };

  const cancelarInscripcion = async (torneoId) => {
    if (!usuario) {
      setMessage('Debes iniciar sesión para cancelar inscripciones');
      return;
    }

    // Verificar si el usuario es admin
    const adminStatus = usuario.admin || usuario.user?.admin || usuario.is_admin;
    const esAdmin = adminStatus === 1 || adminStatus === "1" || adminStatus === true;
    
    if (esAdmin) {
      setMessage('Los administradores no pueden cancelar inscripciones a torneos');
      return;
    }

    // Confirmar cancelación
    const confirmar = window.confirm('¿Estás seguro de que quieres cancelar tu inscripción a este torneo?');
    if (!confirmar) {
      return;
    }

    try {
      setInscribiendo(true);
      setMessage('');

      const usuarioId = usuario.user?.id || usuario.id || usuario.user_id || usuario.usuario_id || usuario.ID || usuario.userId;
      
      if (!usuarioId) {
        setMessage('Error: No se pudo obtener el ID del usuario');
        return;
      }

      const requestData = {
        usuario_id: usuarioId,
        torneo_id: torneoId
      };

      const data = await apiPost('cancelar_inscripcion.php', requestData);
      console.log('Respuesta de cancelación:', data);

      if (data.status === 'ok') {
        setMessage('¡Inscripción cancelada exitosamente!');
        // Recargar inscripciones
        await cargarInscripciones();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error: ' + (data.message || 'No se pudo cancelar la inscripción'));
      }
    } catch (error) {
      console.error('Error al cancelar inscripción:', error);
      setMessage('Error de conexión al cancelar la inscripción: ' + error.message);
    } finally {
      setInscribiendo(false);
    }
  };

  const getConfig = () => {
    switch (screenSize) {
      case 'mobile':
        return {
          containerPadding: '8px',
          cardPadding: '10px',
          titleSize: '1.1rem',
          subtitleSize: '0.8rem',
          fontSize: '0.7rem',
          cardTitleSize: '0.8rem',
          cardTextSize: '0.6rem',
          gridColumns: '1fr',
          gridGap: '8px'
        };
      case 'tablet':
        return {
          containerPadding: '12px',
          cardPadding: '12px',
          titleSize: '1.2rem',
          subtitleSize: '0.9rem',
          fontSize: '0.8rem',
          cardTitleSize: '0.9rem',
          cardTextSize: '0.7rem',
          gridColumns: 'repeat(2, 1fr)',
          gridGap: '10px'
        };
      default:
        return {
          containerPadding: '15px',
          cardPadding: '14px',
          titleSize: '1.3rem',
          subtitleSize: '1rem',
          fontSize: '0.9rem',
          cardTitleSize: '1rem',
          cardTextSize: '0.8rem',
          gridColumns: 'repeat(3, 1fr)',
          gridGap: '12px'
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
            🏆 Torneos Disponibles
          </h1>
          <p style={{
            fontSize: config.subtitleSize,
            color: '#666',
            margin: 0
          }}>
            Participa en los torneos de padel disponibles
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
              Cargando torneos...
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
                  Activo
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
                </div>

                {/* Botones de inscripción/cancelación */}
                {estaInscrito(torneo.id) ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => cancelarInscripcion(torneo.id)}
                      disabled={inscribiendo}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '12px 20px',
                        fontSize: config.cardTextSize,
                        fontWeight: '600',
                        cursor: inscribiendo ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(220, 53, 69, 0.3)',
                        opacity: inscribiendo ? 0.7 : 1
                      }}
                      onMouseOver={(e) => {
                        if (!inscribiendo) {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 6px 20px rgba(220, 53, 69, 0.4)';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!inscribiendo) {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 4px 15px rgba(220, 53, 69, 0.3)';
                        }
                      }}>
                      {inscribiendo ? 'Cancelando...' : 'Cancelar inscripción'}
                    </button>
                    <div style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px 20px',
                      fontSize: config.cardTextSize,
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
                    }}>
                      ✓ Inscrito
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => inscribirseTorneo(torneo.id)}
                    disabled={inscribiendo}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px 20px',
                      fontSize: config.cardTextSize,
                      fontWeight: '600',
                      cursor: inscribiendo ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                      opacity: inscribiendo ? 0.7 : 1
                    }}
                    onMouseOver={(e) => {
                      if (!inscribiendo) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!inscribiendo) {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                      }
                    }}>
                    {inscribiendo ? 'Inscribiendo...' : 'Inscribirse'}
                  </button>
                )}
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
              🏆
            </div>
            <h3 style={{
              fontSize: config.titleSize,
              color: '#333',
              marginBottom: '10px'
            }}>
              No hay torneos disponibles
            </h3>
            <p style={{
              fontSize: config.fontSize,
              color: '#666',
              margin: 0
            }}>
              Pronto habrá nuevos torneos para participar
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

export default TorneosResponsive;
