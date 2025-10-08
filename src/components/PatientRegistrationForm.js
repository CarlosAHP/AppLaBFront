import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { patientService } from '../services/patientService';
import { 
  User, 
  Phone, 
  Heart, 
  Shield, 
  UserPlus,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';

const PatientRegistrationForm = ({ onPatientCreated, onBack, patient = null, isEditing = false }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  // Cargar datos del paciente cuando se está editando
  useEffect(() => {
    if (isEditing && patient) {
      reset({
        first_name: patient.first_name || '',
        last_name: patient.last_name || '',
        middle_name: patient.middle_name || '',
        dpi: patient.dpi || '',
        email: patient.email || '',
        phone: patient.phone || '',
        phone_secondary: patient.phone_secondary || '',
        date_of_birth: patient.date_of_birth || '',
        gender: patient.gender || '',
        marital_status: patient.marital_status || '',
        occupation: patient.occupation || '',
        nationality: patient.nationality || 'Guatemalteco',
        address: patient.address || '',
        city: patient.city || '',
        department: patient.department || '',
        postal_code: patient.postal_code || '',
        blood_type: patient.blood_type || '',
        allergies: patient.allergies || '',
        medical_history: patient.medical_history || '',
        current_medications: patient.current_medications || '',
        chronic_conditions: patient.chronic_conditions || '',
        emergency_contact_name: patient.emergency_contact_name || '',
        emergency_contact_phone: patient.emergency_contact_phone || '',
        emergency_contact_relationship: patient.emergency_contact_relationship || '',
        insurance_company: patient.insurance_company || '',
        insurance_policy_number: patient.insurance_policy_number || '',
        insurance_phone: patient.insurance_phone || '',
        notes: patient.notes || '',
        profile_image_url: patient.profile_image_url || ''
      });
    }
  }, [isEditing, patient, reset]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Limpiar campos vacíos
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== '')
      );

      let response;
      if (isEditing && patient) {
        response = await patientService.updatePatient(patient.id, cleanData);
        toast.success('Paciente actualizado exitosamente');
      } else {
        response = await patientService.createPatient(cleanData);
        toast.success('Paciente registrado exitosamente');
      }
      
      onPatientCreated(response.data);
      reset();
    } catch (error) {
      toast.error(error.message || `Error al ${isEditing ? 'actualizar' : 'registrar'} paciente`);
      console.error(`${isEditing ? 'Update' : 'Registration'} error:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Básico', icon: User },
    { id: 'personal', label: 'Personal', icon: Heart },
    { id: 'medical', label: 'Médico', icon: Shield },
    { id: 'emergency', label: 'Emergencia', icon: Phone },
    { id: 'insurance', label: 'Seguro', icon: UserPlus },
    { id: 'additional', label: 'Adicional', icon: User }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {onBack && (
            <button
              onClick={onBack}
              className="mr-3 p-2 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Editar Paciente' : 'Registrar Nuevo Paciente'}
          </h3>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Información Básica
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Primer Nombre *</label>
                <input
                  type="text"
                  className={`input-field ${errors.first_name ? 'border-red-500' : ''}`}
                  {...register('first_name', { required: 'El primer nombre es requerido' })}
                />
                {errors.first_name && (
                  <p className="error-message">{errors.first_name.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Segundo Nombre</label>
                <input
                  type="text"
                  className="input-field"
                  {...register('middle_name')}
                />
              </div>

              <div>
                <label className="form-label">Apellido *</label>
                <input
                  type="text"
                  className={`input-field ${errors.last_name ? 'border-red-500' : ''}`}
                  {...register('last_name', { required: 'El apellido es requerido' })}
                />
                {errors.last_name && (
                  <p className="error-message">{errors.last_name.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">DPI *</label>
                <input
                  type="text"
                  className={`input-field ${errors.dpi ? 'border-red-500' : ''}`}
                  placeholder="1234567890123"
                  {...register('dpi', { 
                    required: 'El DPI es requerido',
                    pattern: {
                      value: /^\d{13}$/,
                      message: 'El DPI debe tener 13 dígitos'
                    }
                  })}
                />
                {errors.dpi && (
                  <p className="error-message">{errors.dpi.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                  {...register('email', {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  })}
                />
                {errors.email && (
                  <p className="error-message">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Teléfono Principal</label>
                <input
                  type="tel"
                  className="input-field"
                  {...register('phone')}
                />
              </div>

              <div>
                <label className="form-label">Teléfono Secundario</label>
                <input
                  type="tel"
                  className="input-field"
                  {...register('phone_secondary')}
                />
              </div>
            </div>
          </div>
        )}

        {/* Personal Information Tab */}
        {activeTab === 'personal' && (
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900 flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Información Personal
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Fecha de Nacimiento</label>
                <input
                  type="date"
                  className="input-field"
                  {...register('date_of_birth')}
                />
              </div>

              <div>
                <label className="form-label">Género</label>
                <select className="input-field" {...register('gender')}>
                  <option value="">Seleccionar</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="form-label">Estado Civil</label>
                <select className="input-field" {...register('marital_status')}>
                  <option value="">Seleccionar</option>
                  <option value="soltero">Soltero(a)</option>
                  <option value="casado">Casado(a)</option>
                  <option value="divorciado">Divorciado(a)</option>
                  <option value="viudo">Viudo(a)</option>
                </select>
              </div>

              <div>
                <label className="form-label">Ocupación</label>
                <input
                  type="text"
                  className="input-field"
                  {...register('occupation')}
                />
              </div>

              <div>
                <label className="form-label">Nacionalidad</label>
                <input
                  type="text"
                  className="input-field"
                  defaultValue="Guatemalteco"
                  {...register('nationality')}
                />
              </div>

              <div>
                <label className="form-label">Dirección</label>
                <input
                  type="text"
                  className="input-field"
                  {...register('address')}
                />
              </div>

              <div>
                <label className="form-label">Ciudad</label>
                <input
                  type="text"
                  className="input-field"
                  {...register('city')}
                />
              </div>

              <div>
                <label className="form-label">Departamento</label>
                <input
                  type="text"
                  className="input-field"
                  {...register('department')}
                />
              </div>

              <div>
                <label className="form-label">Código Postal</label>
                <input
                  type="text"
                  className="input-field"
                  {...register('postal_code')}
                />
              </div>
            </div>
          </div>
        )}

        {/* Medical Information Tab */}
        {activeTab === 'medical' && (
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Información Médica
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="form-label">Tipo de Sangre</label>
                <select className="input-field" {...register('blood_type')}>
                  <option value="">Seleccionar</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label className="form-label">Alergias</label>
                <textarea
                  className="input-field"
                  rows="3"
                  placeholder="Lista de alergias conocidas..."
                  {...register('allergies')}
                />
              </div>

              <div>
                <label className="form-label">Historial Médico</label>
                <textarea
                  className="input-field"
                  rows="3"
                  placeholder="Enfermedades previas, cirugías, etc..."
                  {...register('medical_history')}
                />
              </div>

              <div>
                <label className="form-label">Medicamentos Actuales</label>
                <textarea
                  className="input-field"
                  rows="3"
                  placeholder="Medicamentos que toma actualmente..."
                  {...register('current_medications')}
                />
              </div>

              <div>
                <label className="form-label">Condiciones Crónicas</label>
                <textarea
                  className="input-field"
                  rows="3"
                  placeholder="Diabetes, hipertensión, etc..."
                  {...register('chronic_conditions')}
                />
              </div>
            </div>
          </div>
        )}

        {/* Emergency Contact Tab */}
        {activeTab === 'emergency' && (
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900 flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Contacto de Emergencia
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Nombre del Contacto</label>
                <input
                  type="text"
                  className="input-field"
                  {...register('emergency_contact_name')}
                />
              </div>

              <div>
                <label className="form-label">Teléfono del Contacto</label>
                <input
                  type="tel"
                  className="input-field"
                  {...register('emergency_contact_phone')}
                />
              </div>

              <div className="md:col-span-2">
                <label className="form-label">Relación</label>
                <select className="input-field" {...register('emergency_contact_relationship')}>
                  <option value="">Seleccionar</option>
                  <option value="esposo">Esposo(a)</option>
                  <option value="padre">Padre</option>
                  <option value="madre">Madre</option>
                  <option value="hijo">Hijo(a)</option>
                  <option value="hermano">Hermano(a)</option>
                  <option value="amigo">Amigo(a)</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Insurance Information Tab */}
        {activeTab === 'insurance' && (
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900 flex items-center">
              <UserPlus className="h-5 w-5 mr-2" />
              Información de Seguros
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Compañía de Seguro</label>
                <input
                  type="text"
                  className="input-field"
                  {...register('insurance_company')}
                />
              </div>

              <div>
                <label className="form-label">Número de Póliza</label>
                <input
                  type="text"
                  className="input-field"
                  {...register('insurance_policy_number')}
                />
              </div>

              <div>
                <label className="form-label">Teléfono del Seguro</label>
                <input
                  type="tel"
                  className="input-field"
                  {...register('insurance_phone')}
                />
              </div>
            </div>
          </div>
        )}

        {/* Additional Information Tab */}
        {activeTab === 'additional' && (
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Información Adicional
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="form-label">Notas</label>
                <textarea
                  className="input-field"
                  rows="4"
                  placeholder="Notas adicionales sobre el paciente..."
                  {...register('notes')}
                />
              </div>

              <div>
                <label className="form-label">URL de Imagen de Perfil</label>
                <input
                  type="url"
                  className="input-field"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  {...register('profile_image_url')}
                />
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <div className="flex space-x-2">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1 text-sm rounded ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}. {tab.label}
              </button>
            ))}
          </div>
          
          <div className="flex space-x-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="btn-secondary"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50"
            >
              {isSubmitting 
                ? (isEditing ? 'Actualizando...' : 'Registrando...') 
                : (isEditing ? 'Actualizar Paciente' : 'Registrar Paciente')
              }
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PatientRegistrationForm;
