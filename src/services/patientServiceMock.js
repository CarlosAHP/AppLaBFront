/**
 * Servicio Mock para Pacientes
 * Este servicio simula la API de pacientes para permitir el desarrollo y prueba
 * del frontend mientras se implementa el backend real.
 */

// Datos mock de pacientes
const mockPatients = [
  {
    id: 1,
    patient_code: "P20241215001",
    dpi: "1234567890123",
    first_name: "Juan Carlos",
    last_name: "Pérez García",
    middle_name: "Antonio",
    full_name: "Juan Carlos Antonio Pérez García",
    email: "juan.perez@email.com",
    phone: "5555-1234",
    phone_secondary: "5555-5678",
    date_of_birth: "1990-05-15",
    age: 34,
    gender: "masculino",
    marital_status: "soltero",
    occupation: "Ingeniero",
    nationality: "Guatemalteco",
    address: "Zona 10, Ciudad de Guatemala",
    city: "Guatemala",
    department: "Guatemala",
    postal_code: "01010",
    blood_type: "O+",
    allergies: "Ninguna conocida",
    medical_history: "Sin antecedentes médicos relevantes",
    current_medications: "Ninguna",
    chronic_conditions: "Ninguna",
    emergency_contact_name: "María García",
    emergency_contact_phone: "5555-9999",
    emergency_contact_relationship: "madre",
    insurance_company: "Seguro Social",
    insurance_policy_number: "SS-123456",
    insurance_phone: "5555-0000",
    notes: "Paciente de prueba para el sistema",
    profile_image_url: null,
    is_active: true,
    created_at: "2024-12-15T10:30:00",
    updated_at: "2024-12-15T10:30:00",
    created_by: 1
  },
  {
    id: 2,
    patient_code: "P20241215002",
    dpi: "9876543210987",
    first_name: "María Elena",
    last_name: "Rodríguez López",
    middle_name: "Isabel",
    full_name: "María Elena Isabel Rodríguez López",
    email: "maria.rodriguez@email.com",
    phone: "5555-2468",
    phone_secondary: "5555-1357",
    date_of_birth: "1985-08-22",
    age: 39,
    gender: "femenino",
    marital_status: "casada",
    occupation: "Doctora",
    nationality: "Guatemalteca",
    address: "Zona 15, Ciudad de Guatemala",
    city: "Guatemala",
    department: "Guatemala",
    postal_code: "01015",
    blood_type: "A+",
    allergies: "Penicilina",
    medical_history: "Hipertensión controlada",
    current_medications: "Losartán 50mg",
    chronic_conditions: "Hipertensión arterial",
    emergency_contact_name: "Carlos Rodríguez",
    emergency_contact_phone: "5555-8888",
    emergency_contact_relationship: "esposo",
    insurance_company: "IGSS",
    insurance_policy_number: "IGSS-789012",
    insurance_phone: "5555-1111",
    notes: "Paciente con hipertensión controlada",
    profile_image_url: null,
    is_active: true,
    created_at: "2024-12-15T11:15:00",
    updated_at: "2024-12-15T11:15:00",
    created_by: 1
  },
  {
    id: 3,
    patient_code: "P20241215003",
    dpi: "4567891234567",
    first_name: "Carlos Alfonso",
    last_name: "Hernández Pérez",
    middle_name: "Eduardo",
    full_name: "Carlos Alfonso Eduardo Hernández Pérez",
    email: "carlos.hernandez@email.com",
    phone: "5555-3691",
    phone_secondary: "5555-2580",
    date_of_birth: "1992-12-03",
    age: 32,
    gender: "masculino",
    marital_status: "soltero",
    occupation: "Abogado",
    nationality: "Guatemalteco",
    address: "Zona 4, Ciudad de Guatemala",
    city: "Guatemala",
    department: "Guatemala",
    postal_code: "01004",
    blood_type: "B+",
    allergies: "Ninguna conocida",
    medical_history: "Sin antecedentes médicos relevantes",
    current_medications: "Ninguna",
    chronic_conditions: "Ninguna",
    emergency_contact_name: "Ana Hernández",
    emergency_contact_phone: "5555-7777",
    emergency_contact_relationship: "madre",
    insurance_company: "Seguro Privado",
    insurance_policy_number: "SP-345678",
    insurance_phone: "5555-2222",
    notes: "Paciente joven sin antecedentes",
    profile_image_url: null,
    is_active: true,
    created_at: "2024-12-15T12:00:00",
    updated_at: "2024-12-15T12:00:00",
    created_by: 1
  }
];

// Simular delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generar código de paciente único
const generatePatientCode = () => {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `P${dateStr}${random}`;
};

