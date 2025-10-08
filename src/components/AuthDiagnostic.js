import React, { useState } from 'react';
import { 
  User, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  EyeOff,
  RefreshCw,
  X
} from 'lucide-react';
import { testCredentials, getCredentialSuggestions, formatAuthError } from '../utils/authDiagnostic';

const AuthDiagnostic = ({ onClose, onTestLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [suggestion, setSuggestion] = useState(null);

  const handleTest = async () => {
    setIsTesting(true);
    try {
      const results = await testCredentials(username, password);
      setTestResults(results);
      
      // Buscar sugerencias si las credenciales no son válidas
      if (!results.isValid && username) {
        const suggestionResult = getCredentialSuggestions(username);
        setSuggestion(suggestionResult);
      } else {
        setSuggestion(null);
      }
    } catch (error) {
      setTestResults({
        username,
        password,
        tests: [],
        isValid: false,
        error: formatAuthError(error)
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleUseSuggestion = (suggestedCreds) => {
    setUsername(suggestedCreds.username);
    setPassword(suggestedCreds.password);
    setSuggestion(null);
  };

  const handleTestLogin = async () => {
    if (onTestLogin) {
      await onTestLogin(username, password);
    }
  };

  const getTestIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTestColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <User className="h-6 w-6 mr-2" />
              Diagnóstico de Autenticación
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Formulario de prueba */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Ingresa tu username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ingresa tu password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleTest}
                disabled={isTesting || !username || !password}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Probando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Probar Credenciales
                  </>
                )}
              </button>

              {testResults?.isValid && (
                <button
                  onClick={handleTestLogin}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <User className="h-4 w-4 mr-2" />
                  Probar Login
                </button>
              )}
            </div>
          </div>

          {/* Sugerencias */}
          {suggestion?.found && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-blue-900 mb-2">
                ¿Te refieres a estas credenciales?
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-800">
                    <strong>Rol:</strong> {suggestion.role}
                  </p>
                  <p className="text-sm text-blue-800">
                    <strong>Username:</strong> {suggestion.suggestion.username}
                  </p>
                </div>
                <button
                  onClick={() => handleUseSuggestion(suggestion.suggestion)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  Usar
                </button>
              </div>
            </div>
          )}

          {/* Resultados de las pruebas */}
          {testResults && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Resultados de las Pruebas:</h3>
              
              {testResults.tests.map((test, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${getTestColor(test.status)}`}
                >
                  <div className="flex items-center">
                    {getTestIcon(test.status)}
                    <div className="ml-3">
                      <p className="font-medium">{test.name}</p>
                      <p className="text-sm">{test.message}</p>
                    </div>
                  </div>
                </div>
              ))}

              {testResults.error && (
                <div className="p-3 rounded-lg border text-red-700 bg-red-50 border-red-200">
                  <div className="flex items-center">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <div className="ml-3">
                      <p className="font-medium">Error</p>
                      <p className="text-sm">{testResults.error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Credenciales de prueba */}
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Credenciales de Prueba Disponibles:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="bg-white p-3 rounded border">
                <p className="font-medium text-gray-900">Administrador</p>
                <p className="text-gray-600">admin / Admin123!</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <p className="font-medium text-gray-900">Doctor</p>
                <p className="text-gray-600">doctor1 / Doctor123!</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <p className="font-medium text-gray-900">Secretaria</p>
                <p className="text-gray-600">secretaria1 / Secret123!</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <p className="font-medium text-gray-900">Técnico</p>
                <p className="text-gray-600">tecnico1 / Tecnic123!</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthDiagnostic;
