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
    if (!form.torneo_id || !form.pareja_id) {
      setMessage('Seleccioná torneo y pareja');
      return;
    }
    try {
      setLoading(prev => ({ ...prev, inscribiendo: true }));
      const res = await fetch(API_BASE + 'inscribir_pareja.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ torneo_id: form.torneo_id, pareja_id: form.pareja_id })
      });
      const data = await res.json();
      if (data.status === 'ok') {
        setMessage('Pareja inscrita');
        setForm({ torneo_id: '', pareja_id: '' });
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error: ' + (data.message || 'No se pudo inscribir la pareja'));
      }
    } catch (e) {
      setMessage('Error de conexión');
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
              onChange={(e) => setForm({ ...form, pareja_id: e.target.value })} 
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
                <option key={p.id} value={p.id}>
                  Pareja #{p.id}: {p.jugador1_nombre || p.jugador1 || p.jugador_1 || p.nombre_jugador1 || p.jugador_a} + {p.jugador2_nombre || p.jugador2 || p.jugador_2 || p.nombre_jugador2 || p.jugador_b}
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

const TorneosAdminResponsive = () => {
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
    </div>
  );
};

export default TorneosAdminResponsive;
