import api from './api';

export const adminService = {
  // Registrar nuevo usuario
  async createUser(token, userData) {
    try {
      const response = await api.post('/admin/users', userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('adminService.createUser - Full response:', response.data);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error al crear usuario');
      }
    } catch (error) {
      console.error('adminService.createUser - Error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Listar usuarios con paginación
  async getUsers(token, page = 1, perPage = 10) {
    try {
      const response = await api.get(`/admin/users?page=${page}&per_page=${perPage}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('adminService.getUsers - Full response:', response.data);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error al obtener usuarios');
      }
    } catch (error) {
      console.error('adminService.getUsers - Error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Obtener usuario por ID
  async getUserById(token, userId) {
    try {
      const response = await api.get(`/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('adminService.getUserById - Full response:', response.data);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error al obtener usuario');
      }
    } catch (error) {
      console.error('adminService.getUserById - Error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Actualizar usuario
  async updateUser(token, userId, userData) {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('adminService.updateUser - Full response:', response.data);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error al actualizar usuario');
      }
    } catch (error) {
      console.error('adminService.updateUser - Error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Activar/desactivar usuario
  async toggleUserStatus(token, userId) {
    try {
      const response = await api.put(`/admin/users/${userId}/toggle-status`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('adminService.toggleUserStatus - Full response:', response.data);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error al cambiar estado del usuario');
      }
    } catch (error) {
      console.error('adminService.toggleUserStatus - Error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Eliminar usuario (si está implementado en el backend)
  async deleteUser(token, userId) {
    try {
      const response = await api.delete(`/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('adminService.deleteUser - Full response:', response.data);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error al eliminar usuario');
      }
    } catch (error) {
      console.error('adminService.deleteUser - Error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  }
};

