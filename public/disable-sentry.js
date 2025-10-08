// Script para deshabilitar completamente Sentry
// Este script se ejecuta antes que cualquier otro código

(function() {
  'use strict';
  
  console.log('[Sentry Disabler] Deshabilitando Sentry completamente...');
  
  // Lista de dominios de Sentry
  const SENTRY_DOMAINS = [
    'sentry.io',
    'ingest.us.sentry.io',
    'ingest.sentry.io',
    'o1100188.ingest.us.sentry.io',
    'browser.sentry-cdn.com',
    'js.sentry-cdn.com',
    'sentry-cdn.com'
  ];
  
  // Función para verificar si una URL es de Sentry
  function isSentryUrl(url) {
    if (!url) return false;
    return SENTRY_DOMAINS.some(domain => url.includes(domain));
  }
  
  // Bloquear fetch
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    if (isSentryUrl(url)) {
      console.warn('[Sentry Disabler] Bloqueando fetch a:', url);
      return Promise.reject(new Error('Sentry request blocked'));
    }
    return originalFetch.call(this, url, options);
  };
  
  // Bloquear XMLHttpRequest
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;
  
  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    this._url = url;
    if (isSentryUrl(url)) {
      console.warn('[Sentry Disabler] Bloqueando XHR a:', url);
      throw new Error('Sentry request blocked');
    }
    return originalXHROpen.call(this, method, url, ...args);
  };
  
  XMLHttpRequest.prototype.send = function(data) {
    if (this._url && isSentryUrl(this._url)) {
      console.warn('[Sentry Disabler] Bloqueando XHR send a:', this._url);
      return;
    }
    return originalXHRSend.call(this, data);
  };
  
  // Bloquear también las peticiones de extensiones
  if (window.chrome && window.chrome.runtime) {
    const originalSendMessage = window.chrome.runtime.sendMessage;
    window.chrome.runtime.sendMessage = function(...args) {
      const message = args[0];
      if (message && typeof message === 'object' && message.url && isSentryUrl(message.url)) {
        console.warn('[Sentry Disabler] Bloqueando chrome.runtime.sendMessage a:', message.url);
        return Promise.reject(new Error('Sentry request blocked'));
      }
      return originalSendMessage.apply(this, args);
    };
  }
  
  console.log('[Sentry Disabler] Sentry completamente deshabilitado');
})();
