import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  Stethoscope,
  Clipboard,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  UserPlus,
  CreditCard,
  Settings
} from 'lucide-react';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalResults: 0,
    pendingResults: 0,
    totalPayments: 0,
    recentPatients: [],
    recentResults: [],
    urgentResults: [],
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
      setStats({
        totalPatients: 45,
        totalResults: 142,
        pendingResults: 8,
        totalPayments: 89,
        recentPatients: [
          { name: 'Ana García', age: 35, lastVisit: '2024-01-15' },
          { name: 'Carlos López', age: 42, lastVisit: '2024-01-14' },
          { name: 'María Torres', age: 28, lastVisit: '2024-01-13' }
        ],
        recentResults: [
          { patient: 'Ana García', test: 'Hemograma Completo', status: 'completed', date: '2024-01-15' },
          { patient: 'Carlos López', test: 'Química Sanguínea', status: 'pending', date: '2024-01-14' },
          { patient: 'María Torres', test: 'Perfil Lipídico', status: 'completed', date: '2024-01-13' }
        ],
        urgentResults: [
          { patient: 'Juan Pérez', test: 'Glucosa', value: '180 mg/dL', status: 'high' },
          { patient: 'Sofia Ruiz', test: 'Colesterol', value: '250 mg/dL', status: 'high' }
        ],
        recentPayments: [
          { patient: 'Ana García', amount: 150.00, method: 'Efectivo', date: '2024-01-15' },
          { patient: 'Carlos López', amount: 200.00, method: 'Tarjeta', date: '2024-01-14' },
          { patient: 'María Torres', amount: 175.00, method: 'Transferencia', date: '2024-01-13' }
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
              <Stethoscope className="h-8 w-8 text-primary-600 mr-3" />
              Panel Médico
            </h1>
            <p className="text-gray-600 mt-1">
              {getGreeting()} • Gestión de pacientes y resultados
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
            <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              <Plus className="h-5 w-5 mr-2" />
              Nuevo Resultado
            </button>
            <button
              onClick={() => navigate('/register')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Crear Usuario
            </button>
            <button
              onClick={() => navigate('/payments')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Ver Pagos
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
              <p className="text-sm font-medium text-gray-600">Total Pacientes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resultados Procesados</p>
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
              <p className="text-sm font-medium text-gray-600">Pagos Totales</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPayments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Results Alert */}
      {stats.urgentResults.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-900">Valores Críticos Detectados</h3>
              <p className="text-red-700">Se han detectado {stats.urgentResults.length} resultados con valores fuera del rango normal</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Patients */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pacientes Recientes</h2>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {stats.recentPatients.map((patient, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{patient.name}</p>
                    <p className="text-sm text-gray-600">Edad: {patient.age} años</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{patient.lastVisit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Results */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Resultados Recientes</h2>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {stats.recentResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Clipboard className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{result.patient}</p>
                    <p className="text-sm text-gray-600">{result.test}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    {result.status === 'completed' ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />
                    )}
                    <span className="text-xs text-gray-500 capitalize">{result.status}</span>
                  </div>
                  <p className="text-xs text-gray-500">{result.date}</p>
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
                    <CreditCard className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{payment.patient}</p>
                    <p className="text-sm text-gray-600">{payment.method}</p>
                  </div>
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

      {/* Urgent Results */}
      {stats.urgentResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            Valores Críticos
          </h2>
          <div className="space-y-3">
            {stats.urgentResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-full">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{result.patient}</p>
                    <p className="text-sm text-gray-600">{result.test}: {result.value}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
                    Revisar
                  </button>
                  <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Médicas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <Plus className="h-6 w-6 text-blue-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Nuevo Resultado</p>
              <p className="text-sm text-gray-600">Crear resultado de laboratorio</p>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/register')}
            className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <UserPlus className="h-6 w-6 text-green-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Crear Usuario</p>
              <p className="text-sm text-gray-600">Registrar nuevo paciente</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
            <FileText className="h-6 w-6 text-yellow-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Ver Resultados</p>
              <p className="text-sm text-gray-600">Gestionar resultados</p>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/payments')}
            className="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <CreditCard className="h-6 w-6 text-purple-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Ver Pagos</p>
              <p className="text-sm text-gray-600">Consultar pagos de pacientes</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
