import api from './api';
import { patientServiceMock } from './patientServiceMock';
import { PATIENT_CONFIG } from '../config/patientConfig';

// Función para detectar si el backend está disponible
const isBackendAvailable = async () => {
  try {
    // Probar con un endpoint que sabemos que existe
    const response = await fetch(`${PATIENT_CONFIG.API_URL}/patients`, {
      method: 'GET',
      timeout: 3000
    });
    // Si devuelve 401 (token requerido), significa que el endpoint existe
    return response.status === 401 || response.ok;
  } catch (error) {
    return false;
  }
};

// Función para decidir qué servicio usar
const getPatientService = async () => {
  if (PATIENT_CONFIG.USE_MOCK) {
    console.log('🔧 [PATIENT SERVICE] Usando servicio MOCK de pacientes');
    console.log('   ⚠️ Los cambios NO se guardan en la base de datos');
    return patientServiceMock;
  }
  
  const backendAvailable = await isBackendAvailable();
  if (!backendAvailable) {
    console.log('⚠️ [PATIENT SERVICE] Backend no disponible, usando servicio MOCK');
    console.log('   ⚠️ Los cambios NO se guardan en la base de datos');
    return patientServiceMock;
  }
  
  console.log('🌐 [PATIENT SERVICE] Usando servicio REAL de pacientes');
  console.log('   ✅ Los cambios SÍ se guardan en la base de datos');
  return patientServiceReal;
};

// Servicio real de pacientes
export const patientServiceReal = {
  // Crear nuevo paciente
  async createPatient(patientData) {
    try {
      const response = await api.post('/patients', patientData);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al crear paciente');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Obtener paciente por ID
  async getPatientById(id) {
    try {
      const response = await api.get(`/patients/${id}`);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al obtener paciente');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Obtener paciente por código
  async getPatientByCode(code) {
    try {
      const response = await api.get(`/patients/code/${code}`);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al obtener paciente');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Obtener paciente por DPI
  async getPatientByDpi(dpi) {
    try {
      const response = await api.get(`/patients/dpi/${dpi}`);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al obtener paciente');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Buscar pacientes
  async searchPatients(searchParams) {
    try {
      const response = await api.get('/patients/search', {
        params: searchParams
      });
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al buscar pacientes');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Listar todos los pacientes (con paginación)
  async getPatients(page = 1, perPage = 10, filters = {}) {
    try {
      const response = await api.get('/patients', {
        params: { 
          page, 
          per_page: perPage,
          ...filters
        }
      });
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al obtener pacientes');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Actualizar paciente
  async updatePatient(id, patientData) {
    try {
      const response = await api.put(`/patients/${id}`, patientData);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al actualizar paciente');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Desactivar paciente
  async deactivatePatient(id) {
    try {
      const response = await api.patch(`/patients/${id}/deactivate`);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al desactivar paciente');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Eliminar paciente permanentemente
  async deletePatient(id) {
    try {
      const response = await api.delete(`/patients/${id}`);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al eliminar paciente');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Reactivar paciente
  async activatePatient(id) {
    try {
      const response = await api.post(`/patients/${id}/activate`);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al reactivar paciente');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Obtener estadísticas de pacientes
  async getPatientStatistics() {
    try {
      const response = await api.get('/patients/statistics');
      
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
  }
};

// Servicio principal que decide automáticamente qué usar
export const patientService = {
  async createPatient(patientData) {
    const service = await getPatientService();
    return service.createPatient(patientData);
  },

  async getPatientById(id) {
    const service = await getPatientService();
    return service.getPatientById(id);
  },

  async getPatientByCode(code) {
    const service = await getPatientService();
    return service.getPatientByCode(code);
  },

  async getPatientByDpi(dpi) {
    const service = await getPatientService();
    return service.getPatientByDpi(dpi);
  },

  async searchPatients(searchParams) {
    const service = await getPatientService();
    return service.searchPatients(searchParams);
  },

  async getPatients(page = 1, perPage = 10, filters = {}) {
    const service = await getPatientService();
    return service.getPatients(page, perPage, filters);
  },

  async updatePatient(id, patientData) {
    const service = await getPatientService();
    return service.updatePatient(id, patientData);
  },

  async deactivatePatient(id) {
    const service = await getPatientService();
    return service.deactivatePatient(id);
  },

  async deletePatient(id) {
    const service = await getPatientService();
    return service.deletePatient(id);
  },

  async activatePatient(id) {
    const service = await getPatientService();
    return service.activatePatient(id);
  },

  async getPatientStatistics() {
    const service = await getPatientService();
    return service.getPatientStatistics();
  }
};

export default patientService;
