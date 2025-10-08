// Bloqueador agresivo de Sentry para desarrollo
// Este archivo bloquea completamente las peticiones a Sentry para evitar errores 429

const SENTRY_DOMAINS = [
  'sentry.io',
  'ingest.us.sentry.io',
  'ingest.sentry.io',
  'o1100188.ingest.us.sentry.io',
  'browser.sentry-cdn.com',
  'js.sentry-cdn.com'
];

// Función para verificar si una URL es de Sentry
const isSentryUrl = (url) => {
  if (!url) return false;
  return SENTRY_DOMAINS.some(domain => url.includes(domain));
};

// Bloquear fetch
const originalFetch = window.fetch;
window.fetch = function(url, options) {
  if (isSentryUrl(url)) {
    console.warn(`[Sentry Blocker] Blocked fetch request to: ${url}`);
    return Promise.reject(new Error('Sentry request blocked in development'));
  }
  return originalFetch.call(this, url, options);
};

// Bloquear XMLHttpRequest
const originalXHROpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url, ...args) {
  if (isSentryUrl(url)) {
    console.warn(`[Sentry Blocker] Blocked XHR request to: ${url}`);
    throw new Error('Sentry request blocked in development');
  }
  return originalXHROpen.call(this, method, url, ...args);
};

// Bloquear send de XMLHttpRequest
const originalXHRSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function(data) {
  if (this._url && isSentryUrl(this._url)) {
    console.warn(`[Sentry Blocker] Blocked XHR send to: ${this._url}`);
    return;
  }
  return originalXHRSend.call(this, data);
};

// Interceptar el open para capturar la URL
XMLHttpRequest.prototype.open = function(method, url, ...args) {
  this._url = url;
  if (isSentryUrl(url)) {
    console.warn(`[Sentry Blocker] Blocked XHR request to: ${url}`);
    throw new Error('Sentry request blocked in development');
  }
  return originalXHROpen.call(this, method, url, ...args);
};

console.log('[Sentry Blocker] Sentry requests are now blocked in development mode');

const sentryBlockUtils = {
  isSentryUrl,
  SENTRY_DOMAINS
};

export default sentryBlockUtils;
