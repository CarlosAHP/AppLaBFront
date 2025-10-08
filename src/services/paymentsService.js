import api from './api';

export const paymentsService = {
  // Simulamos una lista de pagos local para el dashboard
  async getPayments(page = 1, perPage = 10) {
    try {
      // Como el backend no tiene GET /payments, retornamos datos simulados
      const mockPayments = {
        success: true,
        data: [
          {
            id: 1,
            amount: 150.00,
            patient_name: 'Juan Pérez',
            payment_method: 'Efectivo',
            created_at: new Date().toISOString(),
            status: 'completed'
          },
          {
            id: 2,
            amount: 200.00,
            patient_name: 'María García',
            payment_method: 'Tarjeta',
            created_at: new Date().toISOString(),
            status: 'completed'
          }
        ],
        pagination: {
          page: 1,
          per_page: 10,
          total: 2,
          pages: 1
        }
      };
      
      return mockPayments;
    } catch (error) {
      throw new Error('Error al obtener pagos');
    }
  },

  async createPayment(paymentData) {
    try {
      const response = await api.post('/payments', paymentData);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al crear pago');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  // Funciones simuladas para mantener compatibilidad
  async updatePayment(id, paymentData) {
    throw new Error('Función no implementada en el backend');
  },

  async deletePayment(id) {
    throw new Error('Función no implementada en el backend');
  }
};

