import React from 'react';
import LabHeader from './LabHeader';
import LabFooter from './LabFooter';

const LabReportTemplate = ({ 
  patientData = {},
  reportData = {},
  children,
  className = ""
}) => {
  return (
    <div className={`lab-report-template ${className}`}>
      {/* Estilos CSS para la plantilla completa */}
      <style jsx>{`
        .lab-report-template {
          font-family: Arial, Helvetica, sans-serif;
          background: white;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        .report-content {
          flex: 1;
          padding: 20px;
          line-height: 1.6;
        }
        
        .report-content h1,
        .report-content h2,
        .report-content h3 {
          color: #000;
          margin-top: 20px;
          margin-bottom: 10px;
        }
        
        .report-content h1 {
          font-size: 16px;
          font-weight: bold;
        }
        
        .report-content h2 {
          font-size: 14px;
          font-weight: bold;
        }
        
        .report-content h3 {
          font-size: 12px;
          font-weight: bold;
        }
        
        .report-content p {
          margin: 8px 0;
          font-size: 12px;
          color: #000;
        }
        
        .report-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
          font-size: 12px;
        }
        
        .report-content th,
        .report-content td {
          border: 1px solid #000;
          padding: 8px;
          text-align: left;
        }
        
        .report-content th {
          background-color: #f5f5f5;
          font-weight: bold;
        }
        
        .report-content .result-value {
          font-weight: bold;
        }
        
        .report-content .normal-range {
          font-style: italic;
          color: #666;
        }
        
        .report-content .abnormal-value {
          color: #dc2626;
          font-weight: bold;
        }
        
        @media print {
          .lab-report-template {
            min-height: auto;
          }
          
          .report-content {
            padding: 10px;
          }
        }
      `}</style>

      {/* Encabezado del reporte */}
      <LabHeader 
        patientData={patientData}
        reportData={reportData}
      />

      {/* Contenido del reporte */}
      <div className="report-content">
        {children}
      </div>

      {/* Pie de página del reporte */}
      <LabFooter 
        signatures={{
          showResponsibleSignature: true,
          showDirectorSignature: false
        }}
      />
    </div>
  );
};

export default LabReportTemplate;



