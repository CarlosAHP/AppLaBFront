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
    // Si devuelve 200, también está disponible
    // Si devuelve 500, el servidor está funcionando pero hay error interno
    const isAvailable = response.status === 401 || response.status === 200 || response.status === 500;
    
    console.log(`Backend availability check: ${response.status} - ${isAvailable ? 'Available' : 'Not available'}`);
    return isAvailable;
  } catch (error) {
    console.log('Backend availability check failed:', error.message);
    return false;
  }
};

// Función para verificar autenticación antes de hacer peticiones
const ensureAuthentication = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('⚠️ No token found, authentication required');
    return false;
  }
  
  try {
    // Verificar que el token sea válido
    const response = await fetch(`${PATIENT_CONFIG.API_URL}/auth/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('✅ Token is valid');
      return true;
    } else {
      console.log('❌ Token is invalid, clearing auth data');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }
  } catch (error) {
    console.log('❌ Token verification failed:', error.message);
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
    console.log('⚠️ [PATIENT SERVICE] Backend no disponible - NO se mostrarán pacientes');
    console.log('   ❌ Sin conexión a la API - Lista de pacientes vacía');
    return null; // No usar mock, devolver null para indicar sin conexión
  }
  
  // Verificar autenticación antes de usar el servicio real
  const isAuthenticated = await ensureAuthentication();
  if (!isAuthenticated) {
    console.log('⚠️ [PATIENT SERVICE] No autenticado - NO se mostrarán pacientes');
    console.log('   ❌ Token inválido o expirado - Lista de pacientes vacía');
    return null;
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
      // Si es error 401, intentar una vez más después de un breve delay
      if (error.response?.status === 401) {
        console.log('401 error on searchPatients, retrying once...');
        try {
          // Esperar un poco y reintentar
          await new Promise(resolve => setTimeout(resolve, 1000));
          const retryResponse = await api.get('/patients/search', {
            params: searchParams
          });
          
          if (retryResponse.data.success) {
            return retryResponse.data;
          }
        } catch (retryError) {
          console.log('Retry failed:', retryError.message);
        }
      }
      
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
      // Si es error 401, intentar una vez más después de un breve delay
      if (error.response?.status === 401) {
        console.log('401 error on getPatients, retrying once...');
        try {
          // Esperar un poco y reintentar
          await new Promise(resolve => setTimeout(resolve, 1000));
          const retryResponse = await api.get('/patients', {
            params: { 
              page, 
              per_page: perPage,
              ...filters
            }
          });
          
          if (retryResponse.data.success) {
            return retryResponse.data;
          }
        } catch (retryError) {
          console.log('Retry failed:', retryError.message);
        }
      }
      
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
    if (!service) {
      throw new Error('Sin conexión a la API. No se pueden crear pacientes.');
    }
    return service.createPatient(patientData);
  },

  async getPatientById(id) {
    const service = await getPatientService();
    if (!service) {
      throw new Error('Sin conexión a la API. No se pueden obtener pacientes.');
    }
    return service.getPatientById(id);
  },

  async getPatientByCode(code) {
    const service = await getPatientService();
    if (!service) {
      throw new Error('Sin conexión a la API. No se pueden obtener pacientes.');
    }
    return service.getPatientByCode(code);
  },

  async getPatientByDpi(dpi) {
    const service = await getPatientService();
    if (!service) {
      throw new Error('Sin conexión a la API. No se pueden obtener pacientes.');
    }
    return service.getPatientByDpi(dpi);
  },

  async searchPatients(searchParams) {
    const service = await getPatientService();
    if (!service) {
      // Devolver lista vacía en lugar de error para búsquedas
      return {
        success: true,
        data: [],
        search_term: searchParams.query || searchParams.q || '',
        total: 0
      };
    }
    return service.searchPatients(searchParams);
  },

  async getPatients(page = 1, perPage = 10, filters = {}) {
    const service = await getPatientService();
    if (!service) {
      // Devolver lista vacía en lugar de error para listados
      return {
        success: true,
        data: [],
        pagination: {
          page: page,
          per_page: perPage,
          total: 0,
          pages: 0
        }
      };
    }
    return service.getPatients(page, perPage, filters);
  },

  async updatePatient(id, patientData) {
    const service = await getPatientService();
    if (!service) {
      throw new Error('Sin conexión a la API. No se pueden actualizar pacientes.');
    }
    return service.updatePatient(id, patientData);
  },

  async deactivatePatient(id) {
    const service = await getPatientService();
    if (!service) {
      throw new Error('Sin conexión a la API. No se pueden desactivar pacientes.');
    }
    return service.deactivatePatient(id);
  },

  async deletePatient(id) {
    const service = await getPatientService();
    if (!service) {
      throw new Error('Sin conexión a la API. No se pueden eliminar pacientes.');
    }
    return service.deletePatient(id);
  },

  async activatePatient(id) {
    const service = await getPatientService();
    if (!service) {
      throw new Error('Sin conexión a la API. No se pueden reactivar pacientes.');
    }
    return service.activatePatient(id);
  },

  async getPatientStatistics() {
    const service = await getPatientService();
    if (!service) {
      throw new Error('Sin conexión a la API. No se pueden obtener estadísticas.');
    }
    return service.getPatientStatistics();
  }
};

export default patientService;
