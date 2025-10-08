import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminService } from '../services/adminService';
import { cleanUserProfileData } from '../utils/formDataCleaner';
import toast from 'react-hot-toast';
import { 
  Edit, 
  X, 
  User,
  Users,
  AlertCircle,
  FileText,
  Save,
  RotateCcw
} from 'lucide-react';

const UserEditForm = ({ user, onClose, onSuccess }) => {
  const { token, user: currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: 'patient',
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

  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState({});

  // Roles disponibles
  const roles = [
    { value: 'patient', label: 'Paciente' },
    { value: 'secretary', label: 'Secretaria' },
    { value: 'doctor', label: 'Doctor' },
    { value: 'admin', label: 'Administrador' }
  ];

  // Géneros disponibles
  const genders = [
    { value: '', label: 'Seleccionar...' },
    { value: 'masculino', label: 'Masculino' },
    { value: 'femenino', label: 'Femenino' },
    { value: 'otro', label: 'Otro' }
  ];

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    if (user) {
      const userData = {
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        role: user.role || 'patient',
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
      
      setFormData(userData);
      setOriginalData(userData);
    }
  }, [user]);

  // Detectar cambios en el formulario
  useEffect(() => {
    const hasFormChanges = Object.keys(formData).some(key => {
      return formData[key] !== (originalData[key] || '');
    });
    setHasChanges(hasFormChanges);
  }, [formData, originalData]);

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    // Campos requeridos
    if (!formData.username.trim()) {
      newErrors.username = 'El username es requerido';
    } else if (formData.username.length < 3) {
      newErrors.username = 'El username debe tener al menos 3 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'El nombre es requerido';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'El apellido es requerido';
    }

    if (!formData.role) {
      newErrors.role = 'El rol es requerido';
    }

    // Validar teléfono si se proporciona
    if (formData.phone && !/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = 'El formato del teléfono no es válido';
    }

    // Validar teléfono de emergencia si se proporciona
    if (formData.emergency_phone && !/^\+?[\d\s\-()]+$/.test(formData.emergency_phone)) {
      newErrors.emergency_phone = 'El formato del teléfono de emergencia no es válido';
    }

    // Validar URL de imagen si se proporciona
    if (formData.profile_image_url && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(formData.profile_image_url)) {
      newErrors.profile_image_url = 'La URL de la imagen no es válida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrige los errores en el formulario');
      return;
    }

    setIsSubmitting(true);

    try {
      // Limpiar datos antes de enviar - convertir cadenas vacías a null para campos opcionales
      const cleanedFormData = cleanUserProfileData(formData);
      
      console.log('UserEditForm - Original formData:', formData);
      console.log('UserEditForm - Cleaned formData:', cleanedFormData);
      
      let result;
      
      // Si el usuario está editando su propio perfil, usar el endpoint de perfil
      // en lugar del endpoint de administración para evitar errores 500
      if (user.id === currentUser?.id) {
        console.log('UserEditForm - Editing own profile, using authService.updateProfile');
        const { authService } = await import('../services/authService');
        result = await authService.updateProfile(token, cleanedFormData);
        
        // El contexto se actualizará en el componente padre
      } else {
        console.log('UserEditForm - Editing other user, using adminService.updateUser');
        result = await adminService.updateUser(token, user.id, cleanedFormData);
      }
      
      // Llamar onSuccess con el resultado
      onSuccess && onSuccess(result);
      
      toast.success('Usuario actualizado exitosamente');
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.message || 'Error al actualizar el usuario');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar cancelar
  const handleCancel = () => {
    onClose();
  };

  // Manejar reset
  const handleReset = () => {
    setFormData(originalData);
    setErrors({});
    setHasChanges(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg mr-4">
                <Edit className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Editar Usuario</h2>
                <p className="text-gray-600">
                  Editando: {user.first_name} {user.last_name} (@{user.username})
                </p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Información de Acceso */}
          <div className="card-modern">
            <div className="px-8 py-6 border-b border-gray-200/50">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md mr-3">
                  <User className="h-5 w-5 text-white" />
                </div>
                Información de Acceso
              </h3>
            </div>
            <div className="px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="username" className="form-label">
                  Username *
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`input-field ${errors.username ? 'border-red-500' : ''}`}
                  placeholder="usuario123"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
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
                  className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="usuario@ejemplo.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="role" className="form-label">
                  Rol *
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className={`input-field ${errors.role ? 'border-red-500' : ''}`}
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                )}
              </div>

              <div className="flex items-center">
                <div className="flex items-center">
                  {user.is_active ? (
                    <div className="flex items-center text-green-600">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm font-medium">Usuario Activo</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-sm font-medium">Usuario Inactivo</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Información Personal */}
          <div className="card-modern">
            <div className="px-8 py-6 border-b border-gray-200/50">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md mr-3">
                  <Users className="h-5 w-5 text-white" />
                </div>
                Información Personal
              </h3>
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
                  className={`input-field ${errors.first_name ? 'border-red-500' : ''}`}
                  placeholder="Juan"
                />
                {errors.first_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                )}
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
                  className={`input-field ${errors.last_name ? 'border-red-500' : ''}`}
                  placeholder="Pérez"
                />
                {errors.last_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                )}
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
                  className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="+51 987 654 321"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
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
                  {genders.map(gender => (
                    <option key={gender.value} value={gender.value}>
                      {gender.label}
                    </option>
                  ))}
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
                  placeholder="Av. Principal 123, Lima, Perú"
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
                  className={`input-field ${errors.profile_image_url ? 'border-red-500' : ''}`}
                  placeholder="https://ejemplo.com/mi-imagen.jpg"
                />
                {errors.profile_image_url && (
                  <p className="text-red-500 text-sm mt-1">{errors.profile_image_url}</p>
                )}
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
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-md mr-3">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                Contacto de Emergencia
              </h3>
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
                  placeholder="María García"
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
                  className={`input-field ${errors.emergency_phone ? 'border-red-500' : ''}`}
                  placeholder="+51 987 654 321"
                />
                {errors.emergency_phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.emergency_phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Información Médica */}
          <div className="card-modern">
            <div className="px-8 py-6 border-b border-gray-200/50">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md mr-3">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                Información Médica
              </h3>
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
                  className="input-field"
                  placeholder="Describe cualquier condición médica, cirugías previas, etc."
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
                  className="input-field"
                  placeholder="Lista cualquier alergia conocida (medicamentos, alimentos, etc.)"
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
                  className="input-field"
                  placeholder="Lista los medicamentos que toma actualmente"
                />
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleReset}
              disabled={!hasChanges || isSubmitting}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restaurar
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
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
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditForm;
