// Configuración de desarrollo y debugging
export const DEV_CONFIG = {
  // Habilitar logs detallados en desarrollo
  ENABLE_DEBUG_LOGS: process.env.NODE_ENV === 'development',
  
  // Mostrar información de red en la consola
  LOG_NETWORK_REQUESTS: true,
  
  // Mostrar información de autenticación
  LOG_AUTH_EVENTS: true,
  
  // Simular errores para testing
  SIMULATE_ERRORS: false,
  
  // Configuración de timeouts para desarrollo
  TIMEOUTS: {
    API_REQUEST: 10000, // 10 segundos
    LOGIN_TIMEOUT: 5000, // 5 segundos
    HEALTH_CHECK: 3000, // 3 segundos
  },
  
  // URLs de desarrollo
  DEVELOPMENT_URLS: {
    BACKEND: 'http://localhost:5000',
    FRONTEND: 'http://localhost:3000',
    API_BASE: 'http://localhost:5000/api'
  }
};

// Función para logging condicional
export const debugLog = (message, data = null) => {
  if (DEV_CONFIG.ENABLE_DEBUG_LOGS) {
    console.log(`[DEBUG] ${message}`, data || '');
  }
};

// Función para logging de red
export const networkLog = (method, url, status, data = null) => {
  if (DEV_CONFIG.LOG_NETWORK_REQUESTS) {
    const statusColor = status >= 200 && status < 300 ? '🟢' : 
                       status >= 400 ? '🔴' : '🟡';
    console.log(`${statusColor} ${method} ${url} - ${status}`, data || '');
  }
};

// Función para logging de autenticación
export const authLog = (event, data = null) => {
  if (DEV_CONFIG.LOG_AUTH_EVENTS) {
    console.log(`🔐 [AUTH] ${event}`, data || '');
  }
};

// Función para simular errores en desarrollo
export const simulateError = (errorType) => {
  if (DEV_CONFIG.SIMULATE_ERRORS) {
    switch (errorType) {
      case 'NETWORK':
        throw new Error('Simulated network error');
      case 'AUTH':
        throw new Error('Simulated authentication error');
      case 'CORS':
        throw new Error('Simulated CORS error');
      default:
        throw new Error('Simulated error');
    }
  }
};

// Función para verificar configuración de desarrollo
export const checkDevConfig = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🚀 Modo de desarrollo activado');
    console.log('📊 Configuración de debugging:', {
      debugLogs: DEV_CONFIG.ENABLE_DEBUG_LOGS,
      networkLogs: DEV_CONFIG.LOG_NETWORK_REQUESTS,
      authLogs: DEV_CONFIG.LOG_AUTH_EVENTS,
      simulateErrors: DEV_CONFIG.SIMULATE_ERRORS
    });
    console.log('🌐 URLs de desarrollo:', DEV_CONFIG.DEVELOPMENT_URLS);
  }
};

export default DEV_CONFIG;
