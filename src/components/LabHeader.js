import React from 'react';

const LabHeader = ({ 
  patientData = {},
  reportData = {},
  className = ""
}) => {
  const {
    gender = 'F',
    orderNumber = '005',
    patientInitial = 'C',
    age = '43 año(s)',
    doctor = 'MARIA SINAY',
    receptionDate = '12/09/2025'
  } = patientData;

  const {
    reportTitle = 'Informe de Resultado de Laboratorio',
    responsible = 'Licda. Carmen Xomara López Col. 4118'
  } = reportData;

  return (
    <div className={`lab-header ${className}`}>
      {/* Estilos CSS para el encabezado */}
      <style jsx>{`
        .lab-header {
          font-family: Arial, Helvetica, sans-serif;
          background: white;
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .header-top {
          display: flex;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        
        .logo-section {
          flex-shrink: 0;
          margin-right: 30px;
        }
        
        .logo {
          width: 80px;
          height: 80px;
          object-fit: contain;
        }
        
        .lab-info {
          flex: 1;
          line-height: 1.4;
        }
        
        .lab-name-main {
          font-size: 14px;
          color: #000;
          margin: 0;
          font-weight: normal;
        }
        
        .lab-name-brand {
          font-size: 18px;
          color: #000;
          margin: 2px 0;
          font-weight: bold;
          text-decoration: underline;
        }
        
        .lab-address {
          font-size: 12px;
          color: #000;
          margin: 2px 0;
          font-weight: normal;
        }
        
        .lab-phone {
          font-size: 12px;
          color: #000;
          margin: 2px 0;
          font-weight: bold;
        }
        
        .header-bottom {
          border-top: 1px solid #e5e7eb;
          padding-top: 15px;
        }
        
        .report-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .report-title {
          font-size: 14px;
          font-weight: bold;
          color: #000;
          margin: 0;
        }
        
        .gender-info {
          font-size: 12px;
          color: #000;
          margin: 0;
        }
        
        .patient-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px 30px;
          font-size: 12px;
          color: #000;
        }
        
        .info-item {
          display: flex;
          align-items: center;
        }
        
        .info-label {
          font-weight: normal;
          margin-right: 5px;
        }
        
        .info-value {
          font-weight: bold;
        }
        
        .responsible-section {
          margin-top: 10px;
          text-align: right;
        }
        
        .responsible-label {
          font-size: 12px;
          color: #000;
          font-weight: normal;
        }
        
        .responsible-value {
          font-size: 12px;
          color: #000;
          font-weight: bold;
        }
      `}</style>

      {/* Sección superior con logo e información del laboratorio */}
      <div className="header-top">
        <div className="logo-section">
          <img 
            src="/recursos/logos/logo.jpg" 
            alt="Laboratorio Clínico Esperanza" 
            className="logo"
          />
        </div>
        
        <div className="lab-info">
          <p className="lab-name-main">LABORATORIO CLINICO</p>
          <p className="lab-name-brand">"ESPERANZA"</p>
          <p className="lab-address">3ra. Calle 3-01 Zona 3</p>
          <p className="lab-address">SAN ANTONIO AGUAS CALIENTES SACATEPEQUEZ</p>
          <p className="lab-phone">TEL. 5596-8317 * 4556-4727</p>
        </div>
      </div>

      {/* Sección inferior con información del reporte y paciente */}
      <div className="header-bottom">
        <div className="report-title-row">
          <h1 className="report-title">{reportTitle}</h1>
          <span className="gender-info">Género: {gender}</span>
        </div>
        
        <div className="patient-info">
          <div className="info-item">
            <span className="info-label">Nº. Orden:</span>
            <span className="info-value">{orderNumber}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Paciente:</span>
            <span className="info-value">{patientInitial}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Edad:</span>
            <span className="info-value">{age}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Doctor(a):</span>
            <span className="info-value">{doctor}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Recepción:</span>
            <span className="info-value">{receptionDate}</span>
          </div>
        </div>
        
        <div className="responsible-section">
          <span className="responsible-label">Responsable:</span>
          <span className="responsible-value"> {responsible}</span>
        </div>
      </div>
    </div>
  );
};

export default LabHeader;

