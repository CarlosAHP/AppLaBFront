import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { labTestsService } from '../services/labTestsService';
import { frontendHtmlService } from '../services/frontendHtmlService';
import PatientSearch from '../components/PatientSearch';
import PatientRegistrationForm from '../components/PatientRegistrationForm';
import ReportHistory from '../components/ReportHistory';
import HtmlFileList from '../components/HtmlFileList';
import OCRScanner from '../components/OCRScanner';
import MedicalInterpreter from '../components/MedicalInterpreter';
import { 
  Plus, 
  Search, 
  FileText, 
  ArrowLeft,
  UserCheck,
  Edit3,
  Save,
  X,
  Grid,
  List,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List as ListIcon,
  Type,
  Trash2,
  Download,
  History,
  Clock,
  CheckCircle,
  Camera,
  Brain
} from 'lucide-react';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const LabResults = () => {
  const { user, hasRole } = useAuth();
  const editorRef = useRef(null);

  // Función para formatear el nombre del paciente
  const formatPatientName = (patient) => {
    // Intentar usar full_name primero, luego construir desde campos individuales
    if (patient.full_name) {
      return patient.full_name;
    }
    
    const parts = [patient.first_name, patient.middle_name, patient.last_name].filter(Boolean);
    const fullName = parts.join(' ');
    
    // Si no hay nombre, mostrar información alternativa
    if (!fullName.trim()) {
      return patient.patient_code || 'Sin nombre';
    }
    
    return fullName;
  };
  
  // Estados principales
  const [currentView, setCurrentView] = useState('list'); // 'list', 'patient-search', 'patient-registration', 'test-selection', 'html-editor'
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedTests, setSelectedTests] = useState([]); // Cambio a array para múltiples selecciones
  const [htmlContent, setHtmlContent] = useState('');
  const [editedHtml, setEditedHtml] = useState('');
  
  // Estados para las pruebas
  const [labTests, setLabTests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'list'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  // Estados para archivos pendientes y completados
  const [editingOriginalFile, setEditingOriginalFile] = useState(null); // Archivo original que se está editando
  
  // Estados para OCR
  const [showOCR, setShowOCR] = useState(false);
  
  // Estados para Interpretador Médico
  const [showMedicalInterpreter, setShowMedicalInterpreter] = useState(false);

  // Debug: Log cuando cambien los estados
  useEffect(() => {
    console.log('Lab tests state updated:', labTests);
  }, [labTests]);

  useEffect(() => {
    console.log('Categories state updated:', categories);
  }, [categories]);

  useEffect(() => {
    loadLabTests();
    loadCategories();
  }, []);

  // Cargar contenido en el editor cuando cambie
  useEffect(() => {
    if (editorRef.current && editedHtml) {
      // Solo actualizar si el contenido es diferente
      if (editorRef.current.innerHTML !== editedHtml) {
        editorRef.current.innerHTML = editedHtml;
      }
    }
  }, [editedHtml]);

  const loadLabTests = async () => {
    try {
      setLoading(true);
      const response = await labTestsService.getLabTests();
      console.log('Lab tests response:', response);
      
      // Manejar diferentes estructuras de respuesta
      let testsData = [];
      if (response.data && Array.isArray(response.data)) {
        testsData = response.data;
      } else if (response.tests && Array.isArray(response.tests)) {
        testsData = response.tests;
      } else if (Array.isArray(response)) {
        testsData = response;
      }
      
      console.log('Setting lab tests:', testsData);
      setLabTests(testsData);
    } catch (error) {
      toast.error('Error al cargar las pruebas de laboratorio');
      console.error('Error loading lab tests:', error);
      setLabTests([]); // Asegurar que siempre sea un array
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await labTestsService.getCategories();
      console.log('Categories response:', response);
      
      // Manejar diferentes estructuras de respuesta
      let categoriesData = [];
      if (response.data && Array.isArray(response.data)) {
        categoriesData = response.data;
      } else if (response.categories && Array.isArray(response.categories)) {
        categoriesData = response.categories;
      } else if (Array.isArray(response)) {
        categoriesData = response;
      }
      
      console.log('Setting categories:', categoriesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]); // Asegurar que siempre sea un array
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadLabTests();
      return;
    }

    try {
      setLoading(true);
      const response = await labTestsService.searchTests(searchTerm);
      console.log('Search response:', response);
      
      // Manejar diferentes estructuras de respuesta
      let searchData = [];
      if (response.data && Array.isArray(response.data)) {
        searchData = response.data;
      } else if (response.tests && Array.isArray(response.tests)) {
        searchData = response.tests;
      } else if (Array.isArray(response)) {
        searchData = response;
      }
      
      console.log('Setting search results:', searchData);
      setLabTests(searchData);
    } catch (error) {
      toast.error('Error al buscar pruebas');
      console.error('Error searching tests:', error);
      setLabTests([]); // Asegurar que siempre sea un array
    } finally {
      setLoading(false);
    }
  };

  const handleNewResult = () => {
    if (hasRole('doctor') || hasRole('admin')) {
      setCurrentView('patient-search');
    } else {
      setCurrentView('test-selection');
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setCurrentView('test-selection');
  };

  const handleNewPatient = () => {
    setCurrentView('patient-registration');
  };

  const handlePatientCreated = (patient) => {
    setSelectedPatient(patient);
    setCurrentView('test-selection');
  };

  const handleTestToggle = (test) => {
    setSelectedTests(prev => {
      const isSelected = prev.some(t => t.filename === test.filename);
      if (isSelected) {
        return prev.filter(t => t.filename !== test.filename);
      } else {
        return [...prev, test];
      }
    });
  };

  const handleCategorySelect = (category) => {
    const categoryTests = filteredTests.filter(test => 
      getTestCategory(test.filename) === category
    );
    
    setSelectedTests(prev => {
      const categorySelected = categoryTests.every(test => 
        prev.some(selected => selected.filename === test.filename)
      );
      
      if (categorySelected) {
        // Deseleccionar toda la categoría
        return prev.filter(test => 
          !categoryTests.some(catTest => catTest.filename === test.filename)
        );
      } else {
        // Seleccionar toda la categoría
        const newTests = categoryTests.filter(test => 
          !prev.some(selected => selected.filename === test.filename)
        );
        return [...prev, ...newTests];
      }
    });
  };

  // Función para generar el encabezado HTML del laboratorio
  const generateLabHeaderHTML = (patientData = {}) => {
    const {
      gender = 'F',
      orderNumber = '005',
      patientInitial = 'C',
      age = '43 año(s)',
      doctor = 'MARIA SINAY',
      receptionDate = '12/09/2025'
    } = patientData;

    return `
      <div style="font-family: Arial, Helvetica, sans-serif; background: white; padding: 20px; border-bottom: 1px solid #e5e7eb; margin-bottom: 20px;">
        <!-- Sección superior con logo e información del laboratorio -->
        <div style="display: flex; align-items: flex-start; margin-bottom: 20px;">
          <div style="flex-shrink: 0; margin-right: 30px;">
            <img src="/recursos/logos/logo.jpg" alt="Laboratorio Clínico Esperanza" style="width: 80px; height: 80px; object-fit: contain;" />
          </div>
          
          <div style="flex: 1; line-height: 1.4;">
            <p style="font-size: 14px; color: #000; margin: 0; font-weight: normal;">LABORATORIO CLINICO</p>
            <p style="font-size: 18px; color: #000; margin: 2px 0; font-weight: bold; text-decoration: underline;">"ESPERANZA"</p>
            <p style="font-size: 12px; color: #000; margin: 2px 0; font-weight: normal;">3ra. Calle 3-01 Zona 3</p>
            <p style="font-size: 12px; color: #000; margin: 2px 0; font-weight: normal;">SAN ANTONIO AGUAS CALIENTES SACATEPEQUEZ</p>
            <p style="font-size: 12px; color: #000; margin: 2px 0; font-weight: bold;">TEL. 5596-8317 * 4556-4727</p>
          </div>
        </div>

        <!-- Sección inferior con información del reporte y paciente -->
        <div style="border-top: 1px solid #e5e7eb; padding-top: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h1 style="font-size: 14px; font-weight: bold; color: #000; margin: 0;">Informe de Resultado de Laboratorio</h1>
            <span style="font-size: 12px; color: #000; margin: 0;">Género: ${gender}</span>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px 30px; font-size: 12px; color: #000;">
            <div style="display: flex; align-items: center;">
              <span style="font-weight: normal; margin-right: 5px;">Nº. Orden:</span>
              <span style="font-weight: bold;">${orderNumber}</span>
            </div>
            
            <div style="display: flex; align-items: center;">
              <span style="font-weight: normal; margin-right: 5px;">Paciente:</span>
              <span style="font-weight: bold;">${patientInitial}</span>
            </div>
            
            <div style="display: flex; align-items: center;">
              <span style="font-weight: normal; margin-right: 5px;">Edad:</span>
              <span style="font-weight: bold;">${age}</span>
            </div>
            
            <div style="display: flex; align-items: center;">
              <span style="font-weight: normal; margin-right: 5px;">Doctor(a):</span>
              <span style="font-weight: bold;">${doctor}</span>
            </div>
            
            <div style="display: flex; align-items: center;">
              <span style="font-weight: normal; margin-right: 5px;">Recepción:</span>
              <span style="font-weight: bold;">${receptionDate}</span>
            </div>
          </div>
          
          <div style="margin-top: 10px; text-align: right;">
            <span style="font-size: 12px; color: #000; font-weight: normal;">Responsable:</span>
            <span style="font-size: 12px; color: #000; font-weight: bold;"> Licda. Carmen Xomara López Col. 4118</span>
          </div>
        </div>
      </div>
    `;
  };

  // Función para generar el pie de página básico (para cada página)
  const generateLabFooterBasicHTML = () => {
    return `
      <div style="font-family: Arial, Helvetica, sans-serif; background: white; padding: 10px; border-top: 1px solid #e5e7eb; margin-top: 20px; page-break-inside: avoid;">
        <!-- Información del horario y acreditación -->
        <div style="text-align: right;">
          <p style="font-size: 9px; color: #000; margin: 0; line-height: 1.3;">
            <strong>Horario:</strong> Lunes a viernes de 7:30 a 17:00 Hrs.- Sábado de 7:30 a 12:00 Hrs.
          </p>
          <p style="font-size: 9px; color: #000; margin: 3px 0 0 0;">
            Avalados por el Ministerio de Salud Pública y Asistencia Social
          </p>
        </div>
      </div>
    `;
  };

  // Función para generar el pie de página completo (última página con firma)
  const generateLabFooterCompleteHTML = () => {
    return `
      <div style="font-family: Arial, Helvetica, sans-serif; background: white; padding: 20px; border-top: 1px solid #e5e7eb; margin-top: 30px;">
        <!-- Información del horario y acreditación -->
        <div style="text-align: right; margin-bottom: 20px;">
          <p style="font-size: 10px; color: #000; margin: 0; line-height: 1.4;">
            <strong>Horario:</strong> Lunes a viernes de 7:30 a 17:00 Hrs.- Sábado de 7:30 a 12:00 Hrs.
          </p>
          <p style="font-size: 10px; color: #000; margin: 5px 0 0 0;">
            Avalados por el Ministerio de Salud Pública y Asistencia Social
          </p>
        </div>

        <!-- Sección de firma responsable -->
        <div style="display: flex; justify-content: flex-end; align-items: flex-end;">
          <div style="display: flex; flex-direction: column; align-items: center; min-width: 200px;">
            <img src="/recursos/firmas/firma_responsable.png" alt="Firma Licda. Xomara López" style="width: 150px; height: 60px; object-fit: contain; margin-bottom: 10px;" />
            <div style="font-size: 11px; color: #000; text-align: center; font-weight: bold; margin-top: 5px;">Licda. Xomara López</div>
            <div style="font-size: 10px; color: #000; text-align: center; font-weight: normal;">Química Bióloga</div>
            <div style="font-size: 10px; color: #000; text-align: center; font-weight: normal;">Col. 4118</div>
          </div>
        </div>
      </div>
    `;
  };

  const handleProceedToEditor = async () => {
    if (selectedTests.length === 0) {
      toast.error('Selecciona al menos una prueba');
      return;
    }

    try {
      setLoading(true);
      
      // Generar datos del paciente (puedes personalizar esto según tus necesidades)
      const patientData = {
        gender: selectedPatient?.gender === 'masculino' ? 'M' : 'F',
        orderNumber: selectedPatient?.patient_code || 'ORD-001',
        patientInitial: selectedPatient ? formatPatientName(selectedPatient).charAt(0) : 'C',
        age: selectedPatient?.age ? `${selectedPatient.age} año(s)` : '43 año(s)',
        doctor: selectedPatient?.doctor || 'MARIA SINAY',
        receptionDate: new Date().toLocaleDateString('es-GT')
      };

      // Generar encabezado HTML
      const headerHTML = generateLabHeaderHTML(patientData);
      
      // Si solo hay una prueba, cargar directamente
      if (selectedTests.length === 1) {
        const test = selectedTests[0];
        const htmlContent = await labTestsService.getHtmlFile(test.filename);
        const footerHTML = generateLabFooterCompleteHTML();
        
        // Combinar encabezado + contenido + pie de página
        const completeHTML = headerHTML + htmlContent + footerHTML;
        
        setHtmlContent(completeHTML);
        setEditedHtml(completeHTML);
        setCurrentView('html-editor');
        
        // Cargar el contenido en el editor
        setTimeout(() => {
          if (editorRef.current) {
            editorRef.current.innerHTML = completeHTML;
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(editorRef.current);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }, 100);
      } else {
        // Para múltiples pruebas, combinar el contenido
        let combinedHtml = '';
        for (let i = 0; i < selectedTests.length; i++) {
          const test = selectedTests[i];
          const htmlContent = await labTestsService.getHtmlFile(test.filename);
          const basicFooter = generateLabFooterBasicHTML();
          
          combinedHtml += `<div class="test-section" data-test="${test.filename}">
            <h3 class="test-title">${test.name}</h3>
            ${htmlContent}
          </div>`;
          
          // Agregar pie de página básico entre pruebas (excepto en la última)
          if (i < selectedTests.length - 1) {
            combinedHtml += basicFooter + '<div style="page-break-after: always;"></div>';
          }
        }
        
        const footerHTML = generateLabFooterCompleteHTML();
        const completeHTML = headerHTML + combinedHtml + footerHTML;
        
        setHtmlContent(completeHTML);
        setEditedHtml(completeHTML);
        setCurrentView('html-editor');
        
        // Cargar el contenido combinado en el editor
        setTimeout(() => {
          if (editorRef.current) {
            editorRef.current.innerHTML = completeHTML;
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(editorRef.current);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }, 100);
      }
    } catch (error) {
      toast.error('Error al cargar los archivos HTML');
      console.error('Error loading HTML files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResult = async () => {
    if (saving) return; // Evitar múltiples guardados simultáneos
    
    try {
      setSaving(true);
      // Mostrar loading
      toast.loading('Guardando resultado...', { id: 'save-report' });

      // Generar datos del reporte
      const reportData = {
        order_number: selectedPatient?.patient_code || 'ORD-001',
        patient_name: selectedPatient ? formatPatientName(selectedPatient) : 'Paciente',
        patient_age: selectedPatient?.age || 43,
        patient_gender: selectedPatient?.gender === 'masculino' ? 'M' : 'F',
        doctor_name: selectedPatient?.doctor || 'MARIA SINAY',
        reception_date: new Date().toISOString().split('T')[0],
        selected_tests: selectedTests.map(test => ({
          name: test.name,
          filename: test.filename
        })),
        html_content: editedHtml,
        status: 'draft'
      };

      try {
        console.log('🚀 Intentando guardar en servidor...');
        console.log('📋 Datos a enviar:', {
          patient_name: reportData.patient_name,
          order_number: reportData.order_number,
          doctor_name: reportData.doctor_name,
          status: 'pending'
        });
        
        // Verificar conectividad del backend primero
        console.log('🔍 Verificando conectividad del backend...');
        try {
          // Usar un endpoint que sabemos que existe
          const healthCheck = await fetch('http://localhost:5002/api/frontend-html/system/validate', {
            method: 'GET',
            timeout: 5000,
          });
          console.log('✅ Backend disponible:', healthCheck.ok);
        } catch (healthError) {
          console.warn('⚠️ Backend no disponible:', healthError.message);
          // No lanzar error aquí, continuar con el intento de guardado
          console.log('🔄 Continuando con el intento de guardado...');
        }
        
        // Determinar si estamos editando un archivo existente o creando uno nuevo
        let response;
        if (editingOriginalFile) {
          console.log('📝 Actualizando archivo existente:', editingOriginalFile);
          
          // Obtener información del archivo original para calcular edit_count
          const originalFileInfo = await frontendHtmlService.getFileInfo(editingOriginalFile);
          const originalMetadata = originalFileInfo.data?.metadata || {};
          const currentEditCount = originalMetadata.edit_count || 0;
          const newEditCount = currentEditCount + 1;
          
          // Crear entrada de historial de edición
          const editEntry = {
            edited_by: user?.username || 'Usuario',
            edited_at: new Date().toISOString(),
            edit_number: newEditCount,
            changes_summary: 'Archivo modificado'
          };
          
          // Obtener historial existente o crear uno nuevo
          const existingHistory = originalMetadata.edit_history || [];
          const updatedHistory = [...existingHistory, editEntry];
          
          // Actualizar archivo existente con seguimiento de ediciones
          response = await frontendHtmlService.updateHtmlFile(editingOriginalFile, editedHtml, {
            patient_name: reportData.patient_name,
            order_number: reportData.order_number,
            doctor_name: reportData.doctor_name,
            patient_age: reportData.patient_age,
            patient_gender: reportData.patient_gender,
            reception_date: reportData.reception_date,
            tests: reportData.selected_tests,
            status: 'pending', // Mantener estado pendiente
            updated_by: user?.username || 'Usuario',
            updated_at: new Date().toISOString(),
            // Campos de seguimiento de ediciones
            edit_count: newEditCount,
            is_modified: true,
            last_edited_by: user?.username || 'Usuario',
            last_edit_date: new Date().toISOString(),
            edit_history: updatedHistory,
            original_created_by: originalMetadata.created_by || originalMetadata.updated_by,
            modification_timestamp: new Date().toISOString()
          });
        } else {
          console.log('📤 Creando nuevo archivo');
          // Crear nuevo archivo
          response = await frontendHtmlService.uploadHtmlFile(editedHtml, {
            patient_name: reportData.patient_name,
            order_number: reportData.order_number,
            doctor_name: reportData.doctor_name,
            patient_age: reportData.patient_age,
            patient_gender: reportData.patient_gender,
            reception_date: reportData.reception_date,
            tests: reportData.selected_tests,
            status: 'pending', // Estado pendiente por defecto
            created_by: user?.username || 'Usuario',
            created_at: new Date().toISOString(),
            // Campos iniciales para archivos nuevos
            edit_count: 0,
            is_modified: false,
            original_created_by: user?.username || 'Usuario'
          });
        }
        
        console.log('📡 Respuesta del servidor:', response);
        
        if (response.success) {
          console.log('✅ Archivo guardado exitosamente en servidor');
          toast.success(`Resultado guardado exitosamente: ${response.data.filename}`, { id: 'save-report' });
          
          // Limpiar el estado de edición
          setEditingOriginalFile(null);
          
          // No guardar en localStorage - solo usar el servidor

          // Recargar archivos y volver a la lista
          handleBackToList();
          return;
        } else {
          console.error('❌ Error en la respuesta del servidor:', response.message);
          throw new Error(response.message || 'Error desconocido del servidor');
        }
      } catch (backendError) {
        console.error('❌ Error al guardar en servidor:', backendError);
        console.error('📋 Detalles del error:', {
          message: backendError.message,
          response: backendError.response?.data,
          status: backendError.response?.status
        });
        
        // Mostrar error y no permitir guardado local
        toast.error(`Error al guardar en el servidor: ${backendError.message}`, { id: 'save-report' });
        throw backendError; // Re-lanzar el error para que se maneje en el catch principal
      }
      
    } catch (error) {
      console.error('Error saving report:', error);
      toast.error(`Error al guardar el resultado: ${error.message}`, { id: 'save-report' });
    } finally {
      setSaving(false);
    }
  };

  // Función para manejar la edición de archivos existentes
  const handleEditFile = async (file) => {
    try {
      console.log('📝 Editando archivo:', file.filename);
      
      // Cargar el contenido HTML del archivo
      const response = await frontendHtmlService.getHtmlContent(file.filename);
      
      if (response.success) {
        // El contenido HTML está en response.data.content, no en html_content
        const htmlContent = response.data.content || response.data.html_content;
        
        // Establecer el contenido HTML en el editor
        setHtmlContent(htmlContent);
        setEditedHtml(htmlContent);
        
        // Establecer los datos del paciente desde los metadatos
        const metadata = file.metadata || {};
        const patientData = {
          patient_code: metadata.order_number,
          full_name: metadata.patient_name,
          age: metadata.patient_age,
          gender: metadata.patient_gender === 'M' ? 'masculino' : 'femenino',
          doctor: metadata.doctor_name
        };
        
        setSelectedPatient(patientData);
        
        // Establecer las pruebas desde los metadatos
        const tests = metadata.tests || [];
        setSelectedTests(tests);
        
        // Guardar el nombre del archivo original que estamos editando
        setEditingOriginalFile(file.filename);
        
        // Cambiar a la vista del editor
        setCurrentView('html-editor');
        
        // Cerrar el historial si está abierto
        setShowHistory(false);
        
        // Actualizar el contenido del editor después de un pequeño delay
        setTimeout(() => {
          if (editorRef.current) {
            editorRef.current.innerHTML = htmlContent;
            console.log('📝 Contenido HTML cargado en el editor:', htmlContent);
          }
        }, 100);
        
        toast.success('Archivo cargado para edición');
      } else {
        throw new Error(response.message || 'Error al cargar el archivo');
      }
    } catch (error) {
      console.error('Error cargando archivo para edición:', error);
      toast.error(`Error al cargar archivo: ${error.message}`);
    }
  };

  const handleGeneratePDF = async () => {
    if (!editorRef.current) {
      toast.error('No hay contenido para generar PDF');
      return;
    }

    try {
      toast.loading('Generando PDF...', { id: 'pdf-generation' });
      
      // Configuración para html2canvas
      const canvas = await html2canvas(editorRef.current, {
        scale: 2, // Mayor resolución
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: editorRef.current.scrollWidth,
        height: editorRef.current.scrollHeight,
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

      // Generar nombre del archivo
      const patientName = selectedPatient ? formatPatientName(selectedPatient) : 'Paciente';
      const testNames = selectedTests.map(test => test.name).join('_');
      const filename = `Reporte_${patientName}_${testNames}_${new Date().toISOString().split('T')[0]}.pdf`;

      // Descargar PDF
      pdf.save(filename);
      
      toast.success('PDF generado exitosamente', { id: 'pdf-generation' });
    } catch (error) {
      console.error('Error generando PDF:', error);
      toast.error('Error al generar PDF: ' + error.message, { id: 'pdf-generation' });
    }
  };

  const handleBackToSearch = () => {
    setCurrentView('patient-search');
    setSelectedPatient(null);
  };

  const handleBackToTestSelection = () => {
    setCurrentView('test-selection');
    // No limpiar selectedTests para preservar las pruebas seleccionadas
    setHtmlContent('');
    setEditedHtml('');
  };

  const handleRemoveSelectedTests = () => {
    if (selectedTests.length === 0) {
      toast.error('No hay pruebas seleccionadas para eliminar');
      return;
    }

    // Confirmar la eliminación
    const confirmMessage = selectedTests.length === 1 
      ? `¿Estás seguro de que quieres eliminar la prueba "${selectedTests[0].name}"?`
      : `¿Estás seguro de que quieres eliminar las ${selectedTests.length} pruebas seleccionadas?`;

    if (window.confirm(confirmMessage)) {
      setSelectedTests([]);
      setHtmlContent('');
      setEditedHtml('');
      setCurrentView('test-selection');
      toast.success('Pruebas eliminadas correctamente');
    }
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedPatient(null);
    setSelectedTests([]);
    setHtmlContent('');
    setEditedHtml('');
    setEditingOriginalFile(null); // Limpiar el estado de edición
  };



  // Funciones para el editor de texto
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setEditedHtml(editorRef.current.innerHTML);
    }
  };

  const handleEditorChange = () => {
    if (editorRef.current) {
      setEditedHtml(editorRef.current.innerHTML);
    }
  };

  // Función para insertar texto del OCR en el editor
  const handleInsertOCRText = (text) => {
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        // Si no hay selección, insertar al final
        editorRef.current.innerHTML += `<br>${text}`;
      }
      handleEditorChange();
    }
  };

  // Función para manejar la interpretación médica
  const handleMedicalInterpretation = (interpretationData) => {
    console.log('Interpretación médica completada:', interpretationData);
    toast.success('Interpretación médica completada');
  };

  const handleEditorClick = (e) => {
    // Permitir el comportamiento normal del clic
    // Solo intervenir si hay problemas de posicionamiento
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const editorRect = editorRef.current.getBoundingClientRect();
        
        // Si el cursor está fuera del área del editor, ajustarlo
        if (rect.top < editorRect.top || rect.bottom > editorRect.bottom) {
          const newRange = document.createRange();
          newRange.selectNodeContents(editorRef.current);
          newRange.collapse(false); // Ir al final del contenido
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      }
    }, 10);
  };

  const handleEditorFocus = () => {
    // Asegurar que el editor mantenga el foco correctamente
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection.rangeCount === 0) {
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false); // Ir al final
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  // Definir categorías manualmente (antes de su uso)
  const testCategories = {
    'HECES': ['coprologia', 'orina_completa', 'heces_completa'],
    'HEMATOLOGIA': ['bioquimica_completa', 'bioquimica_hepatica', 'hematologia_completa', 'inmunologia_salmonella', 'pruebas_tiroideas'],
    'QUIMICA CLINICA': [
      'acido_urico_orina',
      'aldolasa',
      'bilirrubinas_adultos',
      'bilirrubinas_recien_nacidos',
      'bioquimica_basica',
      'bioquimica_hepatica',
      'calcio_orina',
      'cardiovasculares_probnp',
      'cardiovasculares_troponinas',
      'curva_insulina',
      'curva_tolerancia_glucosa',
      'ferritina',
      'hierro_serico',
      'homocisteina',
      'lactato',
      'peptido_c',
      'perfil_lipidico',
      'proteinas_orina_simple',
      'pruebas_renales',
      'quimica_clinica_proteinas',
      'urologia_24h',
      'urologia_al_azar',
      'urologia_depuracion',
      'urologia_microalbumina',
      'vitamina_d'
    ],
    'ENZIMAS': [
      'colinesterasa',
      'enzimas_cardiacas',
      'enzimas_generales',
      'enzimas_pancreaticas',
      'fosfatasa_alcalina_detallada'
    ],
    'ELECTROLITOS': [
      'electrolitos_basicos',
      'electrolitos_ultralab',
      'pruebas_ferroceneticas'
    ],
    'HORMONAS': [
      'prueba_embarazo'
    ],
    'INMUNOLOGIA': [
      'acido_folico',
      'anti_cardiolipina',
      'anti_citrulina',
      'anti_dna',
      'anti_dna_elisa',
      'anti_la_ssb',
      'anti_mitocondriales',
      'anti_musculo_liso',
      'anti_ro_ssa',
      'anti_sm',
      'autoinmunidad',
      'bioquimica_inmunoglobulinas',
      'celulas_le',
      'complemento',
      'coombs_indirecto',
      'crioglobulinas',
      'eosinofilos_moco',
      'factor_antinuclear',
      'ferritina_inmunologia',
      'homocisteina_inmunologia',
      'inmunoglobulinas',
      'inmunohematologia',
      'inmunologia_avanzada',
      'inmunologia_basica',
      'inmunologia_reumatoide',
      'mioglobina_inmunologia',
      'monotest',
      'pcr_ultrasensible',
      'resistencia_insulina',
      'serologia',
      'transferrina',
      'troponina_t',
      'vitamina_b12',
      'vitamina_d_inmunologia'
    ],
    'INFECCIOSAS': [
      'anti_cardiolipina_infecciosas',
      'anti_cisticerco',
      'anti_endomiciales',
      'anti_hbc_igm',
      'anti_tuberculosis',
      'chikungunya',
      'chlamydia_trachomatis',
      'citomegalovirus_igg',
      'citomegalovirus_igm',
      'dengue',
      'epstein_barr_igg',
      'epstein_barr_igg_ultralab',
      'epstein_barr_igm',
      'epstein_barr_igm_ultralab',
      'fta_abs',
      'hepatitis_a_igg',
      'hepatitis_a_igm_igg',
      'hepatitis_a_positivo',
      'hepatitis_avanzada',
      'hepatitis_b_anti_hbc_igm',
      'hepatitis_basica',
      'hepatitis_c',
      'herpes_simplex_igg_biolab',
      'herpes_simplex_ii_igg',
      'herpes_simplex_ii_igm',
      'hiv_elisa',
      'influenza',
      'inmunologia_hepatitis',
      'inmunologia_infecciosa_basica',
      'leptospira',
      'malaria',
      'rubeola_igm',
      'rubeola_radio',
      'salmonella_typhi',
      'salmonella_typhi_avanzado',
      'torch_completo',
      'torch_igg',
      'torch_igg_ultralab',
      'torch_igg_ultralab_completo',
      'torch_igm',
      'torch_igm_radio',
      'toxoplasma_gondii_igg',
      'toxoplasma_gondii_igg_biolab',
      'toxoplasma_gondii_igg_ultralab',
      'toxoplasma_gondii_igm',
      'toxoplasma_gondii_igm_biolab',
      'toxoplasma_gondii_igm_ultralab',
      'toxoplasma_gondii_radio',
      'widal',
      'widal_avanzado'
    ],
    'ENDOCRINOLOGIA': [
      'ac_antimicrosomales',
      'ac_antitiroglobulinicos',
      'ac_antitiroglobulinicos_avanzado',
      'acth',
      'acth_am_pm',
      'anti_endomiciales',
      'anti_gliadina',
      'cortisol_am',
      'cortisol_am_pm',
      'estradiol_avanzado',
      'ferrocenica_avanzada',
      'ferrocenica_basica',
      'hcg_beta_abesco',
      'hcg_beta_cuantitativa',
      'hcg_beta_esperanza',
      'hcg_beta_ultralab',
      'hormona_crecimiento',
      'hormona_crecimiento_avanzada',
      'hormonas_fertilidad_abesco',
      'hormonas_fertilidad_avanzadas',
      'hormonas_fertilidad_basicas',
      'insulina_postprandial',
      'insulina_preprandial',
      'parathormona',
      'pruebas_tiroideas_avanzadas',
      'pruebas_tiroideas_basicas',
      'testosterona',
      'testosterona_libre_total',
      'tiroglobulinas'
    ],
    'MARCADORES TUMORALES': [
      'alfa_fetoproteina',
      'alfa_fetoproteina_biolab',
      'ca_15_3_basico',
      'ca_15_3_biolab',
      'ca_19_9_basico',
      'ca_19_9_biolab',
      'ca_125',
      'ca_125_biolab',
      'cea_biolab',
      'homocisteina_marcadores',
      'proteinas_neoplasicas_avanzadas',
      'proteinas_neoplasicas_basicas',
      'psa_biolab',
      'psa_esperanza',
      'relacion_libre_total',
      'relacion_libre_total_biolab'
    ],
    'COAGULACION': [
      'anticuagulante_lupico',
      'clinitest',
      'coagulacion_basica',
      'fibrinogeno',
      'inmunoglobulina_e',
      'proteina_c',
      'recuentos_sanguineos',
      'tiempos_coagulacion'
    ],
    'TIPO DE SANGRE': [
      'grupo_rh'
    ],
    'CULTIVOS': [
      'urocultivo_negativo',
      'urocultivo_positivo',
      'orocultivo',
      'secrecion_vaginal',
      'coprocultivo'
    ],
    'FROTE PERIFERICO Y CLASIFICACION DE ANEMIA': [
      'frote_periferico',
      'clasificacion_anemia',
      'gota_gruesa'
    ],
    'HELICOBACTER': [
      'helicobacter_antigeno_heces',
      'azul_metileno',
      'transferrina_heces',
      'virus_heces',
      'sangre_oculta_heces',
      'helicobacter_igm_1',
      'helicobacter_igg_1',
      'helicobacter_igm_igg_2',
      'panel_parasitos',
      'clostridium_difficile',
      'clinitest_1',
      'clinitest_2',
      'clinitest_sudan_calprotectina',
      'helicobacter_igg_3'
    ],
    'MICROBIOLOGIA': [
      'ziehl_neelsen_esputo',
      'bk_esputo_1',
      'bk_esputo_2',
      'bk_esputo_3',
      'koh_lesiones_piel',
      'microscopia_azul_metileno'
    ],
    'ESPERMOGRAMA': [
      'espermograma'
    ],
    'TARJETA DE SALUD': [
      'inmunologia_infecciosa',
      'hepatitis',
      'heces_completa',
      'orina_completa'
    ],
    'DROGAS': [
      'acido_valproico_1',
      'acido_valproico_fenitoina'
    ],
    'PAQUETE PRENATAL DRA WENDY': [
      'hematologia_wendy',
      'tipo_sangre_wendy',
      'bioquimica_wendy',
      'inmunologia_infecciosa_wendy',
      'hepatitis_wendy',
      'orina_completa_wendy'
    ],
    'PAQUETE PRENATAL': [
      'hematologia_prenatal',
      'tipo_sangre_prenatal',
      'bioquimica_prenatal',
      'inmunologia_infecciosa_prenatal',
      'hepatitis_prenatal',
      'heces_completa_prenatal',
      'orina_completa_prenatal'
    ],
    'PAQUETE COVID-19': [
      'hematologia_covid',
      'bioquimica_covid',
      'inmunologia_covid',
      'proteinas_neoplasicas_covid',
      'coagulacion_covid',
      'enzimas_covid',
      'interleucina_covid'
    ],
    'HEMATOLOGIA CANINO': [
      'hematologia_canino',
      'bioquimica_canino',
      'bioquimica_hepatica_canino'
    ],
    'HEMATOLOGIA FELINO': [
      'hematologia_felino',
      'bioquimica_felino',
      'bioquimica_hepatica_felino',
      'bilirrubinas_felino'
    ],
    'PAQUETE DENGUE': [
      'hematologia_dengue',
      'inmunologia_dengue',
      'orina_completa_dengue'
    ]
  };

  // Función para obtener la categoría de una prueba
  const getTestCategory = (filename) => {
    const baseName = filename.replace('.html', '');
    for (const [category, tests] of Object.entries(testCategories)) {
      if (tests.includes(baseName)) {
        return category;
      }
    }
    return 'OTROS';
  };

  const filteredTests = Array.isArray(labTests) ? labTests.filter(test => {
    const testCategory = getTestCategory(test.filename);
    const matchesSearch = test.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testCategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || testCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  }) : [];

  // Agrupar pruebas por categoría manual
  const groupedTests = filteredTests.reduce((groups, test) => {
    const category = getTestCategory(test.filename);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(test);
    return groups;
  }, {});

  // Debug: Log filtered tests
  console.log('Filtered tests:', filteredTests);
  console.log('Grouped tests:', groupedTests);
  console.log('Search term:', searchTerm);
  console.log('Selected category:', selectedCategory);

  const getCategoryBadge = (category) => {
    const categoryColors = {
      'HECES': 'bg-amber-100 text-amber-800',
      'HEMATOLOGIA': 'bg-red-100 text-red-800',
      'QUIMICA CLINICA': 'bg-blue-100 text-blue-800',
      'ENZIMAS': 'bg-green-100 text-green-800',
      'ELECTROLITOS': 'bg-purple-100 text-purple-800',
      'HORMONAS': 'bg-pink-100 text-pink-800',
      'INMUNOLOGIA': 'bg-indigo-100 text-indigo-800',
      'INFECCIOSAS': 'bg-orange-100 text-orange-800',
      'ENDOCRINOLOGIA': 'bg-teal-100 text-teal-800',
      'MARCADORES TUMORALES': 'bg-cyan-100 text-cyan-800',
      'COAGULACION': 'bg-emerald-100 text-emerald-800',
      'TIPO DE SANGRE': 'bg-rose-100 text-rose-800',
      'CULTIVOS': 'bg-yellow-100 text-yellow-800',
      'FROTE PERIFERICO Y CLASIFICACION DE ANEMIA': 'bg-violet-100 text-violet-800',
      'HELICOBACTER': 'bg-slate-100 text-slate-800',
      'MICROBIOLOGIA': 'bg-lime-100 text-lime-800',
      'ESPERMOGRAMA': 'bg-fuchsia-100 text-fuchsia-800',
      'TARJETA DE SALUD': 'bg-sky-100 text-sky-800',
      'DROGAS': 'bg-red-100 text-red-800',
      'PAQUETE PRENATAL DRA WENDY': 'bg-pink-100 text-pink-800',
      'PAQUETE PRENATAL': 'bg-indigo-100 text-indigo-800',
      'PAQUETE COVID-19': 'bg-orange-100 text-orange-800',
      'HEMATOLOGIA CANINO': 'bg-amber-100 text-amber-800',
      'HEMATOLOGIA FELINO': 'bg-emerald-100 text-emerald-800',
      'PAQUETE DENGUE': 'bg-teal-100 text-teal-800',
      'OTROS': 'bg-gray-100 text-gray-800'
    };
    
    const colorClass = categoryColors[category] || categoryColors.OTROS;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {category}
      </span>
    );
  };

  if (loading && currentView === 'list') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Generación de Resultados
          </h1>
          <p className="text-gray-600 mt-1">
            Selecciona y edita documentos HTML para generar resultados de laboratorio
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => setShowHistory(true)}
            className="btn-secondary"
          >
            <History className="h-5 w-5 mr-2" />
            Historial
          </button>
          {(hasRole('admin') || hasRole('doctor') || hasRole('technician')) && (
            <button
              onClick={handleNewResult}
              className="btn-primary"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nuevo Resultado
            </button>
          )}
        </div>
      </div>

      {/* Patient Selection Views */}
      {currentView === 'patient-search' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Seleccionar Paciente</h2>
            <button
              onClick={handleBackToList}
              className="btn-secondary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </button>
          </div>
          <PatientSearch
            onPatientSelect={handlePatientSelect}
            onNewPatient={handleNewPatient}
          />
        </div>
      )}

      {currentView === 'patient-registration' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <PatientRegistrationForm
            onPatientCreated={handlePatientCreated}
            onBack={handleBackToSearch}
          />
        </div>
      )}

      {/* Test Selection View */}
      {currentView === 'test-selection' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Seleccionar Tipo de Prueba</h2>
              {selectedPatient && (
                <div className="mt-2 flex items-center text-sm text-gray-600">
                  <UserCheck className="h-4 w-4 mr-2" />
                  <span className="font-medium">Paciente:</span> {formatPatientName(selectedPatient)}
                  {selectedPatient.patient_code && (
                    <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                      Código: {selectedPatient.patient_code}
                    </span>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={selectedPatient ? handleBackToSearch : handleBackToList}
              className="btn-secondary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </button>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar pruebas..."
                    className="input-field pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select
                  className="input-field"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">Todas las categorías</option>
                  {Object.keys(testCategories).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                  <option value="OTROS">OTROS</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Tests Grouped by Category */}
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedTests).map(([category, tests]) => {
                const isCategorySelected = tests.every(test => 
                  selectedTests.some(selected => selected.filename === test.filename)
                );
                const isCategoryPartiallySelected = tests.some(test => 
                  selectedTests.some(selected => selected.filename === test.filename)
                );

                return (
                  <div key={category} className="border border-gray-200 rounded-lg p-4">
                    {/* Category Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">{category}</h3>
                        {getCategoryBadge(category)}
                      </div>
                      <button
                        onClick={() => handleCategorySelect(category)}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          isCategorySelected 
                            ? 'bg-primary-600 text-white' 
                            : isCategoryPartiallySelected
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {isCategorySelected ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
                      </button>
                    </div>

                    {/* Tests in Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {tests.map((test) => {
                        const isSelected = selectedTests.some(selected => selected.filename === test.filename);
                        return (
                          <div
                            key={test.filename}
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${
                              isSelected 
                                ? 'border-primary-500 bg-primary-50 shadow-md' 
                                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                            }`}
                            onClick={() => handleTestToggle(test)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <div className={`w-4 h-4 rounded border-2 mr-2 flex items-center justify-center ${
                                    isSelected 
                                      ? 'border-primary-500 bg-primary-500' 
                                      : 'border-gray-300'
                                  }`}>
                                    {isSelected && (
                                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    )}
                                  </div>
                                  <FileText className="h-4 w-4 text-primary-600 mr-2" />
                                  <h4 className="font-medium text-gray-900 text-sm">{test.name}</h4>
                                </div>
                                {test.description && (
                                  <p className="text-xs text-gray-600 mb-2">{test.description}</p>
                                )}
                                <span className="text-xs text-gray-500">{test.filename}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Selected Tests Summary and Proceed Button */}
          {selectedTests.length > 0 && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-primary-900">
                    {selectedTests.length} prueba{selectedTests.length !== 1 ? 's' : ''} seleccionada{selectedTests.length !== 1 ? 's' : ''}
                  </h4>
                  <p className="text-sm text-primary-700">
                    {selectedTests.map(test => test.name).join(', ')}
                  </p>
                </div>
                <button
                  onClick={handleProceedToEditor}
                  className="btn-primary"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Proceder a Edición
                </button>
              </div>
            </div>
          )}

          {filteredTests.length === 0 && !loading && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pruebas disponibles</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'No se encontraron pruebas con los filtros aplicados.'
                  : 'No hay pruebas de laboratorio disponibles.'
                }
              </p>
            </div>
          )}
        </div>
      )}

      {/* HTML Editor View */}
      {currentView === 'html-editor' && (
        <div className="space-y-6">
          <div className="flex gap-6">
            {/* Editor principal */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Editor de Resultado</h2>
                <div className="mt-2 flex items-center text-sm text-gray-600">
                  <FileText className="h-4 w-4 mr-2" />
                  {selectedTests.length === 1 
                    ? selectedTests[0]?.name 
                    : `${selectedTests.length} pruebas seleccionadas`
                  }
                  {selectedPatient && (
                    <>
                      <span className="mx-2">•</span>
                      <UserCheck className="h-4 w-4 mr-2" />
                      {formatPatientName(selectedPatient)}
                    </>
                  )}
                </div>
                {selectedTests.length > 1 && (
                  <div className="mt-1 text-xs text-gray-500">
                    {selectedTests.map(test => test.name).join(', ')}
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowMedicalInterpreter(!showMedicalInterpreter)}
                  className={`btn-secondary text-sm ${
                    showMedicalInterpreter ? 'bg-blue-100 text-blue-700 border-blue-300' : ''
                  }`}
                >
                  <Brain className="h-4 w-4 mr-1" />
                  {showMedicalInterpreter ? 'Ocultar IA' : 'Mostrar IA'}
                </button>
                <button
                  onClick={() => setShowOCR(!showOCR)}
                  className={`btn-secondary text-sm ${
                    showOCR ? 'bg-green-100 text-green-700 border-green-300' : ''
                  }`}
                >
                  <Camera className="h-4 w-4 mr-1" />
                  {showOCR ? 'Ocultar OCR' : 'Mostrar OCR'}
                </button>
                <button
                  onClick={handleBackToTestSelection}
                  className="btn-secondary"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </button>
              </div>
            </div>

          {/* Custom WYSIWYG Editor */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-medium text-gray-900">Editor de Resultado</h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleRemoveSelectedTests}
                  className="btn-secondary text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                  title="Eliminar pruebas seleccionadas"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Eliminar Pruebas
                </button>
                <button
                  onClick={() => {
                    setEditedHtml(htmlContent);
                    if (editorRef.current) {
                      editorRef.current.innerHTML = htmlContent;
                    }
                  }}
                  className="btn-secondary text-sm"
                >
                  <X className="h-4 w-4 mr-1" />
                  Descartar Cambios
                </button>
                <button
                  onClick={handleGeneratePDF}
                  className="btn-primary text-sm bg-green-600 hover:bg-green-700"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Generar PDF
                </button>
                <button
                  onClick={handleSaveResult}
                  disabled={saving}
                  className={`btn-primary text-sm ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-1" />
                      Guardar Resultado
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="border border-gray-300 border-b-0 rounded-t-lg bg-gray-50 p-2">
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => execCommand('bold')}
                  className="p-2 hover:bg-gray-200 rounded text-gray-700"
                  title="Negrita"
                >
                  <Bold className="h-4 w-4" />
                </button>
                <button
                  onClick={() => execCommand('italic')}
                  className="p-2 hover:bg-gray-200 rounded text-gray-700"
                  title="Cursiva"
                >
                  <Italic className="h-4 w-4" />
                </button>
                <button
                  onClick={() => execCommand('underline')}
                  className="p-2 hover:bg-gray-200 rounded text-gray-700"
                  title="Subrayado"
                >
                  <Underline className="h-4 w-4" />
                </button>
                <div className="w-px h-8 bg-gray-300 mx-1"></div>
                <button
                  onClick={() => execCommand('justifyLeft')}
                  className="p-2 hover:bg-gray-200 rounded text-gray-700"
                  title="Alinear izquierda"
                >
                  <AlignLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => execCommand('justifyCenter')}
                  className="p-2 hover:bg-gray-200 rounded text-gray-700"
                  title="Centrar"
                >
                  <AlignCenter className="h-4 w-4" />
                </button>
                <button
                  onClick={() => execCommand('justifyRight')}
                  className="p-2 hover:bg-gray-200 rounded text-gray-700"
                  title="Alinear derecha"
                >
                  <AlignRight className="h-4 w-4" />
                </button>
                <div className="w-px h-8 bg-gray-300 mx-1"></div>
                <button
                  onClick={() => execCommand('insertUnorderedList')}
                  className="p-2 hover:bg-gray-200 rounded text-gray-700"
                  title="Lista con viñetas"
                >
                  <ListIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => execCommand('insertOrderedList')}
                  className="p-2 hover:bg-gray-200 rounded text-gray-700"
                  title="Lista numerada"
                >
                  <Type className="h-4 w-4" />
                </button>
                <div className="w-px h-8 bg-gray-300 mx-1"></div>
                <select
                  onChange={(e) => execCommand('formatBlock', e.target.value)}
                  className="px-2 py-1 text-sm border border-gray-300 rounded bg-white"
                  title="Formato de párrafo"
                >
                  <option value="div">Párrafo</option>
                  <option value="h1">Título 1</option>
                  <option value="h2">Título 2</option>
                  <option value="h3">Título 3</option>
                  <option value="h4">Título 4</option>
                </select>
                <select
                  onChange={(e) => execCommand('foreColor', e.target.value)}
                  className="px-2 py-1 text-sm border border-gray-300 rounded bg-white"
                  title="Color del texto"
                >
                  <option value="">Color</option>
                  <option value="#000000">Negro</option>
                  <option value="#dc2626">Rojo</option>
                  <option value="#059669">Verde</option>
                  <option value="#2563eb">Azul</option>
                  <option value="#7c3aed">Morado</option>
                  <option value="#ea580c">Naranja</option>
                </select>
              </div>
            </div>
            
            {/* Editor */}
            <div className="border border-gray-300 rounded-b-lg overflow-hidden">
              <div
                ref={editorRef}
                contentEditable
                onInput={handleEditorChange}
                onClick={handleEditorClick}
                onFocus={handleEditorFocus}
                className="w-full h-96 p-4 focus:outline-none overflow-y-auto"
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#333',
                  minHeight: '384px'
                }}
                suppressContentEditableWarning={true}
              />
            </div>
          </div>
          </div>

          {/* Panel OCR */}
          {showOCR && (
            <div className="w-80">
              <OCRScanner 
                onTextExtracted={(text) => console.log('Text extracted:', text)}
                onInsertText={handleInsertOCRText}
                editorContent={editedHtml}
              />
            </div>
          )}
          </div>

          {/* Interpretador Médico - Sección completa debajo */}
          {showMedicalInterpreter && (
            <div className="mt-6">
              <MedicalInterpreter 
                htmlContent={editedHtml}
                onInterpretationComplete={handleMedicalInterpretation}
              />
            </div>
          )}
        </div>
      )}

      {/* Main List View - Mostrar cuando no hay vista específica activa */}
      {currentView === 'list' && (
        <div className="space-y-6">
          {/* Sección de Archivos Pendientes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-orange-500 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Resultados Pendientes</h3>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <HtmlFileList 
                status="pending" 
                title="Archivos Pendientes de Revisión"
                onEditFile={handleEditFile}
              />
            </div>
          </div>

          {/* Sección de Archivos Completados */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Resultados Completados</h3>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <HtmlFileList 
                status="completed" 
                title="Archivos Completados"
                onEditFile={handleEditFile}
              />
            </div>
          </div>

          {/* Botón para Nuevo Resultado */}
          <div className="text-center">
            <button
              onClick={handleNewResult}
              className="btn-primary"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nuevo Resultado
            </button>
          </div>
        </div>
      )}

      {/* Report History Modal */}
      {showHistory && (
        <ReportHistory 
          onClose={() => setShowHistory(false)} 
          onEditFile={handleEditFile}
        />
      )}
    </div>
  );
};

export default LabResults;