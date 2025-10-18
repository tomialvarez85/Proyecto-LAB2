import React, { useState, useEffect } from 'react';

const Reservas = () => {
  const [formData, setFormData] = useState({
    fecha: '',
    cancha: '',
    hora: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [usuario, setUsuario] = useState(null);

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

  // Verificar si hay usuario logueado al cargar el componente
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!usuario) {
      setMessage('Debes iniciar sesión para hacer reservas');
      return;
    }

    // Validar que todos los campos estén completos
    if (!formData.fecha || !formData.cancha || !formData.hora) {
      setMessage('Por favor completa todos los campos');
      return;
    }

    // Obtener el ID del usuario de diferentes posibles campos
    // El servidor devuelve los datos del usuario en un objeto 'user'
    const usuarioId = usuario.user?.id || usuario.id || usuario.user_id || usuario.usuario_id || usuario.ID || usuario.userId;
    
    if (!usuarioId) {
      setMessage('Error: No se pudo obtener el ID del usuario. Por favor, inicia sesión nuevamente.');
      console.log('Datos completos del usuario:', usuario);
      console.log('Campos disponibles:', Object.keys(usuario));
      return;
    }

    setLoading(true);
    setMessage('');

    // Datos que se van a enviar
    const datosReserva = {
      usuario_id: usuarioId,
      cancha_id: formData.cancha,
      fecha: formData.fecha,
      hora: formData.hora
    };

    // Debug: mostrar datos que se envían
    console.log('Datos del usuario:', usuario);
    console.log('Datos de la reserva:', datosReserva);

    try {
      const response = await fetch('https://padel-gestionado.com/api/reservar.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosReserva)
      });

      const data = await response.json();

      // Debug: mostrar respuesta del servidor
      console.log('Respuesta del servidor:', data);

      if (data.status === 'ok') {
        setMessage('Reserva realizada exitosamente!');
        // Limpiar formulario después de reserva exitosa
        setFormData({
          fecha: '',
          cancha: '',
          hora: ''
        });
      } else {
        setMessage('Error en la reserva: ' + (data.message || 'Error desconocido'));
      }
    } catch (error) {
      setMessage('Error de conexión: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Si no hay usuario logueado, mostrar mensaje
  if (!usuario) {
    return (
      <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
        <h2>Reservas</h2>
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
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Reservas</h2>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        Bienvenido, {usuario.user?.nombre || usuario.nombre || usuario.name || 'Usuario'}
      </p>
      
      {/* Debug: Mostrar datos del usuario */}
      <div style={{
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        <strong>Debug - Datos del usuario:</strong>
        <pre style={{ margin: '5px 0', fontSize: '11px', overflow: 'auto' }}>
          {JSON.stringify(usuario, null, 2)}
        </pre>
        <p style={{ margin: '5px 0', fontSize: '11px' }}>
          <strong>ID encontrado:</strong> {usuario.user?.id || usuario.id || usuario.user_id || usuario.usuario_id || usuario.ID || usuario.userId || 'NO ENCONTRADO'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="fecha" style={{ display: 'block', marginBottom: '5px' }}>
            Fecha:
          </label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={formData.fecha}
            onChange={handleInputChange}
            required
            min={new Date().toISOString().split('T')[0]}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="cancha" style={{ display: 'block', marginBottom: '5px' }}>
            Cancha:
          </label>
          <select
            id="cancha"
            name="cancha"
            value={formData.cancha}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          >
            <option value="">Seleccionar cancha</option>
            {canchas.map((cancha, index) => (
              <option key={index} value={cancha.id}>
                {cancha.nombre}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="hora" style={{ display: 'block', marginBottom: '5px' }}>
            Hora:
          </label>
          <select
            id="hora"
            name="hora"
            value={formData.hora}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          >
            <option value="">Seleccionar hora</option>
            {turnos.map((turno, index) => (
              <option key={index} value={turno}>
                {turno}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Reservando...' : 'Reservar'}
        </button>
      </form>

      {message && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: message.includes('exitosamente') ? '#d4edda' : '#f8d7da',
          color: message.includes('exitosamente') ? '#155724' : '#721c24',
          border: `1px solid ${message.includes('exitosamente') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Reservas;
