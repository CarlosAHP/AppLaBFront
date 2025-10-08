import React, { useState, useEffect } from 'react';
import { FileText, Calendar, User, Download, Trash2, Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ReportHistory = ({ onClose }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReportHistory();
  }, []);

  const loadReportHistory = () => {
    try {
      const reportHistory = JSON.parse(localStorage.getItem('labReports') || '[]');
      setReports(reportHistory);
    } catch (error) {
      console.error('Error loading report history:', error);
      toast.error('Error al cargar el historial de reportes');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = (reportId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este reporte del historial local?')) {
      try {
        const updatedReports = reports.filter(report => report.id !== reportId);
        setReports(updatedReports);
        localStorage.setItem('labReports', JSON.stringify(updatedReports));
        toast.success('Reporte eliminado del historial');
      } catch (error) {
        console.error('Error deleting report:', error);
        toast.error('Error al eliminar el reporte');
      }
    }
  };

  const handleViewReport = (report) => {
    // Abrir el reporte en una nueva ventana
    const newWindow = window.open('', '_blank');
    newWindow.document.write(report.html_content);
    newWindow.document.close();
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('es-GT');
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Historial de Reportes</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay reportes guardados</h3>
            <p className="mt-1 text-sm text-gray-500">
              Los reportes que guardes aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[60vh]">
            <div className="grid gap-4">
              {reports.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <FileText className="h-5 w-5 text-primary-600 mr-2" />
                        <h3 className="font-medium text-gray-900">{report.fileName}</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span>{report.patient_name}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDate(report.savedAt)}</span>
                        </div>
                        <div>
                          <span className="font-medium">Orden:</span> {report.order_number}
                        </div>
                        <div>
                          <span className="font-medium">Pruebas:</span> {report.selected_tests?.length || 0}
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          report.savedToServer 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {report.savedToServer ? 'Guardado en servidor' : 'Guardado localmente'}
                        </span>
                      </div>
                      
                      {report.selected_tests && report.selected_tests.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">
                            {report.selected_tests.map(test => test.name).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleViewReport(report)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                        title="Ver reporte"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                        title="Eliminar del historial"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportHistory;
