import React, { useState, useEffect } from 'react';
import TorneosAdmin from './admin/torneos/TorneosAdmin';

const AdminPanel = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [torneos, setTorneos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState({
    usuarios: true,
    torneos: true,
    reservas: true
  });
  const [message, setMessage] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [nuevoTorneo, setNuevoTorneo] = useState({
    nombre: '',
    descripcion: '',
    fecha: ''
  });
  const [creandoTorneo, setCreandoTorneo] = useState(false);
  const [eliminandoTorneo, setEliminandoTorneo] = useState(null);
  const [eliminandoUsuario, setEliminandoUsuario] = useState(null);
  const [eliminandoReserva, setEliminandoReserva] = useState(null);

  // Obtener usuario del localStorage al cargar el componente
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        const usuarioData = JSON.parse(usuarioGuardado);
        setUsuario(usuarioData);
        
        // Verificar si es admin
        const esAdmin = usuarioData.user?.admin === '1' || usuarioData.admin === '1' || usuarioData.user?.admin === 1 || usuarioData.admin === 1;
        if (!esAdmin) {
          setMessage('Acceso denegado. Solo los administradores pueden acceder a este panel.');
          return;
        }
        
        cargarDatos();
      } catch (error) {
        console.error('Error al parsear datos del usuario:', error);
        setMessage('Error al cargar datos del usuario');
      }
    } else {
      setMessage('Debes iniciar sesión para acceder al panel de administración');
    }
  }, []);

  const cargarDatos = async () => {
    await Promise.all([
      obtenerUsuarios(),
      obtenerTorneos(),
      obtenerReservas()
    ]);
  };

  const obtenerUsuarios = async () => {
    try {
      setLoading(prev => ({ ...prev, usuarios: true }));
      const response = await fetch('https://padel-gestionado.com/api/usuarios.php', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      console.log('Usuarios:', data);

      if (data.status === 'ok') {
        setUsuarios(data.usuarios || []);
      } else {
        setMessage('Error al obtener usuarios: ' + (data.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      setMessage('Error de conexión al obtener usuarios: ' + error.message);
    } finally {
      setLoading(prev => ({ ...prev, usuarios: false }));
    }
  };

  const obtenerTorneos = async () => {
    try {
      setLoading(prev => ({ ...prev, torneos: true }));
      const response = await fetch('https://padel-gestionado.com/api/torneos.php', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      console.log('Torneos:', data);

      if (data.status === 'ok') {
        setTorneos(data.torneos || []);
      } else {
        setMessage('Error al obtener torneos: ' + (data.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al obtener torneos:', error);
      setMessage('Error de conexión al obtener torneos: ' + error.message);
    } finally {
      setLoading(prev => ({ ...prev, torneos: false }));
    }
  };

  const obtenerReservas = async () => {
    try {
      setLoading(prev => ({ ...prev, reservas: true }));
      const response = await fetch('https://padel-gestionado.com/api/todas_las_reservas.php', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      console.log('Reservas:', data);
      
      // Debug: verificar si hay email en las reservas
      if (data.reservas && data.reservas.length > 0) {
        console.log('Primera reserva completa:', data.reservas[0]);
        console.log('¿Tiene email?', data.reservas[0].email || data.reservas[0].usuario_email || 'NO');
      }

      if (data.status === 'ok') {
        setReservas(data.reservas || []);
      } else {
        setMessage('Error al obtener reservas: ' + (data.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al obtener reservas:', error);
      setMessage('Error de conexión al obtener reservas: ' + error.message);
    } finally {
      setLoading(prev => ({ ...prev, reservas: false }));
    }
  };

  const handleCrearTorneo = async (e) => {
    e.preventDefault();
    
    if (!nuevoTorneo.nombre || !nuevoTorneo.descripcion || !nuevoTorneo.fecha) {
      setMessage('Por favor completa todos los campos');
      return;
    }

    try {
      setCreandoTorneo(true);
      setMessage('');

      const response = await fetch('https://padel-gestionado.com/api/crear_torneo.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoTorneo)
      });

      const data = await response.json();
      console.log('Respuesta crear torneo:', data);

      if (data.status === 'ok') {
        setMessage('Torneo creado exitosamente');
        setNuevoTorneo({ nombre: '', descripcion: '', fecha: '' });
        // Actualizar la lista de torneos
        await obtenerTorneos();
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } else {
        setMessage('Error al crear torneo: ' + (data.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al crear torneo:', error);
      setMessage('Error de conexión al crear torneo: ' + error.message);
    } finally {
      setCreandoTorneo(false);
    }
  };

  const handleEliminarTorneo = async (torneoId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este torneo? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setEliminandoTorneo(torneoId);
      setMessage('');

      const response = await fetch('https://padel-gestionado.com/api/eliminar_torneo.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          torneo_id: torneoId
        })
      });

      const data = await response.json();
      console.log('Respuesta eliminar torneo:', data);

      if (data.status === 'ok') {
        setMessage('Torneo eliminado exitosamente');
        // Actualizar la lista de torneos
        await obtenerTorneos();
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } else {
        setMessage('Error al eliminar torneo: ' + (data.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al eliminar torneo:', error);
      setMessage('Error de conexión al eliminar torneo: ' + error.message);
    } finally {
      setEliminandoTorneo(null);
    }
  };

  const handleEliminarUsuario = async (usuarioId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setEliminandoUsuario(usuarioId);
      setMessage('');

      const response = await fetch('https://padel-gestionado.com/api/eliminar_usuario.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario_id: usuarioId
        })
      });

      const data = await response.json();
      console.log('Respuesta eliminar usuario:', data);

      if (data.status === 'ok') {
        setMessage('Usuario eliminado exitosamente');
        // Actualizar la lista de usuarios
        await obtenerUsuarios();
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } else {
        setMessage('Error al eliminar usuario: ' + (data.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      setMessage('Error de conexión al eliminar usuario: ' + error.message);
    } finally {
      setEliminandoUsuario(null);
    }
  };

  const handleEliminarReserva = async (reservaId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta reserva? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setEliminandoReserva(reservaId);
      setMessage('');

      const response = await fetch('https://padel-gestionado.com/api/eliminar_reserva.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reserva_id: reservaId
        })
      });

      const data = await response.json();
      console.log('Respuesta eliminar reserva:', data);

      if (data.status === 'ok') {
        setMessage('Reserva eliminada exitosamente');
        // Actualizar la lista de reservas
        await obtenerReservas();
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } else {
        setMessage('Error al eliminar reserva: ' + (data.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al eliminar reserva:', error);
      setMessage('Error de conexión al eliminar reserva: ' + error.message);
    } finally {
      setEliminandoReserva(null);
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
    const canchas = {
      1: 'Cancha 1',
      2: 'Cancha 2',
      3: 'Cancha 3'
    };
    return canchas[canchaId] || `Cancha ${canchaId}`;
  };

  // Si no hay usuario logueado o no es admin, mostrar mensaje
  if (!usuario) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <h2>Panel de Administración</h2>
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

  const esAdmin = usuario.user?.admin === '1' || usuario.admin === '1' || usuario.user?.admin === 1 || usuario.admin === 1;
  if (!esAdmin) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <h2>Panel de Administración</h2>
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h2>Panel de Administración</h2>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        Bienvenido, {usuario.user?.nombre || usuario.nombre || usuario.name || 'Administrador'}
      </p>

      {/* Sección Usuarios Registrados */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#007bff', marginBottom: '15px' }}>👥 Usuarios Registrados</h3>
        {loading.usuarios ? (
          <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            Cargando usuarios...
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Nombre</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((user, index) => (
                  <tr key={user.id || index} style={{ borderBottom: '1px solid #f8f9fa' }}>
                    <td style={{ padding: '12px' }}>{user.id}</td>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: '#007bff' }}>{user.nombre || user.name}</td>
                    <td style={{ padding: '12px' }}>{user.email}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleEliminarUsuario(user.id)}
                        disabled={eliminandoUsuario === user.id}
                        style={{
                          backgroundColor: eliminandoUsuario === user.id ? '#ccc' : '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: eliminandoUsuario === user.id ? 'not-allowed' : 'pointer',
                          fontWeight: 'bold'
                        }}
                        onMouseOver={(e) => {
                          if (eliminandoUsuario !== user.id) {
                            e.target.style.backgroundColor = '#c82333';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (eliminandoUsuario !== user.id) {
                            e.target.style.backgroundColor = '#dc3545';
                          }
                        }}
                      >
                        {eliminandoUsuario === user.id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sección Torneos Existentes */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#28a745', marginBottom: '15px' }}>🏆 Torneos Existentes</h3>
        {loading.torneos ? (
          <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            Cargando torneos...
          </div>
        ) : torneos.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Nombre</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Descripción</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Fecha</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {torneos.map((torneo, index) => (
                  <tr key={torneo.id || index} style={{ borderBottom: '1px solid #f8f9fa' }}>
                    <td style={{ padding: '12px' }}>{torneo.id}</td>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: '#007bff' }}>{torneo.nombre || torneo.titulo}</td>
                    <td style={{ padding: '12px', maxWidth: '200px', wordWrap: 'break-word' }}>
                      {torneo.descripcion || torneo.description || 'Sin descripción'}
                    </td>
                    <td style={{ padding: '12px', color: '#28a745', fontWeight: 'bold' }}>
                      📅 {formatearFecha(torneo.fecha || torneo.fecha_torneo)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleEliminarTorneo(torneo.id)}
                        disabled={eliminandoTorneo === torneo.id}
                        style={{
                          backgroundColor: eliminandoTorneo === torneo.id ? '#ccc' : '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: eliminandoTorneo === torneo.id ? 'not-allowed' : 'pointer',
                          fontWeight: 'bold'
                        }}
                        onMouseOver={(e) => {
                          if (eliminandoTorneo !== torneo.id) {
                            e.target.style.backgroundColor = '#c82333';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (eliminandoTorneo !== torneo.id) {
                            e.target.style.backgroundColor = '#dc3545';
                          }
                        }}
                      >
                        {eliminandoTorneo === torneo.id ? 'Eliminando...' : 'Cancelar torneo'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            No hay torneos registrados
          </div>
        )}
      </div>

      {/* Formulario Crear Nuevo Torneo */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#fd7e14', marginBottom: '15px' }}>➕ Crear Nuevo Torneo</h3>
        <form onSubmit={handleCrearTorneo} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre del Torneo:</label>
              <input
                type="text"
                value={nuevoTorneo.nombre}
                onChange={(e) => setNuevoTorneo({ ...nuevoTorneo, nombre: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Fecha:</label>
              <input
                type="date"
                value={nuevoTorneo.fecha}
                onChange={(e) => setNuevoTorneo({ ...nuevoTorneo, fecha: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Descripción:</label>
            <textarea
              value={nuevoTorneo.descripcion}
              onChange={(e) => setNuevoTorneo({ ...nuevoTorneo, descripcion: e.target.value })}
              required
              rows="3"
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' }}
            />
          </div>
          <button
            type="submit"
            disabled={creandoTorneo}
            style={{
              backgroundColor: creandoTorneo ? '#ccc' : '#fd7e14',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: creandoTorneo ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {creandoTorneo ? 'Creando...' : 'Crear Torneo'}
          </button>
        </form>
      </div>

      {/* Sección Reservas de Usuarios */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#6f42c1', marginBottom: '15px' }}>📅 Reservas de Usuarios</h3>
        {loading.reservas ? (
          <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            Cargando reservas...
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Fecha</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Hora</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Cancha</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Usuario</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((reserva, index) => (
                  <tr key={reserva.id || index} style={{ borderBottom: '1px solid #f8f9fa' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: '#28a745' }}>{formatearFecha(reserva.fecha)}</td>
                    <td style={{ padding: '12px', color: '#007bff', fontWeight: 'bold' }}>{reserva.hora}</td>
                    <td style={{ padding: '12px' }}>{obtenerNombreCancha(reserva.cancha)}</td>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: '#6f42c1' }}>
                      <div style={{ marginBottom: '2px' }}>
                        <strong>{reserva.usuario || reserva.usuario_nombre || reserva.nombre_usuario || reserva.nombre || reserva.name || 'N/A'}</strong>
                      </div>
                      <div style={{ fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
                        {reserva.usuario_email || reserva.email || reserva.user_email || reserva.email_usuario || 'Sin email'}
                      </div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleEliminarReserva(reserva.id)}
                        disabled={eliminandoReserva === reserva.id}
                        style={{
                          backgroundColor: eliminandoReserva === reserva.id ? '#ccc' : '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: eliminandoReserva === reserva.id ? 'not-allowed' : 'pointer',
                          fontWeight: 'bold'
                        }}
                        onMouseOver={(e) => {
                          if (eliminandoReserva !== reserva.id) {
                            e.target.style.backgroundColor = '#c82333';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (eliminandoReserva !== reserva.id) {
                            e.target.style.backgroundColor = '#dc3545';
                          }
                        }}
                      >
                        {eliminandoReserva === reserva.id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Nueva Sección: Torneos */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#0ea5e9', marginBottom: '15px' }}>🏟️ Torneos</h3>
        <TorneosAdmin />
      </div>

      {/* Mensajes de estado */}
      {message && (
        <div style={{
          marginTop: '20px',
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

export default AdminPanel;
