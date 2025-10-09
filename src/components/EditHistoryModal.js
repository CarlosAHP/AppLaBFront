/**
 * Componente para mostrar el historial de ediciones de un archivo
 */

import React, { useState, useEffect, useCallback } from 'react';
import { X, Clock, User, Edit3, Calendar } from 'lucide-react';
import { frontendHtmlService } from '../services/frontendHtmlService';

const EditHistoryModal = ({ filename, onClose }) => {
  const [editHistory, setEditHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEditHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await frontendHtmlService.getEditHistory(filename);
      
      if (response.success) {
        // El endpoint devuelve un objeto con edit_history, no directamente el array
        const historyData = response.data;
        if (historyData && Array.isArray(historyData.edit_history)) {
          setEditHistory(historyData.edit_history);
        } else if (Array.isArray(historyData)) {
          setEditHistory(historyData);
        } else {
          console.warn('Historial de ediciones no es un array:', historyData);
          setEditHistory([]);
        }
      } else {
        setError('Error al cargar historial de ediciones');
      }
    } catch (err) {
      console.error('Error cargando historial:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filename]);

  useEffect(() => {
    loadEditHistory();
  }, [loadEditHistory]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const normalizeEditEntry = (edit) => {
    return {
      edited_by: edit.edited_by || 'Usuario desconocido',
      edited_at: edit.edited_at || edit.edit_date || new Date().toISOString(),
      edit_number: edit.edit_number || 1,
      changes_summary: edit.changes_summary || edit.edit_reason || 'Sin descripción',
      file_size: edit.file_size_after || edit.file_size || null
    };
  };

  const getEditIcon = (editNumber) => {
    if (editNumber === 1) return '🆕';
    if (editNumber <= 3) return '✏️';
    if (editNumber <= 5) return '🔄';
    return '📝';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
          <div className="flex items-center space-x-2">
            <Edit3 className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Historial de Ediciones</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Cargando historial...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-2">❌</div>
              <p className="text-red-600">{error}</p>
              <button
                onClick={loadEditHistory}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Reintentar
              </button>
            </div>
          ) : !Array.isArray(editHistory) || editHistory.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">📝</div>
              <p className="text-gray-600">No hay historial de ediciones disponible</p>
            </div>
          ) : (
            <div className="space-y-4">
              {editHistory.map((edit, index) => {
                const normalizedEdit = normalizeEditEntry(edit);
                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">
                          {getEditIcon(normalizedEdit.edit_number)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-semibold text-gray-800">
                              Edición #{normalizedEdit.edit_number}
                            </span>
                            {index === 0 && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Más reciente
                              </span>
                            )}
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span><strong>Editor:</strong> {normalizedEdit.edited_by}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span><strong>Fecha:</strong> {formatDate(normalizedEdit.edited_at)}</span>
                            </div>
                            
                            {normalizedEdit.changes_summary && (
                              <div className="flex items-start space-x-2">
                                <Edit3 className="h-4 w-4 mt-0.5" />
                                <span><strong>Cambios:</strong> {normalizedEdit.changes_summary}</span>
                              </div>
                            )}
                            
                            {normalizedEdit.file_size && (
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4" />
                                <span><strong>Tamaño:</strong> {normalizedEdit.file_size} bytes</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        {formatDate(normalizedEdit.edited_at)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200 mt-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Total de ediciones: {Array.isArray(editHistory) ? editHistory.length : 0}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditHistoryModal;
