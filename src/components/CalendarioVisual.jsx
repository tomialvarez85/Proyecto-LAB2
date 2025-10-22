import React, { useState, useEffect } from 'react';
import { obtenerDisponibilidad, crearReserva } from '../utils/api';

const CalendarioVisual = ({ usuario, onReservaCreada }) => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingReserva, setLoadingReserva] = useState(false);
  const [message, setMessage] = useState('');
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

  // Cargar disponibilidad cuando cambia la fecha
  useEffect(() => {
    if (fechaSeleccionada) {
      cargarDisponibilidad();
    }
  }, [fechaSeleccionada]);

  const cargarDisponibilidad = async () => {
    try {
      setLoading(true);
      setMessage('');
      console.log('Cargando disponibilidad para:', fechaSeleccionada);
      
      const data = await obtenerDisponibilidad(fechaSeleccionada);
      console.log('Disponibilidad recibida:', data);
      
      if (data && data.status === 'ok') {
        setDisponibilidad(data.disponibilidad || []);
        console.log('Disponibilidad establecida:', data.disponibilidad);
      } else {
        console.error('Error al cargar disponibilidad:', data);
        setMessage('Error al cargar disponibilidad: ' + (data?.message || 'Error desconocido'));
        setDisponibilidad([]);
      }
    } catch (error) {
      console.error('Error al cargar disponibilidad:', error);
      setMessage('Error de conexión al cargar disponibilidad: ' + error.message);
      setDisponibilidad([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReserva = async (cancha_id, fecha, hora) => {
    if (!usuario) {
      setMessage('Debes iniciar sesión para hacer reservas');
      return;
    }

    // Confirmar reserva
    const fechaFormateada = new Date(fecha).toLocaleDateString('es-ES');
    const confirmar = window.confirm(
      `¿Confirmar reserva para Cancha ${cancha_id} el ${fechaFormateada} a las ${hora}?`
    );
    
    if (!confirmar) {
      return;
    }

    try {
      setLoadingReserva(true);
      setMessage('');

      const usuarioId = usuario.user?.id || usuario.id || usuario.user_id || usuario.usuario_id || usuario.ID || usuario.userId;
      
      if (!usuarioId) {
        setMessage('Error: No se pudo obtener el ID del usuario');
        return;
      }

      const requestData = {
        usuario_id: usuarioId,
        cancha_id: cancha_id,
        fecha: fecha,
        hora: hora
      };

      console.log('Creando reserva:', requestData);
      
      const data = await crearReserva(requestData);
      console.log('Respuesta de reserva:', data);

      if (data.status === 'ok') {
        setMessage('¡Reserva creada exitosamente!');
        // Recargar disponibilidad para actualizar la vista
        await cargarDisponibilidad();
        // Notificar al componente padre
        if (onReservaCreada) {
          onReservaCreada(data);
        }
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error: ' + (data.message || 'No se pudo crear la reserva'));
      }
    } catch (error) {
      console.error('Error al crear reserva:', error);
      setMessage('Error de conexión al crear la reserva');
    } finally {
      setLoadingReserva(false);
    }
  };

  const getConfig = () => {
    switch (screenSize) {
      case 'mobile':
        return {
          containerPadding: '10px',
          fontSize: '0.7rem',
          titleSize: '1rem',
          cardPadding: '8px',
          gridColumns: '1fr',
          gridGap: '8px'
        };
      case 'tablet':
        return {
          containerPadding: '15px',
          fontSize: '0.8rem',
          titleSize: '1.2rem',
          cardPadding: '12px',
          gridColumns: 'repeat(2, 1fr)',
          gridGap: '12px'
        };
      default:
        return {
          containerPadding: '20px',
          fontSize: '0.9rem',
          titleSize: '1.4rem',
          cardPadding: '16px',
          gridColumns: 'repeat(3, 1fr)',
          gridGap: '16px'
        };
    }
  };

  const config = getConfig();

  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      padding: config.containerPadding
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
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
            🏟️ Calendario de Disponibilidad
          </h1>
          <p style={{
            fontSize: config.fontSize,
            color: '#666',
            margin: 0
          }}>
            Selecciona una fecha y horario para hacer tu reserva
          </p>
        </div>

        {/* Selector de fecha */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: config.cardPadding,
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: config.fontSize === '0.9rem' ? '1.1rem' : config.fontSize === '0.8rem' ? '1rem' : '0.9rem',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '15px'
          }}>
            📅 Seleccionar Fecha
          </h3>
          
          <input
            type="date"
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            style={{
              padding: '10px 15px',
              border: '2px solid #e9ecef',
              borderRadius: '10px',
              fontSize: config.fontSize,
              backgroundColor: 'white',
              transition: 'all 0.3s ease',
              outline: 'none',
              cursor: 'pointer'
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

        {/* Disponibilidad */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: config.cardPadding,
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h3 style={{
            fontSize: config.fontSize === '0.9rem' ? '1.1rem' : config.fontSize === '0.8rem' ? '1rem' : '0.9rem',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            🏟️ Disponibilidad - {new Date(fechaSeleccionada).toLocaleDateString('es-ES')}
          </h3>

          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666'
            }}>
              Cargando disponibilidad...
            </div>
          ) : disponibilidad && Array.isArray(disponibilidad) && disponibilidad.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: config.gridColumns,
              gap: config.gridGap
            }}>
              {disponibilidad.map((cancha) => (
                <div key={cancha.cancha_id} style={{
                  border: '1px solid #e9ecef',
                  borderRadius: '10px',
                  padding: '12px',
                  backgroundColor: '#f8f9fa'
                }}>
                  <h4 style={{
                    fontSize: config.fontSize,
                    fontWeight: 'bold',
                    color: '#333',
                    margin: '0 0 15px 0',
                    textAlign: 'center'
                  }}>
                    {cancha.nombre}
                  </h4>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '6px'
                  }}>
                    {cancha.horas && Array.isArray(cancha.horas) ? cancha.horas.map((hora, index) => (
                      <button
                        key={index}
                        onClick={() => handleReserva(cancha.cancha_id, fechaSeleccionada, hora.hora)}
                        disabled={!hora.disponible || loadingReserva}
                        className={`hora-boton ${hora.disponible ? 'libre' : 'ocupado'}`}
                        style={{
                          padding: '8px 6px',
                          border: '2px solid',
                          borderRadius: '8px',
                          cursor: hora.disponible && !loadingReserva ? 'pointer' : 'not-allowed',
                          fontSize: config.fontSize === '0.9rem' ? '0.7rem' : '0.6rem',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: '50px',
                          textAlign: 'center'
                        }}
                        onMouseOver={(e) => {
                          if (hora.disponible && !loadingReserva) {
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (hora.disponible && !loadingReserva) {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = 'none';
                          }
                        }}
                      >
                        <span style={{ fontSize: '0.8em' }}>
                          {hora.disponible ? '✓' : '✗'}
                        </span>
                        <span style={{ fontSize: '0.9em', marginTop: '2px' }}>
                          {hora.hora}
                        </span>
                      </button>
                    )) : (
                      <div style={{
                        gridColumn: '1 / -1',
                        textAlign: 'center',
                        color: '#666',
                        fontSize: config.fontSize === '0.9rem' ? '0.7rem' : '0.6rem'
                      }}>
                        No hay horarios disponibles
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666'
            }}>
              {disponibilidad === null || disponibilidad === undefined 
                ? 'Cargando datos...' 
                : 'No hay horarios disponibles para esta fecha'
              }
            </div>
          )}
        </div>

        {/* Leyenda */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: config.cardPadding,
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h3 style={{
            fontSize: config.fontSize === '0.9rem' ? '1.1rem' : config.fontSize === '0.8rem' ? '1rem' : '0.9rem',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            ℹ️ Información
          </h3>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                backgroundColor: '#28a745',
                borderRadius: '4px'
              }}></div>
              <span style={{ fontSize: config.fontSize, color: '#666' }}>Disponible</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                backgroundColor: '#dc3545',
                borderRadius: '4px'
              }}></div>
              <span style={{ fontSize: config.fontSize, color: '#666' }}>Ocupado</span>
            </div>
          </div>
        </div>

        {/* Mensaje */}
        {message && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            borderRadius: '10px',
            fontSize: config.fontSize,
            fontWeight: '500',
            backgroundColor: message.includes('Error') ? '#f8d7da' : '#d4edda',
            color: message.includes('Error') ? '#721c24' : '#155724',
            border: `1px solid ${message.includes('Error') ? '#f5c6cb' : '#c3e6cb'}`,
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .hora-boton {
          border: 2px solid;
          transition: all 0.3s ease;
        }
        
        .hora-boton.libre {
          background-color: #28a745;
          color: white;
          border-color: #28a745;
        }
        
        .hora-boton.libre:hover {
          background-color: #218838;
          border-color: #1e7e34;
        }
        
        .hora-boton.ocupado {
          background-color: #dc3545;
          color: white;
          border-color: #dc3545;
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .hora-boton:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default CalendarioVisual;
