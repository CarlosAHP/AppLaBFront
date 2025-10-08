import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { prepareUserProfileForBackend } from '../utils/formDataCleaner';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { User, AlertCircle, FileText } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, isLoading, token } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    date_of_birth: '',
    gender: '',
    emergency_contact: '',
    emergency_phone: '',
    medical_history: '',
    allergies: '',
    current_medications: '',
    profile_image_url: ''
  });
  const [originalData, setOriginalData] = useState(null); // Datos originales para comparar cambios
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  // Función para cargar el perfil completo desde el backend
  const loadFullProfile = async () => {
    if (!token) {
      console.log('Profile - loadFullProfile: No token available');
      return;
    }
    
    try {
      setProfileLoading(true);
      console.log('Profile - loadFullProfile: Starting to load profile from backend...');
      
      // Agregar un pequeño delay para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const fullProfile = await authService.getProfile(token);
      console.log('Profile - Full profile loaded:', fullProfile);
      
      // Verificar que la respuesta sea válida
      if (!fullProfile) {
        console.error('Profile - No profile data received from backend');
        toast.error('No se pudieron cargar los datos del perfil');
        return;
      }
      
      const userData = {
        first_name: fullProfile.first_name || '',
        last_name: fullProfile.last_name || '',
        email: fullProfile.email || '',
        phone: fullProfile.phone || '',
        address: fullProfile.address || '',
        date_of_birth: fullProfile.date_of_birth || '',
        gender: fullProfile.gender || '',
        emergency_contact: fullProfile.emergency_contact || '',
        emergency_phone: fullProfile.emergency_phone || '',
        medical_history: fullProfile.medical_history || '',
        allergies: fullProfile.allergies || '',
        current_medications: fullProfile.current_medications || '',
        profile_image_url: fullProfile.profile_image_url || ''
      };
      
      console.log('Profile - Form data set from backend:', userData);
      
      // Solo establecer los datos si no hay cambios pendientes
      if (!hasChanges) {
        setFormData(userData);
        setOriginalData(userData); // Guardar datos originales para comparar cambios
      } else {
        console.log('Profile - Skipping form data update due to pending changes');
      }
    } catch (error) {
      console.error('Profile - Error loading full profile:', error);
      
      // Si hay error, usar los datos del contexto como fallback
      if (user && !hasChanges) {
        console.log('Profile - Using context data as fallback');
        const fallbackData = {
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          date_of_birth: user.date_of_birth || '',
          gender: user.gender || '',
          emergency_contact: user.emergency_contact || '',
          emergency_phone: user.emergency_phone || '',
          medical_history: user.medical_history || '',
          allergies: user.allergies || '',
          current_medications: user.current_medications || '',
          profile_image_url: user.profile_image_url || ''
        };
        setFormData(fallbackData);
        setOriginalData(fallbackData); // Guardar datos originales para comparar cambios
        toast('Usando datos locales. Algunos campos pueden estar desactualizados.', {
          icon: '⚠️',
          style: {
            background: '#fbbf24',
            color: '#92400e',
          },
        });
      } else {
        toast.error('Error al cargar el perfil completo');
      }
    } finally {
      setProfileLoading(false);
    }
  };

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    console.log('Profile - useEffect triggered:', { 
      hasUser: !!user, 
      hasToken: !!token, 
      hasFormData: !!formData.first_name,
      userFirstName: user?.first_name,
      formDataFirstName: formData.first_name
    });
    
    if (user && token && !formData.first_name) { // Solo cargar si no hay datos en el formulario
      console.log('Profile - Loading full profile from backend...');
      loadFullProfile();
    } else {
      console.log('Profile - Skipping profile load:', {
        reason: !user ? 'No user' : !token ? 'No token' : 'Form data already exists'
      });
    }
  }, [user, token, formData.first_name]); // eslint-disable-line react-hooks/exhaustive-deps

  // Función para normalizar valores para comparación
  const normalizeValue = (value) => {
    if (value === null || value === undefined) return '';
    return String(value).trim();
  };

  // Detectar cambios en el formulario
  useEffect(() => {
    if (formData.first_name && originalData) { // Solo si ya se cargaron los datos
      const changes = [];
      let hasFormChanges = false;

      Object.keys(formData).forEach(key => {
        const currentValue = normalizeValue(formData[key]);
        const originalValue = normalizeValue(originalData[key]);
        
        if (currentValue !== originalValue) {
          changes.push({
            field: key,
            current: currentValue,
            original: originalValue
          });
          hasFormChanges = true;
        }
      });

      console.log('Profile - Checking for changes:', { 
        hasFormChanges, 
        changesCount: changes.length,
        changes: changes,
        formDataKeys: Object.keys(formData),
        originalDataKeys: Object.keys(originalData)
      });
      
      setHasChanges(hasFormChanges);
    }
  }, [formData, originalData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    console.log('Profile - Input change detected:', { 
      name, 
      value, 
      currentFormData: formData[name],
      originalData: originalData ? originalData[name] : 'No original data'
    });
    
    // Manejar campos vacíos correctamente - no recargar el formulario
    setFormData(prev => {
      const newFormData = {
        ...prev,
        [name]: value || '' // Asegurar que siempre sea una cadena, nunca undefined
      };
      
      console.log('Profile - Form data updated:', { 
        field: name, 
        oldValue: prev[name], 
        newValue: newFormData[name],
        hasChanges: newFormData[name] !== (originalData ? originalData[name] : '')
      });
      
      return newFormData;
    });
  };

  // Prevenir el envío del formulario cuando se presiona Delete
  const handleKeyDown = (e) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      // No hacer nada especial, solo prevenir el comportamiento por defecto si es necesario
      e.stopPropagation();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Preparar datos para el backend (solo campos permitidos)
      const backendData = prepareUserProfileForBackend(formData);
      
      console.log('Profile.js - handleSubmit - Original formData:', JSON.stringify(formData, null, 2));
      console.log('Profile.js - handleSubmit - Backend data:', JSON.stringify(backendData, null, 2));
      console.log('Profile.js - handleSubmit - Backend data keys:', Object.keys(backendData));
      console.log('Profile.js - handleSubmit - Backend data types:', Object.keys(backendData).reduce((acc, key) => {
        acc[key] = typeof backendData[key];
        return acc;
      }, {}));
      
      // Validar datos antes de enviar
      console.log('Profile.js - handleSubmit - Validating data...');
      const validationErrors = [];
      
      // Validar email
      if (backendData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(backendData.email)) {
        validationErrors.push('Email format is invalid');
      }
      
      // Validar teléfono (debe ser solo números, +, -, espacios, paréntesis)
      if (backendData.phone && !/^[\d\s+\-()]+$/.test(backendData.phone)) {
        validationErrors.push('Phone format is invalid');
      }
      
      // Validar longitud de campos
      if (backendData.first_name && backendData.first_name.length > 100) {
        validationErrors.push('First name is too long');
      }
      if (backendData.last_name && backendData.last_name.length > 100) {
        validationErrors.push('Last name is too long');
      }
      if (backendData.email && backendData.email.length > 255) {
        validationErrors.push('Email is too long');
      }
      
      if (validationErrors.length > 0) {
        console.error('Profile.js - handleSubmit - Validation errors:', validationErrors);
        toast.error('Error de validación: ' + validationErrors.join(', '));
        return;
      }
      
      console.log('Profile.js - handleSubmit - Data validation passed');
      
      const result = await updateProfile(backendData);
      
      if (result.success) {
        toast.success('Perfil actualizado exitosamente');
        setHasChanges(false);
        
        // Actualizar el contexto de autenticación con los nuevos datos
        console.log('Profile - Updating auth context with new data...');
        
        // Si el backend devuelve datos actualizados, usarlos
        if (result.data) {
          console.log('Profile - Using updated data from backend:', result.data);
          const updatedUserData = {
            first_name: result.data.first_name || formData.first_name,
            last_name: result.data.last_name || formData.last_name,
            email: result.data.email || formData.email,
            phone: result.data.phone || formData.phone,
            address: result.data.address || formData.address,
            date_of_birth: result.data.date_of_birth || formData.date_of_birth,
            gender: result.data.gender || formData.gender,
            emergency_contact: result.data.emergency_contact || formData.emergency_contact,
            emergency_phone: result.data.emergency_phone || formData.emergency_phone,
            medical_history: result.data.medical_history || formData.medical_history,
            allergies: result.data.allergies || formData.allergies,
            current_medications: result.data.current_medications || formData.current_medications,
            profile_image_url: result.data.profile_image_url || formData.profile_image_url
          };
          setFormData(updatedUserData);
          setOriginalData(updatedUserData); // Actualizar datos originales
        } else {
          // Si no hay datos del backend, actualizar datos originales con los datos actuales
          setOriginalData(formData);
        }
        
        // Refrescar la página después de 1 segundo para asegurar que los datos se actualicen
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(result.error || 'Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      
      // Manejar errores específicos del backend
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || 'Error de validación en el servidor';
        console.error('Profile.js - Backend validation error:', errorMessage);
        toast.error(`Error de validación: ${errorMessage}`);
      } else if (error.response?.status === 401) {
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      } else if (error.response?.status === 500) {
        toast.error('Error interno del servidor. Intenta nuevamente más tarde.');
      } else {
        toast.error('Error al actualizar el perfil. Verifica los datos e intenta nuevamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    // Recargar el perfil completo desde el backend
    loadFullProfile();
    setHasChanges(false);
  };

  if (isLoading || profileLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No se pudo cargar el perfil</h2>
          <p className="text-gray-600">Por favor, inicia sesión nuevamente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="card-modern mb-8">
          <div className="px-8 py-6 border-b border-gray-200/50">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg mr-4">
                <User className="h-8 w-8 text-white" />
              </div>
              Mi Perfil
            </h1>
            <p className="text-gray-600 text-lg">Gestiona tu información personal y médica</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-8">
          {/* Información Personal */}
          <div className="card-modern">
            <div className="px-8 py-6 border-b border-gray-200/50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md mr-3">
                  <User className="h-5 w-5 text-white" />
                </div>
                Información Personal
              </h2>
            </div>
            <div className="px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="first_name" className="form-label">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="last_name" className="form-label">
                  Apellido *
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="email" className="form-label">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="phone" className="form-label">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="date_of_birth" className="form-label">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="gender" className="form-label">
                  Género
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">Seleccionar...</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="address" className="form-label">
                  Dirección
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="input-field"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="profile_image_url" className="form-label">
                  URL de Imagen de Perfil
                </label>
                <input
                  type="url"
                  id="profile_image_url"
                  name="profile_image_url"
                  value={formData.profile_image_url}
                  onChange={handleInputChange}
                  placeholder="https://ejemplo.com/mi-imagen.jpg"
                  className="input-field"
                />
                {formData.profile_image_url && (
                  <div className="mt-4">
                    <img 
                      src={formData.profile_image_url} 
                      alt="Vista previa" 
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contacto de Emergencia */}
          <div className="card-modern">
            <div className="px-8 py-6 border-b border-gray-200/50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-md mr-3">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                Contacto de Emergencia
              </h2>
            </div>
            <div className="px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="emergency_contact" className="form-label">
                  Nombre del Contacto
                </label>
                <input
                  type="text"
                  id="emergency_contact"
                  name="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="emergency_phone" className="form-label">
                  Teléfono de Emergencia
                </label>
                <input
                  type="tel"
                  id="emergency_phone"
                  name="emergency_phone"
                  value={formData.emergency_phone}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Información Médica */}
          <div className="card-modern">
            <div className="px-8 py-6 border-b border-gray-200/50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md mr-3">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                Información Médica
              </h2>
            </div>
            <div className="px-8 py-8 space-y-8">
              <div>
                <label htmlFor="medical_history" className="form-label">
                  Historial Médico
                </label>
                <textarea
                  id="medical_history"
                  name="medical_history"
                  value={formData.medical_history}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Describe cualquier condición médica, cirugías previas, etc."
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="allergies" className="form-label">
                  Alergias
                </label>
                <textarea
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Lista cualquier alergia conocida (medicamentos, alimentos, etc.)"
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="current_medications" className="form-label">
                  Medicamentos Actuales
                </label>
                <textarea
                  id="current_medications"
                  name="current_medications"
                  value={formData.current_medications}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Lista los medicamentos que tomas actualmente"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="card-modern">
            <div className="px-8 py-8 flex flex-col sm:flex-row gap-6 justify-end">
              <button
                type="button"
                onClick={handleReset}
                disabled={!hasChanges || isSubmitting}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar Cambios
              </button>
              
              
              <button
                type="submit"
                disabled={!hasChanges || isSubmitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
