// Utilidades para manejar rate limiting

export const clearRateLimitState = () => {
  // Limpiar localStorage de intentos de login
  const loginAttempts = localStorage.getItem('loginAttempts');
  if (loginAttempts) {
    const attempts = JSON.parse(loginAttempts);
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    
    // Mantener solo intentos de la última hora
    const recentAttempts = attempts.filter(attempt => attempt.timestamp > oneHourAgo);
    
    if (recentAttempts.length === 0) {
      localStorage.removeItem('loginAttempts');
    } else {
      localStorage.setItem('loginAttempts', JSON.stringify(recentAttempts));
    }
  }
};

export const recordLoginAttempt = (username, success = false) => {
  const attempts = JSON.parse(localStorage.getItem('loginAttempts') || '[]');
  const now = Date.now();
  
  attempts.push({
    username,
    success,
    timestamp: now
  });
  
  // Mantener solo los últimos 10 intentos
  if (attempts.length > 10) {
    attempts.splice(0, attempts.length - 10);
  }
  
  localStorage.setItem('loginAttempts', JSON.stringify(attempts));
};

export const getLoginAttempts = (username, timeWindow = 15 * 60 * 1000) => {
  const attempts = JSON.parse(localStorage.getItem('loginAttempts') || '[]');
  const now = Date.now();
  const windowStart = now - timeWindow;
  
  return attempts.filter(attempt => 
    attempt.username === username && 
    attempt.timestamp > windowStart &&
    !attempt.success
  );
};

export const isRateLimited = (username, maxAttempts = 5, timeWindow = 15 * 60 * 1000) => {
  const attempts = getLoginAttempts(username, timeWindow);
  return attempts.length >= maxAttempts;
};

export const getRateLimitInfo = (username) => {
  const attempts = getLoginAttempts(username);
  const maxAttempts = 5;
  const timeWindow = 15 * 60 * 1000; // 15 minutos
  
  if (attempts.length === 0) {
    return {
      isLimited: false,
      remainingAttempts: maxAttempts,
      resetTime: null
    };
  }
  
  const oldestAttempt = Math.min(...attempts.map(a => a.timestamp));
  const resetTime = oldestAttempt + timeWindow;
  const remainingAttempts = Math.max(0, maxAttempts - attempts.length);
  
  return {
    isLimited: attempts.length >= maxAttempts,
    remainingAttempts,
    resetTime: resetTime > Date.now() ? resetTime : null
  };
};

export const formatTimeRemaining = (timestamp) => {
  if (!timestamp) return null;
  
  const now = Date.now();
  const remaining = timestamp - now;
  
  if (remaining <= 0) return null;
  
  const minutes = Math.floor(remaining / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
  
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  
  return `${seconds}s`;
};

const rateLimitUtils = {
  clearRateLimitState,
  recordLoginAttempt,
  getLoginAttempts,
  isRateLimited,
  getRateLimitInfo,
  formatTimeRemaining
};

export default rateLimitUtils;
