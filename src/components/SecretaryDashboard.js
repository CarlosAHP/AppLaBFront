import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  CreditCard, 
  UserPlus, 
  Clipboard,
  Activity,
  UserCheck,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Settings
} from 'lucide-react';

const SecretaryDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPayments: 0,
    pendingPayments: 0,
    recentUsers: [],
    recentPayments: [],
    pendingTasks: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Aquí cargarías los datos reales del backend
      setStats({
        totalUsers: 12,
        totalPayments: 89,
        pendingPayments: 5,
        recentUsers: [
          { name: 'Ana García', role: 'patient', date: '2024-01-15' },
          { name: 'Carlos López', role: 'patient', date: '2024-01-14' },
          { name: 'María Torres', role: 'patient', date: '2024-01-13' }
        ],
        recentPayments: [
          { patient: 'Ana García', amount: 150.00, method: 'Efectivo', status: 'completed' },
          { patient: 'Carlos López', amount: 200.00, method: 'Tarjeta', status: 'pending' },
          { patient: 'María Torres', amount: 175.00, method: 'Transferencia', status: 'completed' }
        ],
        pendingTasks: [
          { task: 'Registrar pago de Juan Pérez', priority: 'high' },
          { task: 'Actualizar datos de María González', priority: 'medium' },
          { task: 'Verificar pago de Carlos Ruiz', priority: 'low' }
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
              <Clipboard className="h-8 w-8 text-primary-600 mr-3" />
              Panel de Secretaría
            </h1>
            <p className="text-gray-600 mt-1">
              {getGreeting()} • Gestión de usuarios y pagos
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
            <button
              onClick={() => navigate('/payments')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Realizar Pago
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
              <p className="text-sm font-medium text-gray-600">Usuarios Registrados</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pagos Procesados</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPayments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pagos Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingPayments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tareas Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingTasks.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Usuarios Recientes</h2>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {stats.recentUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <UserCheck className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{user.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pagos Recientes</h2>
            <CreditCard className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {stats.recentPayments.map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-full">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{payment.patient}</p>
                    <p className="text-sm text-gray-600">{payment.method}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">Q{payment.amount}</p>
                  <div className="flex items-center">
                    {payment.status === 'completed' ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />
                    )}
                    <span className="text-xs text-gray-500 capitalize">{payment.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tareas Pendientes</h2>
        <div className="space-y-3">
          {stats.pendingTasks.map((task, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`p-2 rounded-full ${
                  task.priority === 'high' ? 'bg-red-100' : 
                  task.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                }`}>
                  <AlertCircle className={`h-4 w-4 ${
                    task.priority === 'high' ? 'text-red-600' : 
                    task.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                  }`} />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{task.task}</p>
                  <p className="text-sm text-gray-600 capitalize">Prioridad: {task.priority}</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors">
                Completar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          
          <button 
            onClick={() => navigate('/payments')}
            className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <CreditCard className="h-6 w-6 text-green-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Realizar Pago</p>
              <p className="text-sm text-gray-600">Procesar nuevo pago</p>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/payments')}
            className="flex items-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
          >
            <FileText className="h-6 w-6 text-yellow-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Ver Pagos</p>
              <p className="text-sm text-gray-600">Gestionar pagos</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecretaryDashboard;
