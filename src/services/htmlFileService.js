/**
 * Servicio para manejar archivos HTML desde la API del backend
 */

import { API_CONFIG } from '../config/api';

class HtmlFileService {
  constructor() {
    this.baseURL = `${API_CONFIG.BASE_URL}/frontend-html`;
  }

  // Configurar headers con autenticación
  getHeaders() {
    // El contexto de autenticación guarda el token como 'token', no 'auth_token'
    const token = localStorage.getItem('token');
    console.log('🔑 Token obtenido del localStorage:', token ? 'Presente' : 'No encontrado');
    
    if (!token) {
      throw new Error('No se encontró token de autenticación. Por favor, inicia sesión nuevamente.');
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Obtener archivos pendientes
  async getPendingFiles(limit = 20) {
    try {
      console.log('📥 Obteniendo archivos pendientes...');
      const response = await fetch(`${this.baseURL}/pending?limit=${limit}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Archivos pendientes obtenidos:', data.data.length);
        return data;
      } else {
        throw new Error(data.message || 'Error al obtener archivos pendientes');
      }
    } catch (error) {
      console.error('❌ Error al obtener archivos pendientes:', error);
      throw error;
    }
  }

  // Obtener archivos completados
  async getCompletedFiles(limit = 20) {
    try {
      console.log('📥 Obteniendo archivos completados...');
      const response = await fetch(`${this.baseURL}/completed?limit=${limit}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Archivos completados obtenidos:', data.data.length);
        return data;
      } else {
        throw new Error(data.message || 'Error al obtener archivos completados');
      }
    } catch (error) {
      console.error('❌ Error al obtener archivos completados:', error);
      throw error;
    }
  }

  // Obtener estadísticas
  async getStatusStats() {
    try {
      console.log('📊 Obteniendo estadísticas...');
      const response = await fetch(`${this.baseURL}/status-stats`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Estadísticas obtenidas:', data.data);
        return data;
      } else {
        throw new Error(data.message || 'Error al obtener estadísticas');
      }
    } catch (error) {
      console.error('❌ Error al obtener estadísticas:', error);
      throw error;
    }
  }

  // Obtener contenido HTML
  async getHtmlContent(filename) {
    try {
      console.log('📄 Obteniendo contenido HTML:', filename);
      const response = await fetch(`${this.baseURL}/content/${filename}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Contenido HTML obtenido');
        return data;
      } else {
        throw new Error(data.message || 'Error al obtener contenido HTML');
      }
    } catch (error) {
      console.error('❌ Error al obtener contenido HTML:', error);
      throw error;
    }
  }

  // Cambiar estado de archivo
  async updateFileStatus(filename, status) {
    try {
      console.log(`🔄 Cambiando estado de ${filename} a ${status}...`);
      const response = await fetch(`${this.baseURL}/file/${filename}/status`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ status })
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Estado actualizado exitosamente');
        return data;
      } else {
        throw new Error(data.message || 'Error al cambiar estado');
      }
    } catch (error) {
      console.error('❌ Error al cambiar estado:', error);
      throw error;
    }
  }

  // Obtener información de archivo
  async getFileInfo(filename) {
    try {
      console.log('ℹ️ Obteniendo información del archivo:', filename);
      const response = await fetch(`${this.baseURL}/info/${filename}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Información del archivo obtenida');
        return data;
      } else {
        throw new Error(data.message || 'Error al obtener información del archivo');
      }
    } catch (error) {
      console.error('❌ Error al obtener información del archivo:', error);
      throw error;
    }
  }

  // Eliminar archivo
  async deleteFile(filename) {
    try {
      console.log('🗑️ Eliminando archivo:', filename);
      const response = await fetch(`${this.baseURL}/file/${filename}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          // Si el archivo no existe, considerarlo como eliminado exitosamente
          console.log('⚠️ Archivo no encontrado, considerando como eliminado');
          return { success: true, message: 'Archivo ya no existe' };
        } else if (response.status === 401) {
          throw new Error('Token de autenticación inválido');
        } else {
          throw new Error(`Error del servidor: ${response.status}`);
        }
      }
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Archivo eliminado exitosamente');
        return data;
      } else {
        throw new Error(data.message || 'Error al eliminar archivo');
      }
    } catch (error) {
      console.error('❌ Error al eliminar archivo:', error);
      throw error;
    }
  }

  // Obtener todos los archivos (para búsqueda)
  async getAllFiles(limit = 50) {
    try {
      console.log('📋 Obteniendo todos los archivos...');
      const response = await fetch(`${this.baseURL}/list?limit=${limit}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Todos los archivos obtenidos:', data.data.length);
        return data;
      } else {
        throw new Error(data.message || 'Error al obtener archivos');
      }
    } catch (error) {
      console.error('❌ Error al obtener archivos:', error);
      throw error;
    }
  }
}

const htmlFileService = new HtmlFileService();
export default htmlFileService;
