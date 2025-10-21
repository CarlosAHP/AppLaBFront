// Configuración de endpoints de API
const API_CONFIG = {
  // Backend Flask para interpretación médica
  MEDICAL_API_BASE_URL: 'http://localhost:5000',
  
  // Endpoints específicos
  MEDICAL_INTERPRET: '/api/medical-interpret',
  MEDICAL_HEALTH: '/api/medical-interpret/health',
  MEDICAL_RANGES: '/api/medical-interpret/ranges',
  
  // Configuración de desarrollo
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
};

// Función para obtener URL completa
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.MEDICAL_API_BASE_URL}${endpoint}`;
};

// URLs predefinidas
export const API_URLS = {
  MEDICAL_INTERPRET: getApiUrl(API_CONFIG.MEDICAL_INTERPRET),
  MEDICAL_HEALTH: getApiUrl(API_CONFIG.MEDICAL_HEALTH),
  MEDICAL_RANGES: getApiUrl(API_CONFIG.MEDICAL_RANGES),
};

export default API_CONFIG;

