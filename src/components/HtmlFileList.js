/**
 * Componente principal para mostrar la lista de archivos HTML
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import HtmlFileCard from './HtmlFileCard';
import htmlFileService from '../services/htmlFileService';
import LoadingSpinner from './LoadingSpinner';

const HtmlFileList = ({ status = 'pending', title = 'Archivos', onEditFile }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const loadFiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (status === 'pending') {
        response = await htmlFileService.getPendingFiles(20);
      } else if (status === 'completed') {
        response = await htmlFileService.getCompletedFiles(20);
      }
      
      if (response.success) {
        setFiles(response.data);
        console.log(`✅ ${status} files loaded:`, response.data.length);
      } else {
        setError('Error al cargar archivos');
      }
    } catch (err) {
      console.error(`❌ Error loading ${status} files:`, err);
      
      // Manejar errores específicos de autenticación
      if (err.message.includes('token') || err.message.includes('autenticación')) {
        setError('Error de autenticación. Por favor, inicia sesión nuevamente.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [status]);

  const loadStats = useCallback(async () => {
    try {
      const response = await htmlFileService.getStatusStats();
      if (response.success) {
        setStats(response.data);
        console.log('✅ Stats loaded:', response.data);
      }
    } catch (err) {
      console.error('❌ Error loading stats:', err);
      // No mostrar error de stats en la UI, solo en consola
    }
  }, []);

  useEffect(() => {
    loadFiles();
    loadStats();
  }, [loadFiles, loadStats]);

  const handleStatusChange = async (filename, newStatus) => {
    try {
      const response = await htmlFileService.updateFileStatus(filename, newStatus);
      if (response.success) {
        console.log(`✅ File ${filename} status changed to ${newStatus}`);
        // Recargar archivos
        await loadFiles();
        await loadStats();
      }
    } catch (err) {
      console.error('❌ Error changing status:', err);
      throw err;
    }
  };

  const handleDelete = async (filename) => {
    try {
      await htmlFileService.deleteFile(filename);
      console.log(`✅ File ${filename} deleted`);
      // Recargar archivos
      await loadFiles();
      await loadStats();
    } catch (err) {
      console.error('❌ Error deleting file:', err);
      throw err;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'cancelled': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600';
      case 'completed': return 'text-green-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner />
        <span className="ml-2">Cargando archivos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <strong>Error:</strong> {error}
        </div>
        <button
          onClick={loadFiles}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header con estadísticas */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center space-x-2 mb-4">
          {getStatusIcon(status)}
          <h2 className={`text-2xl font-bold ${getStatusColor(status)}`}>
            {title}
          </h2>
        </div>
        
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-100 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.total_files}</div>
              <div className="text-sm text-blue-800">Total Archivos</div>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending_count}</div>
              <div className="text-sm text-yellow-800">Pendientes</div>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.completed_count}</div>
              <div className="text-sm text-green-800">Completados</div>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.cancelled_count}</div>
              <div className="text-sm text-red-800">Cancelados</div>
            </div>
          </div>
        )}
      </div>

      {/* Lista de archivos */}
      {files.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">📄</div>
          <p>No hay archivos {status === 'pending' ? 'pendientes' : 'completados'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <HtmlFileCard
              key={index}
              file={file}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onEdit={onEditFile}
              showStatusChange={status === 'pending'}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HtmlFileList;
