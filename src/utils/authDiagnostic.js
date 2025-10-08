// Utilidades para diagnosticar problemas de autenticación

export const testCredentials = async (username, password) => {
  const results = {
    username: username,
    password: password,
    tests: [],
    isValid: false,
    error: null
  };

  // Test 1: Verificar formato de username
  if (!username || username.trim().length === 0) {
    results.tests.push({
      name: 'Username Format',
      status: 'error',
      message: 'Username no puede estar vacío'
    });
    return results;
  }

  if (username.length < 3) {
    results.tests.push({
      name: 'Username Format',
      status: 'error',
      message: 'Username debe tener al menos 3 caracteres'
    });
    return results;
  }

  results.tests.push({
    name: 'Username Format',
    status: 'success',
    message: 'Formato de username válido'
  });

  // Test 2: Verificar formato de password
  if (!password || password.trim().length === 0) {
    results.tests.push({
      name: 'Password Format',
      status: 'error',
      message: 'Password no puede estar vacío'
    });
    return results;
  }

  if (password.length < 6) {
    results.tests.push({
      name: 'Password Format',
      status: 'warning',
      message: 'Password muy corto (mínimo 6 caracteres)'
    });
  } else {
    results.tests.push({
      name: 'Password Format',
      status: 'success',
      message: 'Formato de password válido'
    });
  }

  // Test 3: Verificar credenciales conocidas
  const knownCredentials = [
    { username: 'admin', password: 'Admin123!', role: 'admin' },
    { username: 'doctor1', password: 'Doctor123!', role: 'doctor' },
    { username: 'secretaria1', password: 'Secret123!', role: 'secretary' },
    { username: 'tecnico1', password: 'Tecnic123!', role: 'technician' }
  ];

  const knownCredential = knownCredentials.find(
    cred => cred.username === username && cred.password === password
  );

  if (knownCredential) {
    results.tests.push({
      name: 'Known Credentials',
      status: 'success',
      message: `Credenciales válidas para rol: ${knownCredential.role}`
    });
    results.isValid = true;
  } else {
    results.tests.push({
      name: 'Known Credentials',
      status: 'warning',
      message: 'Credenciales no coinciden con las de prueba'
    });
  }

  return results;
};

export const getCredentialSuggestions = (username) => {
  const suggestions = {
    admin: { username: 'admin', password: 'Admin123!' },
    doctor: { username: 'doctor1', password: 'Doctor123!' },
    secretary: { username: 'secretaria1', password: 'Secret123!' },
    technician: { username: 'tecnico1', password: 'Tecnic123!' }
  };

  // Si el username coincide parcialmente, sugerir
  for (const [role, creds] of Object.entries(suggestions)) {
    if (creds.username.toLowerCase().includes(username.toLowerCase()) ||
        username.toLowerCase().includes(creds.username.toLowerCase())) {
      return {
        found: true,
        role,
        suggestion: creds
      };
    }
  }

  return { found: false };
};

export const validateLoginRequest = (username, password) => {
  const errors = [];

  if (!username) {
    errors.push('Username es requerido');
  }

  if (!password) {
    errors.push('Password es requerido');
  }

  if (username && username.length < 3) {
    errors.push('Username debe tener al menos 3 caracteres');
  }

  if (password && password.length < 6) {
    errors.push('Password debe tener al menos 6 caracteres');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const formatAuthError = (error) => {
  if (!error) return 'Error desconocido';

  const errorMessage = error.message || error.toString();

  // Errores específicos del backend
  if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
    return 'Credenciales incorrectas. Verifica tu username y password.';
  }

  if (errorMessage.includes('429')) {
    return 'Demasiados intentos. Espera un momento antes de intentar de nuevo.';
  }

  if (errorMessage.includes('CORS') || errorMessage.includes('ERR_NETWORK')) {
    return 'Error de conexión. Verifica que el servidor esté ejecutándose.';
  }

  if (errorMessage.includes('timeout')) {
    return 'Tiempo de espera agotado. El servidor no responde.';
  }

  return errorMessage;
};

const authDiagnosticUtils = {
  testCredentials,
  getCredentialSuggestions,
  validateLoginRequest,
  formatAuthError
};

export default authDiagnosticUtils;
