import api from './api';

export const frontendHtmlService = {
  // Subir archivo HTML desde el frontend
  async uploadHtmlFile(htmlContent, metadata = {}) {
    try {
      console.log('📤 Enviando datos al servidor...');
      console.log('📋 Metadatos recibidos:', metadata);
      
      // Generar número de orden único si no se proporciona

      // Solo incluir campos que tienen datos reales
      const requestData = {
        html_content: htmlContent,
        status: 'pending',
        source: 'frontend',
        prefix: 'frontend'
      };

      // Agregar campos solo si tienen datos
      if (metadata.original_filename) requestData.original_filename = metadata.original_filename;
      if (metadata.patient_name) requestData.patient_name = metadata.patient_name;
      if (metadata.order_number) requestData.order_number = metadata.order_number;
      if (metadata.doctor_name) requestData.doctor_name = metadata.doctor_name;
      if (metadata.patient_age !== undefined && metadata.patient_age !== null) requestData.patient_age = metadata.patient_age;
      if (metadata.patient_gender) requestData.patient_gender = metadata.patient_gender;
      if (metadata.reception_date) requestData.reception_date = metadata.reception_date;
      if (metadata.tests && metadata.tests.length > 0) requestData.tests = metadata.tests;
      if (metadata.created_by) requestData.created_by = metadata.created_by;
      if (metadata.created_at) requestData.created_at = metadata.created_at;
      if (metadata.notes) requestData.notes = metadata.notes;
      
      console.log('📦 Datos a enviar:', requestData);
      console.log('📊 Estructura de datos:', JSON.stringify(requestData, null, 2));
      console.log('🔍 Verificando campos específicos:');
      console.log('   - patient_age:', requestData.patient_age);
      console.log('   - patient_gender:', requestData.patient_gender);
      console.log('   - reception_date:', requestData.reception_date);
      console.log('   - source:', requestData.source);
      console.log('   - prefix:', requestData.prefix);
      
      const response = await api.post('/frontend-html/upload', requestData);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al subir archivo HTML');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Obtener archivo HTML por nombre
  async getHtmlFile(filename) {
    try {
      const response = await api.get(`/frontend-html/file/${filename}`);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al obtener archivo HTML');
    }
  },

  // Obtener contenido HTML como JSON
  async getHtmlContent(filename) {
    try {
      const response = await api.get(`/frontend-html/content/${filename}`);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al obtener contenido HTML');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Listar archivos HTML disponibles
  async listHtmlFiles() {
    try {
      const response = await api.get('/frontend-html/list');
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al listar archivos');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Actualizar archivo HTML existente
  async updateHtmlFile(filename, htmlContent, metadata = {}) {
    try {
      const response = await api.put(`/frontend-html/file/${filename}`, {
        html_content: htmlContent,
        metadata: {
          ...metadata,
          updated_at: new Date().toISOString()
        }
      });
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al actualizar archivo HTML');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Eliminar archivo HTML
  async deleteHtmlFile(filename) {
    try {
      const response = await api.delete(`/frontend-html/file/${filename}`);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al eliminar archivo HTML');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Obtener información del archivo
  async getFileInfo(filename) {
    try {
      const response = await api.get(`/frontend-html/info/${filename}`);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al obtener información del archivo');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Buscar archivos HTML
  async searchHtmlFiles(searchCriteria) {
    try {
      const response = await api.get('/frontend-html/search', {
        params: searchCriteria
      });
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al buscar archivos');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Crear backup de archivos
  async createBackup() {
    try {
      const response = await api.post('/frontend-html/backup');
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al crear backup');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Validar sistema
  async validateSystem() {
    try {
      const response = await api.get('/frontend-html/system/validate');
      
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
  },

  // Obtener estadísticas del sistema
  async getSystemStats() {
    try {
      const response = await api.get('/frontend-html/stats');
      
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

  // Obtener archivos recientes
  async getRecentFiles(limit = 10) {
    try {
      const response = await api.get('/frontend-html/recent', {
        params: { limit }
      });
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al obtener archivos recientes');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Descargar archivo HTML
  async downloadHtmlFile(filename) {
    try {
      const response = await api.get(`/frontend-html/download/${filename}`, {
        responseType: 'blob'
      });
      
      // Crear blob y descargar
      const blob = new Blob([response.data], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return { success: true, message: 'Archivo descargado exitosamente' };
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al descargar archivo');
    }
  },

  // ===== NUEVOS MÉTODOS PARA MANEJO DE ESTADOS =====

  // Obtener archivos pendientes
  async getPendingFiles() {
    try {
      const response = await api.get('/frontend-html/pending');
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al obtener archivos pendientes');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Obtener archivos completados
  async getCompletedFiles() {
    try {
      const response = await api.get('/frontend-html/completed');
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al obtener archivos completados');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Filtrar archivos por estado
  async getFilesByStatus(status) {
    try {
      const response = await api.get('/frontend-html/status', {
        params: { status }
      });
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al filtrar archivos por estado');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Actualizar estado de un archivo
  async updateFileStatus(filename, status) {
    try {
      const response = await api.patch(`/frontend-html/file/${filename}/status`, {
        status: status
      });
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al actualizar estado del archivo');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Obtener estadísticas por estado
  async getStatusStats() {
    try {
      const response = await api.get('/frontend-html/status-stats');
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al obtener estadísticas por estado');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Marcar archivo como completado
  async markAsCompleted(filename) {
    return this.updateFileStatus(filename, 'completed');
  },

  // Marcar archivo como pendiente
  async markAsPending(filename) {
    return this.updateFileStatus(filename, 'pending');
  },

  // Marcar archivo como cancelado
  async markAsCancelled(filename) {
    return this.updateFileStatus(filename, 'cancelled');
  },

  // Obtener historial de ediciones de un archivo
  async getEditHistory(filename) {
    try {
      const response = await api.get(`/frontend-html/file/${filename}/edit-history`);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al obtener historial de ediciones');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Obtener estadísticas de edición de un archivo
  async getEditStats(filename) {
    try {
      const response = await api.get(`/frontend-html/file/${filename}/edit-stats`);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al obtener estadísticas de edición');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Obtener archivos modificados
  async getModifiedFiles(limit = 20) {
    try {
      const response = await api.get(`/frontend-html/modified?limit=${limit}`);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al obtener archivos modificados');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Obtener resumen de estadísticas de edición
  async getEditStatsSummary() {
    try {
      const response = await api.get('/frontend-html/edit-stats-summary');
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al obtener resumen de estadísticas');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  }
};
