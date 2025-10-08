import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminService } from '../services/adminService';
import toast from 'react-hot-toast';
import { 
  UserPlus, 
  X, 
  Eye, 
  EyeOff,
  User,
  Users,
  AlertCircle,
  FileText
} from 'lucide-react';

const UserRegistrationForm = ({ onClose, onSuccess }) => {
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
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

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
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
    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'El formato del teléfono no es válido';
    }

    // Validar teléfono de emergencia si se proporciona
    if (formData.emergency_phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.emergency_phone)) {
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
      const result = await adminService.createUser(token, formData);
      
      toast.success('Usuario creado exitosamente');
      onSuccess && onSuccess(result);
      onClose();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error.message || 'Error al crear el usuario');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar cancelar
  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg mr-4">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Registrar Nuevo Usuario</h2>
                <p className="text-gray-600">Completa la información del nuevo usuario</p>
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
                <label htmlFor="password" className="form-label">
                  Contraseña *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`input-field pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Mínimo 8 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
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
              onClick={handleCancel}
              disabled={isSubmitting}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando Usuario...
                </>
              ) : (
                'Crear Usuario'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRegistrationForm;
