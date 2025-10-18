import React, { useState, useEffect } from 'react';

const MisReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [usuario, setUsuario] = useState(null);

  // Obtener usuario del localStorage al cargar el componente
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        const usuarioData = JSON.parse(usuarioGuardado);
        setUsuario(usuarioData);
        obtenerReservas(usuarioData);
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

  const obtenerReservas = async (usuarioData) => {
    try {
      setLoading(true);
      setMessage('');

      // Obtener el ID del usuario
      const usuarioId = usuarioData.user?.id || usuarioData.id || usuarioData.user_id || usuarioData.usuario_id || usuarioData.ID || usuarioData.userId;
      
      if (!usuarioId) {
        setMessage('Error: No se pudo obtener el ID del usuario');
        setLoading(false);
        return;
      }

      const response = await fetch('https://padel-gestionado.com/api/mis_reservas.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario_id: usuarioId
        })
      });

      const data = await response.json();

      // Debug: mostrar respuesta del servidor
      console.log('Respuesta del servidor:', data);

      if (data.status === 'ok') {
        setReservas(data.reservas || []);
        if (!data.reservas || data.reservas.length === 0) {
          setMessage('No tienes reservas registradas');
        }
      } else {
        setMessage('Error al obtener reservas: ' + (data.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al obtener reservas:', error);
      setMessage('Error de conexión: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelarReserva = async (reservaId) => {
    try {
      setMessage('');

      const response = await fetch('https://padel-gestionado.com/api/cancelar_reserva.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reserva_id: reservaId
        })
      });

      const data = await response.json();

      // Debug: mostrar respuesta del servidor
      console.log('Respuesta de cancelación:', data);

      if (data.status === 'ok') {
        // Eliminar la reserva del estado local
        setReservas(prevReservas => prevReservas.filter(reserva => reserva.id !== reservaId));
        setMessage('Reserva cancelada exitosamente');
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } else {
        setMessage('Error al cancelar reserva: ' + (data.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      setMessage('Error de conexión al cancelar: ' + error.message);
    }
  };

  // Si no hay usuario logueado, mostrar mensaje
  if (!usuario) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <h2>Mis Reservas</h2>
        <div style={{
          padding: '20px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          {message}
        </div>
      </div>
    );
  }

  // Función para formatear la fecha
  const formatearFecha = (fecha) => {
    try {
      const fechaObj = new Date(fecha);
      return fechaObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return fecha;
    }
  };

  // Función para obtener el nombre de la cancha por ID
  const obtenerNombreCancha = (canchaId) => {
    const canchas = {
      1: 'Cancha 1',
      2: 'Cancha 2',
      3: 'Cancha 3'
    };
    return canchas[canchaId] || `Cancha ${canchaId}`;
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Mis Reservas</h2>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        Bienvenido, {usuario.user?.nombre || usuario.nombre || usuario.name || 'Usuario'}
      </p>

      {loading ? (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '4px'
        }}>
          Cargando reservas...
        </div>
      ) : reservas.length > 0 ? (
        <div>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>
            Tienes {reservas.length} reserva{reservas.length !== 1 ? 's' : ''}
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {reservas.map((reserva, index) => (
              <div
                key={index}
                style={{
                  padding: '15px',
                  backgroundColor: '#fff',
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, color: '#007bff' }}>
                    {obtenerNombreCancha(reserva.cancha)}
                  </h4>
                  <span style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {reserva.hora}
                  </span>
                </div>
                
                <div style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                  <p style={{ margin: '4px 0' }}>
                    <strong>Fecha:</strong> {formatearFecha(reserva.fecha)}
                  </p>
                  <p style={{ margin: '4px 0' }}>
                    <strong>Hora:</strong> {reserva.hora}
                  </p>
                  <p style={{ margin: '4px 0' }}>
                    <strong>Cancha:</strong> {obtenerNombreCancha(reserva.cancha)}
                  </p>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => cancelarReserva(reserva.id)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#c82333';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = '#dc3545';
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, color: '#666' }}>
            {message || 'No tienes reservas registradas'}
          </p>
        </div>
      )}

      {message && !loading && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: message.includes('Error') ? '#f8d7da' : '#d4edda',
          color: message.includes('Error') ? '#721c24' : '#155724',
          border: `1px solid ${message.includes('Error') ? '#f5c6cb' : '#c3e6cb'}`,
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default MisReservas;
