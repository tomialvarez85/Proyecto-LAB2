import React, { useEffect, useState } from 'react';

// Sub-sections
const API_BASE = 'https://padel-gestionado.com/api/';

const ParejasSection = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [parejas, setParejas] = useState([]);
  const [form, setForm] = useState({ jugador1: '', jugador2: '' });
  const [loading, setLoading] = useState({ usuarios: true, parejas: true, creando: false });
  const [message, setMessage] = useState('');

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

  return (
    <div className="section">
      <h3 style={{ marginTop: 0 }}>👥 Gestión de Parejas</h3>
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card">
          <h4 style={{ marginTop: 0 }}>Crear nueva pareja</h4>
          <form onSubmit={crearPareja} className="form">
            <div>
              <label className="label">Jugador 1</label>
              <select className="select" value={form.jugador1} onChange={(e) => setForm({ ...form, jugador1: e.target.value })} required>
                <option value="">Seleccionar</option>
                {usuarios.map(u => (
                  <option key={u.id} value={u.id}>{usuarioLabel(u)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Jugador 2</label>
              <select className="select" value={form.jugador2} onChange={(e) => setForm({ ...form, jugador2: e.target.value })} required>
                <option value="">Seleccionar</option>
                {usuarios.map(u => (
                  <option key={u.id} value={u.id}>{usuarioLabel(u)}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-success" disabled={loading.creando}>{loading.creando ? 'Creando...' : 'Crear pareja'}</button>
          </form>
          {message && <div className={`alert ${message.startsWith('Error') ? 'alert-danger' : 'alert-success'}`} style={{ marginTop: 12 }}>{message}</div>}
        </div>
        <div className="card">
          <h4 style={{ marginTop: 0 }}>Parejas registradas</h4>
          {loading.parejas ? (
            <div className="alert alert-muted">Cargando...</div>
          ) : parejas.length ? (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Jugador 1</th>
                    <th>Jugador 2</th>
                  </tr>
                </thead>
                <tbody>
                  {parejas.map((p, idx) => (
                    <tr key={p.id || idx}>
                      <td>{p.id || p.pareja_id || idx + 1}</td>
                      <td>{p.jugador1_nombre || p.jugador1 || p.jugador_1 || p.nombre_jugador1 || p.jugador_a}</td>
                      <td>{p.jugador2_nombre || p.jugador2 || p.jugador_2 || p.nombre_jugador2 || p.jugador_b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-muted">No hay parejas registradas</div>
          )}
        </div>
      </div>
    </div>
  );
};

const InscripcionSection = () => {
  const [torneos, setTorneos] = useState([]);
  const [parejas, setParejas] = useState([]);
  const [form, setForm] = useState({ torneo: '', pareja: '' });
  const [loading, setLoading] = useState({ torneos: true, parejas: true, enviando: false });
  const [message, setMessage] = useState('');

  const cargarTorneos = async () => {
    try {
      setLoading(prev => ({ ...prev, torneos: true }));
      const res = await fetch(API_BASE + 'torneos.php');
      const data = await res.json();
      if (data.status === 'ok') setTorneos((data.torneos || []).filter(t => (t.estado || t.status || 'activo') !== 'finalizado'));
    } catch {
      setMessage('Error al cargar torneos');
    } finally {
      setLoading(prev => ({ ...prev, torneos: false }));
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

  // Función para probar el endpoint de inscripción
  const probarEndpoint = async () => {
    try {
      console.log('Probando endpoint asignar_pareja_torneo.php...');
      const res = await fetch(API_BASE + 'asignar_pareja_torneo.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ torneo_id: 'test', pareja_id: 'test' })
      });
      console.log('Respuesta del endpoint:', res.status, res.statusText);
      const data = await res.text();
      console.log('Contenido de la respuesta:', data);
    } catch (error) {
      console.error('Error al probar endpoint:', error);
    }
  };

  useEffect(() => {
    cargarTorneos();
    cargarParejas();
    // Probar el endpoint al cargar el componente
    probarEndpoint();
  }, []);

  const inscribir = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!form.torneo || !form.pareja) {
      setMessage('Seleccioná torneo y pareja');
      return;
    }
    try {
      setLoading(prev => ({ ...prev, enviando: true }));
      
      // Debug: mostrar datos que se envían
      console.log('Enviando datos:', { torneo_id: form.torneo, pareja_id: form.pareja });
      console.log('Tipo de pareja_id:', typeof form.pareja);
      console.log('Pareja seleccionada:', parejas.find(p => p.pareja_id == form.pareja));
      
      const res = await fetch(API_BASE + 'asignar_pareja_torneo.php', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ torneo_id: parseInt(form.torneo), pareja_id: parseInt(form.pareja) })
      });
      
      // Debug: mostrar respuesta del servidor
      console.log('Respuesta del servidor:', res.status, res.statusText);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('Datos de respuesta:', data);
      
      if (data.status === 'ok') {
        setMessage('Pareja inscrita en el torneo');
        setForm({ torneo: '', pareja: '' });
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error: ' + (data.message || 'No se pudo inscribir'));
      }
    } catch (error) {
      console.error('Error al inscribir pareja:', error);
      if (error.message.includes('HTTP')) {
        setMessage('Error del servidor: ' + error.message);
      } else {
        setMessage('Error de conexión: ' + error.message);
      }
    } finally {
      setLoading(prev => ({ ...prev, enviando: false }));
    }
  };

  return (
    <div className="section">
      <h3 style={{ marginTop: 0 }}>📝 Inscripción de Parejas a Torneos</h3>
      <div className="card">
        <form onSubmit={inscribir} className="form">
          <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <label className="label">Torneo</label>
              <select className="select" value={form.torneo} onChange={(e) => setForm({ ...form, torneo: e.target.value })} required>
                <option value="">Seleccionar torneo</option>
                {loading.torneos ? <option>Cargando...</option> : torneos.map(t => (
                  <option key={t.id} value={t.id}>{t.nombre || t.titulo} ({t.estado || 'activo'})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Pareja</label>
              <select className="select" value={form.pareja} onChange={(e) => {
                console.log('Pareja seleccionada:', e.target.value);
                console.log('Parejas disponibles:', parejas);
                setForm({ ...form, pareja: e.target.value });
              }} required>
                <option value="">Seleccionar pareja</option>
                {loading.parejas ? <option>Cargando...</option> : parejas.map(p => (
                  <option key={p.pareja_id} value={p.pareja_id}>{p.jugador1_nombre || p.jugador1 || p.jugador_1 || p.nombre_jugador1 || p.jugador_a} + {p.jugador2_nombre || p.jugador2 || p.jugador_2 || p.nombre_jugador2 || p.jugador_b}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading.enviando}>{loading.enviando ? 'Inscribiendo...' : 'Inscribir pareja'}</button>
        </form>
        {message && <div className={`alert ${message.startsWith('Error') ? 'alert-danger' : 'alert-success'}`} style={{ marginTop: 12 }}>{message}</div>}
      </div>
    </div>
  );
};

const InicioSection = () => {
  const [torneosPendientes, setTorneosPendientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const cargarPendientes = async () => {
    try {
      setLoading(true);
      console.log('Cargando torneos activos...');
      const res = await fetch(API_BASE + 'torneos.php');
      const data = await res.json();
      console.log('Todos los torneos:', data.torneos);
      console.log('Estructura del primer torneo:', data.torneos?.[0]);
      console.log('Verificando columna estado del backend...');
      
      if (data.status === 'ok') {
        // Usar el valor real del estado del backend
        const lista = (data.torneos || []).filter(t => {
          const estado = t.estado; // Usar el valor exacto del backend
          console.log(`Torneo ${t.id} - Estado del backend: "${estado}" (tipo: ${typeof estado})`);
          console.log(`Torneo ${t.id} - Campos disponibles:`, Object.keys(t));
          
          // Verificar si la columna estado está presente
          if (t.hasOwnProperty('estado')) {
            console.log(`✅ Torneo ${t.id} - Columna estado encontrada: "${estado}"`);
          } else {
            console.log(`❌ Torneo ${t.id} - Columna estado NO encontrada`);
          }
          
          // Si el estado es undefined/null, asumir que está pendiente
          if (estado === undefined || estado === null || estado === 'undefined') {
            console.log(`Torneo ${t.id} - Estado undefined, asumiendo pendiente`);
            return true; // Incluir torneos sin estado definido
          }
          
          // Incluir todos los torneos que no estén finalizados
          return estado !== 'finalizado' && estado !== 'cancelado';
        });
        console.log('Torneos activos filtrados:', lista);
        setTorneosPendientes(lista);
      }
    } catch {
      setMessage('Error al cargar torneos');
    } finally {
      setLoading(false);
    }
  };

  // Función para verificar parejas inscritas en un torneo
  const verificarParejasInscritas = async (torneoId) => {
    try {
      console.log('Verificando parejas inscritas en torneo:', torneoId);
      // Usar el endpoint que sabemos que existe: parejas.php
      const res = await fetch(API_BASE + 'parejas.php');
      const data = await res.json();
      console.log('Todas las parejas disponibles:', data);
      
      // Por ahora, asumir que hay parejas disponibles
      // TODO: Implementar endpoint específico para parejas de un torneo
      if (data.status === 'ok' && data.parejas && data.parejas.length > 0) {
        console.log('Parejas disponibles:', data.parejas.length);
        return { parejas: data.parejas };
      }
      return { parejas: [] };
    } catch (error) {
      console.error('Error al verificar parejas inscritas:', error);
      return { parejas: [] };
    }
  };

  // Función para probar el endpoint de iniciar torneo
  const probarEndpointIniciar = async () => {
    try {
      console.log('Probando endpoint iniciar_torneo.php...');
      const res = await fetch(API_BASE + 'iniciar_torneo.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ torneo_id: 'test' })
      });
      console.log('Respuesta del endpoint iniciar:', res.status, res.statusText);
      const data = await res.text();
      console.log('Contenido de la respuesta iniciar:', data);
    } catch (error) {
      console.error('Error al probar endpoint iniciar:', error);
    }
  };

  // Función para probar diferentes valores de estado
  const probarEstados = () => {
    console.log('🧪 Probando diferentes valores de estado...');
    const estadosPrueba = ['pendiente', 'iniciado', 'en_curso', 'activo', 'finalizado', 'cancelado', undefined, null];
    
    estadosPrueba.forEach(estado => {
      const estadoReal = (estado === undefined || estado === null || estado === 'undefined') ? 'pendiente' : estado;
      const isIniciado = estadoReal === 'iniciado' || estadoReal === 'en_curso' || estadoReal === 'activo';
      const estadoDisplay = estadoReal === 'pendiente' ? 'Pendiente' : estadoReal;
      
      console.log(`Estado: "${estado}" → EstadoReal: "${estadoReal}" → IsIniciado: ${isIniciado} → Display: "${estadoDisplay}"`);
    });
  };

  useEffect(() => {
    cargarPendientes();
    // Probar el endpoint al cargar el componente
    probarEndpointIniciar();
    // Probar diferentes estados
    probarEstados();
  }, []);

  const iniciar = async (id) => {
    try {
      setMessage('');
      
      // Debug: mostrar información básica
      console.log('Iniciando torneo con ID:', id);
      
      const torneoSeleccionado = torneosPendientes.find(t => t.id == id);
      if (torneoSeleccionado) {
        console.log('Torneo seleccionado:', torneoSeleccionado.nombre || torneoSeleccionado.titulo);
        console.log('Estado actual del backend:', `"${torneoSeleccionado.estado}"`);
      }
      
      const res = await fetch(API_BASE + 'iniciar_torneo.php', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ torneo_id: parseInt(id) })
      });
      
      // Debug: mostrar respuesta del servidor
      console.log('Respuesta del servidor:', res.status, res.statusText);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('Respuesta del servidor:', data);
      
      if (data.status === 'ok') {
        setMessage('✅ Torneo iniciado exitosamente');
        console.log('Torneo iniciado, actualizando lista...');
        
        // Actualizar la lista de torneos pendientes
        await cargarPendientes();
        
        // Verificar que el torneo ya no esté en la lista de pendientes
        console.log('Verificando que el torneo ya no esté en pendientes...');
        
        // Mostrar mensaje de éxito
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error: ' + (data.message || 'No se pudo iniciar'));
        console.log('Error completo del servidor:', data);
      }
    } catch (error) {
      console.error('Error al iniciar torneo:', error);
      if (error.message.includes('HTTP')) {
        setMessage('Error del servidor: ' + error.message);
      } else {
        setMessage('Error de conexión: ' + error.message);
      }
    }
  };

  return (
    <div className="section">
      <h3 style={{ marginTop: 0 }}>🚀 Gestión de Torneos Activos</h3>
      <div className="card">
        {loading ? (
          <div className="alert alert-muted">Cargando...</div>
        ) : torneosPendientes.length ? (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {torneosPendientes.map(t => {
                  const estado = t.estado; // Usar el valor exacto del backend
                  console.log(`Renderizando torneo ${t.id} con estado: "${estado}" (tipo: ${typeof estado})`);
                  
                  // Manejar el caso cuando el estado es undefined/null
                  const estadoReal = (estado === undefined || estado === null || estado === 'undefined') ? 'pendiente' : estado;
                  
                  // Determinar si el torneo está iniciado basado en el estado del backend
                  const isIniciado = estadoReal === 'iniciado' || estadoReal === 'en_curso' || estadoReal === 'activo';
                  
                  // Mostrar el estado (si es undefined, mostrar "Pendiente")
                  const estadoDisplay = estadoReal === 'pendiente' ? 'Pendiente' : estadoReal;
                  
                  return (
                    <tr key={t.id}>
                      <td>{t.id}</td>
                      <td>{t.nombre || t.titulo}</td>
                      <td>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          backgroundColor: isIniciado ? '#28a745' : '#ffc107',
                          color: isIniciado ? 'white' : 'black'
                        }}>
                          {estadoDisplay}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {isIniciado ? (
                          <button className="btn btn-info" disabled>
                            🏆 {estadoDisplay}
                          </button>
                        ) : (
                          <button className="btn btn-success" onClick={() => iniciar(t.id)}>
                            🚀 Iniciar Torneo
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
          <div className="alert alert-muted">No hay torneos activos</div>
        )}
        {message && <div className={`alert ${message.startsWith('Error') ? 'alert-danger' : 'alert-success'}`} style={{ marginTop: 12 }}>{message}</div>}
      </div>
    </div>
  );
};

const PartidosSection = () => {
  const [torneos, setTorneos] = useState([]);
  const [torneoId, setTorneoId] = useState('');
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState({ torneos: true, partidos: false });
  const [message, setMessage] = useState('');

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
        if (data.partidos && data.partidos.length > 0) {
          console.log('Estructura del primer partido:', data.partidos[0]);
          console.log('Campos disponibles en partido:', Object.keys(data.partidos[0]));
          
          // Debug específico para resultados
          data.partidos.forEach((partido, index) => {
            console.log(`Partido ${index + 1} - ID: ${partido.id}`);
            console.log(`  resultado_pareja1: "${partido.resultado_pareja1}" (tipo: ${typeof partido.resultado_pareja1})`);
            console.log(`  resultado_pareja2: "${partido.resultado_pareja2}" (tipo: ${typeof partido.resultado_pareja2})`);
            console.log(`  ganador_id: "${partido.ganador_id}" (tipo: ${typeof partido.ganador_id})`);
          });
        }
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
  }, []);
  useEffect(() => { cargarPartidos(torneoId); }, [torneoId]);

  const registrarResultado = async (partido) => {
    console.log('Iniciando registro de resultado para partido:', partido.id);
    const resultado = prompt(`Registrar resultado para partido ${partido.id}\n\nIngresá el resultado separado por comas (ej: 6-0, 6-2):\n- Primer set: resultado de la pareja 1 (ej: 6-0)\n- Segundo set: resultado de la pareja 1 (ej: 6-2)\n\nFormato: "set1, set2"\n\nNOTA: Si el resultado se muestra incompleto, usa formato alternativo: "6_0, 6_2"`);
    if (!resultado) {
      console.log('Usuario canceló el registro de resultado');
      return;
    }
    
    try {
      setMessage('');
      
      // Debug: mostrar datos del partido y resultado
      console.log('Partido seleccionado:', partido);
      console.log('Resultado ingresado:', resultado);
      
      // Usar el formato correcto que funciona (resultado separado por sets)
      const resultadoSplit = resultado.split(',');
      let resultadoPareja1 = resultadoSplit[0]?.trim() || resultado;
      let resultadoPareja2 = resultadoSplit[1]?.trim() || '0';
      
      // Detectar si el usuario está usando formato alternativo (con guiones bajos)
      const usaFormatoAlternativo = resultado.includes('_');
      
      console.log('Resultado original:', resultado);
      console.log('Resultado split:', resultadoSplit);
      console.log('Usa formato alternativo:', usaFormatoAlternativo);
      console.log('Resultado pareja 1 (antes):', resultadoPareja1);
      console.log('Resultado pareja 2 (antes):', resultadoPareja2);
      
      // Si usa formato alternativo, convertir guiones bajos a guiones normales
      if (usaFormatoAlternativo) {
        resultadoPareja1 = resultadoPareja1.replace(/_/g, '-');
        resultadoPareja2 = resultadoPareja2.replace(/_/g, '-');
        console.log('Convertido a formato normal:');
        console.log('Resultado pareja 1 (después):', resultadoPareja1);
        console.log('Resultado pareja 2 (después):', resultadoPareja2);
      }
      
      const datosCorrectos = {
        partido_id: partido.id,
        torneo_id: torneoId,
        pareja1_id: partido.pareja1_id,
        pareja2_id: partido.pareja2_id,
        resultado_pareja1: resultadoPareja1,
        resultado_pareja2: resultadoPareja2,
        ronda: partido.ronda
      };
      
      console.log('Datos que se enviarán (formato correcto):', datosCorrectos);
      
      // Si el backend está truncando resultados, probar formato alternativo
      if (resultadoPareja1.includes('-') && !usaFormatoAlternativo) {
        console.log('⚠️ ADVERTENCIA: El backend podría truncar resultados con guiones');
        console.log('💡 Sugerencia: Usa formato alternativo como "6_0, 6_2" en el futuro');
      }
      
      const res = await fetch(API_BASE + 'registrar_resultado.php', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosCorrectos)
      });
      
      console.log('Respuesta del servidor:', res.status, res.statusText);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('Datos de respuesta:', data);
      
      if (data.status === 'ok') {
        setMessage('✅ Resultado registrado correctamente');
        await cargarPartidos(torneoId);
        setTimeout(() => setMessage(''), 3000);
      } else {
        console.log('Error completo del servidor:', data);
        setMessage('Error: ' + (data.message || 'No se pudo registrar'));
      }
    } catch (error) {
      console.error('Error al registrar resultado:', error);
      if (error.message.includes('HTTP')) {
        setMessage('Error del servidor: ' + error.message);
      } else {
        setMessage('Error de conexión: ' + error.message);
      }
    }
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
                  <th>Resultado</th>
                  <th>Ganador</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {partidos.map((p, idx) => {
                  console.log(`Renderizando partido ${p.id || idx}:`, p);
                  
                  // Función para formatear el nombre de la pareja usando la estructura real del backend
                  const formatearPareja = (jugador1, jugador2) => {
                    if (jugador1 && jugador2 && jugador1 !== 'undefined' && jugador2 !== 'undefined') {
                      return `${jugador1} + ${jugador2}`;
                    }
                    return 'Pareja no disponible';
                  };
                  
                  // Usar los campos correctos del backend
                  const parejaA = formatearPareja(p.jugador1a, p.jugador1b);
                  const parejaB = formatearPareja(p.jugador2a, p.jugador2b);
                  
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
                        {p.resultado_pareja1 && p.resultado_pareja2 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ 
                              fontSize: '14px', 
                              fontWeight: 'bold',
                              color: '#007bff'
                            }}>
                              Set 1: {p.resultado_pareja1}
                            </span>
                            <span style={{ 
                              fontSize: '14px', 
                              fontWeight: 'bold',
                              color: '#28a745'
                            }}>
                              Set 2: {p.resultado_pareja2}
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: '#6c757d' }}>-</span>
                        )}
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
                        <button className="btn btn-primary" onClick={() => registrarResultado(p)}>Cargar resultado</button>
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
    </div>
  );
};

const TorneosAdmin = () => {
  return (
    <div className="section">
      <h2 style={{ marginTop: 0 }}>Torneos</h2>
      <ParejasSection />
      <InscripcionSection />
      <InicioSection />
      <PartidosSection />
    </div>
  );
};

export default TorneosAdmin;


