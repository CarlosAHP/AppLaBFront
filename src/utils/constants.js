// Constantes de la aplicación
export const API_BASE_URL = 'http://localhost:5000';

export const USER_ROLES = {
  ADMIN: 'admin',
  SECRETARIA: 'secretaria',
  MEDICO: 'medico'
};

export const ROLE_DISPLAY_NAMES = {
  [USER_ROLES.ADMIN]: 'Administrador',
  [USER_ROLES.SECRETARIA]: 'Secretaria',
  [USER_ROLES.MEDICO]: 'Médico'
};

export const LAB_RESULT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const LAB_RESULT_STATUS_LABELS = {
  [LAB_RESULT_STATUS.PENDING]: 'Pendiente',
  [LAB_RESULT_STATUS.COMPLETED]: 'Completado',
  [LAB_RESULT_STATUS.CANCELLED]: 'Cancelado'
};

export const PAYMENT_METHODS = {
  EFECTIVO: 'efectivo',
  TARJETA: 'tarjeta',
  TRANSFERENCIA: 'transferencia',
  CHEQUE: 'cheque'
};

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.EFECTIVO]: 'Efectivo',
  [PAYMENT_METHODS.TARJETA]: 'Tarjeta',
  [PAYMENT_METHODS.TRANSFERENCIA]: 'Transferencia',
  [PAYMENT_METHODS.CHEQUE]: 'Cheque'
};

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  LAB_RESULTS: '/lab-results',
  PAYMENTS: '/payments',
  SYNC: '/sync',
  REGISTER: '/register'
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user'
};

export const TOAST_CONFIG = {
  position: 'top-right',
  duration: 4000,
  style: {
    background: '#363636',
    color: '#fff',
  },
  success: {
    duration: 3000,
    iconTheme: {
      primary: '#10B981',
      secondary: '#fff',
    },
  },
  error: {
    duration: 5000,
    iconTheme: {
      primary: '#EF4444',
      secondary: '#fff',
    },
  },
};

