import React, { useState, useEffect } from 'react';
import { cancelarReserva as cancelarReservaAPI, obtenerMisReservas } from '../utils/api';

const MisReservasResponsive = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [screenSize, setScreenSize] = useState('desktop');
  const [cancelandoReserva, setCancelandoReserva] = useState(null);

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
        console.log('Datos del usuario en MisReservas:', usuarioData);
        setUsuario(usuarioData);
        
        // Obtener el ID del usuario con múltiples intentos
        const userId = usuarioData.user?.id || usuarioData.id || usuarioData.user_id || usuarioData.usuario_id || usuarioData.ID || usuarioData.userId;
        console.log('ID del usuario extraído:', userId);
        
        if (!userId) {
          console.error('No se pudo obtener el ID del usuario. Estructura de datos:', usuarioData);
          setMessage('Error: No se pudo obtener el ID del usuario');
          setLoading(false);
          return;
        }
        
        cargarReservas(userId);
      } catch (error) {
        console.error('Error al parsear datos del usuario:', error);
        setMessage('Error al cargar datos del usuario');
        setLoading(false);
      }
    } else {
      setMessage('Debes iniciar sesión para ver tus reservas');
      setLoading(false);
    }
  }, []);

  const cargarReservas = async (usuarioId) => {
    try {
      setLoading(true);
      console.log('Cargando reservas para usuario:', usuarioId);
      
      const data = await obtenerMisReservas(usuarioId);
      console.log('Respuesta de reservas:', data);

      if (data.status === 'ok') {
        console.log('Reservas recibidas:', data.reservas);
        // Debug: mostrar estructura de cada reserva
        if (data.reservas && data.reservas.length > 0) {
          console.log('Estructura de la primera reserva:', data.reservas[0]);
          console.log('Campos disponibles en reserva:', Object.keys(data.reservas[0]));
        }
        setReservas(data.reservas || []);
      } else {
        console.error('Error en respuesta de reservas:', data);
        setMessage('Error al cargar reservas: ' + (data.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al cargar reservas:', error);
      setMessage('Error de conexión al cargar reservas: ' + error.message);
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

  const obtenerNombreCancha = (canchaId) => {
    // Debug: mostrar el valor recibido
    console.log('obtenerNombreCancha recibió:', canchaId, 'tipo:', typeof canchaId);
    
    const canchas = {
      1: 'Cancha 1',
      2: 'Cancha 2',
      3: 'Cancha 3'
    };
    
    // Si canchaId es undefined, null o vacío, mostrar mensaje de error
    if (canchaId === undefined || canchaId === null || canchaId === '') {
      console.warn('Cancha ID es undefined/null/vacío:', canchaId);
      return 'Cancha no especificada';
    }
    
    return canchas[canchaId] || `Cancha ${canchaId}`;
  };

  const cancelarReserva = async (reservaId) => {
    // Confirmar cancelación
    const confirmar = window.confirm(
      '¿Estás seguro de que quieres cancelar esta reserva?\n\nEsta acción no se puede deshacer.'
    );
    
    if (!confirmar) {
      return;
    }

    try {
      setCancelandoReserva(reservaId);
      setMessage('');

      const usuarioId = usuario.user?.id || usuario.id || usuario.user_id || usuario.usuario_id || usuario.ID || usuario.userId;
      
      const data = await cancelarReservaAPI(usuarioId, reservaId);

      if (data.status === 'ok') {
        setMessage('Reserva cancelada exitosamente');
        
        // Actualizar la lista de reservas removiendo la cancelada
        setReservas(prevReservas => 
          prevReservas.filter(reserva => reserva.id !== reservaId)
        );
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error: ' + (data.message || 'No se pudo cancelar la reserva'));
      }
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      setMessage('Error de conexión. Intenta nuevamente.');
    } finally {
      setCancelandoReserva(null);
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
            📋 Mis Reservas
          </h1>
          <p style={{
            fontSize: config.subtitleSize,
            color: '#666',
            margin: 0
          }}>
            Gestiona tus reservas de canchas de padel
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
              Cargando tus reservas...
            </div>
          </div>
        ) : reservas.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: config.gridColumns,
            gap: config.gridGap
          }}>
            {reservas.map((reserva, index) => {
              // Debug: mostrar datos de cada reserva
              console.log(`Reserva ${index}:`, reserva);
              console.log(`Cancha fields - cancha: ${reserva.cancha}, cancha_id: ${reserva.cancha_id}, id_cancha: ${reserva.id_cancha}`);
              
              return (
              <div key={reserva.id || index} style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                padding: config.cardPadding,
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                border: '1px solid #e9ecef'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '15px'
                }}>
                  <h3 style={{
                    fontSize: config.cardTitleSize,
                    fontWeight: 'bold',
                    color: '#333',
                    margin: 0
                  }}>
                    {obtenerNombreCancha(reserva.cancha || reserva.cancha_id || reserva.id_cancha)}
                  </h3>
                  <span style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: config.cardTextSize,
                    fontWeight: '600'
                  }}>
                    #{reserva.id}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
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
                      {formatearFecha(reserva.fecha)}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{
                      fontSize: '1.2rem'
                    }}>🕐</span>
                    <span style={{
                      fontSize: config.cardTextSize,
                      color: '#666',
                      fontWeight: '500'
                    }}>
                      {reserva.hora}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{
                      fontSize: '1.2rem'
                    }}>👤</span>
                    <span style={{
                      fontSize: config.cardTextSize,
                      color: '#666',
                      fontWeight: '500'
                    }}>
                      {reserva.usuario || reserva.usuario_nombre || reserva.nombre_usuario || 'Usuario'}
                    </span>
                  </div>
                </div>

                <div style={{
                  marginTop: '15px',
                  padding: '10px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}>
                  <div style={{
                    fontSize: config.cardTextSize,
                    color: '#666',
                    textAlign: 'center',
                    marginBottom: '10px'
                  }}>
                    Estado: <strong style={{ color: '#28a745' }}>Confirmada</strong>
                  </div>
                  
                  {/* Botón de cancelación */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '10px'
                  }}>
                    <button
                      onClick={() => cancelarReserva(reserva.id)}
                      disabled={cancelandoReserva === reserva.id}
                      style={{
                        backgroundColor: cancelandoReserva === reserva.id ? '#6c757d' : '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: config.cardTextSize,
                        fontWeight: '600',
                        cursor: cancelandoReserva === reserva.id ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                      onMouseOver={(e) => {
                        if (cancelandoReserva !== reserva.id) {
                          e.target.style.backgroundColor = '#c82333';
                          e.target.style.transform = 'translateY(-1px)';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (cancelandoReserva !== reserva.id) {
                          e.target.style.backgroundColor = '#dc3545';
                          e.target.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      {cancelandoReserva === reserva.id ? (
                        <>
                          <span>⏳</span>
                          Cancelando...
                        </>
                      ) : (
                        <>
                          <span>❌</span>
                          Cancelar Reserva
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
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
              📅
            </div>
            <h3 style={{
              fontSize: config.titleSize,
              color: '#333',
              marginBottom: '10px'
            }}>
              No tienes reservas
            </h3>
            <p style={{
              fontSize: config.fontSize,
              color: '#666',
              margin: 0
            }}>
              Crea tu primera reserva para comenzar a jugar
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

export default MisReservasResponsive;
