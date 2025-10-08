import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, Shield } from 'lucide-react';

const RoleGuard = ({ 
  children, 
  allowedRoles = [], 
  fallback = null,
  showError = true 
}) => {
  const { hasRole, hasAnyRole, user } = useAuth();

  // Si no hay roles especificados, permitir acceso
  if (allowedRoles.length === 0) {
    return children;
  }

  // Verificar si el usuario tiene alguno de los roles permitidos
  const hasPermission = hasAnyRole(allowedRoles);

  if (hasPermission) {
    return children;
  }

  // Si se especifica un fallback, mostrarlo
  if (fallback) {
    return fallback;
  }

  // Si no se debe mostrar error, no renderizar nada
  if (!showError) {
    return null;
  }

  // Mostrar mensaje de error por defecto
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100 mb-4">
          <Shield className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>
        <p className="text-gray-600 mb-4">
          No tienes permisos para acceder a esta sección.
        </p>
        <div className="bg-gray-100 rounded-lg p-4 text-left">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Tu rol actual:</strong> {user?.role || 'No definido'}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Roles permitidos:</strong> {allowedRoles.join(', ')}
          </p>
        </div>
        <button
          onClick={() => window.history.back()}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default RoleGuard;
