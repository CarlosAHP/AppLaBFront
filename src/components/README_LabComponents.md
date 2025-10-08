# Componentes de Reportes de Laboratorio

Este conjunto de componentes permite generar reportes de laboratorio con encabezados y pies de página profesionales.

## Componentes Disponibles

### 1. LabHeader
Encabezado del reporte con logo, información del laboratorio y datos del paciente.

```jsx
import LabHeader from './LabHeader';

<LabHeader 
  patientData={{
    gender: 'F',
    orderNumber: '005',
    patientInitial: 'C',
    age: '43 año(s)',
    doctor: 'MARIA SINAY',
    receptionDate: '12/09/2025'
  }}
  reportData={{
    reportTitle: 'Informe de Resultado de Laboratorio',
    responsible: 'Licda. Carmen Xomara López Col. 4118'
  }}
/>
```

### 2. LabFooter
Pie de página con firmas y información del laboratorio.

```jsx
import LabFooter from './LabFooter';

<LabFooter 
  signatures={{
    showResponsibleSignature: true,
    showDirectorSignature: false,
    customText: "Texto adicional opcional"
  }}
/>
```

### 3. LabReportTemplate
Plantilla completa que combina encabezado, contenido y pie de página.

```jsx
import LabReportTemplate from './LabReportTemplate';

<LabReportTemplate 
  patientData={patientData}
  reportData={reportData}
>
  {/* Contenido del reporte */}
  <div>
    <h2>RESULTADOS DE LABORATORIO</h2>
    {/* Tablas, resultados, etc. */}
  </div>
</LabReportTemplate>
```

### 4. usePDFGenerator
Hook para generar PDFs desde los componentes.

```jsx
import usePDFGenerator from '../hooks/usePDFGenerator';

const MyComponent = () => {
  const { generatePDF } = usePDFGenerator();
  
  const handleGeneratePDF = () => {
    generatePDF('report-element-id', 'mi-reporte.pdf');
  };
  
  return (
    <div id="report-element-id">
      <LabReportTemplate>
        {/* Contenido */}
      </LabReportTemplate>
      <button onClick={handleGeneratePDF}>
        Generar PDF
      </button>
    </div>
  );
};
```

## Estructura de Datos

### patientData
```javascript
{
  gender: 'F',                    // Género del paciente
  orderNumber: '005',            // Número de orden
  patientInitial: 'C',           // Inicial del paciente
  age: '43 año(s)',              // Edad
  doctor: 'MARIA SINAY',         // Doctor solicitante
  receptionDate: '12/09/2025'    // Fecha de recepción
}
```

### reportData
```javascript
{
  reportTitle: 'Informe de Resultado de Laboratorio',
  responsible: 'Licda. Carmen Xomara López Col. 4118'
}
```

### signatures
```javascript
{
  showResponsibleSignature: true,    // Mostrar firma responsable
  showDirectorSignature: false,      // Mostrar firma director
  customText: "Texto adicional"      // Texto personalizado
}
```

## Recursos Requeridos

### Logos
- `/public/recursos/logos/logo.jpg` - Logo principal del laboratorio

### Firmas
- `/public/recursos/firmas/firma_responsable.png` - Firma del responsable técnico
- `/public/recursos/firmas/firma_director.png` - Firma del director (opcional)

## Estilos CSS

Los componentes incluyen estilos CSS-in-JS que replican el diseño original:
- Fuente: Arial, Helvetica, sans-serif
- Colores: Negro (#000) para texto principal
- Layout: Flexbox para alineación precisa
- Responsive: Adaptable a diferentes tamaños

## Generación de PDF

Para generar PDFs, instala las dependencias necesarias:

```bash
npm install html2canvas jspdf
```

Los PDFs generados mantendrán:
- Logo del laboratorio
- Información del paciente
- Formato profesional
- Firmas digitales
- Calidad de impresión (300 DPI)

## Ejemplo Completo

Ver `LabReportExample.js` para un ejemplo completo de uso con datos de muestra.

