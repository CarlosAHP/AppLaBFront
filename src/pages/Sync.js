import React, { useState, useEffect } from 'react';
import { syncService } from '../services/syncService';
import { 
  RefreshCw as SyncIcon, 
  RefreshCw,
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Cloud, 
  Database,
  Activity,
  Server
} from 'lucide-react';
import toast from 'react-hot-toast';

const Sync = () => {
  const [syncStatus, setSyncStatus] = useState({
    isOnline: false,
    lastSync: null,
    syncInProgress: false,
    totalRecords: 0,
    syncedRecords: 0,
    errors: []
  });
  const [loading, setLoading] = useState(true);
  const [syncLogs, setSyncLogs] = useState([]);

  useEffect(() => {
    loadSyncStatus();
    // Verificar estado cada 30 segundos
    const interval = setInterval(loadSyncStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSyncStatus = async () => {
    try {
      setLoading(true);
      const response = await syncService.getSyncStatus();
      
      if (response.success) {
        setSyncStatus({
          isOnline: response.data?.is_online || false,
          lastSync: response.data?.last_sync || null,
          syncInProgress: response.data?.sync_in_progress || false,
          totalRecords: response.data?.total_records || 0,
          syncedRecords: response.data?.synced_records || 0,
          errors: response.data?.errors || []
        });
        setSyncLogs(response.data?.logs || []);
      }
    } catch (error) {
      console.error('Error loading sync status:', error);
      setSyncStatus(prev => ({
        ...prev,
        isOnline: false,
        errors: [error.message || 'Error de conexión']
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncStatus(prev => ({ ...prev, syncInProgress: true }));
      toast.loading('Iniciando sincronización...', { id: 'sync' });
      
      const response = await syncService.triggerSync();
      
      if (response.success) {
        toast.success('Sincronización iniciada exitosamente', { id: 'sync' });
        // Recargar estado después de un breve delay
        setTimeout(loadSyncStatus, 2000);
      } else {
        toast.error('Error al iniciar sincronización', { id: 'sync' });
      }
    } catch (error) {
      toast.error('Error al iniciar sincronización', { id: 'sync' });
      console.error('Sync error:', error);
    } finally {
      setSyncStatus(prev => ({ ...prev, syncInProgress: false }));
    }
  };

  const getStatusIcon = () => {
    if (syncStatus.syncInProgress) {
      return <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />;
    }
    if (syncStatus.isOnline) {
      return <CheckCircle className="h-6 w-6 text-green-600" />;
    }
    return <AlertCircle className="h-6 w-6 text-red-600" />;
  };

  const getStatusText = () => {
    if (syncStatus.syncInProgress) {
      return 'Sincronizando...';
    }
    if (syncStatus.isOnline) {
      return 'Conectado';
    }
    return 'Desconectado';
  };

  const getStatusColor = () => {
    if (syncStatus.syncInProgress) {
      return 'text-blue-600';
    }
    if (syncStatus.isOnline) {
      return 'text-green-600';
    }
    return 'text-red-600';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleString('es-ES');
  };

  const getSyncProgress = () => {
    if (syncStatus.totalRecords === 0) return 0;
    return Math.round((syncStatus.syncedRecords / syncStatus.totalRecords) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sincronización de Datos</h1>
          <p className="text-gray-600 mt-1">Estado de la sincronización con la nube</p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncStatus.syncInProgress}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SyncIcon className="h-5 w-5 mr-2" />
          {syncStatus.syncInProgress ? 'Sincronizando...' : 'Sincronizar Ahora'}
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              {getStatusIcon()}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Estado</p>
              <p className={`text-lg font-semibold ${getStatusColor()}`}>
                {getStatusText()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Cloud className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Última Sincronización</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(syncStatus.lastSync)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Database className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Registros Totales</p>
              <p className="text-lg font-semibold text-gray-900">
                {syncStatus.totalRecords}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Activity className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Progreso</p>
              <p className="text-lg font-semibold text-gray-900">
                {getSyncProgress()}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Progreso de Sincronización</h3>
          <span className="text-sm text-gray-600">
            {syncStatus.syncedRecords} de {syncStatus.totalRecords} registros
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getSyncProgress()}%` }}
          ></div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Server className="h-8 w-8 text-gray-400 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Estado de Conexión</h3>
              <p className="text-sm text-gray-600">
                {syncStatus.isOnline 
                  ? 'Conectado al servidor de sincronización' 
                  : 'Desconectado del servidor'
                }
              </p>
            </div>
          </div>
          <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            syncStatus.isOnline 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              syncStatus.isOnline ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            {syncStatus.isOnline ? 'En línea' : 'Sin conexión'}
          </div>
        </div>
      </div>

      {/* Error Logs */}
      {syncStatus.errors.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Errores de Sincronización</h3>
          </div>
          <div className="space-y-2">
            {syncStatus.errors.map((error, index) => (
              <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sync Logs */}
      {syncLogs.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Clock className="h-6 w-6 text-gray-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Historial de Sincronización</h3>
            </div>
            <button
              onClick={loadSyncStatus}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Actualizar
            </button>
          </div>
          <div className="space-y-3">
            {syncLogs.slice(0, 10).map((log, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    log.status === 'success' ? 'bg-green-500' : 
                    log.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{log.message}</p>
                    <p className="text-xs text-gray-600">{log.details}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {formatDate(log.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Sync Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <SyncIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Sincronización Manual
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                La sincronización automática se ejecuta cada 30 segundos. 
                Puedes forzar una sincronización manual haciendo clic en el botón "Sincronizar Ahora".
              </p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Los datos se sincronizan automáticamente con la nube</li>
                <li>Se mantiene un historial de todas las sincronizaciones</li>
                <li>Los errores se registran para su revisión</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sync;
