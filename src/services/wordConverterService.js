// Servicio para conversión de Word a HTML
import api from './api';

export const wordConverterService = {
  // Convertir archivo Word a HTML
  async convertWordToHtml(file) {
    try {
      console.log('🔄 [WORD CONVERTER] Iniciando conversión de archivo:', file.name);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/word-converter/convert', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 segundos timeout
      });
      
      if (response.data.success) {
        console.log('✅ [WORD CONVERTER] Conversión exitosa');
        return {
          success: true,
          html: response.data.html,
          metadata: response.data.metadata || {},
          originalFileName: file.name
        };
      } else {
        throw new Error(response.data.message || 'Error en la conversión');
      }
    } catch (error) {
      console.error('❌ [WORD CONVERTER] Error en conversión:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Tiempo de espera agotado. El archivo puede ser muy grande.');
      }
      
      throw new Error('Error de conexión con el servidor de conversión');
    }
  },

  // Simular conversión local (fallback)
  async convertWordToHtmlLocal(file) {
    console.log('🔄 [WORD CONVERTER] Usando conversión local para:', file.name);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // HTML de ejemplo basado en el archivo
        const html = this.generateSampleHtml(file.name, file.size);
        resolve({
          success: true,
          html,
          metadata: {
            fileName: file.name,
            fileSize: file.size,
            convertedAt: new Date().toISOString(),
            method: 'local-simulation'
          },
          originalFileName: file.name
        });
      }, 2000);
    });
  },

  // Generar HTML de ejemplo
  generateSampleHtml(fileName, fileSize) {
    const baseName = fileName.replace(/\.(doc|docx)$/i, '');
    const sizeKB = (fileSize / 1024).toFixed(1);
    
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${baseName} - Convertido</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            color: #333;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: center;
          }
          .content {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
          }
          .metadata {
            background: #e9ecef;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
            font-size: 14px;
            color: #6c757d;
          }
          h1, h2, h3 {
            color: #2c3e50;
          }
          .highlight {
            background: #fff3cd;
            padding: 10px;
            border-radius: 5px;
            border-left: 3px solid #ffc107;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📄 Documento Convertido</h1>
          <p>Archivo: <strong>${fileName}</strong></p>
        </div>
        
        <div class="content">
          <h2>Contenido del Documento</h2>
          <p>Este es un ejemplo de conversión de Word a HTML. El documento original <strong>"${baseName}"</strong> ha sido procesado y convertido al formato HTML.</p>
          
          <h3>Características del Documento:</h3>
          <ul>
            <li><strong>Archivo original:</strong> ${fileName}</li>
            <li><strong>Tamaño:</strong> ${sizeKB} KB</li>
            <li><strong>Formato de origen:</strong> Microsoft Word</li>
            <li><strong>Formato de destino:</strong> HTML</li>
            <li><strong>Fecha de conversión:</strong> ${new Date().toLocaleString('es-GT')}</li>
          </ul>
          
          <div class="highlight">
            <h3>📋 Información Importante:</h3>
            <p>Este HTML generado es compatible con el sistema de reportes del laboratorio y puede ser utilizado directamente en los resultados de laboratorio.</p>
          </div>
          
          <h3>Sección de Ejemplo:</h3>
          <p>Aquí aparecería el contenido real del documento Word convertido. El sistema mantiene:</p>
          <ul>
            <li>✅ Formato de texto (negrita, cursiva, subrayado)</li>
            <li>✅ Estructura de párrafos y títulos</li>
            <li>✅ Listas y tablas</li>
            <li>✅ Imágenes y gráficos</li>
            <li>✅ Metadatos del documento</li>
          </ul>
        </div>
        
        <div class="metadata">
          <h4>🔧 Metadatos Técnicos:</h4>
          <p><strong>Método de conversión:</strong> Simulación local</p>
          <p><strong>Compatibilidad:</strong> HTML5 + CSS3</p>
          <p><strong>Optimizado para:</strong> Sistema de Laboratorio Esperanza</p>
          <p><strong>Generado el:</strong> ${new Date().toISOString()}</p>
        </div>
      </body>
      </html>
    `;
  },

  // Descargar HTML como archivo
  downloadHtml(html, fileName) {
    try {
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = `${fileName.replace(/\.(doc|docx)$/i, '')}.html`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      console.log('✅ [WORD CONVERTER] HTML descargado exitosamente');
      return true;
    } catch (error) {
      console.error('❌ [WORD CONVERTER] Error al descargar:', error);
      throw new Error('Error al descargar el archivo HTML');
    }
  }
};

export default wordConverterService;
