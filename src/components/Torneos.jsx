import React, { useState, useEffect } from 'react';

const Torneos = () => {
  const [torneos, setTorneos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [inscripciones, setInscripciones] = useState(new Set());
  const [inscribiendo, setInscribiendo] = useState(false);

  // Obtener usuario del localStorage al cargar el componente
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        const usuarioData = JSON.parse(usuarioGuardado);
        setUsuario(usuarioData);
        obtenerTorneos();
      } catch (error) {
        console.error('Error al parsear datos del usuario:', error);
        setMessage('Error al cargar datos del usuario');
        setLoading(false);
      }
    } else {
      setMessage('Debes iniciar sesión para ver los torneos');
      setLoading(false);
    }
  }, []);

  const obtenerTorneos = async () => {
    try {
      setLoading(true);
      setMessage('');

      const response = await fetch('https://padel-gestionado.com/api/torneos.php', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      // Debug: mostrar respuesta del servidor
      console.log('Respuesta del servidor:', data);

      if (data.status === 'ok') {
        setTorneos(data.torneos || []);
        if (!data.torneos || data.torneos.length === 0) {
          setMessage('No hay torneos disponibles');
        }
      } else {
        setMessage('Error al obtener torneos: ' + (data.message || 'Error desconocido'));
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

  const handleInscribirse = async (torneoId) => {
    if (!usuario) {
      setMessage('Debes iniciar sesión para inscribirte en torneos');
      return;
    }

    // Obtener el ID del usuario
    const usuarioId = usuario.user?.id || usuario.id || usuario.user_id || usuario.usuario_id || usuario.ID || usuario.userId;
    
    if (!usuarioId) {
      setMessage('Error: No se pudo obtener el ID del usuario');
      return;
    }

    try {
      setInscribiendo(true);
      setMessage('');

      const response = await fetch('https://padel-gestionado.com/api/inscribir.php', {
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

      // Debug: mostrar respuesta del servidor
      console.log('Respuesta de inscripción:', data);

      if (data.status === 'ok') {
        setMessage('Inscripción exitosa');
        // Agregar el torneo a las inscripciones
        setInscripciones(prev => new Set([...prev, torneoId]));
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } else {
        setMessage('Error: ' + (data.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al inscribirse:', error);
      setMessage('Error de conexión: ' + error.message);
    } finally {
      setInscribiendo(false);
    }
  };

  // Si no hay usuario logueado, mostrar mensaje
  if (!usuario) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h2>Torneos</h2>
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
      <h2>Torneos</h2>
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
          Cargando torneos...
        </div>
      ) : torneos.length > 0 ? (
        <div>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>
            Torneos disponibles ({torneos.length})
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
                  <h3 style={{ 
                    margin: '0 0 10px 0', 
                    color: '#007bff',
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}>
                    {torneo.nombre || torneo.titulo || 'Torneo sin nombre'}
                  </h3>
                  
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
                  
                  <button
                    onClick={() => handleInscribirse(torneo.id)}
                    disabled={inscripciones.has(torneo.id) || inscribiendo}
                    style={{
                      backgroundColor: inscripciones.has(torneo.id) ? '#6c757d' : '#28a745',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: inscripciones.has(torneo.id) || inscribiendo ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold',
                      transition: 'background-color 0.2s ease',
                      opacity: inscripciones.has(torneo.id) || inscribiendo ? 0.7 : 1
                    }}
                    onMouseOver={(e) => {
                      if (!inscripciones.has(torneo.id) && !inscribiendo) {
                        e.target.style.backgroundColor = '#218838';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!inscripciones.has(torneo.id) && !inscribiendo) {
                        e.target.style.backgroundColor = '#28a745';
                      }
                    }}
                  >
                    {inscribiendo ? 'Inscribiendo...' : inscripciones.has(torneo.id) ? 'Inscrito' : 'Inscribirme'}
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
            {message || 'No hay torneos disponibles'}
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

export default Torneos;
