import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  CreditCard, 
  UserPlus, 
  Settings, 
  Shield,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalResults: 0,
    totalPayments: 0,
    pendingResults: 0,
    recentUsers: [],
    recentResults: [],
    recentPayments: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Aquí cargarías los datos reales del backend
      // Por ahora usamos datos mock
      setStats({
        totalUsers: 15,
        totalResults: 142,
        totalPayments: 89,
        pendingResults: 8,
        recentUsers: [
          { name: 'Dr. Carlos Mendoza', role: 'doctor', date: '2024-01-15' },
          { name: 'María González', role: 'secretary', date: '2024-01-14' },
          { name: 'Luis Rodríguez', role: 'technician', date: '2024-01-13' }
        ],
        recentResults: [
          { patient: 'Ana García', test: 'Hemograma Completo', status: 'completed' },
          { patient: 'Carlos López', test: 'Química Sanguínea', status: 'pending' },
          { patient: 'María Torres', test: 'Perfil Lipídico', status: 'completed' }
        ],
        recentPayments: [
          { patient: 'Ana García', amount: 150.00, method: 'Efectivo', date: '2024-01-15' },
          { patient: 'Carlos López', amount: 200.00, method: 'Tarjeta', date: '2024-01-14' }
        ]
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Shield className="h-8 w-8 text-primary-600 mr-3" />
              Panel de Administración
            </h1>
            <p className="text-gray-600 mt-1">
              {getGreeting()} • Control total del sistema
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Settings className="h-5 w-5 mr-2" />
              Mi Perfil
            </button>
            <button
              onClick={() => navigate('/register')}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Nuevo Usuario
            </button>
            <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              <Settings className="h-5 w-5 mr-2" />
              Configuración
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resultados</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalResults}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingResults}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pagos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPayments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Usuarios Recientes</h2>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {stats.recentUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{user.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Results */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Resultados Recientes</h2>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {stats.recentResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{result.patient}</p>
                  <p className="text-sm text-gray-600">{result.test}</p>
                </div>
                <div className="flex items-center">
                  {result.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pagos Recientes</h2>
            <CreditCard className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {stats.recentPayments.map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{payment.patient}</p>
                  <p className="text-sm text-gray-600">{payment.method}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">Q{payment.amount}</p>
                  <p className="text-xs text-gray-500">{payment.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Administrativas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/register')}
            className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <UserPlus className="h-6 w-6 text-blue-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Registrar Usuario</p>
              <p className="text-sm text-gray-600">Crear nueva cuenta</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <FileText className="h-6 w-6 text-green-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Gestionar Resultados</p>
              <p className="text-sm text-gray-600">Ver todos los resultados</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
            <CreditCard className="h-6 w-6 text-yellow-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Gestionar Pagos</p>
              <p className="text-sm text-gray-600">Ver todos los pagos</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <BarChart3 className="h-6 w-6 text-purple-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Reportes</p>
              <p className="text-sm text-gray-600">Generar reportes</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
