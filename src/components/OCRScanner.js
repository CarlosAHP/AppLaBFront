import React, { useState, useRef } from 'react';
import { Camera, X, Download, Copy, Check, Upload, Clipboard, Lightbulb, Target, HelpCircle } from 'lucide-react';
import { createWorker } from 'tesseract.js';
import toast from 'react-hot-toast';
import OCRStats from './OCRStats';

const OCRScanner = ({ onTextExtracted, onInsertText, editorContent = '' }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedResults, setExtractedResults] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [smartSuggestions, setSmartSuggestions] = useState([]);
  const [showHelp, setShowHelp] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Función para iniciar la cámara
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Usar cámara trasera en móviles
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('No se pudo acceder a la cámara');
    }
  };

  // Función para capturar imagen
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);
      setShowCamera(false);
      
      // Detener la cámara
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
    }
  };

  // Función para procesar OCR
  const processOCR = async () => {
    if (!capturedImage) return;
    
    setIsProcessing(true);
    toast.loading('Procesando imagen...', { id: 'ocr-processing' });
    
    try {
      const worker = await createWorker('spa'); // Español
      const { data: { text } } = await worker.recognize(capturedImage);
      
      setExtractedText(text);
      
      // Procesar texto y extraer resultados estructurados
      const results = processExtractedText(text);
      setExtractedResults(results);
      
      toast.success('Texto extraído exitosamente', { id: 'ocr-processing' });
      
      await worker.terminate();
    } catch (error) {
      console.error('Error processing OCR:', error);
      toast.error('Error al procesar la imagen', { id: 'ocr-processing' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Función para procesar el texto extraído y estructurarlo
  const processExtractedText = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    const results = [];
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine.length > 3) { // Filtrar líneas muy cortas
        results.push({
          id: index,
          text: trimmedLine,
          type: detectTextType(trimmedLine),
          selected: false,
          keywords: extractKeywords(trimmedLine),
          confidence: calculateConfidence(trimmedLine)
        });
      }
    });
    
    // Generar sugerencias inteligentes
    generateSmartSuggestions(results);
    
    return results;
  };

  // Función para extraer palabras clave del texto
  const extractKeywords = (text) => {
    const medicalKeywords = [
      'glucosa', 'colesterol', 'triglicéridos', 'hemoglobina', 'hematocrito',
      'leucocitos', 'eritrocitos', 'plaquetas', 'urea', 'creatinina',
      'bilirrubina', 'transaminasas', 'fosfatasa', 'proteínas', 'albúmina',
      'globulina', 'tiroides', 't3', 't4', 'tsh', 'cortisol', 'testosterona',
      'estrógenos', 'progesterona', 'vitamina', 'hierro', 'ferritina',
      'calcio', 'fósforo', 'magnesio', 'sodio', 'potasio', 'cloro',
      'ph', 'densidad', 'proteínas', 'glucosa', 'cetonas', 'sangre',
      'bacterias', 'levaduras', 'parásitos', 'cristales', 'cilindros',
      'epiteliales', 'leucocitos', 'eritrocitos', 'moco', 'bacterias'
    ];

    const lowerText = text.toLowerCase();
    const foundKeywords = medicalKeywords.filter(keyword => 
      lowerText.includes(keyword)
    );

    return foundKeywords;
  };

  // Función para calcular confianza del texto extraído
  const calculateConfidence = (text) => {
    let confidence = 0.5; // Base confidence
    
    // Aumentar confianza si contiene números
    if (/\d/.test(text)) confidence += 0.2;
    
    // Aumentar confianza si contiene unidades médicas
    const medicalUnits = ['mg/dl', 'g/dl', '%', 'u/l', 'iu/ml', 'ng/ml', 'pg/ml'];
    if (medicalUnits.some(unit => text.toLowerCase().includes(unit))) {
      confidence += 0.3;
    }
    
    // Aumentar confianza si contiene palabras médicas
    const medicalWords = ['resultado', 'valor', 'normal', 'alto', 'bajo', 'positivo', 'negativo'];
    if (medicalWords.some(word => text.toLowerCase().includes(word))) {
      confidence += 0.2;
    }
    
    return Math.min(confidence, 1.0);
  };

  // Función para generar sugerencias inteligentes
  const generateSmartSuggestions = (results) => {
    const suggestions = [];
    
    // Analizar el contenido del editor para encontrar ubicaciones apropiadas
    const editorText = editorContent.toLowerCase();
    
    results.forEach((result, index) => {
      const suggestion = {
        id: `suggestion-${index}`,
        resultId: result.id,
        text: result.text,
        suggestedLocation: findBestLocation(result, editorText),
        confidence: result.confidence,
        reason: generateReason(result, editorText)
      };
      
      suggestions.push(suggestion);
    });
    
    setSmartSuggestions(suggestions);
  };

  // Función para encontrar la mejor ubicación para insertar el texto
  const findBestLocation = (result, editorText) => {
    const keywords = result.keywords;
    
    // Buscar secciones relevantes en el editor
    if (keywords.some(k => ['glucosa', 'colesterol', 'triglicéridos'].includes(k))) {
      return 'Sección de Química Sanguínea';
    }
    
    if (keywords.some(k => ['hemoglobina', 'hematocrito', 'leucocitos'].includes(k))) {
      return 'Sección de Hematología';
    }
    
    if (keywords.some(k => ['urea', 'creatinina', 'bilirrubina'].includes(k))) {
      return 'Sección de Función Renal';
    }
    
    if (keywords.some(k => ['tiroides', 't3', 't4', 'tsh'].includes(k))) {
      return 'Sección de Hormonas';
    }
    
    if (keywords.some(k => ['orina', 'proteínas', 'glucosa'].includes(k))) {
      return 'Sección de Análisis de Orina';
    }
    
    return 'Sección General de Resultados';
  };

  // Función para generar razón de la sugerencia
  const generateReason = (result, editorText) => {
    const keywords = result.keywords;
    
    if (keywords.length > 0) {
      return `Contiene palabras clave: ${keywords.join(', ')}`;
    }
    
    if (result.type === 'value') {
      return 'Valor numérico detectado';
    }
    
    if (result.type === 'result') {
      return 'Resultado de laboratorio identificado';
    }
    
    return 'Texto relevante para resultados de laboratorio';
  };

  // Función para detectar el tipo de texto (resultado, valor, etc.)
  const detectTextType = (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('resultado') || lowerText.includes('valor')) {
      return 'result';
    } else if (lowerText.includes('mg/dl') || lowerText.includes('g/dl') || lowerText.includes('%')) {
      return 'value';
    } else if (lowerText.includes('normal') || lowerText.includes('alto') || lowerText.includes('bajo')) {
      return 'status';
    } else {
      return 'text';
    }
  };

  // Función para seleccionar/deseleccionar resultado
  const toggleResult = (id) => {
    setExtractedResults(prev => 
      prev.map(result => 
        result.id === id ? { ...result, selected: !result.selected } : result
      )
    );
  };

  // Función para insertar texto seleccionado en el editor
  const insertSelectedText = () => {
    const selectedResults = extractedResults.filter(result => result.selected);
    if (selectedResults.length === 0) {
      toast.error('Selecciona al menos un resultado');
      return;
    }
    
    const textToInsert = selectedResults.map(result => result.text).join('\n');
    onInsertText(textToInsert);
    toast.success('Texto insertado en el editor');
  };

  // Función para copiar texto individual
  const copyTextToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Texto copiado al portapapeles');
    } catch (error) {
      console.error('Error copying text:', error);
      toast.error('Error al copiar texto');
    }
  };

  // Función para copiar todos los resultados seleccionados
  const copySelectedText = async () => {
    const selectedResults = extractedResults.filter(result => result.selected);
    if (selectedResults.length === 0) {
      toast.error('Selecciona al menos un resultado');
      return;
    }
    
    const textToCopy = selectedResults.map(result => result.text).join('\n');
    await copyTextToClipboard(textToCopy);
  };

  // Función para insertar texto en ubicación sugerida
  const insertAtSuggestedLocation = (suggestion) => {
    const result = extractedResults.find(r => r.id === suggestion.resultId);
    if (result) {
      onInsertText(result.text);
      toast.success(`Texto insertado en: ${suggestion.suggestedLocation}`);
    }
  };

  // Función para limpiar todo
  const clearAll = () => {
    setCapturedImage(null);
    setExtractedText('');
    setExtractedResults([]);
    setShowCamera(false);
  };

  // Función para subir archivo
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full h-full bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Camera className="h-5 w-5 mr-2 text-green-600" />
              Escáner de Resultados
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Captura y extrae texto de resultados escritos
            </p>
          </div>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
            title="Ayuda y tutorial"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </div>
        
        {/* Panel de Ayuda */}
        {showHelp && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">¿Cómo usar el OCR?</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• <strong>Captura:</strong> Usa la cámara o sube una imagen</li>
              <li>• <strong>Procesa:</strong> El sistema extraerá el texto automáticamente</li>
              <li>• <strong>Selecciona:</strong> Elige los resultados que quieres insertar</li>
              <li>• <strong>Copia:</strong> Usa el botón de copiar para pegar manualmente</li>
              <li>• <strong>Inserta:</strong> Los resultados aparecerán en el editor</li>
            </ul>
            <p className="text-xs text-blue-700 mt-2">
              💡 <strong>Tip:</strong> Las sugerencias inteligentes te ayudarán a ubicar mejor el texto
            </p>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 space-y-4">
        {!capturedImage ? (
          /* Botones de captura */
          <div className="space-y-3">
            <button
              onClick={startCamera}
              className="w-full btn-primary flex items-center justify-center"
            >
              <Camera className="h-4 w-4 mr-2" />
              Usar Cámara
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full btn-secondary flex items-center justify-center"
            >
              <Upload className="h-4 w-4 mr-2" />
              Subir Imagen
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        ) : (
          /* Imagen capturada y controles */
          <div className="space-y-4">
            {/* Imagen capturada */}
            <div className="relative">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-48 object-cover rounded-lg border"
              />
              <button
                onClick={clearAll}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Botón de procesar */}
            <button
              onClick={processOCR}
              disabled={isProcessing}
              className={`w-full btn-primary flex items-center justify-center ${
                isProcessing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Extraer Texto
                </>
              )}
            </button>
          </div>
        )}

        {/* Cámara en vivo */}
        {showCamera && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
            <div className="relative w-full max-w-2xl mx-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-auto rounded-lg"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                <button
                  onClick={captureImage}
                  className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700"
                >
                  <Camera className="h-6 w-6" />
                </button>
                <button
                  onClick={() => {
                    setShowCamera(false);
                    if (videoRef.current?.srcObject) {
                      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
                    }
                  }}
                  className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resultados extraídos */}
        {extractedResults.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Resultados Extraídos</h4>
              <div className="flex space-x-2">
                <button
                  onClick={copySelectedText}
                  className="text-sm btn-secondary px-3 py-1"
                >
                  <Clipboard className="h-3 w-3 mr-1" />
                  Copiar
                </button>
                <button
                  onClick={insertSelectedText}
                  className="text-sm btn-primary px-3 py-1"
                >
                  Insertar
                </button>
              </div>
            </div>
            
            <div className="max-h-64 overflow-y-auto space-y-2">
              {extractedResults.map((result) => (
                <div
                  key={result.id}
                  className={`p-3 border rounded-lg transition-colors ${
                    result.selected 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 cursor-pointer" onClick={() => toggleResult(result.id)}>
                      <p className="text-sm text-gray-900">{result.text}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          result.type === 'result' ? 'bg-blue-100 text-blue-800' :
                          result.type === 'value' ? 'bg-green-100 text-green-800' :
                          result.type === 'status' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {result.type === 'result' ? 'Resultado' :
                           result.type === 'value' ? 'Valor' :
                           result.type === 'status' ? 'Estado' : 'Texto'}
                        </span>
                        {result.confidence > 0.7 && (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                            {Math.round(result.confidence * 100)}% confianza
                          </span>
                        )}
                        {result.keywords.length > 0 && (
                          <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                            {result.keywords.length} palabras clave
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <button
                        onClick={() => copyTextToClipboard(result.text)}
                        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                        title="Copiar texto"
                      >
                        <Clipboard className="h-3 w-3" />
                      </button>
                      {result.selected && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estadísticas del OCR */}
        {extractedResults.length > 0 && (
          <OCRStats 
            results={extractedResults} 
            suggestions={smartSuggestions} 
          />
        )}

        {/* Sugerencias Inteligentes */}
        {smartSuggestions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center">
              <Lightbulb className="h-4 w-4 text-yellow-500 mr-2" />
              <h4 className="font-medium text-gray-900">Sugerencias Inteligentes</h4>
            </div>
            
            <div className="max-h-48 overflow-y-auto space-y-2">
              {smartSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="p-3 border border-yellow-200 bg-yellow-50 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium">{suggestion.text}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        <Target className="h-3 w-3 inline mr-1" />
                        {suggestion.suggestedLocation}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{suggestion.reason}</p>
                    </div>
                    <button
                      onClick={() => insertAtSuggestedLocation(suggestion)}
                      className="text-xs btn-primary px-2 py-1"
                    >
                      Insertar Aquí
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OCRScanner;
