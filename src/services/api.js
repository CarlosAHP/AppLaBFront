import axios from 'axios';
import { API_CONFIG } from '../config/api';
import { debugLog, networkLog, checkDevConfig } from '../config/development';

// Sistema de rate limiting y reintentos
class RateLimiter {
  constructor() {
    this.requests = new Map();
    this.retryDelays = [1000, 2000, 4000]; // Delays en ms: 1s, 2s, 4s
  }

  shouldRetry(url, retryCount) {
    const now = Date.now();
    const key = url;
    const lastRequest = this.requests.get(key) || 0;
    
    // Si han pasado menos de 2 segundos desde la última petición, esperar
    if (now - lastRequest < 2000) {
      return false;
    }
    
    // Limitar reintentos
    return retryCount < this.retryDelays.length;
  }

  getRetryDelay(retryCount) {
    return this.retryDelays[retryCount] || 5000;
  }

  recordRequest(url) {
    this.requests.set(url, Date.now());
  }

  clearOldRequests() {
    const now = Date.now();
    for (const [url, timestamp] of this.requests.entries()) {
      if (now - timestamp > 60000) { // Limpiar requests de más de 1 minuto
        this.requests.delete(url);
      }
    }
  }
}

const rateLimiter = new RateLimiter();

// Crear instancia de axios
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Registrar la petición para rate limiting
    rateLimiter.recordRequest(config.url);
    
    debugLog(`Making ${config.method?.toUpperCase()} request to ${config.url}`, {
      headers: config.headers,
      data: config.data,
      retryCount: config.retryCount || 0
    });
    
    return config;
  },
  (error) => {
    debugLog('Request interceptor error', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    networkLog(
      response.config.method?.toUpperCase() || 'GET',
      response.config.url || '',
      response.status,
      response.data
    );
    
    // Limpiar requests antiguos cada 10 respuestas exitosas
    if (Math.random() < 0.1) {
      rateLimiter.clearOldRequests();
    }
    
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const url = error.config?.url || 'unknown';
    const method = error.config?.method?.toUpperCase() || 'GET';
    const retryCount = error.config?.retryCount || 0;
    
    // Filtrar errores de Sentry para evitar spam
    if (url.includes('sentry.io') || url.includes('ingest.us.sentry.io')) {
      debugLog('Sentry error filtered out to prevent spam', { url, status });
      return Promise.reject(error);
    }
    
    networkLog(method, url, status || 'ERROR', error.message);
    
    // Manejar error 429 con reintentos automáticos
    if (status === 429) {
      debugLog(`Rate limit hit for ${url}, retry count: ${retryCount}`);
      
      if (rateLimiter.shouldRetry(url, retryCount)) {
        const delay = rateLimiter.getRetryDelay(retryCount);
        debugLog(`Retrying request to ${url} in ${delay}ms`);
        
        // Esperar antes del reintento
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Crear nueva configuración con contador de reintentos
        const newConfig = {
          ...error.config,
          retryCount: retryCount + 1
        };
        
        rateLimiter.recordRequest(url);
        return api.request(newConfig);
      } else {
        console.error('Demasiadas solicitudes. Intenta de nuevo más tarde.');
        error.message = 'Demasiadas solicitudes. Espera un momento antes de intentar de nuevo.';
      }
    } else if (status === 401) {
      // Token expirado o inválido
      debugLog('Token expired or invalid, redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
      // Error de red o CORS
      console.error('Error de conexión con el servidor. Verifica que el backend esté ejecutándose.');
    }
    
    debugLog('Response error', {
      status,
      message: error.message,
      url,
      method,
      retryCount
    });
    
    return Promise.reject(error);
  }
);

// Inicializar configuración de desarrollo
checkDevConfig();

export default api;
