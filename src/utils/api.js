// Configuración de API
const API_BASE_URL = 'https://padel-gestionado.com/api';

// Función para hacer peticiones con manejo de CORS
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}/${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    ...options
  };

  try {
    console.log('Haciendo petición a:', url);
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Función específica para crear reservas
export const crearReserva = async (reservaData) => {
  return apiRequest('reservar.php', {
    method: 'POST',
    body: JSON.stringify(reservaData)
  });
};

// Función para obtener torneos
export const obtenerTorneos = async () => {
  return apiRequest('torneos.php', {
    method: 'GET'
  });
};

// Función para obtener mis reservas
export const obtenerMisReservas = async (usuarioId) => {
  return apiRequest('mis_reservas.php', {
    method: 'POST',
    body: JSON.stringify({ usuario_id: usuarioId })
  });
};

// Función para obtener mis torneos
export const obtenerMisTorneos = async (usuarioId) => {
  return apiRequest('mis_torneos.php', {
    method: 'POST',
    body: JSON.stringify({ usuario_id: usuarioId })
  });
};

// Función para login
export const login = async (loginData) => {
  return apiRequest('login.php', {
    method: 'POST',
    body: JSON.stringify(loginData)
  });
};

// Función para registro
export const register = async (registerData) => {
  return apiRequest('register.php', {
    method: 'POST',
    body: JSON.stringify(registerData)
  });
};

// Función para cancelar reserva
export const cancelarReserva = async (usuarioId, reservaId) => {
  return apiRequest('cancelar_reserva.php', {
    method: 'POST',
    body: JSON.stringify({
      usuario_id: usuarioId,
      reserva_id: reservaId
    })
  });
};

// Función para obtener disponibilidad de canchas
export const obtenerDisponibilidad = async (fecha) => {
  return apiRequest('disponibilidad.php', {
    method: 'POST',
    body: JSON.stringify({ fecha })
  });
};