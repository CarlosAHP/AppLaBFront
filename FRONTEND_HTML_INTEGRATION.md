# Integración Frontend-Backend para Archivos HTML

## 📋 Resumen

Se ha implementado una integración completa entre el frontend y backend para el manejo de archivos HTML de resultados de laboratorio. El sistema permite guardar, editar, buscar y gestionar archivos HTML directamente desde la interfaz de usuario.

## 🏗️ Arquitectura Implementada

### Backend (Ya implementado)
- **Carpeta**: `frontend_html/` - Directorio principal para archivos HTML
- **Organización**: Automática por fecha (YYYY/MM/)
- **Servicio**: `app/services/frontend_html_service.py`
- **Controlador**: `app/controllers/frontend_html_controller.py`
- **Rutas**: `app/routes/frontend_html_routes.py`
- **API**: 13 endpoints completos

### Frontend (Recién implementado)
- **Servicio**: `src/services/frontendHtmlService.js`
- **Integración**: Modificada función `handleSaveResult` en `src/pages/LabResults.js`
- **Fallback**: Sistema de respaldo local si el servidor no está disponible

## 🔧 Funcionalidades Implementadas

### ✅ Guardado de Resultados HTML
- **Endpoint**: `POST /api/frontend-html/upload`
- **Funcionalidad**: Subir archivos HTML editados desde el frontend
- **Metadatos**: Información del paciente, doctor, pruebas, etc.
- **Validación**: Contenido HTML y metadatos requeridos

### ✅ Gestión de Archivos
- **Listado**: `GET /api/frontend-html/list`
- **Búsqueda**: `GET /api/frontend-html/search`
- **Información**: `GET /api/frontend-html/info/<filename>`
- **Actualización**: `PUT /api/frontend-html/file/<filename>`
- **Eliminación**: `DELETE /api/frontend-html/file/<filename>`

### ✅ Sistema de Respaldo
- **Backup**: `POST /api/frontend-html/backup`
- **Estadísticas**: `GET /api/frontend-html/stats`
- **Validación**: `GET /api/frontend-html/system/validate`
- **Archivos Recientes**: `GET /api/frontend-html/recent`

## 🚀 Flujo de Trabajo

### 1. Usuario Edita Resultado
```
Usuario selecciona pruebas → Editor HTML → Modifica contenido
```

### 2. Guardado en Servidor
```
Botón "Guardar Resultado" → frontendHtmlService.uploadHtmlFile() → API Backend
```

### 3. Respuesta del Sistema
```
✅ Éxito: Archivo guardado en servidor + localStorage
❌ Error: Fallback local + descarga automática
```

## 📁 Estructura de Archivos

```
src/
├── services/
│   ├── frontendHtmlService.js    # Nuevo servicio para API HTML
│   └── reportService.js          # Servicio existente (mantenido)
├── pages/
│   └── LabResults.js            # Modificado para usar nuevo servicio
└── scripts/
    ├── test-html-integration.js      # Pruebas de integración
    └── test-frontend-html-save.js     # Pruebas específicas del frontend
```

## 🔄 Flujo de Datos

### Datos Enviados al Backend
```javascript
{
  html_content: "<!DOCTYPE html>...", // Contenido HTML editado
  metadata: {
    patient_name: "Carlos Alfonso Hernández Pérez",
    order_number: "005",
    doctor_name: "MARIA SINAY",
    patient_age: 22,
    patient_gender: "M",
    reception_date: "2025-01-08",
    tests: [
      { name: "coprologia", filename: "coprologia.html" },
      { name: "heces_completa", filename: "heces_completa.html" },
      { name: "orina_completa", filename: "orina_completa.html" }
    ],
    status: "draft",
    created_by: "usuario_actual",
    created_at: "2025-01-08T10:30:00.000Z"
  }
}
```

