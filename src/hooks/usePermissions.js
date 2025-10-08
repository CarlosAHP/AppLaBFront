import { useAuth } from '../contexts/AuthContext';

export const usePermissions = () => {
  const { user, hasRole, hasAnyRole } = useAuth();

  const permissions = {
    // Permisos de administrador - acceso completo
    canManageUsers: hasRole('admin'),
    canAccessAdminPanel: hasRole('admin'),
    canManageSystem: hasRole('admin'),
    canViewAllData: hasRole('admin'),
    
    // Permisos de doctor - crear usuarios, hacer pruebas, ver pagos
    canCreateUsers: hasAnyRole(['admin', 'doctor']),
    canManageResults: hasAnyRole(['admin', 'doctor']),
    canViewResults: hasAnyRole(['admin', 'doctor', 'user']),
    canCreateResults: hasAnyRole(['admin', 'doctor']),
    canEditResults: hasAnyRole(['admin', 'doctor']),
    canViewPayments: hasAnyRole(['admin', 'doctor']),
    
    // Permisos de secretaria - realizar pagos, crear usuarios
    canManagePayments: hasAnyRole(['admin', 'secretary']),
    canRegisterUsers: hasAnyRole(['admin', 'secretary']),
    canProcessPayments: hasAnyRole(['admin', 'secretary']),
    
    // Permisos de usuario - pagar y ver resultados
    canMakePayments: hasAnyRole(['admin', 'user']),
    canViewOwnResults: hasAnyRole(['admin', 'user']),
    canViewOwnPayments: hasAnyRole(['admin', 'user']),
    
    // Permisos de técnico
    canProcessSamples: hasAnyRole(['admin', 'technician']),
    canViewLabData: hasAnyRole(['admin', 'technician', 'doctor']),
    
    // Permisos generales
    canViewDashboard: hasAnyRole(['admin', 'secretary', 'doctor', 'technician', 'user']),
    canAccessProfile: true, // Todos los usuarios autenticados
    canLogout: true, // Todos los usuarios autenticados
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      admin: 'Administrador',
      secretary: 'Secretaria',
      doctor: 'Doctor',
      technician: 'Técnico',
      user: 'Usuario'
    };
    return roleNames[role] || role;
  };

  const getRoleDescription = (role) => {
    const descriptions = {
      admin: 'Control total del sistema',
      secretary: 'Gestión de usuarios y pagos',
      doctor: 'Gestión de resultados y pacientes',
      technician: 'Procesamiento de muestras',
      user: 'Pagar y ver resultados'
    };
    return descriptions[role] || '';
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      secretary: 'bg-blue-100 text-blue-800',
      doctor: 'bg-green-100 text-green-800',
      technician: 'bg-purple-100 text-purple-800',
      user: 'bg-gray-100 text-gray-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const canAccessRoute = (route) => {
    const routePermissions = {
      '/dashboard': permissions.canViewDashboard,
      '/register': permissions.canRegisterUsers,
      '/payments': permissions.canManagePayments || permissions.canMakePayments,
      '/lab-results': permissions.canViewResults || permissions.canViewOwnResults,
      '/sync': permissions.canManageSystem,
    };
    
    return routePermissions[route] || false;
  };

  const getAvailableRoutes = () => {
    const routes = [
      { path: '/dashboard', name: 'Dashboard', permission: permissions.canViewDashboard },
      { path: '/register', name: 'Registrar Usuario', permission: permissions.canRegisterUsers },
      { path: '/payments', name: 'Pagos', permission: permissions.canManagePayments || permissions.canMakePayments },
      { path: '/lab-results', name: 'Resultados', permission: permissions.canViewResults || permissions.canViewOwnResults },
      { path: '/sync', name: 'Sincronización', permission: permissions.canManageSystem },
    ];
    
    return routes.filter(route => route.permission);
  };

  return {
    permissions,
    user,
    hasRole,
    hasAnyRole,
    getRoleDisplayName,
    getRoleDescription,
    getRoleColor,
    canAccessRoute,
    getAvailableRoutes
  };
};

export default usePermissions;
