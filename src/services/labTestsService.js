import api from './api';

export const labTestsService = {
  // Obtener lista de todas las pruebas disponibles
  async getLabTests() {
    try {
      const response = await api.get('/lab-tests/list');
      console.log('Lab tests response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching lab tests:', error);
      throw new Error('Error al obtener la lista de pruebas');
    }
  },

  // Obtener categorías de pruebas
  async getCategories() {
    try {
      const response = await api.get('/lab-tests/categories');
      console.log('Categories response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Error al obtener las categorías');
    }
  },

  // Buscar pruebas por término
  async searchTests(query) {
    try {
      const response = await api.get('/lab-tests/search', {
        params: { q: query }
      });
      console.log('Search tests response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error searching tests:', error);
      throw new Error('Error al buscar pruebas');
    }
  },

  // Obtener archivo HTML específico
  async getHtmlFile(filename) {
    try {
      const response = await api.get(`/lab-tests/html/${filename}`, {
        responseType: 'text'
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching HTML file:', error);
      throw new Error('Error al obtener el archivo HTML');
    }
  }
};