// Calcular edad
const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Crear nombre completo
const createFullName = (first, middle, last) => {
  const parts = [first, middle, last].filter(Boolean);
  return parts.join(' ');
};

export const patientServiceMock = {
  // Crear nuevo paciente
  async createPatient(patientData) {
    await delay(800); // Simular delay de red
    
    // Validaciones básicas
    if (!patientData.first_name || !patientData.last_name) {
      throw new Error('El primer nombre y apellido son requeridos');
    }
    
    if (patientData.dpi) {
      // Verificar si el DPI ya existe
      const existingPatient = mockPatients.find(p => p.dpi === patientData.dpi);
      if (existingPatient) {
        throw new Error('Ya existe un paciente con este DPI');
      }
    }
    
    // Crear nuevo paciente
    const newPatient = {
      id: mockPatients.length + 1,
      patient_code: generatePatientCode(),
      dpi: patientData.dpi || null,
      first_name: patientData.first_name,
      last_name: patientData.last_name,
      middle_name: patientData.middle_name || null,
      full_name: createFullName(patientData.first_name, patientData.middle_name, patientData.last_name),
      email: patientData.email || null,
      phone: patientData.phone || null,
      phone_secondary: patientData.phone_secondary || null,
      date_of_birth: patientData.date_of_birth || null,
      age: calculateAge(patientData.date_of_birth),
      gender: patientData.gender || null,
      marital_status: patientData.marital_status || null,
      occupation: patientData.occupation || null,
      nationality: patientData.nationality || 'Guatemalteco',
      address: patientData.address || null,
      city: patientData.city || null,
      department: patientData.department || null,
      postal_code: patientData.postal_code || null,
      blood_type: patientData.blood_type || null,
      allergies: patientData.allergies || null,
      medical_history: patientData.medical_history || null,
      current_medications: patientData.current_medications || null,
      chronic_conditions: patientData.chronic_conditions || null,
      emergency_contact_name: patientData.emergency_contact_name || null,
      emergency_contact_phone: patientData.emergency_contact_phone || null,
      emergency_contact_relationship: patientData.emergency_contact_relationship || null,
      insurance_company: patientData.insurance_company || null,
      insurance_policy_number: patientData.insurance_policy_number || null,
      insurance_phone: patientData.insurance_phone || null,
      notes: patientData.notes || null,
      profile_image_url: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 1
    };
    
    mockPatients.push(newPatient);
    
    return {
      success: true,
      message: 'Paciente creado exitosamente',
      data: newPatient
    };
  },

  // Obtener paciente por ID
  async getPatientById(id) {
    await delay(300);
    
    const patient = mockPatients.find(p => p.id === parseInt(id) && p.is_active);
    
    if (!patient) {
      throw new Error('Paciente no encontrado');
    }
    
    return {
      success: true,
      data: patient
    };
  },

  // Obtener paciente por código
  async getPatientByCode(code) {
    await delay(300);
    
    const patient = mockPatients.find(p => p.patient_code === code && p.is_active);
    
    if (!patient) {
      throw new Error('Paciente no encontrado');
    }
    
    return {
      success: true,
      data: patient
    };
  },

  // Obtener paciente por DPI
  async getPatientByDpi(dpi) {
    await delay(300);
    
    const patient = mockPatients.find(p => p.dpi === dpi && p.is_active);
    
    if (!patient) {
      throw new Error('Paciente no encontrado');
    }
    
    return {
      success: true,
      data: patient
    };
  },

  // Función para normalizar texto (quitar tildes y convertir a minúsculas)
  normalizeText(text) {
    if (!text) return '';
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Quitar tildes
      .trim();
  },

  // Buscar pacientes
  async searchPatients(searchParams) {
    await delay(500);
    
    const query = searchParams.query || searchParams.q || '';
    const limit = Math.min(parseInt(searchParams.limit) || 50, 100);
    
    if (!query || query.length < 2) {
      return {
        success: true,
        data: []
      };
    }
    
    const normalizedSearchTerm = this.normalizeText(query);
    const results = mockPatients.filter(patient => {
      if (!patient.is_active) return false;
      
      // Normalizar todos los campos de búsqueda
      const normalizedFirstName = this.normalizeText(patient.first_name);
      const normalizedLastName = this.normalizeText(patient.last_name);
      const normalizedMiddleName = this.normalizeText(patient.middle_name);
      const normalizedFullName = this.normalizeText(patient.full_name);
      const normalizedEmail = this.normalizeText(patient.email);
      const normalizedPatientCode = this.normalizeText(patient.patient_code);
      
      return (
        normalizedFirstName.includes(normalizedSearchTerm) ||
        normalizedLastName.includes(normalizedSearchTerm) ||
        normalizedMiddleName.includes(normalizedSearchTerm) ||
        normalizedFullName.includes(normalizedSearchTerm) ||
        normalizedEmail.includes(normalizedSearchTerm) ||
        normalizedPatientCode.includes(normalizedSearchTerm) ||
        patient.dpi?.includes(query) // DPI se mantiene sin normalizar
      );
    }).slice(0, limit);
    
    return {
      success: true,
      data: results,
      search_term: query,
      search_words: query.trim().split(/\s+/).filter(word => word.length >= 2),
      total: results.length
    };
  },

  // Listar todos los pacientes (con paginación)
  async getPatients(page = 1, perPage = 10, filters = {}) {
    await delay(400);
    
    const activePatients = mockPatients.filter(p => p.is_active);
    const total = activePatients.length;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedPatients = activePatients.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: paginatedPatients,
      pagination: {
        page: page,
        per_page: perPage,
        total: total,
        pages: Math.ceil(total / perPage)
      }
    };
  },

  // Actualizar paciente
  async updatePatient(id, patientData) {
    await delay(600);
    
    const patientIndex = mockPatients.findIndex(p => p.id === parseInt(id));
    
    if (patientIndex === -1) {
      throw new Error('Paciente no encontrado');
    }
    
    const patient = mockPatients[patientIndex];
    
    // Actualizar campos
    Object.keys(patientData).forEach(key => {
      if (patientData[key] !== undefined) {
        patient[key] = patientData[key];
      }
    });
    
    // Actualizar campos calculados
    patient.full_name = createFullName(patient.first_name, patient.middle_name, patient.last_name);
    patient.age = calculateAge(patient.date_of_birth);
    patient.updated_at = new Date().toISOString();
    
    mockPatients[patientIndex] = patient;
    
    return {
      success: true,
      message: 'Paciente actualizado exitosamente',
      data: patient
    };
  },

  // Desactivar paciente
  async deactivatePatient(id) {
    await delay(400);
    
    const patientIndex = mockPatients.findIndex(p => p.id === parseInt(id));
    
    if (patientIndex === -1) {
      throw new Error('Paciente no encontrado');
    }
    
    mockPatients[patientIndex].is_active = false;
    mockPatients[patientIndex].updated_at = new Date().toISOString();
    
    return {
      success: true,
      message: 'Paciente desactivado exitosamente'
    };
  },

  // Eliminar paciente permanentemente
  async deletePatient(id) {
    await delay(400);
    
    const patientIndex = mockPatients.findIndex(p => p.id === parseInt(id));
    
    if (patientIndex === -1) {
      throw new Error('Paciente no encontrado');
    }
    
    const deletedPatient = mockPatients[patientIndex];
    mockPatients.splice(patientIndex, 1);
    
    return {
      success: true,
      message: 'Paciente eliminado permanentemente',
      data: deletedPatient
    };
  },

  // Reactivar paciente
  async activatePatient(id) {
    await delay(400);
    
    const patientIndex = mockPatients.findIndex(p => p.id === parseInt(id));
    
    if (patientIndex === -1) {
      throw new Error('Paciente no encontrado');
    }
    
    mockPatients[patientIndex].is_active = true;
    mockPatients[patientIndex].updated_at = new Date().toISOString();
    
    return {
      success: true,
      message: 'Paciente reactivado exitosamente'
    };
  },

  // Obtener estadísticas de pacientes
  async getPatientStatistics() {
    await delay(300);
    
    const total = mockPatients.length;
    const active = mockPatients.filter(p => p.is_active).length;
    const inactive = total - active;
    
    // Estadísticas por género
    const genderStats = mockPatients.reduce((acc, patient) => {
      if (patient.gender) {
        acc[patient.gender] = (acc[patient.gender] || 0) + 1;
      }
      return acc;
    }, {});
    
    // Estadísticas por edad
    const ageGroups = {
      '0-18': 0,
      '19-35': 0,
      '36-50': 0,
      '51-65': 0,
      '65+': 0
    };
    
    mockPatients.forEach(patient => {
      if (patient.age !== null) {
        if (patient.age <= 18) ageGroups['0-18']++;
        else if (patient.age <= 35) ageGroups['19-35']++;
        else if (patient.age <= 50) ageGroups['36-50']++;
        else if (patient.age <= 65) ageGroups['51-65']++;
        else ageGroups['65+']++;
      }
    });
    
    return {
      success: true,
      data: {
        total_patients: total,
        active_patients: active,
        inactive_patients: inactive,
        gender_distribution: genderStats,
        age_distribution: ageGroups,
        created_today: mockPatients.filter(p => {
          const today = new Date().toISOString().split('T')[0];
          return p.created_at.startsWith(today);
        }).length
      }
    };
  }
};

export default patientServiceMock;
