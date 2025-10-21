import React, { useState } from 'react';
import StructuredMedicalInterpreter from './StructuredMedicalInterpreter';

const MedicalInterpreterExample = () => {
  const [htmlContent, setHtmlContent] = useState('');

  // Ejemplo de HTML de resultados de laboratorio
  const exampleHtml = `
    <div class="lab-results">
      <h2>Resultados de Laboratorio</h2>
      <div class="patient-info">
        <p>Paciente: Juan Pérez</p>
        <p>Edad: 45 años</p>
        <p>Género: Masculino</p>
        <p>Fecha: 21/10/2025</p>
      </div>
      
      <div class="results">
        <h3>Química Sanguínea</h3>
        <table>
          <tr>
            <td>Glucosa</td>
            <td>180 mg/dl</td>
            <td>70-100 mg/dl</td>
            <td>↑</td>
          </tr>
          <tr>
            <td>Colesterol Total</td>
            <td>250 mg/dl</td>
            <td>&lt;200 mg/dl</td>
            <td>↑</td>
          </tr>
          <tr>
            <td>HDL</td>
            <td>35 mg/dl</td>
            <td>&gt;40 mg/dl</td>
            <td>↓</td>
          </tr>
          <tr>
            <td>LDL</td>
            <td>180 mg/dl</td>
            <td>&lt;100 mg/dl</td>
            <td>↑</td>
          </tr>
          <tr>
            <td>Triglicéridos</td>
            <td>220 mg/dl</td>
            <td>&lt;150 mg/dl</td>
            <td>↑</td>
          </tr>
        </table>
        
        <h3>Hematología</h3>
        <table>
          <tr>
            <td>Hemoglobina</td>
            <td>14.5 g/dl</td>
            <td>12-16 g/dl</td>
            <td>Normal</td>
          </tr>
          <tr>
            <td>Hematocrito</td>
            <td>42%</td>
            <td>36-48%</td>
            <td>Normal</td>
          </tr>
          <tr>
            <td>Leucocitos</td>
            <td>8500 /mm³</td>
            <td>4000-11000 /mm³</td>
            <td>Normal</td>
          </tr>
        </table>
        
        <h3>Función Renal</h3>
        <table>
          <tr>
            <td>Creatinina</td>
            <td>1.8 mg/dl</td>
            <td>0.6-1.2 mg/dl</td>
            <td>↑</td>
          </tr>
          <tr>
            <td>Urea</td>
            <td>45 mg/dl</td>
            <td>7-20 mg/dl</td>
            <td>↑</td>
          </tr>
        </table>
      </div>
    </div>
  `;

  const handleInterpretationComplete = (data) => {
    console.log('Interpretación completada:', data);
    // Aquí puedes manejar la respuesta de la interpretación
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Ejemplo de Intérprete Médico Estructurado
        </h1>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Contenido HTML de Ejemplo</h2>
          <textarea
            value={htmlContent || exampleHtml}
            onChange={(e) => setHtmlContent(e.target.value)}
            className="w-full h-40 p-3 border border-gray-300 rounded-md text-sm font-mono"
            placeholder="Pega aquí el HTML de los resultados de laboratorio..."
          />
          <div className="mt-2 flex space-x-2">
            <button
              onClick={() => setHtmlContent(exampleHtml)}
              className="btn-secondary text-sm"
            >
              Usar Ejemplo
            </button>
            <button
              onClick={() => setHtmlContent('')}
              className="btn-secondary text-sm"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      <StructuredMedicalInterpreter
        htmlContent={htmlContent}
        onInterpretationComplete={handleInterpretationComplete}
      />
    </div>
  );
};

export default MedicalInterpreterExample;
