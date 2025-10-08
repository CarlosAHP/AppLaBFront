import { useState, useCallback } from 'react';

export const useRateLimit = () => {
  const [rateLimitError, setRateLimitError] = useState(null);
  const [retryAfter, setRetryAfter] = useState(0);

  const handleRateLimitError = useCallback((error) => {
    if (error.response?.status === 429) {
      const retryAfterHeader = error.response.headers['retry-after'];
      const retryAfterSeconds = retryAfterHeader ? parseInt(retryAfterHeader) : 30;
      
      setRetryAfter(retryAfterSeconds);
      setRateLimitError({
        message: error.message || 'Demasiadas solicitudes',
        retryAfter: retryAfterSeconds,
        timestamp: Date.now()
      });
      
      return true;
    }
    return false;
  }, []);

  const clearRateLimitError = useCallback(() => {
    setRateLimitError(null);
    setRetryAfter(0);
  }, []);

  const isRateLimited = rateLimitError !== null;

  return {
    rateLimitError,
    retryAfter,
    isRateLimited,
    handleRateLimitError,
    clearRateLimitError
  };
};

export default useRateLimit;
