import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, RefreshCw, X } from 'lucide-react';

const RateLimitNotification = ({ onClose, retryAfter = 0 }) => {
  const [countdown, setCountdown] = useState(retryAfter);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Esperar a que termine la animación
  };

  const handleRetry = () => {
    if (countdown === 0) {
      window.location.reload();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 animate-slide-in">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-red-800">
              Demasiadas solicitudes
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>
                Has realizado demasiadas solicitudes al servidor. 
                Por favor, espera un momento antes de intentar de nuevo.
              </p>
              
              {countdown > 0 && (
                <div className="mt-3 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Puedes intentar de nuevo en: {countdown}s</span>
                </div>
              )}
            </div>
            
            <div className="mt-4 flex space-x-3">
              <button
                onClick={handleRetry}
                disabled={countdown > 0}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  countdown > 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {countdown > 0 ? 'Esperando...' : 'Reintentar'}
              </button>
              
              <button
                onClick={handleClose}
                className="px-3 py-2 text-sm font-medium text-red-700 hover:text-red-800 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
          
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={handleClose}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateLimitNotification;
