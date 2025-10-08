// Solución definitiva para bloquear Sentry completamente
// Este archivo intercepta y bloquea TODAS las peticiones a Sentry

console.log('[Sentry Killer] Iniciando bloqueo completo de Sentry...');

// Lista completa de dominios de Sentry
const SENTRY_DOMAINS = [
  'sentry.io',
  'ingest.us.sentry.io',
  'ingest.sentry.io',
  'o1100188.ingest.us.sentry.io',
  'browser.sentry-cdn.com',
  'js.sentry-cdn.com',
  'sentry-cdn.com',
  'sentry.io/api',
  'ingest.sentry.io/api'
];

// Función para verificar si una URL es de Sentry
const isSentryUrl = (url) => {
  if (!url) return false;
  return SENTRY_DOMAINS.some(domain => url.includes(domain));
};

// Bloquear fetch completamente
const originalFetch = window.fetch;
window.fetch = function(url, options) {
  if (isSentryUrl(url)) {
    console.warn(`[Sentry Killer] BLOQUEANDO fetch a: ${url}`);
    return Promise.reject(new Error('Sentry request blocked by Sentry Killer'));
  }
  return originalFetch.call(this, url, options);
};

// Bloquear XMLHttpRequest completamente
const originalXHROpen = XMLHttpRequest.prototype.open;
const originalXHRSend = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.open = function(method, url, ...args) {
  this._url = url;
  if (isSentryUrl(url)) {
    console.warn(`[Sentry Killer] BLOQUEANDO XHR a: ${url}`);
    throw new Error('Sentry request blocked by Sentry Killer');
  }
  return originalXHROpen.call(this, method, url, ...args);
};

XMLHttpRequest.prototype.send = function(data) {
  if (this._url && isSentryUrl(this._url)) {
    console.warn(`[Sentry Killer] BLOQUEANDO XHR send a: ${this._url}`);
    return;
  }
  return originalXHRSend.call(this, data);
};

// Bloquear también las peticiones de extensiones del navegador
if (window.chrome && window.chrome.runtime) {
  const originalSendMessage = window.chrome.runtime.sendMessage;
  window.chrome.runtime.sendMessage = function(...args) {
    const message = args[0];
    if (message && typeof message === 'object' && message.url && isSentryUrl(message.url)) {
      console.warn(`[Sentry Killer] BLOQUEANDO chrome.runtime.sendMessage a: ${message.url}`);
      return Promise.reject(new Error('Sentry request blocked by Sentry Killer'));
    }
    return originalSendMessage.apply(this, args);
  };
}

// Bloquear también fetch de workers
// eslint-disable-next-line no-restricted-globals, no-undef
if (typeof WorkerGlobalScope !== 'undefined' && typeof self !== 'undefined' && self instanceof WorkerGlobalScope) {
  // eslint-disable-next-line no-restricted-globals
  const originalWorkerFetch = self.fetch;
  // eslint-disable-next-line no-restricted-globals
  self.fetch = function(url, options) {
    if (isSentryUrl(url)) {
      console.warn(`[Sentry Killer] BLOQUEANDO worker fetch a: ${url}`);
      return Promise.reject(new Error('Sentry request blocked by Sentry Killer'));
    }
    return originalWorkerFetch.call(this, url, options);
  };
}

// Interceptar también las peticiones de contenido script
const originalPostMessage = window.postMessage;
window.postMessage = function(message, targetOrigin, transfer) {
  if (message && typeof message === 'object' && message.url && isSentryUrl(message.url)) {
    console.warn(`[Sentry Killer] BLOQUEANDO postMessage a: ${message.url}`);
    return;
  }
  return originalPostMessage.call(this, message, targetOrigin, transfer);
};

// Bloquear también las peticiones de Service Workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.url && isSentryUrl(event.data.url)) {
      console.warn(`[Sentry Killer] BLOQUEANDO service worker message a: ${event.data.url}`);
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

// Estadísticas de bloqueo
let blockedCount = 0;
const originalConsoleWarn = console.warn;
console.warn = function(...args) {
  if (args[0] && args[0].includes('[Sentry Killer] BLOQUEANDO')) {
    blockedCount++;
  }
  return originalConsoleWarn.apply(this, args);
};

// Función para obtener estadísticas
export const getSentryKillerStats = () => {
  return {
    blockedCount,
    domains: SENTRY_DOMAINS,
    isActive: true
  };
};

// Función para limpiar estadísticas
export const clearSentryKillerStats = () => {
  blockedCount = 0;
  console.log('[Sentry Killer] Estadísticas limpiadas');
};

console.log('[Sentry Killer] Bloqueo completo de Sentry activado');
console.log('[Sentry Killer] Dominios bloqueados:', SENTRY_DOMAINS);

const sentryKillerUtils = {
  isSentryUrl,
  getSentryKillerStats,
  clearSentryKillerStats,
  SENTRY_DOMAINS
};

export default sentryKillerUtils;
