import React, { useState, useEffect, useCallback } from 'react';
import { patientService } from '../services/patientService';
import { Search, User, Phone, Mail, Calendar, MapPin, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const PatientSearch = ({ onPatientSelect, onNewPatient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState('name'); // name, dpi, code, email
  const [searchInfo, setSearchInfo] = useState(null); // Información de la búsqueda

  const performSearch = useCallback(async () => {
    try {
      setLoading(true);
      let response;

      switch (searchType) {
        case 'dpi':
          response = await patientService.getPatientByDpi(searchTerm);
          setSearchResults(response.data ? [response.data] : []);
          break;
        case 'code':
          response = await patientService.getPatientByCode(searchTerm);
          setSearchResults(response.data ? [response.data] : []);
          break;
        default:
          // Usar la búsqueda avanzada del backend
          response = await patientService.searchPatients({
            q: searchTerm.trim(),
            limit: 50
          });
          setSearchResults(response.data || []);
          // Guardar información de la búsqueda
          setSearchInfo({
            search_term: response.search_term,
            search_words: response.search_words,
            total: response.total
          });
      }
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        setSearchResults([]);
      } else if (error.message.includes('Sin conexión a la API')) {
        // No mostrar error para conexión, solo lista vacía
        console.log('⚠️ Sin conexión a la API - Búsqueda no disponible');
        setSearchResults([]);
        setSearchInfo({
          search_term: searchTerm,
          search_words: [],
          total: 0
        });
      } else {
        toast.error('Error al buscar pacientes');
        console.error('Search error:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [searchTerm, searchType]);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const delayedSearch = setTimeout(() => {
        performSearch();
      }, 500);
      return () => clearTimeout(delayedSearch);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, searchType, performSearch]);

  const handlePatientSelect = (patient) => {
    onPatientSelect(patient);
  };

  const getSearchPlaceholder = () => {
    switch (searchType) {
      case 'dpi':
        return 'Buscar por DPI (ej: 1234567890123)';
      case 'code':
        return 'Buscar por código de paciente';
      case 'email':
        return 'Buscar por email';
      default:
        return 'Buscar por nombre del paciente';
    }
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Buscar Paciente</h3>
        <button
          onClick={onNewPatient}
          className="btn-primary text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Paciente
        </button>
      </div>

      {/* Search Controls */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="input-field w-32"
          >
            <option value="name">Nombre</option>
            <option value="dpi">DPI</option>
            <option value="code">Código</option>
            <option value="email">Email</option>
          </select>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={getSearchPlaceholder()}
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600">Buscando...</span>
        </div>
      )}

      {/* Search Results */}
      {!loading && searchResults.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Resultados ({searchResults.length})
            </h4>
            {searchInfo && (
              <div className="text-xs text-gray-500">
                <span className="font-medium">Búsqueda:</span> "{searchInfo.search_term}"
                {searchInfo.search_words && searchInfo.search_words.length > 1 && (
                  <span className="ml-2">
                    <span className="font-medium">Palabras:</span> {searchInfo.search_words.join(', ')}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {searchResults.map((patient) => (
              <div
                key={patient.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-sm cursor-pointer transition-all"
                onClick={() => handlePatientSelect(patient)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <h5 className="font-medium text-gray-900">
                        {formatPatientName(patient)}
                      </h5>
                      {patient.patient_code && (
                        <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {patient.patient_code}
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      {patient.dpi && (
                        <div className="flex items-center">
                          <span className="font-medium mr-2">DPI:</span>
                          <span>{patient.dpi}</span>
                        </div>
                      )}
                      
                      {patient.email && (
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          <span className="truncate">{patient.email}</span>
                        </div>
                      )}
                      
                      {patient.phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          <span>{patient.phone}</span>
                        </div>
                      )}
                      
                      {patient.date_of_birth && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDate(patient.date_of_birth)}</span>
                        </div>
                      )}
                      
                      {patient.city && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{patient.city}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePatientSelect(patient);
                    }}
                    className="btn-primary text-sm ml-4"
                  >
                    Seleccionar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && searchTerm.length >= 2 && searchResults.length === 0 && (
        <div className="text-center py-8">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron pacientes</h3>
          <p className="mt-1 text-sm text-gray-500 mb-4">
            No hay pacientes que coincidan con tu búsqueda.
          </p>
          {searchInfo && (
            <div className="text-xs text-gray-400 mb-4">
              <p><strong>Búsqueda realizada:</strong> "{searchInfo.search_term}"</p>
              {searchInfo.search_words && searchInfo.search_words.length > 1 && (
                <p><strong>Palabras buscadas:</strong> {searchInfo.search_words.join(', ')}</p>
              )}
            </div>
          )}
          <div className="text-xs text-gray-400 mb-4">
            <p><strong>Sugerencias:</strong></p>
            <p>• Verifica la ortografía</p>
            <p>• Intenta con menos palabras</p>
            <p>• Busca por apellido o código</p>
          </div>
          <button
            onClick={onNewPatient}
            className="mt-4 btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Registrar Nuevo Paciente
          </button>
        </div>
      )}

      {/* Initial State */}
      {!loading && searchTerm.length < 2 && (
        <div className="text-center py-8">
          <Search className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Búsqueda Avanzada de Pacientes</h3>
          <p className="mt-1 text-sm text-gray-500 mb-4">
            Escribe al menos 2 caracteres para comenzar la búsqueda.
          </p>
          <div className="text-xs text-gray-400 space-y-1">
            <p><strong>Puedes buscar por:</strong></p>
            <p>• Nombre completo: "Juan Carlos Pérez"</p>
            <p>• Apellido: "Pérez" o "García"</p>
            <p>• Palabras parciales: "María" encuentra "María Elena"</p>
            <p>• Código de paciente: "P2025"</p>
            <p>• DPI: "1234567"</p>
          </div>
          <div className="mt-4 text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded-md">
            ⚠️ Sin conexión a la API - La búsqueda no está disponible
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientSearch;
