// Utilidad para limpiar datos de formulario antes de enviar al backend
// Convierte cadenas vacías a null para evitar errores de PostgreSQL

export const cleanFormData = (formData) => {
  const cleaned = { ...formData };
  
  // Lista de campos que pueden ser null en la base de datos
  const nullableFields = [
    'date_of_birth',
    'phone',
    'address',
    'gender',
    'emergency_contact',
    'emergency_phone',
    'medical_history',
    'allergies',
    'current_medications',
    'profile_image_url'
  ];
  
  // Convertir cadenas vacías a null para campos opcionales
  nullableFields.forEach(field => {
    if (cleaned[field] === '') {
      cleaned[field] = null;
    }
  });
  
  return cleaned;
};

// Función específica para limpiar datos de perfil de usuario
// Función para limpiar datos de perfil de usuario (no paciente)
export const cleanUserProfileData = (formData) => {
  const cleaned = { ...formData };
  
  // Limpiar y validar cada campo
  Object.keys(cleaned).forEach(key => {
    let value = cleaned[key];
    
    // Convertir null/undefined a cadena vacía
    if (value === null || value === undefined) {
      value = '';
    }
    
    // Convertir a string y trim
    value = String(value).trim();
    
    // Limpiar caracteres problemáticos
    if (key === 'email') {
      // Solo permitir caracteres válidos para email
      value = value.replace(/[^a-zA-Z0-9@._-]/g, '');
    } else if (key === 'phone') {
      // Solo permitir números, +, -, espacios, paréntesis
      value = value.replace(/[^\d\s+\-()]/g, '');
    } else if (key === 'date_of_birth') {
      // Validar formato de fecha YYYY-MM-DD
      if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        value = '';
      }
    } else {
      // Para otros campos, remover caracteres de control
      // eslint-disable-next-line no-control-regex
      value = value.replace(/[\x00-\x1F\x7F]/g, '');
    }
    
    // Limitar longitud de campos
    const maxLengths = {
      first_name: 100,
      last_name: 100,
      email: 255,
      phone: 20,
      address: 500,
      emergency_contact: 100,
      emergency_phone: 20,
      medical_history: 2000,
      allergies: 1000,
      current_medications: 1000
    };
    
    if (maxLengths[key] && value.length > maxLengths[key]) {
      value = value.substring(0, maxLengths[key]);
    }
    
    cleaned[key] = value;
  });
  
  return cleaned;
};

// Función para preparar datos de perfil de usuario para el backend
// Ahora envía TODOS los campos disponibles por el endpoint PUT /api/auth/profile
export const prepareUserProfileForBackend = (formData) => {
  // TODOS los campos disponibles para actualización
  // eslint-disable-next-line no-unused-vars
  // Lista de todos los campos disponibles para referencia
  // const allAvailableFields = [
  //   'username',
  //   'email',
  //   'first_name',
  //   'last_name',
  //   'phone',
  //   'role',
  //   'is_active',
  //   'address',
  //   'date_of_birth',
  //   'gender',
  //   'emergency_contact',
  //   'emergency_phone',
  //   'medical_history',
  //   'allergies',
  //   'current_medications',
  //   'profile_image_url'
  // ];
  
  // Limpiar los datos primero
  const cleanedData = cleanUserProfileData(formData);
  
  // Incluir todos los campos disponibles (excepto campos sensibles)
  const backendData = {};
  const availableFields = [
    'email',
    'first_name',
    'last_name',
    'phone',
    'address',
    'date_of_birth',
    'gender',
    'emergency_contact',
    'emergency_phone',
    'medical_history',
    'allergies',
    'current_medications',
    'profile_image_url'
  ];
  
  availableFields.forEach(field => {
    if (cleanedData[field] !== undefined && cleanedData[field] !== '') {
      backendData[field] = cleanedData[field];
    }
  });
  
  // Campos que no se deben enviar por seguridad
  const sensitiveFields = ['role', 'is_active', 'username'];
  sensitiveFields.forEach(field => {
    delete backendData[field];
  });
  
  console.log('prepareUserProfileForBackend - Original data:', formData);
  console.log('prepareUserProfileForBackend - Cleaned data:', cleanedData);
  console.log('prepareUserProfileForBackend - Backend data (all fields):', backendData);
  console.log('prepareUserProfileForBackend - Fields being sent:', Object.keys(backendData));
  
  return backendData;
};

export default cleanFormData;
