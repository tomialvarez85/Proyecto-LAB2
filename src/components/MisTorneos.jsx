import React, { useState, useEffect } from 'react';

const MisTorneos = () => {
  const [torneos, setTorneos] = useState([]);
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
        obtenerMisTorneos(usuarioData);
      } catch (error) {
        console.error('Error al parsear datos del usuario:', error);
        setMessage('Error al cargar datos del usuario');
        setLoading(false);
      }
    } else {
      setMessage('Debes iniciar sesión para ver tus torneos');
      setLoading(false);
    }
  }, []);

  const obtenerMisTorneos = async (usuarioData) => {
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

      const response = await fetch('https://padel-gestionado.com/api/mis_torneos.php', {
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
        setTorneos(data.torneos || []);
        if (!data.torneos || data.torneos.length === 0) {
          setMessage('No estás inscrito en ningún torneo');
        }
      } else {
        setMessage('Error al obtener tus torneos: ' + (data.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al obtener torneos:', error);
      setMessage('Error de conexión: ' + error.message);
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

  // Si no hay usuario logueado, mostrar mensaje
  if (!usuario) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h2>Mis Torneos</h2>
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

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Mis Torneos</h2>
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
          Cargando tus torneos...
        </div>
      ) : torneos.length > 0 ? (
        <div>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>
            Torneos en los que estás inscrito ({torneos.length})
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '20px' 
          }}>
            {torneos.map((torneo, index) => (
              <div
                key={torneo.id || index}
                style={{
                  padding: '20px',
                  backgroundColor: '#fff',
                  border: '1px solid #dee2e6',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s ease',
                  cursor: 'default'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '10px'
                  }}>
                    <h3 style={{ 
                      margin: 0, 
                      color: '#007bff',
                      fontSize: '18px',
                      fontWeight: 'bold'
                    }}>
                      {torneo.nombre || torneo.titulo || 'Torneo sin nombre'}
                    </h3>
                    
                    <span style={{
                      backgroundColor: '#28a745',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      ✓ Inscrito
                    </span>
                  </div>
                  
                  <p style={{ 
                    margin: '0 0 10px 0', 
                    color: '#666', 
                    fontSize: '14px',
                    lineHeight: '1.4'
                  }}>
                    {torneo.descripcion || torneo.description || 'Sin descripción disponible'}
                  </p>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '15px',
                    color: '#28a745',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    <span style={{ marginRight: '5px' }}>📅</span>
                    {formatearFecha(torneo.fecha || torneo.fecha_torneo)}
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  paddingTop: '15px',
                  borderTop: '1px solid #f8f9fa'
                }}>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    ID: {torneo.id || 'N/A'}
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: '#28a745',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    <span style={{ marginRight: '5px' }}>🏆</span>
                    Participando
                  </div>
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
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>🏆</div>
          <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>
            {message || 'No estás inscrito en ningún torneo'}
          </p>
          <p style={{ margin: '10px 0 0 0', color: '#999', fontSize: '14px' }}>
            Ve a la sección "Torneos" para inscribirte en los torneos disponibles
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

export default MisTorneos;
