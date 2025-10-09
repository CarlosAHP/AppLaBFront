import React, { useState } from 'react';
import { X, Clock, CheckCircle } from 'lucide-react';
import HtmlFileList from './HtmlFileList';

const ReportHistory = ({ onClose, onEditFile }) => {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'completed'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-7xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Historial de Resultados</h2>
            <p className="text-gray-600">Gestiona los archivos HTML guardados en el servidor</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'pending'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Clock className="h-4 w-4 inline mr-1" />
            Pendientes
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'completed'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <CheckCircle className="h-4 w-4 inline mr-1" />
            Completados
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'pending' ? (
            <HtmlFileList 
              status="pending" 
              title="Archivos Pendientes de Revisión"
              onEditFile={onEditFile}
            />
          ) : (
            <HtmlFileList 
              status="completed" 
              title="Archivos Completados"
              onEditFile={onEditFile}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportHistory;