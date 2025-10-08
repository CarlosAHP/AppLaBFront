import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  CreditCard, 
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  DollarSign,
  Download,
  Settings
} from 'lucide-react';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalResults: 0,
    totalPayments: 0,
    pendingPayments: 0,
    recentResults: [],
    recentPayments: [],
    pendingResults: []
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
        totalResults: 8,
        totalPayments: 5,
        pendingPayments: 1,
        recentResults: [
          { 
            id: 1,
            test: 'Hemograma Completo', 
            date: '2024-01-15', 
            status: 'completed',
            doctor: 'Dr. Carlos Mendoza'
          },
          { 
            id: 2,
            test: 'Química Sanguínea', 
            date: '2024-01-10', 
            status: 'completed',
            doctor: 'Dr. Ana García'
          },
          { 
            id: 3,
            test: 'Perfil Lipídico', 
            date: '2024-01-08', 
            status: 'pending',
            doctor: 'Dr. Luis Rodríguez'
          }
        ],
        recentPayments: [
          { 
            id: 1,
            amount: 150.00, 
            method: 'Efectivo', 
            date: '2024-01-15',
            status: 'completed',
            description: 'Hemograma Completo'
          },
          { 
            id: 2,
            amount: 200.00, 
            method: 'Tarjeta', 
            date: '2024-01-10',
            status: 'completed',
            description: 'Química Sanguínea'
          },
          { 
            id: 3,
            amount: 175.00, 
            method: 'Transferencia', 
            date: '2024-01-08',
            status: 'pending',
            description: 'Perfil Lipídico'
          }
        ],
        pendingResults: [
          { 
            test: 'Perfil Lipídico', 
            date: '2024-01-08', 
            doctor: 'Dr. Luis Rodríguez'
          }
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

  const handleViewResult = (resultId) => {
    navigate(`/lab-results/${resultId}`);
  };

  // const handleMakePayment = (paymentId) => {
  //   navigate(`/payments/${paymentId}`);
  // };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="card-modern">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg mr-4">
                <User className="h-8 w-8 text-white" />
              </div>
              Mi Panel de Usuario
            </h1>
            <p className="text-gray-600 text-lg">
              {getGreeting()} • Gestiona tus resultados y pagos
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/profile')}
              className="btn-secondary flex items-center"
            >
              <Settings className="h-5 w-5 mr-2" />
              Mi Perfil
            </button>
            <button
              onClick={() => navigate('/payments')}
              className="btn-primary flex items-center"
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Realizar Pago
            </button>
            <button
              onClick={() => navigate('/lab-results')}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-lg hover:shadow-xl hover:shadow-green-500/25 transform hover:-translate-y-0.5"
            >
              <FileText className="h-5 w-5 mr-2" />
              Ver Resultados
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-600">Mis Resultados</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalResults}</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-600">Pagos Realizados</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalPayments}</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-600">Pagos Pendientes</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pendingPayments}</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-600">Resultados Pendientes</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pendingResults.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Results Alert */}
      {stats.pendingResults.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/50 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg mr-4">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-yellow-900">Resultados Pendientes</h3>
              <p className="text-yellow-700 text-lg">Tienes {stats.pendingResults.length} resultado(s) pendiente(s) de procesar</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Results */}
        <div className="card-modern">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md mr-3">
                <FileText className="h-5 w-5 text-white" />
              </div>
              Mis Resultados Recientes
            </h2>
          </div>
          
          <div className="space-y-4">
            {stats.recentResults.map((result) => (
              <div key={result.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-200">
                <div className="flex items-center">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-gray-900">{result.test}</p>
                    <p className="text-sm text-gray-600">Dr. {result.doctor}</p>
                    <p className="text-xs text-gray-500">{result.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {result.status === 'completed' ? (
                    <div className="p-1 bg-green-100 rounded-full">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  ) : (
                    <div className="p-1 bg-yellow-100 rounded-full">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                  )}
                  <button
                    onClick={() => handleViewResult(result.id)}
                    className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="card-modern">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md mr-3">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              Mis Pagos Recientes
            </h2>
          </div>
          
          <div className="space-y-4">
            {stats.recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-200">
                <div className="flex items-center">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md">
                    <DollarSign className="h-4 w-4 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-gray-900">{payment.description}</p>
                    <p className="text-sm text-gray-600">{payment.method}</p>
                    <p className="text-xs text-gray-500">{payment.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-lg">Q{payment.amount}</p>
                  <div className="flex items-center justify-end">
                    {payment.status === 'completed' ? (
                      <div className="flex items-center">
                        <div className="p-1 bg-green-100 rounded-full mr-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-xs text-green-600 font-semibold capitalize">{payment.status}</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <div className="p-1 bg-yellow-100 rounded-full mr-2">
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                        </div>
                        <span className="text-xs text-yellow-600 font-semibold capitalize">{payment.status}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-modern">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <div className="p-2 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg shadow-md mr-3">
            <Settings className="h-6 w-6 text-white" />
          </div>
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button 
            onClick={() => navigate('/lab-results')}
            className="group flex items-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border border-blue-200/50"
          >
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg mr-4 group-hover:scale-110 transition-transform duration-200">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900 text-lg">Ver Mis Resultados</p>
              <p className="text-sm text-gray-600">Consultar todos los resultados</p>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/payments')}
            className="group flex items-center p-6 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border border-green-200/50"
          >
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg mr-4 group-hover:scale-110 transition-transform duration-200">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900 text-lg">Realizar Pago</p>
              <p className="text-sm text-gray-600">Pagar servicios pendientes</p>
            </div>
          </button>
          
          <button className="group flex items-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border border-purple-200/50">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg mr-4 group-hover:scale-110 transition-transform duration-200">
              <Download className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900 text-lg">Descargar Resultados</p>
              <p className="text-sm text-gray-600">Exportar resultados en PDF</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
