import React, { useState, useEffect } from 'react';
import { patientService } from '../services/patientService';
import PatientSearch from '../components/PatientSearch';
import PatientRegistrationForm from '../components/PatientRegistrationForm';
import DeletePatientDialog from '../components/DeletePatientDialog';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  User, 
  Phone, 
  Calendar, 
  MapPin,
  Eye,
  Users,
  Heart,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'search', 'registration', 'details'
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0,
    pages: 0
  });
  
  // Estados para el diálogo de eliminación
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);


  useEffect(() => {
    loadPatients();
  }, [pagination.page, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPatients = async () => {
    try {
      setLoading(true);
      const response = await patientService.getPatients(
        pagination.page, 
        pagination.perPage, 
        { status: statusFilter }
      );
      
      setPatients(response.data || []);
      setPagination(prev => ({
        ...prev,
        ...response.pagination
      }));
    } catch (error) {
      // Si es error de conexión, mostrar lista vacía sin error
      if (error.message.includes('Sin conexión a la API')) {
        console.log('⚠️ Sin conexión a la API - Mostrando lista vacía');
        setPatients([]);
        setPagination(prev => ({
          ...prev,
          total: 0,
          pages: 0
        }));
        // No mostrar toast de error para conexión
      } else {
        toast.error('Error al cargar pacientes');
        console.error('Error loading patients:', error);
      }
    } finally {
      setLoading(false);
    }
  };


  const handlePatientSelect = async (patient) => {
    try {
      // Cargar los datos completos del paciente
      const response = await patientService.getPatientById(patient.id);
      setSelectedPatient(response.data);
      setCurrentView('details');
    } catch (error) {
      toast.error('Error al cargar los datos del paciente');
      console.error('Error loading patient data:', error);
    }
  };

  const handleNewPatient = () => {
    setCurrentView('registration');
  };

  const handlePatientCreated = (patient) => {
    toast.success('Paciente registrado exitosamente');
    setCurrentView('list');
    loadPatients();
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedPatient(null);
    setSearchTerm('');
    loadPatients();
  };

  const handleEditPatient = async (patient) => {
    try {
      // Cargar los datos completos del paciente
      const response = await patientService.getPatientById(patient.id);
      setSelectedPatient(response.data);
      setCurrentView('registration');
    } catch (error) {
      toast.error('Error al cargar los datos del paciente');
      console.error('Error loading patient data:', error);
    }
  };

  const handleDeletePatient = (patient) => {
    setPatientToDelete(patient);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!patientToDelete) return;
    
    try {
      setIsDeleting(true);
      await patientService.deletePatient(patientToDelete.id);
      toast.success('Paciente eliminado permanentemente');
      setShowDeleteDialog(false);
      setPatientToDelete(null);
      loadPatients();
    } catch (error) {
      toast.error('Error al eliminar paciente');
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setPatientToDelete(null);
  };

  const formatPatientName = (patient) => {
    // Intentar usar full_name primero, luego construir desde campos individuales
    if (patient.full_name) {
      return patient.full_name;
    }
    
    const parts = [patient.first_name, patient.middle_name, patient.last_name].filter(Boolean);
    const fullName = parts.join(' ');
    
    // Si no hay nombre, mostrar información alternativa
    if (!fullName.trim()) {
      return patient.patient_code || 'Sin nombre';
    }
    
    return fullName;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-GT');
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Activo
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Inactivo
      </span>
    );
  };

  if (loading && patients.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Pacientes</h1>
          <p className="text-gray-600 mt-1">
            Administra la información de los pacientes del laboratorio
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => setCurrentView('search')}
            className="btn-secondary"
          >
            <Search className="h-5 w-5 mr-2" />
            Buscar
          </button>
          <button
            onClick={handleNewPatient}
            className="btn-primary"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Paciente
          </button>
        </div>
      </div>

      {/* Patient Search View */}
      {currentView === 'search' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Buscar Pacientes</h2>
            <button
              onClick={handleBackToList}
              className="btn-secondary"
            >
              Volver a Lista
            </button>
          </div>
          <PatientSearch
            onPatientSelect={handlePatientSelect}
            onNewPatient={handleNewPatient}
          />
        </div>
      )}

      {/* Patient Registration View */}
      {currentView === 'registration' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <PatientRegistrationForm
            onPatientCreated={handlePatientCreated}
            onBack={handleBackToList}
            patient={selectedPatient}
            isEditing={!!selectedPatient}
          />
        </div>
      )}

      {/* Patient Details View */}
      {currentView === 'details' && selectedPatient && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Detalles del Paciente</h2>
            <div className="flex space-x-3">
              <button
                onClick={() => handleEditPatient(selectedPatient)}
                className="btn-secondary"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </button>
              <button
                onClick={handleBackToList}
                className="btn-primary"
              >
                Volver a Lista
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Información Básica */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Información Básica
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">ID</label>
                  <p className="text-sm text-gray-900">{selectedPatient.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Código de Paciente</label>
                  <p className="text-sm text-gray-900">{selectedPatient.patient_code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">DPI</label>
                  <p className="text-sm text-gray-900">{selectedPatient.dpi}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Primer Nombre</label>
                  <p className="text-sm text-gray-900">{selectedPatient.first_name || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Segundo Nombre</label>
                  <p className="text-sm text-gray-900">{selectedPatient.middle_name || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Apellido</label>
                  <p className="text-sm text-gray-900">{selectedPatient.last_name || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Nombre Completo</label>
                  <p className="text-sm text-gray-900">{selectedPatient.full_name || formatPatientName(selectedPatient)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Estado</label>
                  <div className="mt-1">{getStatusBadge(selectedPatient.is_active)}</div>
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900 flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                Información de Contacto
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm text-gray-900">{selectedPatient.email || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Teléfono Principal</label>
                  <p className="text-sm text-gray-900">{selectedPatient.phone || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Teléfono Secundario</label>
                  <p className="text-sm text-gray-900">{selectedPatient.phone_secondary || 'No especificado'}</p>
                </div>
              </div>
            </div>

            {/* Información Personal */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Información Personal
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Fecha de Nacimiento</label>
                  <p className="text-sm text-gray-900">
                    {selectedPatient.date_of_birth ? formatDate(selectedPatient.date_of_birth) : 'No especificada'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Edad</label>
                  <p className="text-sm text-gray-900">{selectedPatient.age ? `${selectedPatient.age} años` : 'No especificada'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Género</label>
                  <p className="text-sm text-gray-900">{selectedPatient.gender || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Estado Civil</label>
                  <p className="text-sm text-gray-900">{selectedPatient.marital_status || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Ocupación</label>
                  <p className="text-sm text-gray-900">{selectedPatient.occupation || 'No especificada'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Nacionalidad</label>
                  <p className="text-sm text-gray-900">{selectedPatient.nationality || 'No especificada'}</p>
                </div>
              </div>
            </div>

            {/* Dirección */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Dirección
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Dirección</label>
                  <p className="text-sm text-gray-900">{selectedPatient.address || 'No especificada'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Ciudad</label>
                  <p className="text-sm text-gray-900">{selectedPatient.city || 'No especificada'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Departamento</label>
                  <p className="text-sm text-gray-900">{selectedPatient.department || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Código Postal</label>
                  <p className="text-sm text-gray-900">{selectedPatient.postal_code || 'No especificado'}</p>
                </div>
              </div>
            </div>

            {/* Información Médica */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900 flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Información Médica
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo de Sangre</label>
                  <p className="text-sm text-gray-900">{selectedPatient.blood_type || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Alergias</label>
                  <p className="text-sm text-gray-900">{selectedPatient.allergies || 'No especificadas'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Historial Médico</label>
                  <p className="text-sm text-gray-900">{selectedPatient.medical_history || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Medicamentos Actuales</label>
                  <p className="text-sm text-gray-900">{selectedPatient.current_medications || 'No especificados'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Condiciones Crónicas</label>
                  <p className="text-sm text-gray-900">{selectedPatient.chronic_conditions || 'No especificadas'}</p>
                </div>
              </div>
            </div>

            {/* Contacto de Emergencia */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900 flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                Contacto de Emergencia
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nombre del Contacto</label>
                  <p className="text-sm text-gray-900">{selectedPatient.emergency_contact_name || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Teléfono del Contacto</label>
                  <p className="text-sm text-gray-900">{selectedPatient.emergency_contact_phone || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Relación</label>
                  <p className="text-sm text-gray-900">{selectedPatient.emergency_contact_relationship || 'No especificada'}</p>
                </div>
              </div>
            </div>

            {/* Información de Seguro */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Información de Seguro
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Compañía de Seguro</label>
                  <p className="text-sm text-gray-900">{selectedPatient.insurance_company || 'No especificada'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Número de Póliza</label>
                  <p className="text-sm text-gray-900">{selectedPatient.insurance_policy_number || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Teléfono del Seguro</label>
                  <p className="text-sm text-gray-900">{selectedPatient.insurance_phone || 'No especificado'}</p>
                </div>
              </div>
            </div>

            {/* Información de Control */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Información de Control
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Fecha de Creación</label>
                  <p className="text-sm text-gray-900">
                    {selectedPatient.created_at ? formatDate(selectedPatient.created_at) : 'No especificada'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Última Actualización</label>
                  <p className="text-sm text-gray-900">
                    {selectedPatient.updated_at ? formatDate(selectedPatient.updated_at) : 'No especificada'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Creado por</label>
                  <p className="text-sm text-gray-900">{selectedPatient.created_by || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Notas</label>
                  <p className="text-sm text-gray-900">{selectedPatient.notes || 'No especificadas'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Imagen de Perfil</label>
                  <p className="text-sm text-gray-900">
                    {selectedPatient.profile_image_url ? (
                      <a href={selectedPatient.profile_image_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Ver imagen
                      </a>
                    ) : 'No especificada'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patient List View */}
      {currentView === 'list' && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar pacientes..."
                    className="input-field pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select
                  className="input-field"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Todos los estados</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                </select>
              </div>
            </div>
          </div>

          {/* Patients Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paciente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre Completo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Información
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatPatientName(patient)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {patient.patient_code}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatPatientName(patient)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {patient.dpi}
                        </div>
                        <div className="text-sm text-gray-500">
                          {patient.age ? `${patient.age} años` : 'Edad no especificada'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(patient.is_active)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handlePatientSelect(patient)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditPatient(patient)}
                            className="text-green-600 hover:text-green-900"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePatient(patient)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar permanentemente"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {patients.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pacientes</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No se encontraron pacientes con los filtros aplicados.'
                    : 'Sin conexión a la API. Los pacientes no se pueden cargar.'
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <div className="mt-4 space-y-2">
                    <div className="text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded-md">
                      ⚠️ Verifica la conexión a la API para acceder a los pacientes
                    </div>
                    <button
                      onClick={handleNewPatient}
                      className="btn-primary"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Paciente
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow-sm">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando{' '}
                    <span className="font-medium">{(pagination.page - 1) * pagination.perPage + 1}</span>
                    {' '}a{' '}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.perPage, pagination.total)}
                    </span>
                    {' '}de{' '}
                    <span className="font-medium">{pagination.total}</span>
                    {' '}resultados
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page === pagination.pages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Siguiente
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Patient Dialog */}
      <DeletePatientDialog
        isOpen={showDeleteDialog}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        patient={patientToDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default PatientManagement;
