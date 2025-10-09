import React from 'react';
import LabReportTemplate from './LabReportTemplate';

const LabReportExample = () => {
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

  return (
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
  );
};

export default LabReportExample;



