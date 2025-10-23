import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  FileText, 
  CreditCard, 
  RefreshCw as Sync, 
  LogOut, 
  Menu, 
  X,
  Settings,
  FlaskConical,
  Users,
  UserCheck,
  FileUp
} from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, hasRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Forzar logout local aunque falle el servidor
      navigate('/login');
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['admin', 'secretary', 'doctor', 'technician', 'user'] },
    { name: 'Resultados', href: '/lab-results', icon: FileText, roles: ['admin', 'secretary', 'doctor', 'technician', 'user'] },
    { name: 'Gestión de Pacientes', href: '/patients', icon: UserCheck, roles: ['admin', 'secretary', 'doctor'] },
    { name: 'Convertidor Word', href: '/word-converter', icon: FileUp, roles: ['admin', 'secretary', 'doctor'] },
    { name: 'Pagos', href: '/payments', icon: CreditCard, roles: ['admin', 'secretary', 'doctor', 'user'] },
    { name: 'Sincronización', href: '/sync', icon: Sync, roles: ['admin'] },
    { name: 'Gestión de Usuarios', href: '/user-management', icon: Users, roles: ['admin'] },
    { name: 'Mi Perfil', href: '/profile', icon: Settings, roles: ['admin', 'secretary', 'doctor', 'technician', 'user'] },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.some(role => hasRole(role))
  );

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Sidebar móvil */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-72 flex-col bg-white/95 backdrop-blur-xl border-r border-gray-200/50 shadow-2xl">
          <div className="flex h-20 items-center justify-between px-6 border-b border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                <FlaskConical className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                Laboratorio Esperanza
              </h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
                      : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={`mr-3 h-5 w-5 transition-transform duration-200 ${
                    isActive(item.href) ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                  }`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-gray-200/50 p-6">
            <div className="flex items-center mb-4">
              <div className="relative">
                {user?.profile_image ? (
                  <img 
                    src={user.profile_image} 
                    alt="Foto de perfil" 
                    className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-lg"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-semibold text-lg">
                      {user?.name ? user.name.charAt(0).toUpperCase() : user?.first_name ? user.first_name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Usuario'}
                </p>
                <div className="flex items-center mt-1">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    user?.role === 'admin' ? 'bg-red-100 text-red-800' :
                    user?.role === 'doctor' ? 'bg-green-100 text-green-800' :
                    user?.role === 'secretary' ? 'bg-blue-100 text-blue-800' :
                    user?.role === 'user' ? 'bg-gray-100 text-gray-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {user?.role === 'admin' ? 'Administrador' :
                     user?.role === 'doctor' ? 'Doctor' :
                     user?.role === 'secretary' ? 'Secretaria' :
                     user?.role === 'user' ? 'Usuario' :
                     user?.role || 'Sin rol'}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Link
                to="/profile"
                className="flex w-full items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100/80 rounded-xl transition-all duration-200 group"
                onClick={() => setSidebarOpen(false)}
              >
                <Settings className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                Mi Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
              >
                <LogOut className="mr-3 h-5 w-5 text-red-500 group-hover:text-red-600 transition-colors" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white/95 backdrop-blur-xl border-r border-gray-200/50 shadow-xl">
          <div className="flex h-20 items-center px-6 border-b border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                <FlaskConical className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                Laboratorio Esperanza
              </h1>
            </div>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
                      : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 transition-transform duration-200 ${
                    isActive(item.href) ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                  }`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-gray-200/50 p-6">
            <div className="flex items-center mb-4">
              <div className="relative">
                {user?.profile_image ? (
                  <img 
                    src={user.profile_image} 
                    alt="Foto de perfil" 
                    className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-lg"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-semibold text-lg">
                      {user?.name ? user.name.charAt(0).toUpperCase() : user?.first_name ? user.first_name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Usuario'}
                </p>
                <div className="flex items-center mt-1">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    user?.role === 'admin' ? 'bg-red-100 text-red-800' :
                    user?.role === 'doctor' ? 'bg-green-100 text-green-800' :
                    user?.role === 'secretary' ? 'bg-blue-100 text-blue-800' :
                    user?.role === 'user' ? 'bg-gray-100 text-gray-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {user?.role === 'admin' ? 'Administrador' :
                     user?.role === 'doctor' ? 'Doctor' :
                     user?.role === 'secretary' ? 'Secretaria' :
                     user?.role === 'user' ? 'Usuario' :
                     user?.role || 'Sin rol'}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Link
                to="/profile"
                className="flex w-full items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100/80 rounded-xl transition-all duration-200 group"
              >
                <Settings className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                Mi Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
              >
                <LogOut className="mr-3 h-5 w-5 text-red-500 group-hover:text-red-600 transition-colors" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="lg:pl-72">
        {/* Header móvil */}
        <div className="sticky top-0 z-40 flex h-20 items-center gap-x-4 border-b border-gray-200/50 bg-white/95 backdrop-blur-xl px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-3 flex-1">
            <div className="p-1.5 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-md">
              <FlaskConical className="h-5 w-5 text-white" />
            </div>
            <div className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              Laboratorio Esperanza
            </div>
          </div>
        </div>

        {/* Contenido */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
