/**
 * Configuración para el servicio de pacientes
 */

export const PATIENT_CONFIG = {
  // Usar servicio mock solo si se especifica explícitamente
  // Por defecto, usar el backend real
  USE_MOCK: process.env.REACT_APP_USE_PATIENT_MOCK === 'true',
  
  // URL del backend
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  
  // Configuración de búsqueda
  SEARCH: {
    MIN_QUERY_LENGTH: 2,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100
  },
  
  // Configuración de paginación
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 50
  },
  
  // Configuración de validación
  VALIDATION: {
    DPI_LENGTH: 13,
    REQUIRED_FIELDS: ['first_name', 'last_name']
  }
};

export default PATIENT_CONFIG;
