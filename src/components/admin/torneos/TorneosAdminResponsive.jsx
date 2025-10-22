import React, { useEffect, useState } from 'react';

// Sub-sections
const API_BASE = '/api/';

const ParejasSectionResponsive = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [parejas, setParejas] = useState([]);
  const [form, setForm] = useState({ jugador1: '', jugador2: '' });
  const [loading, setLoading] = useState({ usuarios: true, parejas: true, creando: false });
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

  const cargarUsuarios = async () => {
    try {
      setLoading(prev => ({ ...prev, usuarios: true }));
      const res = await fetch(API_BASE + 'usuarios.php');
      const data = await res.json();
      if (data.status === 'ok') setUsuarios(data.usuarios || []);
    } catch (e) {
      setMessage('Error al cargar usuarios');
    } finally {
      setLoading(prev => ({ ...prev, usuarios: false }));
    }
  };

  const cargarParejas = async () => {
    try {
      setLoading(prev => ({ ...prev, parejas: true }));
      setMessage('');
      const res = await fetch(API_BASE + 'parejas.php');
      const data = await res.json();
      if (data.status === 'ok') {
        setParejas(data.parejas || []);
      } else {
        setMessage('Error al cargar parejas: ' + (data.message || 'Error desconocido'));
      }
    } catch (e) {
      console.error('Error al cargar parejas:', e);
      setMessage('Error de conexión al cargar parejas');
    } finally {
      setLoading(prev => ({ ...prev, parejas: false }));
    }
  };

  useEffect(() => {
    cargarUsuarios();
    cargarParejas();
  }, []);

  const crearPareja = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!form.jugador1 || !form.jugador2 || form.jugador1 === form.jugador2) {
      setMessage('Seleccioná dos usuarios distintos');
      return;
    }
    try {
      setLoading(prev => ({ ...prev, creando: true }));
      const res = await fetch(API_BASE + 'crear_pareja.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jugador1_id: form.jugador1, jugador2_id: form.jugador2 })
      });
      const data = await res.json();
      if (data.status === 'ok') {
        setMessage('Pareja creada');
        setForm({ jugador1: '', jugador2: '' });
        await cargarParejas();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error: ' + (data.message || 'No se pudo crear la pareja'));
      }
    } catch (e) {
      setMessage('Error de conexión');
    } finally {
      setLoading(prev => ({ ...prev, creando: false }));
    }
  };

  const usuarioLabel = (u) => u.nombre || u.name || (u.email ? `(${u.email})` : `ID ${u.id}`);

  const getGridConfig = () => {
    switch (screenSize) {
      case 'mobile':
        return {
          gridColumns: '1fr',
          cardPadding: '12px',
          inputPadding: '8px',
          buttonPadding: '8px 12px',
          fontSize: '0.8rem',
          tableFontSize: '0.7rem',
          tablePadding: '6px 4px'
        };
      case 'tablet':
        return {
          gridColumns: '1fr 1fr',
          cardPadding: '15px',
          inputPadding: '10px',
          buttonPadding: '10px 15px',
          fontSize: '0.9rem',
          tableFontSize: '0.8rem',
          tablePadding: '8px 6px'
        };
      default:
        return {
          gridColumns: '1fr 1fr',
          cardPadding: '18px',
          inputPadding: '12px',
          buttonPadding: '12px 20px',
          fontSize: '1rem',
          tableFontSize: '0.9rem',
          tablePadding: '10px 8px'
        };
    }
  };

  const config = getGridConfig();

  return (
    <div style={{
      padding: screenSize === 'mobile' ? '15px' : '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '10px',
      marginBottom: '20px'
    }}>
      <h3 style={{ 
        marginTop: 0, 
        fontSize: screenSize === 'mobile' ? '1.2rem' : '1.5rem',
        color: '#333'
      }}>
        👥 Gestión de Parejas
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: config.gridColumns,
        gap: screenSize === 'mobile' ? '15px' : '20px'
      }}>
        {/* Formulario de creación */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: config.cardPadding,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h4 style={{ 
            marginTop: 0, 
            fontSize: config.fontSize,
            color: '#333'
          }}>
            Crear nueva pareja
          </h4>
          <form onSubmit={crearPareja} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: '600',
                color: '#333',
                fontSize: config.fontSize
              }}>
                Jugador 1
              </label>
              <select 
                value={form.jugador1} 
                onChange={(e) => setForm({ ...form, jugador1: e.target.value })} 
                required
                style={{
                  width: '100%',
                  padding: config.inputPadding,
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: config.fontSize,
                  backgroundColor: 'white'
                }}
              >
                <option value="">Seleccionar</option>
                {usuarios.map(u => (
                  <option key={u.id} value={u.id}>{usuarioLabel(u)}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: '600',
                color: '#333',
                fontSize: config.fontSize
              }}>
                Jugador 2
              </label>
              <select 
                value={form.jugador2} 
                onChange={(e) => setForm({ ...form, jugador2: e.target.value })} 
                required
                style={{
                  width: '100%',
                  padding: config.inputPadding,
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: config.fontSize,
                  backgroundColor: 'white'
                }}
              >
                <option value="">Seleccionar</option>
                {usuarios.map(u => (
                  <option key={u.id} value={u.id}>{usuarioLabel(u)}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={loading.creando}
              style={{
                backgroundColor: loading.creando ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: config.buttonPadding,
                fontSize: config.fontSize,
                fontWeight: '600',
                cursor: loading.creando ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {loading.creando ? 'Creando...' : 'Crear Pareja'}
            </button>
          </form>
          {message && (
            <div style={{
              marginTop: '15px',
              padding: '10px',
              borderRadius: '5px',
              backgroundColor: message.startsWith('Error') ? '#f8d7da' : '#d4edda',
              color: message.startsWith('Error') ? '#721c24' : '#155724',
              fontSize: config.fontSize
            }}>
              {message}
            </div>
          )}
        </div>

        {/* Lista de parejas */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: config.cardPadding,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h4 style={{ 
            marginTop: 0, 
            fontSize: config.fontSize,
            color: '#333'
          }}>
            Parejas existentes
          </h4>
          {loading.parejas ? (
            <div style={{
              padding: '20px',
              textAlign: 'center',
              color: '#666',
              fontSize: config.fontSize
            }}>
              Cargando...
            </div>
          ) : parejas.length ? (
            <div style={{
              maxHeight: screenSize === 'mobile' ? '300px' : '400px',
              overflowY: 'auto'
            }}>
              {screenSize === 'mobile' ? (
                // Vista móvil: tarjetas
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {parejas.map((p, idx) => (
                    <div key={p.id || idx} style={{
                      padding: '12px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                      border: '1px solid #e9ecef'
                    }}>
                      <div style={{
                        fontSize: config.fontSize,
                        fontWeight: '600',
                        color: '#333',
                        marginBottom: '5px'
                      }}>
                        Pareja #{p.id}
                      </div>
                      <div style={{
                        fontSize: config.tableFontSize,
                        color: '#666'
                      }}>
                        {p.jugador1_nombre || p.jugador1 || p.jugador_1 || p.nombre_jugador1 || p.jugador_a} + {p.jugador2_nombre || p.jugador2 || p.jugador_2 || p.nombre_jugador2 || p.jugador_b}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Vista desktop/tablet: tabla
                <div style={{ overflowX: 'auto' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: config.tableFontSize
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa' }}>
                        <th style={{
                          padding: config.tablePadding,
                          textAlign: 'left',
                          borderBottom: '2px solid #dee2e6',
                          fontWeight: '600',
                          color: '#333'
                        }}>
                          ID
                        </th>
                        <th style={{
                          padding: config.tablePadding,
                          textAlign: 'left',
                          borderBottom: '2px solid #dee2e6',
                          fontWeight: '600',
                          color: '#333'
                        }}>
                          Pareja
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {parejas.map((p, idx) => (
                        <tr key={p.id || idx} style={{
                          borderBottom: '1px solid #dee2e6'
                        }}>
                          <td style={{
                            padding: config.tablePadding,
                            fontWeight: '600',
                            color: '#007bff'
                          }}>
                            #{p.id}
                          </td>
                          <td style={{
                            padding: config.tablePadding,
                            color: '#333'
                          }}>
                            {p.jugador1_nombre || p.jugador1 || p.jugador_1 || p.nombre_jugador1 || p.jugador_a} + {p.jugador2_nombre || p.jugador2 || p.jugador_2 || p.nombre_jugador2 || p.jugador_b}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              padding: '20px',
              textAlign: 'center',
              color: '#666',
              fontSize: config.fontSize
            }}>
              No hay parejas registradas
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InscripcionSectionResponsive = () => {
  const [torneos, setTorneos] = useState([]);
  const [parejas, setParejas] = useState([]);
  const [form, setForm] = useState({ torneo_id: '', pareja_id: '' });
  const [loading, setLoading] = useState({ torneos: true, parejas: true, inscribiendo: false });
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

  const cargarTorneos = async () => {
    try {
      setLoading(prev => ({ ...prev, torneos: true }));
      const res = await fetch(API_BASE + 'torneos.php');
      const data = await res.json();
      if (data.status === 'ok') setTorneos(data.torneos || []);
    } catch {
      setMessage('Error al cargar torneos');
    } finally {
      setLoading(prev => ({ ...prev, torneos: false }));
    }
  };

  const cargarParejas = async () => {
    try {
      setLoading(prev => ({ ...prev, parejas: true }));
      const res = await fetch(API_BASE + 'parejas.php');
      const data = await res.json();
      if (data.status === 'ok') setParejas(data.parejas || []);
    } catch {
      setMessage('Error al cargar parejas');
    } finally {
      setLoading(prev => ({ ...prev, parejas: false }));
    }
  };

  useEffect(() => {
    cargarTorneos();
    cargarParejas();
  }, []);

  const inscribirPareja = async (e) => {
    e.preventDefault();
    setMessage('');
    
    console.log('Formulario completo:', form);
    console.log('torneo_id raw:', form.torneo_id, 'tipo:', typeof form.torneo_id);
    console.log('pareja_id raw:', form.pareja_id, 'tipo:', typeof form.pareja_id);
    
    if (!form.torneo_id || !form.pareja_id) {
      setMessage('Seleccioná torneo y pareja');
      return;
    }
    try {
      setLoading(prev => ({ ...prev, inscribiendo: true }));
      
      // Asegurar que pareja_id sea numérico
      const parejaIdNumerico = parseInt(form.pareja_id);
      const torneoIdNumerico = parseInt(form.torneo_id);
      
      console.log('Después de parseInt:');
      console.log('parejaIdNumerico:', parejaIdNumerico, 'isNaN:', isNaN(parejaIdNumerico));
      console.log('torneoIdNumerico:', torneoIdNumerico, 'isNaN:', isNaN(torneoIdNumerico));
      
      if (isNaN(parejaIdNumerico) || isNaN(torneoIdNumerico)) {
        setMessage('Error: IDs de torneo y pareja deben ser numéricos');
        return;
      }
      
      const requestData = { 
        torneo_id: torneoIdNumerico, 
        pareja_id: parejaIdNumerico 
      };
      console.log('Datos de inscripción:', requestData);
      console.log('URL de la petición:', API_BASE + 'asignar_pareja_torneo.php');
      
      const res = await fetch(API_BASE + 'asignar_pareja_torneo.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      
      console.log('Status de respuesta:', res.status);
      console.log('OK de respuesta:', res.ok);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Respuesta del servidor:', data);
      
      if (data.status === 'ok') {
        setMessage('Pareja inscrita exitosamente');
        setForm({ torneo_id: '', pareja_id: '' });
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error: ' + (data.message || 'No se pudo inscribir la pareja'));
      }
    } catch (error) {
      console.error('Error completo:', error);
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(prev => ({ ...prev, inscribiendo: false }));
    }
  };

  const getFormConfig = () => {
    switch (screenSize) {
      case 'mobile':
        return {
          cardPadding: '15px',
          inputPadding: '10px',
          buttonPadding: '10px 15px',
          fontSize: '0.9rem'
        };
      case 'tablet':
        return {
          cardPadding: '20px',
          inputPadding: '12px',
          buttonPadding: '12px 20px',
          fontSize: '1rem'
        };
      default:
        return {
          cardPadding: '25px',
          inputPadding: '14px',
          buttonPadding: '14px 25px',
          fontSize: '1.1rem'
        };
    }
  };

  const config = getFormConfig();

  return (
    <div style={{
      padding: screenSize === 'mobile' ? '15px' : '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '10px',
      marginBottom: '20px'
    }}>
      <h3 style={{ 
        marginTop: 0, 
        fontSize: screenSize === 'mobile' ? '1.2rem' : '1.5rem',
        color: '#333'
      }}>
        📝 Inscripción de Parejas
      </h3>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: config.cardPadding,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <form onSubmit={inscribirPareja} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: '600',
              color: '#333',
              fontSize: config.fontSize
            }}>
              Torneo
            </label>
            <select 
              value={form.torneo_id} 
              onChange={(e) => setForm({ ...form, torneo_id: e.target.value })} 
              required
              style={{
                width: '100%',
                padding: config.inputPadding,
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: config.fontSize,
                backgroundColor: 'white'
              }}
            >
              <option value="">Seleccionar torneo</option>
              {torneos.map(t => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: '600',
              color: '#333',
              fontSize: config.fontSize
            }}>
              Pareja
            </label>
            <select
              value={form.pareja_id}
              onChange={(e) => {
                console.log('Valor seleccionado del select:', e.target.value);
                console.log('Texto del option seleccionado:', e.target.options[e.target.selectedIndex].text);
                setForm({ ...form, pareja_id: e.target.value });
              }} 
              required
              style={{
                width: '100%',
                padding: config.inputPadding,
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: config.fontSize,
                backgroundColor: 'white'
              }}
            >
              <option value="">Seleccionar pareja</option>
              {parejas.map(p => (
                <option key={p.pareja_id} value={p.pareja_id}>
                  Pareja #{p.pareja_id}: {p.jugador1_nombre || p.jugador1 || p.jugador_1 || p.nombre_jugador1 || p.jugador_a} + {p.jugador2_nombre || p.jugador2 || p.jugador_2 || p.nombre_jugador2 || p.jugador_b}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={loading.inscribiendo}
            style={{
              backgroundColor: loading.inscribiendo ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: config.buttonPadding,
              fontSize: config.fontSize,
              fontWeight: '600',
              cursor: loading.inscribiendo ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {loading.inscribiendo ? 'Inscribiendo...' : 'Inscribir Pareja'}
          </button>
        </form>
        {message && (
          <div style={{
            marginTop: '15px',
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: message.startsWith('Error') ? '#f8d7da' : '#d4edda',
            color: message.startsWith('Error') ? '#721c24' : '#155724',
            fontSize: config.fontSize
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

const TorneosExistentesSectionResponsive = () => {
  const [torneos, setTorneos] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const cargarTorneos = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE + 'torneos.php');
      const data = await res.json();
      if (data.status === 'ok') {
        setTorneos(data.torneos || []);
      }
    } catch (error) {
      console.error('Error al cargar torneos:', error);
      setMessage('Error al cargar torneos');
    } finally {
      setLoading(false);
    }
  };

  const iniciarTorneo = async (torneoId) => {
    try {
      setMessage('');
      console.log('Iniciando torneo con ID:', torneoId);
      
      const res = await fetch(API_BASE + 'iniciar_torneo.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ torneo_id: parseInt(torneoId) })
      });
      
      const data = await res.json();
      console.log('Respuesta del servidor:', data);
      
      if (data.status === 'ok') {
        setMessage('✅ Torneo iniciado exitosamente');
        // Recargar la lista de torneos
        await cargarTorneos();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error: ' + (data.message || 'No se pudo iniciar el torneo'));
      }
    } catch (error) {
      console.error('Error al iniciar torneo:', error);
      setMessage('Error de conexión: ' + error.message);
    }
  };

  useEffect(() => {
    cargarTorneos();
  }, []);

  const getConfig = () => {
    switch (screenSize) {
      case 'mobile':
        return {
          cardPadding: '15px',
          fontSize: '0.9rem',
          tableFontSize: '0.8rem',
          tablePadding: '8px 6px'
        };
      case 'tablet':
        return {
          cardPadding: '20px',
          fontSize: '1rem',
          tableFontSize: '0.9rem',
          tablePadding: '10px 8px'
        };
      default:
        return {
          cardPadding: '25px',
          fontSize: '1.1rem',
          tableFontSize: '1rem',
          tablePadding: '12px 10px'
        };
    }
  };

  const config = getConfig();

  return (
    <div style={{
      padding: screenSize === 'mobile' ? '15px' : '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '10px',
      marginBottom: '20px'
    }}>
      <h3 style={{ 
        marginTop: 0, 
        fontSize: screenSize === 'mobile' ? '1.2rem' : '1.5rem',
        color: '#333'
      }}>
        🏆 Torneos Existentes
      </h3>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: config.cardPadding,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            color: '#666'
          }}>
            Cargando torneos...
          </div>
        ) : torneos.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: config.tableFontSize
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{
                    padding: config.tablePadding,
                    textAlign: 'left',
                    borderBottom: '2px solid #dee2e6',
                    fontWeight: '600',
                    color: '#333'
                  }}>
                    ID
                  </th>
                  <th style={{
                    padding: config.tablePadding,
                    textAlign: 'left',
                    borderBottom: '2px solid #dee2e6',
                    fontWeight: '600',
                    color: '#333'
                  }}>
                    Nombre
                  </th>
                  <th style={{
                    padding: config.tablePadding,
                    textAlign: 'left',
                    borderBottom: '2px solid #dee2e6',
                    fontWeight: '600',
                    color: '#333'
                  }}>
                    Estado
                  </th>
                  <th style={{
                    padding: config.tablePadding,
                    textAlign: 'left',
                    borderBottom: '2px solid #dee2e6',
                    fontWeight: '600',
                    color: '#333'
                  }}>
                    Fecha
                  </th>
                  <th style={{
                    padding: config.tablePadding,
                    textAlign: 'left',
                    borderBottom: '2px solid #dee2e6',
                    fontWeight: '600',
                    color: '#333'
                  }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {torneos.map(t => {
                  const estado = t.estado;
                  const estadoReal = (estado === undefined || estado === null || estado === 'undefined') ? 'pendiente' : estado;
                  const isIniciado = estadoReal === 'iniciado' || estadoReal === 'en_curso' || estadoReal === 'activo';
                  const isFinalizado = estadoReal === 'finalizado' || estadoReal === 'terminado';
                  const estadoDisplay = estadoReal === 'pendiente' ? 'Pendiente' : estadoReal;

                  return (
                    <tr key={t.id} style={{
                      borderBottom: '1px solid #dee2e6'
                    }}>
                      <td style={{
                        padding: config.tablePadding,
                        fontWeight: '600',
                        color: '#007bff'
                      }}>
                        #{t.id}
                      </td>
                      <td style={{
                        padding: config.tablePadding,
                        color: '#333'
                      }}>
                        {t.nombre || t.titulo}
                      </td>
                      <td style={{
                        padding: config.tablePadding
                      }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          backgroundColor: isFinalizado ? '#6c757d' : isIniciado ? '#28a745' : '#ffc107',
                          color: isFinalizado ? 'white' : isIniciado ? 'white' : 'black'
                        }}>
                          {estadoDisplay}
                        </span>
                      </td>
                      <td style={{
                        padding: config.tablePadding,
                        color: '#666'
                      }}>
                        {t.fecha || t.fecha_torneo || 'No especificada'}
                      </td>
                      <td style={{
                        padding: config.tablePadding,
                        textAlign: 'right'
                      }}>
                        {isFinalizado ? (
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            Finalizado
                          </span>
                        ) : isIniciado ? (
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            🏆 En Curso
                          </span>
                        ) : (
                          <button
                            onClick={() => iniciarTorneo(t.id)}
                            style={{
                              backgroundColor: '#007bff',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.backgroundColor = '#0056b3';
                              e.target.style.transform = 'translateY(-1px)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.backgroundColor = '#007bff';
                              e.target.style.transform = 'translateY(0)';
                            }}
                          >
                            🚀 Iniciar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            color: '#666'
          }}>
            No hay torneos registrados
          </div>
        )}
        {message && (
          <div style={{
            marginTop: '15px',
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: message.startsWith('Error') ? '#f8d7da' : '#d4edda',
            color: message.startsWith('Error') ? '#721c24' : '#155724',
            fontSize: config.fontSize
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

const PartidosSectionResponsive = () => {
  const [torneos, setTorneos] = useState([]);
  const [torneoId, setTorneoId] = useState('');
  const [partidos, setPartidos] = useState([]);
  const [parejas, setParejas] = useState([]);
  const [loading, setLoading] = useState({ torneos: true, partidos: false, parejas: true });
  const [message, setMessage] = useState('');
  
  // Estados para el modal de edición
  const [modalAbierto, setModalAbierto] = useState(false);
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);
  const [sets, setSets] = useState([]);
  const [guardando, setGuardando] = useState(false);

  const cargarTorneos = async () => {
    try {
      setLoading(prev => ({ ...prev, torneos: true }));
      const res = await fetch(API_BASE + 'torneos.php');
      const data = await res.json();
      if (data.status === 'ok') setTorneos(data.torneos || []);
    } catch {
      setMessage('Error al cargar torneos');
    } finally {
      setLoading(prev => ({ ...prev, torneos: false }));
    }
  };

  const cargarParejas = async () => {
    try {
      setLoading(prev => ({ ...prev, parejas: true }));
      const res = await fetch(API_BASE + 'parejas.php');
      const data = await res.json();
      if (data.status === 'ok') {
        setParejas(data.parejas || []);
        console.log('Parejas cargadas:', data.parejas);
      }
    } catch (error) {
      console.error('Error al cargar parejas:', error);
      setMessage('Error al cargar parejas');
    } finally {
      setLoading(prev => ({ ...prev, parejas: false }));
    }
  };

  const cargarPartidos = async (id) => {
    if (!id) return;
    try {
      setLoading(prev => ({ ...prev, partidos: true }));
      console.log('Cargando partidos para torneo:', id);
      const res = await fetch(API_BASE + `listar_partidos.php?torneo_id=${id}`);
      const data = await res.json();
      console.log('Respuesta de partidos:', data);
      
      if (data.status === 'ok') {
        console.log('Partidos cargados:', data.partidos);
        setPartidos(data.partidos || []);
      }
    } catch (error) {
      console.error('Error al cargar partidos:', error);
      setMessage('Error al cargar partidos');
    } finally {
      setLoading(prev => ({ ...prev, partidos: false }));
    }
  };

  useEffect(() => { 
    cargarTorneos();
    cargarParejas();
  }, []);
  useEffect(() => { cargarPartidos(torneoId); }, [torneoId]);

  // Función para abrir el modal de edición
  const abrirModalEdicion = (partido) => {
    setPartidoSeleccionado(partido);
    
    // Si el partido ya tiene sets, cargarlos; si no, crear sets vacíos
    if (partido.sets && partido.sets.length > 0) {
      setSets(partido.sets.map(set => ({
        numero_set: set.numero_set,
        games_pareja1: set.games_pareja1 || '',
        games_pareja2: set.games_pareja2 || ''
      })));
    } else {
      // Crear 2 sets vacíos por defecto
      setSets([
        { numero_set: 1, games_pareja1: '', games_pareja2: '' },
        { numero_set: 2, games_pareja1: '', games_pareja2: '' }
      ]);
    }
    
    setModalAbierto(true);
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    setModalAbierto(false);
    setPartidoSeleccionado(null);
    setSets([]);
  };

  // Función para agregar un set
  const agregarSet = () => {
    if (sets.length < 5) {
      setSets([...sets, { 
        numero_set: sets.length + 1, 
        games_pareja1: '', 
        games_pareja2: '' 
      }]);
    }
  };

  // Función para eliminar un set
  const eliminarSet = (index) => {
    if (sets.length > 2) {
      const nuevosSets = sets.filter((_, i) => i !== index);
      // Renumerar los sets
      const setsRenumerados = nuevosSets.map((set, i) => ({
        ...set,
        numero_set: i + 1
      }));
      setSets(setsRenumerados);
    }
  };

  // Función para actualizar un set
  const actualizarSet = (index, campo, valor) => {
    const nuevosSets = [...sets];
    nuevosSets[index][campo] = valor;
    setSets(nuevosSets);
  };

  // Función para guardar los resultados
  const guardarResultados = async () => {
    // Validar que todos los sets tengan valores
    const setsValidos = sets.filter(set => 
      set.games_pareja1 !== '' && set.games_pareja2 !== ''
    );
    
    if (setsValidos.length === 0) {
      setMessage('Debes ingresar al menos un set válido');
      return;
    }

    // Validar que los valores estén entre 0 y 7
    for (const set of setsValidos) {
      const games1 = parseInt(set.games_pareja1);
      const games2 = parseInt(set.games_pareja2);
      
      if (isNaN(games1) || isNaN(games2) || games1 < 0 || games1 > 7 || games2 < 0 || games2 > 7) {
        setMessage('Los games deben ser números entre 0 y 7');
        return;
      }
    }

    try {
      setGuardando(true);
      setMessage('');

      const datos = {
        partido_id: partidoSeleccionado.id,
        sets: setsValidos.map(set => ({
          numero_set: set.numero_set,
          games_pareja1: parseInt(set.games_pareja1),
          games_pareja2: parseInt(set.games_pareja2)
        }))
      };

      console.log('Enviando datos:', datos);

      const res = await fetch(API_BASE + 'actualizar_resultado.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      const data = await res.json();
      console.log('Respuesta del servidor:', data);

      if (data.status === 'ok') {
        setMessage('✅ Resultado actualizado correctamente');
        cerrarModal();
        await cargarPartidos(torneoId);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error: ' + (data.message || 'No se pudo actualizar el resultado'));
      }
    } catch (error) {
      console.error('Error al guardar resultados:', error);
      setMessage('Error de conexión: ' + error.message);
    } finally {
      setGuardando(false);
    }
  };

  // Función para formatear el nombre de la pareja
  const formatearPareja = (partido, tipoPareja) => {
    const parejaId = tipoPareja === 'A' ? partido.pareja1_id : partido.pareja2_id;
    
    // Buscar la pareja en la lista de parejas cargadas
    const pareja = parejas.find(p => p.id === parejaId || p.pareja_id === parejaId);
    
    if (pareja) {
      const jugador1 = pareja.jugador1_nombre || pareja.jugador1 || pareja.jugador_1 || pareja.nombre_jugador1 || pareja.jugador_a;
      const jugador2 = pareja.jugador2_nombre || pareja.jugador2 || pareja.jugador_2 || pareja.nombre_jugador2 || pareja.jugador_b;
      
      if (jugador1 && jugador2 && jugador1 !== 'undefined' && jugador2 !== 'undefined' && jugador1 !== null && jugador2 !== null) {
        return `${jugador1} + ${jugador2}`;
      }
    }
    
    return `Pareja ${tipoPareja} (ID: ${parejaId})`;
  };

  // Función para renderizar los sets de un partido
  const renderizarSets = (partido) => {
    if (partido.sets && partido.sets.length > 0) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {partido.sets.map((set, index) => (
            <div key={index} style={{
              padding: '4px 8px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#495057'
            }}>
              Set {set.numero_set}: {set.games_pareja1} - {set.games_pareja2}
            </div>
          ))}
        </div>
      );
    }
    return (
      <span style={{ color: '#6c757d', fontStyle: 'italic' }}>
        Sin resultados registrados
      </span>
    );
  };

  return (
    <div className="section">
      <h3 style={{ marginTop: 0 }}>🎾 Gestión de Partidos</h3>
      <div className="card">
        <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <label className="label">Torneo</label>
            <select className="select" value={torneoId} onChange={(e) => setTorneoId(e.target.value)}>
              <option value="">Seleccionar torneo</option>
              {loading.torneos ? <option>Cargando...</option> : torneos.map(t => (
                <option key={t.id} value={t.id}>{t.nombre || t.titulo}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="divider" />
        {loading.partidos ? (
          <div className="alert alert-muted">Cargando partidos...</div>
        ) : partidos.length ? (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ronda</th>
                  <th>Pareja A</th>
                  <th>Pareja B</th>
                  <th>Resultados</th>
                  <th>Ganador</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {partidos.map((p, idx) => {
                  const parejaA = formatearPareja(p, 'A');
                  const parejaB = formatearPareja(p, 'B');
                  
                  return (
                    <tr key={p.id || idx}>
                      <td>{p.id}</td>
                      <td>
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: '3px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          Ronda {p.ronda}
                        </span>
                      </td>
                      <td>{parejaA}</td>
                      <td>{parejaB}</td>
                      <td>
                        {renderizarSets(p)}
                      </td>
                      <td>
                        {p.ganador_id ? (
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            🏆 Ganador ID: {p.ganador_id}
                          </span>
                        ) : (
                          <span style={{ color: '#6c757d' }}>-</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button 
                          className="btn btn-primary" 
                          onClick={() => abrirModalEdicion(p)}
                          style={{ fontSize: '12px', padding: '4px 8px' }}
                        >
                          Editar resultado
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="alert alert-muted">No hay partidos para este torneo</div>
        )}
        {message && <div className={`alert ${message.startsWith('Error') ? 'alert-danger' : 'alert-success'}`} style={{ marginTop: 12 }}>{message}</div>}
      </div>

      {/* Modal de edición de resultados */}
      {modalAbierto && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
          }}>
            <h4 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>
              Editar Resultados - Partido {partidoSeleccionado?.id}
            </h4>
            
            <div style={{ marginBottom: '20px' }}>
              <strong>Pareja A:</strong> {formatearPareja(partidoSeleccionado, 'A')}<br/>
              <strong>Pareja B:</strong> {formatearPareja(partidoSeleccionado, 'B')}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h5 style={{ marginBottom: '10px' }}>Sets del Partido:</h5>
              {sets.map((set, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '10px',
                  padding: '10px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px'
                }}>
                  <span style={{ fontWeight: 'bold', minWidth: '60px' }}>
                    Set {set.numero_set}:
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="7"
                    value={set.games_pareja1}
                    onChange={(e) => actualizarSet(index, 'games_pareja1', e.target.value)}
                    placeholder="Games Pareja A"
                    style={{
                      width: '80px',
                      padding: '4px 8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    min="0"
                    max="7"
                    value={set.games_pareja2}
                    onChange={(e) => actualizarSet(index, 'games_pareja2', e.target.value)}
                    placeholder="Games Pareja B"
                    style={{
                      width: '80px',
                      padding: '4px 8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  />
                  {sets.length > 2 && (
                    <button
                      onClick={() => eliminarSet(index)}
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              ))}
              
              {sets.length < 5 && (
                <button
                  onClick={agregarSet}
                  style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    marginTop: '10px'
                  }}
                >
                  + Agregar Set
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={cerrarModal}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={guardarResultados}
                disabled={guardando}
                style={{
                  backgroundColor: guardando ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  cursor: guardando ? 'not-allowed' : 'pointer',
                  fontSize: '14px'
                }}
              >
                {guardando ? 'Guardando...' : 'Guardar Resultado'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TorneosAdminResponsive = () => {
  console.log('TorneosAdminResponsive renderizando...');
  
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <h2 style={{ 
        marginTop: 0, 
        fontSize: '2rem',
        color: '#333',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        🏆 Administración de Torneos
      </h2>
      <ParejasSectionResponsive />
      <InscripcionSectionResponsive />
      <TorneosExistentesSectionResponsive />
      <PartidosSectionResponsive />
    </div>
  );
};

export default TorneosAdminResponsive;
