// Configuración de la API
export const BASE_URL = 
  window.location.hostname === "localhost" 
    ? "https://padel-gestionado.com/api" 
    : "/api";

// Función helper para construir URLs completas
export const buildApiUrl = (endpoint) => {
  // Si el endpoint ya incluye la URL completa, lo devolvemos tal como está
  if (endpoint.startsWith('http')) {
    return endpoint;
  }
  
  // Si el endpoint empieza con /, lo concatenamos con BASE_URL
  if (endpoint.startsWith('/')) {
    return `${BASE_URL}${endpoint}`;
  }
  
  // Si no, agregamos / entre BASE_URL y endpoint
  return `${BASE_URL}/${endpoint}`;
};

// Configuración por defecto para fetch
export const defaultFetchConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Función helper para hacer peticiones POST
export const apiPost = async (endpoint, data) => {
  const url = buildApiUrl(endpoint);
  const response = await fetch(url, {
    method: 'POST',
    ...defaultFetchConfig,
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Función helper para hacer peticiones GET
export const apiGet = async (endpoint) => {
  const url = buildApiUrl(endpoint);
  const response = await fetch(url, {
    method: 'GET',
    ...defaultFetchConfig,
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};
