/**
 * Componente para mostrar una tarjeta individual de archivo HTML
 */

import React, { useState, useCallback } from 'react';
import { Clock, CheckCircle, XCircle, Download, Trash2, Edit3, History } from 'lucide-react';
import { toast } from 'react-hot-toast';
import htmlFileService from '../services/htmlFileService';
import EditHistoryModal from './EditHistoryModal';

const HtmlFileCard = ({ file, onStatusChange, onDelete, onEdit, showStatusChange = false }) => {
  const [showViewer, setShowViewer] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);

  const metadata = file.metadata || {};
  const status = metadata.status || 'unknown';
  
  // Verificar si el archivo ha sido modificado
  const isModified = metadata.is_modified || false;
  const editCount = metadata.edit_count || 0;
  const lastEditedBy = metadata.last_edited_by;
  const lastEditDate = metadata.last_edit_date;
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (onStatusChange) {
      setLoading(true);
      try {
        await onStatusChange(file.filename, newStatus);
        toast.success(`Archivo marcado como ${newStatus}`);
      } catch (error) {
        toast.error(`Error al cambiar estado: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este archivo?')) {
      try {
        const result = await htmlFileService.deleteFile(file.filename);
        
        if (result.success) {
          toast.success('Archivo eliminado exitosamente');
          if (onDelete) {
            onDelete(file.filename);
          }
        } else {
          toast.error(result.message || 'Error al eliminar archivo');
        }
      } catch (error) {
        console.error('Error eliminando archivo:', error);
        
        // Mostrar mensaje específico según el tipo de error
        if (error.message.includes('no encontrado') || error.message.includes('ya no existe')) {
          toast.success('El archivo ya no existe (considerado eliminado)');
          if (onDelete) {
            onDelete(file.filename);
          }
        } else if (error.message.includes('autenticación')) {
          toast.error('Error de autenticación. Por favor, inicia sesión nuevamente');
        } else {
          toast.error(`Error al eliminar archivo: ${error.message}`);
        }
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 border-2 ${
      isModified 
        ? 'border-yellow-400 bg-yellow-50' 
        : 'border-gray-200'
    }`}>
      {/* Header con estado */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          {getStatusIcon(status)}
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
            {status.toUpperCase()}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          {formatFileSize(file.size)}
        </div>
      </div>

      {/* Información del paciente */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 mb-2 text-lg">
          👤 {metadata.patient_name || 'Sin nombre'}
        </h3>
        <div className="space-y-1 text-sm text-gray-600">
          <p><strong>📋 Orden:</strong> {metadata.order_number || 'N/A'}</p>
          <p><strong>👨‍⚕️ Doctor:</strong> {metadata.doctor_name || 'N/A'}</p>
          {metadata.patient_age && (
            <p><strong>👶 Edad:</strong> {metadata.patient_age} años</p>
          )}
          {metadata.patient_gender && (
            <p><strong>⚥ Género:</strong> {metadata.patient_gender}</p>
          )}
          {metadata.reception_date && (
            <p><strong>📅 Fecha:</strong> {metadata.reception_date}</p>
          )}
        </div>
      </div>

      {/* Información de ediciones */}
      {isModified && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-yellow-600">✏️</span>
            <span className="text-sm font-medium text-yellow-800">Archivo Modificado</span>
          </div>
          <div className="text-xs text-yellow-700 space-y-1">
            <p><strong>Ediciones:</strong> {editCount} vez(es)</p>
            {lastEditedBy && (
              <p><strong>Último editor:</strong> {lastEditedBy}</p>
            )}
            {lastEditDate && (
              <p><strong>Última edición:</strong> {formatDate(lastEditDate)}</p>
            )}
          </div>
        </div>
      )}

      {/* Tests */}
      {metadata.tests && metadata.tests.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">🧪 Pruebas:</h4>
          <div className="flex flex-wrap gap-1">
            {metadata.tests.map((test, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {test.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Fechas */}
      <div className="mb-4 text-xs text-gray-500">
        <p><strong>Creado:</strong> {formatDate(metadata.created_at)}</p>
        {metadata.completed_at && (
          <p><strong>Completado:</strong> {formatDate(metadata.completed_at)}</p>
        )}
      </div>

      {/* Botones de acción */}
      <div className="space-y-2">
        {/* Primera fila - Botones principales */}
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit && onEdit(file)}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
          >
            <Edit3 className="h-4 w-4" />
            <span>Editar Prueba</span>
          </button>
          
          {showStatusChange && status === 'pending' && (
            <button
              onClick={() => handleStatusChange('completed')}
              disabled={loading}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-1"
            >
              {loading ? (
                <Clock className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              <span>Completar</span>
            </button>
          )}
        </div>
        
        {/* Segunda fila - Botones secundarios */}
        <div className="flex space-x-2">
          {isModified && (
            <button
              onClick={() => setShowHistory(true)}
              className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors flex items-center justify-center space-x-1"
              title="Ver historial de ediciones"
            >
              <History className="h-4 w-4" />
              <span>Historial</span>
            </button>
          )}
          
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
            title="Eliminar archivo"
          >
            <Trash2 className="h-4 w-4" />
            <span>Eliminar</span>
          </button>
        </div>
      </div>

      {/* Visor de archivos */}
      {showViewer && (
        <HtmlFileViewer
          file={file}
          onClose={() => setShowViewer(false)}
        />
      )}

      {/* Modal de historial de ediciones */}
      {showHistory && (
        <EditHistoryModal
          filename={file.filename}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
};

// Componente visor de archivos
const HtmlFileViewer = ({ file, onClose }) => {
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadHtmlContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await htmlFileService.getHtmlContent(file.filename);
      if (response.success) {
        setHtmlContent(response.data.html_content);
      } else {
        setError('Error al cargar el contenido HTML');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [file.filename]);

  React.useEffect(() => {
    loadHtmlContent();
  }, [loadHtmlContent]);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2">Cargando contenido HTML...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md">
          <div className="text-red-600 mb-4">
            <div className="text-4xl mb-2">❌</div>
            <h3 className="text-lg font-semibold">Error</h3>
            <p>{error}</p>
          </div>
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">📄 {file.filename}</h3>
            <p className="text-sm text-gray-600">
              👤 {file.metadata?.patient_name || 'Sin nombre'}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center space-x-1"
            >
              <span>🖨️</span>
              <span>Imprimir</span>
            </button>
            <button
              onClick={handleDownload}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center space-x-1"
            >
              <Download className="h-4 w-4" />
              <span>Descargar</span>
            </button>
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              ❌ Cerrar
            </button>
          </div>
        </div>

        {/* Contenido HTML */}
        <div className="flex-1 overflow-auto p-4">
          <div 
            className="w-full h-full"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      </div>
    </div>
  );
};

export default HtmlFileCard;
