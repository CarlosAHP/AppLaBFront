import React, { useState, useEffect } from 'react';
import { X, Shield, AlertTriangle, CheckCircle, RefreshCw, Zap } from 'lucide-react';
import { getSentryKillerStats, clearSentryKillerStats } from '../utils/sentryKiller';

const SentryDiagnostic = ({ onClose }) => {
  const [sentryStatus, setSentryStatus] = useState({
    blocked: 0,
    allowed: 0,
    lastBlocked: null,
    killerStats: null
  });

  useEffect(() => {
    // Obtener estadísticas reales del Sentry Killer
    const updateStats = () => {
      const killerStats = getSentryKillerStats();
      setSentryStatus(prev => ({
        ...prev,
        blocked: killerStats.blockedCount,
        killerStats: killerStats
      }));
    };

    updateStats();
    const interval = setInterval(updateStats, 2000);

    return () => clearInterval(interval);
  }, []);

  const clearSentryLogs = () => {
    clearSentryKillerStats();
    setSentryStatus(prev => ({
      ...prev,
      blocked: 0,
      allowed: 0,
      lastBlocked: new Date().toLocaleTimeString()
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-blue-600" />
              Diagnóstico de Sentry
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Shield className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Filtro de Sentry Activo
                  </h3>
                  <p className="mt-1 text-sm text-blue-700">
                    Las peticiones a Sentry están siendo bloqueadas para evitar errores 429.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Zap className="h-5 w-5 text-purple-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-purple-800">
                    Sentry Killer Activo
                  </h3>
                  <p className="mt-1 text-sm text-purple-700">
                    Bloqueo agresivo de todas las peticiones a Sentry activado.
                  </p>
                  {sentryStatus.killerStats && (
                    <p className="mt-1 text-xs text-purple-600">
                      Dominios bloqueados: {sentryStatus.killerStats.domains.length}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Bloqueadas</p>
                    <p className="text-2xl font-bold text-red-600">{sentryStatus.blocked}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Permitidas</p>
                    <p className="text-2xl font-bold text-green-600">{sentryStatus.allowed}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Dominios Bloqueados:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• sentry.io</li>
                <li>• ingest.us.sentry.io</li>
                <li>• ingest.sentry.io</li>
                <li>• o1100188.ingest.us.sentry.io</li>
                <li>• browser.sentry-cdn.com</li>
                <li>• js.sentry-cdn.com</li>
              </ul>
            </div>

            {sentryStatus.lastBlocked && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Última petición bloqueada:</strong> {sentryStatus.lastBlocked}
                </p>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={clearSentryLogs}
                className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Limpiar Logs
              </button>
              <button
                onClick={onClose}
                className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentryDiagnostic;