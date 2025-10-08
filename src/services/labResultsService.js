import api from './api';

export const labResultsService = {
  async getLabResults(page = 1, perPage = 10) {
    try {
      const response = await api.get('/lab-results', {
        params: { page, per_page: perPage }
      });
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al obtener resultados');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  async createLabResult(labResultData) {
    try {
      const response = await api.post('/lab-results', labResultData);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al crear resultado');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  async updateLabResult(id, labResultData) {
    try {
      const response = await api.put(`/lab-results/${id}`, labResultData);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al actualizar resultado');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  async deleteLabResult(id) {
    try {
      const response = await api.delete(`/lab-results/${id}`);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al eliminar resultado');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  async getUserResults(userId) {
    try {
      const response = await api.get(`/lab-results/user/${userId}`);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al obtener resultados del usuario');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  async getLabResultsByPatient(patientId) {
    try {
      const response = await api.get(`/lab-results/patient/${patientId}`);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al obtener resultados del paciente');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  }
};

