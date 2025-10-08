// Configuración de la API
export const API_CONFIG = {
  // URL base del backend
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  
  // Timeouts
  TIMEOUT: 10000, // 10 segundos
  
  // Configuración de reintentos
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 segundo
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      VERIFY: '/auth/verify',
      PROFILE: '/auth/profile',
      ROLES: '/auth/roles',
    },
    LAB_RESULTS: {
      BASE: '/lab-results',
      CREATE: '/lab-results',
      UPDATE: '/lab-results',
      DELETE: '/lab-results',
    },
    PAYMENTS: {
      BASE: '/payments',
      CREATE: '/payments',
      UPDATE: '/payments',
    },
    USERS: {
      BASE: '/users',
      CREATE: '/users',
      UPDATE: '/users',
    },
    PATIENTS: {
      BASE: '/patients',
      CREATE: '/patients',
      UPDATE: '/patients',
      SEARCH: '/patients/search',
      BY_CODE: '/patients/code',
      BY_DPI: '/patients/dpi',
      STATISTICS: '/patients/statistics',
    }
  }
};

// Función para construir URLs completas
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Función para verificar si el backend está disponible
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
      method: 'GET',
      timeout: 5000,
    });
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

export default API_CONFIG;
