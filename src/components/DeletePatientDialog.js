import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeletePatientDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  patient, 
  isDeleting = false 
}) => {
  if (!isOpen) return null;

  const formatPatientName = (patient) => {
    if (patient.full_name) {
      return patient.full_name;
    }
    const parts = [patient.first_name, patient.middle_name, patient.last_name].filter(Boolean);
    return parts.join(' ') || patient.patient_code || 'Sin nombre';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Eliminar Paciente
              </h3>
              <p className="text-sm text-gray-500">
                Esta acción no se puede deshacer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isDeleting}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">
              ¿Estás seguro de que quieres eliminar permanentemente este paciente?
            </p>
            
            {patient && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-gray-600">
                      {formatPatientName(patient).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatPatientName(patient)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {patient.patient_code}
                    </p>
                  </div>
                </div>
                {patient.email && (
                  <p className="text-sm text-gray-600">
                    📧 {patient.email}
                  </p>
                )}
                {patient.phone && (
                  <p className="text-sm text-gray-600">
                    📞 {patient.phone}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
              <div className="text-sm text-red-700">
                <p className="font-medium mb-1">Advertencia:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>El paciente será eliminado permanentemente de la base de datos</li>
                  <li>No aparecerá en reportes futuros</li>
                  <li>Esta acción no se puede deshacer</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="btn-secondary disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Eliminando...
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4 mr-2" />
                Eliminar Permanentemente
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePatientDialog;
