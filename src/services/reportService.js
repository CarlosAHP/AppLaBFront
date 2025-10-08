import api from './api';

export const reportService = {
  // Crear nuevo reporte
  async createReport(reportData) {
    try {
      const response = await api.post('/reports', reportData);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al crear reporte');
      }
    } catch (error) {
      // Manejar error 401 específicamente
      if (error.response?.status === 401) {
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      if (error.message.includes('Sesión expirada')) {
        throw error;
      }
      
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Actualizar reporte existente
  async updateReport(reportId, reportData) {
    try {
      const response = await api.put(`/reports/${reportId}`, reportData);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al actualizar reporte');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Obtener reporte por ID
  async getReport(reportId) {
    try {
      const response = await api.get(`/reports/${reportId}`);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al obtener reporte');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Buscar reportes por paciente
  async getReportsByPatient(patientName) {
    try {
      const response = await api.get(`/reports/patient/${encodeURIComponent(patientName)}`);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al buscar reportes del paciente');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Buscar reportes por rango de fechas
  async getReportsByDateRange(startDate, endDate) {
    try {
      const response = await api.get('/reports/date-range', {
        params: { 
          start_date: startDate, 
          end_date: endDate 
        }
      });
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al buscar reportes por fecha');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Obtener estadísticas de reportes
  async getReportStats() {
    try {
      const response = await api.get('/reports/stats');
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al obtener estadísticas');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Eliminar reporte
  async deleteReport(reportId) {
    try {
      const response = await api.delete(`/reports/${reportId}`);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al eliminar reporte');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Validar sistema de reportes
  async validateSystem() {
    try {
      const response = await api.get('/reports/system/validate');
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al validar sistema');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  }
};
