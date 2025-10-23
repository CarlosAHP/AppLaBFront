import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  Code, 
  File, 
  CheckCircle, 
  AlertCircle,
  Loader,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { wordConverterService } from '../services/wordConverterService';

const WordToHtmlConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedHtml, setConvertedHtml] = useState('');
  const [fileName, setFileName] = useState('');

  // Manejar selección de archivo
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Verificar que sea un archivo Word
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/msword' // .doc
      ];
      
      if (validTypes.includes(file.type)) {
        setSelectedFile(file);
        setFileName(file.name);
        setConvertedHtml('');
        toast.success('Archivo Word seleccionado correctamente');
      } else {
        toast.error('Por favor selecciona un archivo Word (.doc o .docx)');
        event.target.value = '';
      }
    }
  };

  // Convertir Word a HTML
  const handleConvert = async () => {
    if (!selectedFile) {
      toast.error('Por favor selecciona un archivo Word primero');
      return;
    }

    setIsConverting(true);
    toast.loading('Convirtiendo archivo Word a HTML...', { id: 'converting' });

    try {
      console.log('🔄 [WORD CONVERTER] Iniciando conversión de:', fileName);
      
      // Intentar conversión con backend primero
      let result;
      try {
        result = await wordConverterService.convertWordToHtml(selectedFile);
        console.log('✅ [WORD CONVERTER] Conversión con backend exitosa');
      } catch (backendError) {
        console.log('⚠️ [WORD CONVERTER] Backend no disponible, usando conversión local:', backendError.message);
        result = await wordConverterService.convertWordToHtmlLocal(selectedFile);
      }
      
      if (result.success) {
        setConvertedHtml(result.html);
        toast.success('Archivo convertido exitosamente', { id: 'converting' });
        console.log('✅ [WORD CONVERTER] Conversión completada');
      } else {
        throw new Error('Error en la conversión');
      }
      
    } catch (error) {
      console.error('❌ [WORD CONVERTER] Error en conversión:', error);
      toast.error(`Error al convertir el archivo: ${error.message}`, { id: 'converting' });
    } finally {
      setIsConverting(false);
    }
  };

  // Descargar HTML
  const handleDownload = () => {
    if (!convertedHtml) {
      toast.error('No hay HTML para descargar');
      return;
    }

    try {
      console.log('📥 [WORD CONVERTER] Descargando HTML:', fileName);
      wordConverterService.downloadHtml(convertedHtml, fileName);
      toast.success('Archivo HTML descargado exitosamente');
    } catch (error) {
      console.error('❌ [WORD CONVERTER] Error al descargar:', error);
      toast.error('Error al descargar el archivo HTML');
    }
  };

  // Limpiar todo
  const handleClear = () => {
    setSelectedFile(null);
    setConvertedHtml('');
    setFileName('');
    toast.success('Formulario limpiado');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Convertidor Word a HTML</h1>
            <p className="text-gray-600">Convierte documentos Word a formato HTML para uso en el laboratorio</p>
          </div>
        </div>
      </div>

      {/* Sección de selección de archivo */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Upload className="h-5 w-5 mr-2 text-blue-600" />
          Seleccionar Archivo Word
        </h2>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept=".doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              <File className="h-12 w-12 text-gray-400" />
              <div className="text-sm text-gray-600">
                <span className="font-medium text-blue-600 hover:text-blue-500">
                  Haz clic para seleccionar
                </span>
                {' '}o arrastra un archivo Word aquí
              </div>
              <div className="text-xs text-gray-500">
                Formatos soportados: .doc, .docx
              </div>
            </label>
          </div>

          {selectedFile && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">
                    Archivo seleccionado: {fileName}
                  </p>
                  <p className="text-xs text-green-600">
                    Tamaño: {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={handleClear}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Eliminar archivo"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sección de conversión */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Code className="h-5 w-5 mr-2 text-green-600" />
          Conversión a HTML
        </h2>
        
        <div className="space-y-4">
          <div className="flex space-x-3">
            <button
              onClick={handleConvert}
              disabled={!selectedFile || isConverting}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isConverting ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Code className="h-4 w-4" />
              )}
              <span>{isConverting ? 'Convirtiendo...' : 'Convertir a HTML'}</span>
            </button>

            {convertedHtml && (
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Descargar HTML</span>
              </button>
            )}
          </div>

          {convertedHtml && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Conversión completada exitosamente
                </span>
              </div>
              <div className="bg-white border border-green-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                  {convertedHtml.substring(0, 500)}
                  {convertedHtml.length > 500 && '...'}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Información importante:</p>
            <ul className="space-y-1 text-blue-700">
              <li>• Los archivos Word se convierten manteniendo el formato y estructura</li>
              <li>• El HTML generado es compatible con el sistema de reportes del laboratorio</li>
              <li>• Puedes descargar el HTML y usarlo directamente en los reportes</li>
              <li>• Se mantiene la información de metadatos del documento original</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordToHtmlConverter;
