import React, { useState, useEffect } from 'react';
import { crearReserva } from '../utils/api';
import CalendarioVisual from './CalendarioVisual';

const ReservasResponsive = () => {
  const [formData, setFormData] = useState({
    fecha: '',
    cancha: '',
    hora: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [screenSize, setScreenSize] = useState('desktop');
  const [mostrarCalendarioVisual, setMostrarCalendarioVisual] = useState(false);
  
  // Fecha local de hoy en formato YYYY-MM-DD (sin UTC)
  const todayLocalStr = (() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  })();

  // Lista fija de canchas con sus IDs
  const canchas = [
    { id: 1, nombre: 'Cancha 1' },
    { id: 2, nombre: 'Cancha 2' },
    { id: 3, nombre: 'Cancha 3' }
  ];
  
  // Lista de turnos disponibles
  const turnos = [
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
    '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

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

  // Verificar si hay usuario logueado al cargar el componente
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        const usuarioData = JSON.parse(usuarioGuardado);
        console.log('Usuario cargado en Reservas:', usuarioData);
        setUsuario(usuarioData);
      } catch (error) {
        console.error('Error al parsear datos del usuario:', error);
        setMessage('Error al cargar datos del usuario');
      }
    } else {
      setMessage('Debes iniciar sesión para hacer reservas');
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReservaCreada = (data) => {
    setMessage('¡Reserva creada exitosamente desde el calendario!');
    setTimeout(() => setMessage(''), 3000);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validar que todos los campos estén completos
    if (!formData.fecha || !formData.cancha || !formData.hora) {
      setMessage('Por favor, completa todos los campos');
      setLoading(false);
      return;
    }

    // Validar que el usuario esté cargado
    if (!usuario || (!usuario.user?.id && !usuario.id)) {
      setMessage('Error: Usuario no válido. Por favor, inicia sesión nuevamente');
      setLoading(false);
      return;
    }

    try {
      const requestData = {
        usuario_id: usuario.user?.id || usuario.id,
        cancha_id: formData.cancha,
        fecha: formData.fecha,
        hora: formData.hora
      };
      
      console.log('Datos del usuario:', usuario);
      console.log('ID del usuario extraído:', usuario.user?.id || usuario.id);
      console.log('Datos de la reserva a enviar:', requestData);
      
      const data = await crearReserva(requestData);
      console.log('Datos de respuesta:', data);

      if (data.status === 'ok') {
        setMessage('Reserva creada exitosamente');
        setFormData({ fecha: '', cancha: '', hora: '' });
        setTimeout(() => setMessage(''), 3000);
      } else {
        console.error('Error en respuesta del servidor:', data);
        setMessage('Error: ' + (data.message || 'No se pudo crear la reserva'));
      }
    } catch (error) {
      console.error('Error de conexión completo:', error);
      console.error('Tipo de error:', error.name);
      console.error('Mensaje de error:', error.message);
      
      if (error.message.includes('CORS')) {
        setMessage('Error: Problema de CORS. El servidor no permite peticiones desde localhost.');
      } else if (error.message.includes('Failed to fetch')) {
        setMessage('Error: No se pudo conectar al servidor. Verifica tu conexión a internet.');
      } else if (error.message.includes('NetworkError')) {
        setMessage('Error: Problema de red. Verifica tu conexión a internet.');
      } else {
        setMessage('Error de conexión. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getFormConfig = () => {
    switch (screenSize) {
      case 'mobile':
        return {
          containerPadding: '8px',
          cardPadding: '12px',
          inputPadding: '8px',
          buttonPadding: '8px 12px',
          fontSize: '0.7rem',
          titleSize: '1.1rem',
          subtitleSize: '0.8rem',
          gridColumns: '1fr',
          gridGap: '8px'
        };
      case 'tablet':
        return {
          containerPadding: '12px',
          cardPadding: '14px',
          inputPadding: '10px',
          buttonPadding: '10px 15px',
          fontSize: '0.8rem',
          titleSize: '1.2rem',
          subtitleSize: '0.9rem',
          gridColumns: 'repeat(2, 1fr)',
          gridGap: '10px'
        };
      default:
        return {
          containerPadding: '15px',
          cardPadding: '16px',
          inputPadding: '12px',
          buttonPadding: '12px 18px',
          fontSize: '0.9rem',
          titleSize: '1.3rem',
          subtitleSize: '1rem',
          gridColumns: 'repeat(3, 1fr)',
          gridGap: '12px'
        };
    }
  };

  const config = getFormConfig();

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
            📅 Nueva Reserva
          </h1>
          <p style={{
            fontSize: config.subtitleSize,
            color: '#666',
            margin: 0
          }}>
            Reserva tu cancha de padel favorita
          </p>
        </div>

        {/* Botón para mostrar calendario visual */}
        <div style={{
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <button
            type="button"
            onClick={() => setMostrarCalendarioVisual(!mostrarCalendarioVisual)}
            style={{
              background: mostrarCalendarioVisual 
                ? 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)' 
                : 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '12px',
              fontSize: config.fontSize,
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
            }}
          >
            {mostrarCalendarioVisual ? '📅 Ocultar Calendario' : '📅 Ver Calendario de Disponibilidad'}
          </button>
        </div>

        {/* Calendario visual */}
        {mostrarCalendarioVisual && (
          <CalendarioVisual
            usuario={usuario}
            onReservaCreada={handleReservaCreada}
          />
        )}

        {/* Formulario */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: config.cardPadding,
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: config.gridColumns,
              gap: config.gridGap,
              marginBottom: '25px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#333',
                  fontSize: config.fontSize
                }}>
                  Fecha
                </label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleInputChange}
                  min={todayLocalStr}
                  required
                  style={{
                    width: '100%',
                    padding: config.inputPadding,
                    border: '2px solid #e9ecef',
                    borderRadius: '10px',
                    fontSize: config.fontSize,
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

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#333',
                  fontSize: config.fontSize
                }}>
                  Cancha
                </label>
                <select
                  name="cancha"
                  value={formData.cancha}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: config.inputPadding,
                    border: '2px solid #e9ecef',
                    borderRadius: '10px',
                    fontSize: config.fontSize,
                    backgroundColor: 'white',
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
                >
                  <option value="">Seleccionar cancha</option>
                  {canchas.map(cancha => (
                    <option key={cancha.id} value={cancha.id}>
                      {cancha.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#333',
                  fontSize: config.fontSize
                }}>
                  Hora
                </label>
                <select
                  name="hora"
                  value={formData.hora}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: config.inputPadding,
                    border: '2px solid #e9ecef',
                    borderRadius: '10px',
                    fontSize: config.fontSize,
                    backgroundColor: 'white',
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
                >
                  <option value="">Seleccionar hora</option>
                  {turnos.map(turno => (
                    <option key={turno} value={turno}>
                      {turno}
                    </option>
                  ))}
                </select>
              </div>
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
                fontSize: config.fontSize,
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
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
              {loading ? 'Creando reserva...' : 'Crear Reserva'}
            </button>
          </form>

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
              border: `1px solid ${message.includes('Error') ? '#f5c6cb' : '#c3e6cb'}`
            }}>
              {message}
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: config.cardPadding,
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            fontSize: config.fontSize === '0.9rem' ? '1.1rem' : config.fontSize === '1rem' ? '1.2rem' : '1.3rem',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '15px'
          }}>
            ℹ️ Información Importante
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: screenSize === 'mobile' ? '1fr' : 'repeat(2, 1fr)',
            gap: '15px'
          }}>
            <div style={{
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '10px',
              border: '1px solid #e9ecef'
            }}>
              <h4 style={{
                fontSize: config.fontSize,
                fontWeight: '600',
                color: '#333',
                margin: '0 0 8px 0'
              }}>
                📅 Horarios
              </h4>
              <p style={{
                fontSize: config.fontSize,
                color: '#666',
                margin: 0,
                lineHeight: '1.5'
              }}>
                Las reservas están disponibles de 10:00 a 22:00 horas
              </p>
            </div>
            <div style={{
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '10px',
              border: '1px solid #e9ecef'
            }}>
              <h4 style={{
                fontSize: config.fontSize,
                fontWeight: '600',
                color: '#333',
                margin: '0 0 8px 0'
              }}>
                🏟️ Canchas
              </h4>
              <p style={{
                fontSize: config.fontSize,
                color: '#666',
                margin: 0,
                lineHeight: '1.5'
              }}>
                Tenemos 3 canchas disponibles para tus partidos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservasResponsive;
