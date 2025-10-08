export const syncService = {
  async getSyncStatus() {
    try {
      // Como el endpoint /sync no existe, simulamos el estado
      const mockSyncStatus = {
        success: true,
        data: {
          isOnline: true,
          lastSync: new Date().toISOString(),
          syncInProgress: false,
          lastError: null,
          dataCount: {
            labResults: 5,
            payments: 2,
            users: 1,
          },
        }
      };
      
      return mockSyncStatus;
    } catch (error) {
      throw new Error('Error al obtener estado de sincronización');
    }
  },

  async triggerSync() {
    try {
      // Simulamos una sincronización exitosa
      const mockSyncResult = {
        success: true,
        message: 'Sincronización completada exitosamente',
        data: {
          syncedAt: new Date().toISOString(),
          recordsProcessed: 10
        }
      };
      
      return mockSyncResult;
    } catch (error) {
      throw new Error('Error al iniciar sincronización');
    }
  }
};