### Respuesta del Backend
```javascript
{
  success: true,
  data: {
    id: 123,
    filename: "005_2025-01-08T10-30-00-000Z_Carlos_Alfonso_Hernandez_Perez.html",
    file_path: "/frontend_html/2025/01/005_2025-01-08T10-30-00-000Z_Carlos_Alfonso_Hernandez_Perez.html",
    created_at: "2025-01-08T10:30:00.000Z",
    metadata: { /* metadatos del archivo */ }
  }
}
```

## 🧪 Pruebas

### Scripts de Prueba Disponibles

1. **test-html-integration.js**
   - Prueba todos los endpoints de la API
   - Valida el sistema completo
   - Verifica funcionalidades de búsqueda y gestión

2. **test-frontend-html-save.js**
   - Simula el comportamiento del frontend
   - Prueba diferentes escenarios de guardado
   - Valida el sistema de fallback

### Ejecutar Pruebas
```bash
# Pruebas de integración completa
node scripts/test-html-integration.js

# Pruebas específicas del frontend
node scripts/test-frontend-html-save.js
```

## 🔒 Seguridad

- **Autenticación**: JWT requerida para todos los endpoints
- **Validación**: Contenido HTML y metadatos validados
- **Autorización**: Verificación de permisos de usuario
- **Sanitización**: Contenido HTML sanitizado antes del guardado

## 📊 Monitoreo

### Logs del Sistema
- **Subida de archivos**: Registro de cada operación
- **Errores**: Logging detallado para debugging
- **Estadísticas**: Métricas de uso del sistema

### Métricas Disponibles
- Total de archivos guardados
- Archivos por fecha
- Tamaño total de archivos
- Usuarios más activos

## 🚨 Manejo de Errores

### Errores del Servidor
```javascript
try {
  const response = await frontendHtmlService.uploadHtmlFile(htmlContent, metadata);
  // Procesar respuesta exitosa
} catch (error) {
  // Fallback local automático
  console.warn('Error del servidor, guardando localmente:', error.message);
}
```

### Fallback Local
- **Descarga automática**: Archivo HTML descargado al navegador
- **localStorage**: Registro guardado para historial
- **Notificación**: Usuario informado del fallback

## 🔄 Migración

### Cambios Realizados
1. **Nuevo servicio**: `frontendHtmlService.js` creado
2. **Función modificada**: `handleSaveResult` actualizada
3. **Importación agregada**: Servicio importado en `LabResults.js`
4. **Fallback mejorado**: Sistema de respaldo robusto

### Compatibilidad
- **Backward compatible**: Sistema anterior sigue funcionando
- **Progressive enhancement**: Nuevas funcionalidades se agregan sin romper existentes
- **Graceful degradation**: Fallback automático si el servidor no está disponible

## 📈 Beneficios

### Para el Usuario
- ✅ Guardado automático en servidor
- ✅ Historial completo de resultados
- ✅ Búsqueda avanzada de archivos
- ✅ Sistema de respaldo confiable

### Para el Sistema
- ✅ Organización automática por fecha
- ✅ Metadatos completos de cada archivo
- ✅ Sistema de backup configurado
- ✅ Estadísticas detalladas

### Para el Desarrollo
- ✅ API REST completa y documentada
- ✅ Manejo de errores robusto
- ✅ Logging detallado para debugging
- ✅ Pruebas automatizadas incluidas

## 🎯 Próximos Pasos

1. **Pruebas en Producción**: Verificar funcionamiento con datos reales
2. **Optimización**: Mejorar rendimiento si es necesario
3. **Monitoreo**: Implementar alertas para errores críticos
4. **Documentación**: Actualizar documentación de usuario

## 📞 Soporte

Para problemas o preguntas sobre la integración:
1. Revisar logs del sistema
2. Ejecutar scripts de prueba
3. Verificar conectividad con el backend
4. Consultar documentación de la API

---

**Estado**: ✅ Implementación Completa
**Versión**: 1.0.0
**Última Actualización**: 2025-01-08
