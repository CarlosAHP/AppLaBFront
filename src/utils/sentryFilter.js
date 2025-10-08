// Filtro para prevenir spam de peticiones a Sentry

class SentryFilter {
  constructor() {
    this.blockedDomains = [
      'sentry.io',
      'ingest.us.sentry.io',
      'ingest.sentry.io',
      'o1100188.ingest.us.sentry.io'
    ];
    
    this.requestCounts = new Map();
    this.maxRequestsPerMinute = 2; // Máximo 2 peticiones por minuto a Sentry para evitar 429
    this.cleanupInterval = 60000; // Limpiar cada minuto
    
    this.startCleanup();
  }

  shouldBlock(url) {
    if (!url) return false;
    
    // Verificar si la URL contiene dominios de Sentry
    const isSentryDomain = this.blockedDomains.some(domain => 
      url.includes(domain)
    );
    
    if (!isSentryDomain) return false;
    
    // Contar peticiones por minuto
    const now = Date.now();
    const minute = Math.floor(now / 60000);
    const key = `${minute}`;
    
    const currentCount = this.requestCounts.get(key) || 0;
    
    if (currentCount >= this.maxRequestsPerMinute) {
      console.warn(`Blocking Sentry request to prevent spam: ${url}`);
      return true;
    }
    
    this.requestCounts.set(key, currentCount + 1);
    return false;
  }

  startCleanup() {
    setInterval(() => {
      const now = Date.now();
      const currentMinute = Math.floor(now / 60000);
      
      // Eliminar contadores de minutos anteriores
      for (const [key] of this.requestCounts.entries()) {
        if (parseInt(key) < currentMinute - 1) {
          this.requestCounts.delete(key);
        }
      }
    }, this.cleanupInterval);
  }

  getStats() {
    const now = Date.now();
    const currentMinute = Math.floor(now / 60000);
    const currentCount = this.requestCounts.get(currentMinute.toString()) || 0;
    
    return {
      currentMinute,
      requestsThisMinute: currentCount,
      maxRequestsPerMinute: this.maxRequestsPerMinute,
      blockedDomains: this.blockedDomains
    };
  }
}

// Instancia global del filtro
const sentryFilter = new SentryFilter();

// Interceptar fetch globalmente
const originalFetch = window.fetch;
window.fetch = function(url, options) {
  if (sentryFilter.shouldBlock(url)) {
    return Promise.reject(new Error('Sentry request blocked to prevent spam'));
  }
  return originalFetch.call(this, url, options);
};

// Interceptar XMLHttpRequest globalmente
const originalXHROpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url, ...args) {
  if (sentryFilter.shouldBlock(url)) {
    throw new Error('Sentry request blocked to prevent spam');
  }
  return originalXHROpen.call(this, method, url, ...args);
};

// Función para obtener estadísticas del filtro
export const getSentryFilterStats = () => {
  return sentryFilter.getStats();
};

// Función para limpiar el filtro
export const clearSentryFilter = () => {
  sentryFilter.requestCounts.clear();
  console.log('Sentry filter cleared');
};

export default sentryFilter;
