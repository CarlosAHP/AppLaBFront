import React, { useState } from 'react';
import { 
  Brain, 
  Stethoscope, 
  AlertTriangle, 
  CheckCircle, 
  Loader, 
  Download, 
  Copy, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  Clock,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URLS } from '../config/apiEndpoints';

const StructuredMedicalInterpreter = ({ htmlContent, onInterpretationComplete }) => {
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [interpretationData, setInterpretationData] = useState(null);

  // Función para interpretar resultados médicos
  const interpretResults = async () => {
    if (!htmlContent || htmlContent.trim().length < 50) {
      toast.error('El contenido HTML es muy corto para interpretar');
      return;
    }

    setIsInterpreting(true);
    toast.loading('Interpretando resultados médicos...', { id: 'medical-interpretation' });

    try {
      const response = await fetch(API_URLS.MEDICAL_INTERPRET, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html_content: htmlContent,
          patient_info: extractPatientInfo(htmlContent)
        })
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setInterpretationData(data.data);
        
        // Notificar al componente padre
        if (onInterpretationComplete) {
          onInterpretationComplete(data);
        }
        
        toast.success('Interpretación completada exitosamente', { id: 'medical-interpretation' });
      } else {
        throw new Error(data.error || 'Error en la interpretación');
      }

    } catch (error) {
      console.error('Error en interpretación médica:', error);
      toast.error(`Error: ${error.message}`, { id: 'medical-interpretation' });
    } finally {
      setIsInterpreting(false);
    }
  };

  // Extraer información del paciente del HTML
  const extractPatientInfo = (html) => {
    // Implementar extracción de edad y género del HTML
    const ageMatch = html.match(/(\d+)\s*años?/i);
    const genderMatch = html.match(/(masculino|femenino|m|f)/i);
    
    return {
      age: ageMatch ? parseInt(ageMatch[1]) : null,
      gender: genderMatch ? (genderMatch[1].toLowerCase().includes('f') ? 'F' : 'M') : null
    };
  };

  // Obtener color según nivel de urgencia
  const getUrgencyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'crítica': return 'text-red-600 bg-red-50 border-red-200';
      case 'alta': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'media': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'baja': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Obtener color según estado del valor
  const getValueStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'normal': return 'text-green-600 bg-green-50';
      case 'elevado': return 'text-orange-600 bg-orange-50';
      case 'bajo': return 'text-blue-600 bg-blue-50';
      case 'crítico': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Obtener ícono según estado del valor
  const getValueStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'normal': return <CheckCircle className="h-4 w-4" />;
      case 'elevado': return <TrendingUp className="h-4 w-4" />;
      case 'bajo': return <TrendingDown className="h-4 w-4" />;
      case 'crítico': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  // Copiar interpretación al portapapeles
  const copyInterpretation = () => {
    if (!interpretationData) return;
    
    const text = `
RESUMEN: ${interpretationData.summary}

CONFIANZA: ${interpretationData.analysis_confidence}

URGENCIA: ${interpretationData.urgency?.level} - ${interpretationData.urgency?.message}

VALORES ANORMALES:
${interpretationData.abnormal_values?.map(v => 
  `• ${v.test_name}: ${v.value} (${v.status}) - ${v.significance}`
).join('\n')}

RECOMENDACIONES:
${interpretationData.recommendations?.map(r => `• ${r}`).join('\n')}

NOTA IMPORTANTE: ${interpretationData.important_note}
    `.trim();
    
    navigator.clipboard.writeText(text);
    toast.success('Interpretación copiada al portapapeles');
  };

  // Descargar interpretación como archivo
  const downloadInterpretation = () => {
    if (!interpretationData) return;
    
    const content = `
# INTERPRETACIÓN MÉDICA
## ${interpretationData.summary}

**Confianza del análisis:** ${interpretationData.analysis_confidence}
**Nivel de urgencia:** ${interpretationData.urgency?.level}
**Mensaje:** ${interpretationData.urgency?.message}

## INTERPRETACIÓN CLÍNICA
**Título:** ${interpretationData.interpretation?.title}
**Descripción:** ${interpretationData.interpretation?.description}
**Significado clínico:** ${interpretationData.interpretation?.clinical_significance}

### Posibles causas:
${interpretationData.interpretation?.possible_causes?.map(c => `- ${c}`).join('\n')}

## VALORES DE LABORATORIO

### Valores Normales:
${interpretationData.normal_values?.map(v => 
  `- **${v.test_name}:** ${v.value} (${v.reference_range})`
).join('\n')}

### Valores Anormales:
${interpretationData.abnormal_values?.map(v => 
  `- **${v.test_name}:** ${v.value} (${v.reference_range}) - ${v.status}
  - **Significado:** ${v.significance}`
).join('\n')}

## RECOMENDACIONES
${interpretationData.recommendations?.map(r => `- ${r}`).join('\n')}

---
*${interpretationData.important_note}*
*Generado el: ${new Date().toLocaleString()}*
    `.trim();
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interpretacion-medica-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Interpretación descargada');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Brain className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Intérprete Médico IA</h3>
            <p className="text-sm text-gray-500">Análisis inteligente de resultados de laboratorio</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={interpretResults}
            disabled={isInterpreting || !htmlContent}
            className="btn-primary flex items-center space-x-2"
          >
            {isInterpreting ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span>{isInterpreting ? 'Interpretando...' : 'Interpretar'}</span>
          </button>
        </div>
      </div>

      {/* Interpretación */}
      {interpretationData && (
        <div className="space-y-6">
          {/* Resumen y Confianza */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {interpretationData.summary}
                </h4>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Shield className="h-4 w-4" />
                    <span>Confianza: {interpretationData.analysis_confidence}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Modelo: {interpretationData.model_used || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nivel de Urgencia */}
          {interpretationData.urgency && (
            <div className={`rounded-lg p-4 border ${getUrgencyColor(interpretationData.urgency.level)}`}>
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-semibold">Nivel de Urgencia: {interpretationData.urgency.level}</span>
              </div>
              <p className="text-sm">{interpretationData.urgency.message}</p>
            </div>
          )}

          {/* Interpretación Clínica */}
          {interpretationData.interpretation && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <Stethoscope className="h-5 w-5" />
                <span>Interpretación Clínica</span>
              </h5>
              
              <div className="space-y-3">
                <div>
                  <h6 className="font-medium text-gray-800">{interpretationData.interpretation.title}</h6>
                  <p className="text-sm text-gray-600 mt-1">{interpretationData.interpretation.description}</p>
                </div>
                
                <div>
                  <h6 className="font-medium text-gray-800">Significado Clínico:</h6>
                  <p className="text-sm text-gray-600">{interpretationData.interpretation.clinical_significance}</p>
                </div>
                
                {interpretationData.interpretation.possible_causes && interpretationData.interpretation.possible_causes.length > 0 && (
                  <div>
                    <h6 className="font-medium text-gray-800">Posibles Causas:</h6>
                    <ul className="text-sm text-gray-600 list-disc list-inside mt-1">
                      {interpretationData.interpretation.possible_causes.map((cause, index) => (
                        <li key={index}>{cause}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Valores de Laboratorio */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Valores Normales */}
            {interpretationData.normal_values && interpretationData.normal_values.length > 0 && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h5 className="font-semibold text-green-800 mb-3 flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Valores Normales ({interpretationData.normal_values.length})</span>
                </h5>
                <div className="space-y-2">
                  {interpretationData.normal_values.map((value, index) => (
                    <div key={index} className="bg-white rounded p-3 border border-green-200">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">{value.test_name}</span>
                        <span className="text-sm text-green-600 font-medium">{value.status}</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        <div>Valor: {value.value}</div>
                        <div>Rango: {value.reference_range}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Valores Anormales */}
            {interpretationData.abnormal_values && interpretationData.abnormal_values.length > 0 && (
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h5 className="font-semibold text-red-800 mb-3 flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Valores Anormales ({interpretationData.abnormal_values.length})</span>
                </h5>
                <div className="space-y-2">
                  {interpretationData.abnormal_values.map((value, index) => (
                    <div key={index} className="bg-white rounded p-3 border border-red-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-800">{value.test_name}</span>
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${getValueStatusColor(value.status)}`}>
                          {getValueStatusIcon(value.status)}
                          <span>{value.status}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <div>Valor: {value.value}</div>
                        <div>Rango: {value.reference_range}</div>
                      </div>
                      {value.significance && (
                        <div className="text-sm text-red-700 bg-red-100 rounded p-2">
                          <strong>Significado:</strong> {value.significance}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recomendaciones */}
          {interpretationData.recommendations && interpretationData.recommendations.length > 0 && (
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <h5 className="font-semibold text-yellow-800 mb-3 flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Recomendaciones ({interpretationData.recommendations.length})</span>
              </h5>
              <ul className="space-y-2">
                {interpretationData.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span className="text-sm text-gray-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Nota Importante */}
          {interpretationData.important_note && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-start space-x-2">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h6 className="font-medium text-blue-800 mb-1">Nota Importante</h6>
                  <p className="text-sm text-blue-700">{interpretationData.important_note}</p>
                </div>
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={copyInterpretation}
              className="btn-secondary flex items-center space-x-2"
            >
              <Copy className="h-4 w-4" />
              <span>Copiar</span>
            </button>
            <button
              onClick={downloadInterpretation}
              className="btn-primary flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Descargar</span>
            </button>
          </div>
        </div>
      )}

      {/* Estado inicial */}
      {!interpretationData && !isInterpreting && (
        <div className="text-center py-8">
          <Brain className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Interpretación Médica</h3>
          <p className="mt-1 text-sm text-gray-500">
            Haz clic en "Interpretar" para analizar los resultados de laboratorio con IA
          </p>
        </div>
      )}
    </div>
  );
};

export default StructuredMedicalInterpreter;
