import React, { useState, useEffect } from 'react';
import { checkBackendHealth, API_CONFIG } from '../config/api';
import { getSentryFilterStats } from '../utils/sentryFilter';
import { 
  Wifi, 
  WifiOff, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  RefreshCw,
  Server,
  Clock,
  Shield
} from 'lucide-react';

const ConnectionDiagnostic = ({ onClose }) => {
  const [diagnostics, setDiagnostics] = useState({
    backendHealth: null,
    networkStatus: null,
    corsStatus: null,
    sentryStatus: null,
    lastCheck: null
  });
  const [isChecking, setIsChecking] = useState(false);

  const runDiagnostics = async () => {
    setIsChecking(true);
    const results = {
      backendHealth: null,
      networkStatus: null,
      corsStatus: null,
      sentryStatus: null,
      lastCheck: new Date().toLocaleTimeString()
    };

    try {
      // Verificar conectividad de red
      results.networkStatus = navigator.onLine ? 'online' : 'offline';

      // Verificar salud del backend
      const healthCheck = await checkBackendHealth();
      results.backendHealth = healthCheck ? 'healthy' : 'unhealthy';

      // Verificar CORS (intentando hacer una petición simple)
      try {
        const corsTest = await fetch(`${API_CONFIG.BASE_URL}/auth/roles`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        results.corsStatus = corsTest.ok ? 'working' : 'blocked';
      } catch (corsError) {
        results.corsStatus = 'blocked';
      }

      // Verificar estado del filtro de Sentry
      const sentryStats = getSentryFilterStats();
      results.sentryStatus = sentryStats.requestsThisMinute > 0 ? 'active' : 'inactive';

    } catch (error) {
      console.error('Diagnostic error:', error);
      results.backendHealth = 'error';
      results.corsStatus = 'error';
      results.sentryStatus = 'error';
    }

    setDiagnostics(results);
    setIsChecking(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
      case 'online':
      case 'working':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'unhealthy':
      case 'offline':
      case 'blocked':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'healthy': return 'Backend funcionando correctamente';
      case 'unhealthy': return 'Backend no responde';
      case 'online': return 'Conexión a internet activa';
      case 'offline': return 'Sin conexión a internet';
      case 'working': return 'CORS configurado correctamente';
      case 'blocked': return 'CORS bloqueado';
      case 'active': return 'Filtro de Sentry activo';
      case 'inactive': return 'Filtro de Sentry inactivo';
      case 'error': return 'Error en la verificación';
      default: return 'Verificando...';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
      case 'online':
      case 'working':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'unhealthy':
      case 'offline':
      case 'blocked':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'active':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'inactive':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'error':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Server className="h-6 w-6 mr-2" />
              Diagnóstico de Conexión
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            {/* Estado de Red */}
            <div className={`p-4 rounded-lg border ${getStatusColor(diagnostics.networkStatus)}`}>
              <div className="flex items-center">
                {diagnostics.networkStatus === 'online' ? (
                  <Wifi className="h-5 w-5 mr-2" />
                ) : (
                  <WifiOff className="h-5 w-5 mr-2" />
                )}
                <div>
                  <p className="font-medium">Estado de Red</p>
                  <p className="text-sm">{getStatusText(diagnostics.networkStatus)}</p>
                </div>
                {getStatusIcon(diagnostics.networkStatus)}
              </div>
            </div>

            {/* Estado del Backend */}
            <div className={`p-4 rounded-lg border ${getStatusColor(diagnostics.backendHealth)}`}>
              <div className="flex items-center">
                <Server className="h-5 w-5 mr-2" />
                <div>
                  <p className="font-medium">Backend</p>
                  <p className="text-sm">{getStatusText(diagnostics.backendHealth)}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    URL: {API_CONFIG.BASE_URL}
                  </p>
                </div>
                {getStatusIcon(diagnostics.backendHealth)}
              </div>
            </div>

            {/* Estado de CORS */}
            <div className={`p-4 rounded-lg border ${getStatusColor(diagnostics.corsStatus)}`}>
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <div>
                  <p className="font-medium">CORS</p>
                  <p className="text-sm">{getStatusText(diagnostics.corsStatus)}</p>
                </div>
                {getStatusIcon(diagnostics.corsStatus)}
              </div>
            </div>

            {/* Estado de Sentry */}
            <div className={`p-4 rounded-lg border ${getStatusColor(diagnostics.sentryStatus)}`}>
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                <div>
                  <p className="font-medium">Filtro Sentry</p>
                  <p className="text-sm">{getStatusText(diagnostics.sentryStatus)}</p>
                  {diagnostics.sentryStatus === 'active' && (
                    <p className="text-xs text-yellow-600 mt-1">
                      Bloqueando peticiones excesivas
                    </p>
                  )}
                </div>
                {getStatusIcon(diagnostics.sentryStatus)}
              </div>
            </div>
          </div>

          {/* Información de ayuda */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-2">Soluciones comunes:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Verifica que el backend esté ejecutándose en el puerto 5002</li>
              <li>• Asegúrate de que CORS esté configurado en el backend</li>
              <li>• Revisa la consola del navegador para más detalles</li>
              <li>• Intenta reiniciar tanto el frontend como el backend</li>
            </ul>
          </div>

          {/* Botones */}
          <div className="flex space-x-3">
            <button
              onClick={runDiagnostics}
              disabled={isChecking}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChecking ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Verificar de Nuevo
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cerrar
            </button>
          </div>

          {diagnostics.lastCheck && (
            <p className="text-xs text-gray-500 text-center mt-4">
              Última verificación: {diagnostics.lastCheck}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionDiagnostic;
