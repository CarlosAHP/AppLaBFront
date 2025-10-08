import React, { useState } from 'react';
import LabReportTemplate from '../components/LabReportTemplate';
import usePDFGenerator from '../hooks/usePDFGenerator';
import { Download, Eye, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';

const LabReportPreview = () => {
  const { generatePDF } = usePDFGenerator();
  const [isGenerating, setIsGenerating] = useState(false);

  // Datos de ejemplo del paciente
  const patientData = {
    gender: 'F',
    orderNumber: '005',
    patientInitial: 'C',
    age: '43 año(s)',
    doctor: 'MARIA SINAY',
    receptionDate: '12/09/2025'
  };

  // Datos del reporte
  const reportData = {
    reportTitle: 'Informe de Resultado de Laboratorio',
    responsible: 'Licda. Carmen Xomara López Col. 4118'
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      const result = await generatePDF('lab-report-preview', 'reporte-laboratorio.pdf');
      if (result.success) {
        toast.success('PDF generado exitosamente');
      } else {
        toast.error('Error al generar PDF: ' + result.message);
      }
    } catch (error) {
      toast.error('Error inesperado al generar PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header de la página */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Vista Previa de Reporte
              </h1>
              <p className="text-gray-600 mt-1">
                Previsualización del reporte de laboratorio con encabezado y pie de página
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className="btn-primary flex items-center"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generando...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Generar PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Vista previa del reporte */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div id="lab-report-preview">
            <LabReportTemplate 
              patientData={patientData}
              reportData={reportData}
            >
              {/* Contenido del reporte de ejemplo */}
              <div>
                <h2>HEMOGRAMA COMPLETO</h2>
                
                <table>
                  <thead>
                    <tr>
                      <th>Examen</th>
                      <th>Resultado</th>
                      <th>Valores de Referencia</th>
                      <th>Unidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Hemoglobina</td>
                      <td className="result-value">12.5</td>
                      <td className="normal-range">12.0 - 16.0</td>
                      <td>g/dL</td>
                    </tr>
                    <tr>
                      <td>Hematocrito</td>
                      <td className="result-value">38.2</td>
                      <td className="normal-range">36.0 - 46.0</td>
                      <td>%</td>
                    </tr>
                    <tr>
                      <td>Leucocitos</td>
                      <td className="result-value">7,500</td>
                      <td className="normal-range">4,500 - 11,000</td>
                      <td>/mm³</td>
                    </tr>
                    <tr>
                      <td>Plaquetas</td>
                      <td className="result-value">285,000</td>
                      <td className="normal-range">150,000 - 450,000</td>
                      <td>/mm³</td>
                    </tr>
                  </tbody>
                </table>

                <h2>QUÍMICA SANGUÍNEA</h2>
                
                <table>
                  <thead>
                    <tr>
                      <th>Examen</th>
                      <th>Resultado</th>
                      <th>Valores de Referencia</th>
                      <th>Unidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Glucosa</td>
                      <td className="result-value">95</td>
                      <td className="normal-range">70 - 110</td>
                      <td>mg/dL</td>
                    </tr>
                    <tr>
                      <td>Colesterol Total</td>
                      <td className="result-value">180</td>
                      <td className="normal-range">&lt; 200</td>
                      <td>mg/dL</td>
                    </tr>
                    <tr>
                      <td>Triglicéridos</td>
                      <td className="result-value">120</td>
                      <td className="normal-range">&lt; 150</td>
                      <td>mg/dL</td>
                    </tr>
                  </tbody>
                </table>

                <div style={{ marginTop: '30px' }}>
                  <p><strong>Observaciones:</strong></p>
                  <p>Los resultados se encuentran dentro de los valores normales de referencia.</p>
                  <p>Se recomienda mantener hábitos de vida saludables.</p>
                </div>
              </div>
            </LabReportTemplate>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Información del Reporte
          </h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Paciente:</strong> {patientData.patientInitial}</p>
            <p><strong>Edad:</strong> {patientData.age}</p>
            <p><strong>Doctor:</strong> {patientData.doctor}</p>
            <p><strong>Fecha de Recepción:</strong> {patientData.receptionDate}</p>
            <p><strong>Responsable:</strong> {reportData.responsible}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabReportPreview;

