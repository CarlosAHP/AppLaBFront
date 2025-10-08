import api from './api';

export const authService = {
  async login(username, password) {
    try {
      const response = await api.post('/auth/login', {
        username,
        password
      });
      
      // console.log('authService - Full response:', response);
      // console.log('authService - Response data:', response.data);
      // console.log('authService - Response data success:', response.data.success);
      // console.log('authService - Response data.data:', response.data.data);
      // console.log('authService - Response data.data user:', response.data.data?.user);
      // console.log('authService - Response data.data token:', response.data.data?.token);
      
      if (response.data.success) {
        return {
          user: response.data.data?.user,
          token: response.data.data?.token
        };
      } else {
        throw new Error(response.data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Login error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url
      });

      if (error.response?.status === 401) {
        throw new Error('Credenciales incorrectas. Verifica tu username y password.');
      }
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      if (error.response?.status) {
        throw new Error(`Error del servidor: ${error.response.status} - ${error.response.statusText}`);
      }
      
      throw new Error('Error de conexión con el servidor');
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success) {
        return {
          user: response.data.data?.user,
          token: response.data.data?.token
        };
      } else {
        throw new Error(response.data.message || 'Error al registrar usuario');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  async verifyToken(token) {
    try {
      const response = await api.post('/auth/verify', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        return response.data.user;
      } else {
        throw new Error('Token inválido');
      }
    } catch (error) {
      throw new Error('Token inválido');
    }
  },

  async logout(token) {
    try {
      const response = await api.post('/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data.success;
    } catch (error) {
      // Incluso si hay error, consideramos el logout exitoso
      return true;
    }
  },

  async getProfile(token) {
    try {
      const response = await api.get('/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('authService.getProfile - Full response:', response.data);
      
      if (response.data.success) {
        // El backend devuelve los datos en response.data.data
        return response.data.data || response.data.user;
      } else {
        throw new Error(response.data.message || 'Error al obtener perfil');
      }
    } catch (error) {
      console.error('authService.getProfile - Error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al obtener perfil');
    }
  },

  async updateProfile(token, userData) {
    try {
      console.log('authService.updateProfile - Sending data:', JSON.stringify(userData, null, 2));
      console.log('authService.updateProfile - Token:', token ? 'Present' : 'Missing');
      console.log('authService.updateProfile - Token length:', token ? token.length : 0);
      console.log('authService.updateProfile - Data keys:', Object.keys(userData));
      console.log('authService.updateProfile - Data types:', Object.keys(userData).reduce((acc, key) => {
        acc[key] = typeof userData[key];
        return acc;
      }, {}));
      
      const response = await api.put('/auth/profile', userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('authService.updateProfile - Full response:', response.data);
      
      if (response.data.success) {
        // Devolver la respuesta completa para que el componente pueda acceder a success y data
        return {
          success: true,
          data: response.data.data || response.data.user,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Error al actualizar perfil');
      }
    } catch (error) {
      console.error('authService.updateProfile - Error:', error);
      console.error('authService.updateProfile - Error response:', error.response?.data);
      console.error('authService.updateProfile - Error status:', error.response?.status);
      console.error('authService.updateProfile - Error headers:', error.response?.headers);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      if (error.response?.status === 500) {
        throw new Error('Error interno del servidor. Por favor, contacta al administrador.');
      }
      
      throw new Error('Error de conexión con el servidor');
    }
  },

  async getRoles(token) {
    try {
      const response = await api.get('/auth/roles', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        return response.data.roles;
      } else {
        throw new Error('Error al obtener roles');
      }
    } catch (error) {
      throw new Error('Error al obtener roles');
    }
  }
};
