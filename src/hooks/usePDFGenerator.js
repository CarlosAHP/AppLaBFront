import { useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const usePDFGenerator = () => {
  const generatePDF = useCallback(async (elementId, filename = 'reporte-laboratorio.pdf') => {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Elemento no encontrado para generar PDF');
      }

      // Configuración para html2canvas
      const canvas = await html2canvas(element, {
        scale: 2, // Mayor resolución
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
        scrollX: 0,
        scrollY: 0
      });

      // Crear PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Calcular dimensiones
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      // Agregar imagen al PDF
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

      // Descargar PDF
      pdf.save(filename);
      
      return { success: true, message: 'PDF generado exitosamente' };
    } catch (error) {
      console.error('Error generando PDF:', error);
      return { success: false, message: error.message };
    }
  }, []);

  const generatePDFFromHTML = useCallback(async (htmlContent, filename = 'reporte-laboratorio.pdf') => {
    try {
      // Crear un elemento temporal
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '210mm'; // A4 width
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.fontSize = '12px';
      tempDiv.style.lineHeight = '1.4';
      tempDiv.style.padding = '20px';
      
      document.body.appendChild(tempDiv);

      // Generar PDF
      const result = await generatePDF(tempDiv.id || 'temp-pdf-element', filename);
      
      // Limpiar elemento temporal
      document.body.removeChild(tempDiv);
      
      return result;
    } catch (error) {
      console.error('Error generando PDF desde HTML:', error);
      return { success: false, message: error.message };
    }
  }, [generatePDF]);

  return {
    generatePDF,
    generatePDFFromHTML
  };
};

export default usePDFGenerator;

