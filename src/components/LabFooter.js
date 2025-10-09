import React from 'react';

const LabFooter = ({ 
  signatures = {},
  className = ""
}) => {
  const {
    showResponsibleSignature = true,
    showDirectorSignature = false,
    customText = ""
  } = signatures;

  return (
    <div className={`lab-footer ${className}`}>
      {/* Estilos CSS para el pie de página */}
      <style jsx>{`
        .lab-footer {
          font-family: Arial, Helvetica, sans-serif;
          background: white;
          padding: 20px;
          border-top: 1px solid #e5e7eb;
          margin-top: 30px;
        }
        
        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          min-height: 120px;
        }
        
        .signature-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 200px;
        }
        
        .signature-line {
          width: 200px;
          height: 1px;
          background-color: #000;
          margin-bottom: 5px;
        }
        
        .signature-label {
          font-size: 11px;
          color: #000;
          text-align: center;
          font-weight: normal;
        }
        
        .signature-name {
          font-size: 11px;
          color: #000;
          text-align: center;
          font-weight: bold;
          margin-top: 5px;
        }
        
        .signature-image {
          width: 150px;
          height: 60px;
          object-fit: contain;
          margin-bottom: 10px;
        }
        
        .footer-info {
          text-align: center;
          flex: 1;
        }
        
        .footer-text {
          font-size: 10px;
          color: #666;
          line-height: 1.4;
          margin: 0;
        }
        
        .lab-credentials {
          font-size: 10px;
          color: #000;
          font-weight: bold;
          margin-top: 10px;
        }
      `}</style>

      <div className="footer-content">
        {/* Sección de firma responsable */}
        {showResponsibleSignature && (
          <div className="signature-section">
            <img 
              src="/recursos/firmas/firma_responsable.png" 
              alt="Firma Responsable" 
              className="signature-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div style={{display: 'none'}}>
              <div className="signature-line"></div>
              <div className="signature-label">Firma y Sello</div>
            </div>
            <div className="signature-name">Licda. Carmen Xomara López</div>
            <div className="signature-label">Responsable Técnico</div>
            <div className="signature-label">Col. 4118</div>
          </div>
        )}

        {/* Sección de firma director (opcional) */}
        {showDirectorSignature && (
          <div className="signature-section">
            <img 
              src="/recursos/firmas/firma_director.png" 
              alt="Firma Director" 
              className="signature-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div style={{display: 'none'}}>
              <div className="signature-line"></div>
              <div className="signature-label">Firma y Sello</div>
            </div>
            <div className="signature-name">Dr. [Nombre Director]</div>
            <div className="signature-label">Director Médico</div>
          </div>
        )}

        {/* Información del laboratorio */}
        <div className="footer-info">
          <p className="footer-text">
            Laboratorio Clínico "ESPERANZA"<br/>
            3ra. Calle 3-01 Zona 3, San Antonio Aguas Calientes, Sacatepéquez<br/>
            Teléfonos: 5596-8317 * 4556-4727
          </p>
          {customText && (
            <p className="footer-text" style={{marginTop: '10px'}}>
              {customText}
            </p>
          )}
          <div className="lab-credentials">
            Laboratorio autorizado por el Ministerio de Salud Pública y Asistencia Social
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabFooter;



