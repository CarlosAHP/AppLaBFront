# 🔧 Diagnóstico del Problema de Guardado

## 📋 Problema Identificado

Los archivos HTML se están guardando solo en el historial local (localStorage) y no se están enviando al servidor con el nuevo sistema de estados.

## 🔍 Diagnóstico Implementado

### 1. **Logging Mejorado**
Se ha agregado logging detallado en `src/pages/LabResults.js` para capturar:
- ✅ Datos que se envían al servidor
- ✅ Respuesta del servidor
- ✅ Errores de conectividad
- ✅ Fallback a guardado local

### 2. **Verificación de Conectividad**
Se ha agregado verificación de salud del backend antes de intentar guardar.

### 3. **Scripts de Diagnóstico**
Se han creado scripts para diagnosticar el problema:

#### **`scripts/diagnose-backend-connection.js`**
- Verifica si el backend está ejecutándose
- Prueba endpoints de autenticación
- Verifica endpoints de frontend-html
- Comprueba configuración de CORS

#### **`scripts/test-html-upload.js`**
- Simula exactamente lo que hace el frontend
- Prueba la subida de archivos HTML
- Verifica que los archivos se guarden correctamente
- Prueba con diferentes configuraciones

## 🚀 Cómo Diagnosticar

### **Paso 1: Ejecutar Diagnóstico del Backend**
```bash
node scripts/diagnose-backend-connection.js
```

### **Paso 2: Probar Subida de Archivos**
```bash
node scripts/test-html-upload.js
```

### **Paso 3: Revisar Consola del Frontend**
1. Abrir DevTools (F12)
2. Ir a la pestaña "Console"
3. Intentar guardar un resultado
4. Revisar los logs que aparecen

## 📊 Logs Esperados

### **Si el Backend está Funcionando:**
```
🚀 Intentando guardar en servidor...
📋 Datos a enviar: { patient_name: "...", order_number: "...", status: "pending" }
🔍 Verificando conectividad del backend...
✅ Backend disponible: true
📡 Respuesta del servidor: { success: true, data: { filename: "...", status: "pending" } }
✅ Archivo guardado exitosamente en servidor
```

### **Si el Backend NO está Funcionando:**
```
🚀 Intentando guardar en servidor...
📋 Datos a enviar: { patient_name: "...", order_number: "...", status: "pending" }
🔍 Verificando conectividad del backend...
⚠️ Backend no disponible: [error message]
❌ Error al guardar en servidor: [error details]
🔄 Cambiando a guardado local como fallback...
```

## 🔧 Soluciones Posibles

### **1. Backend No Ejecutándose**
**Síntomas:**
- Error "Backend no disponible"
- Error "ECONNREFUSED"
- Fallback a guardado local

**Solución:**
```bash
# Verificar que el backend esté ejecutándose
cd backend
python run.py
# o
python app.py
```

### **2. Puerto Incorrecto**
**Síntomas:**
- Error "ENOTFOUND"
- Timeout en las peticiones

**Solución:**
- Verificar que el backend esté en el puerto 5000
- Verificar la configuración en `src/config/api.js`

### **3. CORS No Configurado**
**Síntomas:**
- Error de CORS en la consola
- Peticiones bloqueadas

**Solución:**
- Verificar configuración de CORS en el backend
- Asegurar que el frontend esté en el puerto 3000

### **4. Endpoints No Disponibles**
**Síntomas:**
- Error 404 en `/frontend-html/upload`
- Error "Endpoint not found"

**Solución:**
- Verificar que las rutas estén registradas en el backend
- Verificar que el servicio esté implementado

### **5. Autenticación Requerida**
**Síntomas:**
- Error 401 "Unauthorized"
- Token expirado

**Solución:**
- Verificar que el usuario esté autenticado
- Verificar que el token sea válido

## 🧪 Pruebas de Verificación

### **Prueba 1: Conectividad Básica**
```bash
curl http://localhost:5000/api/health
```

### **Prueba 2: Endpoint de Subida**
```bash
curl -X POST http://localhost:5000/api/frontend-html/upload \
  -H "Content-Type: application/json" \
  -d '{"html_content":"<html><body>Test</body></html>","metadata":{"patient_name":"Test","status":"pending"}}'
```

### **Prueba 3: Archivos Pendientes**
```bash
curl http://localhost:5000/api/frontend-html/pending
```

## 📋 Checklist de Verificación

- [ ] Backend ejecutándose en puerto 5000
- [ ] Frontend ejecutándose en puerto 3000
- [ ] CORS configurado correctamente
- [ ] Endpoints de frontend-html disponibles
- [ ] Usuario autenticado con token válido
- [ ] Logs de consola muestran intento de guardado en servidor
- [ ] Respuesta del servidor es exitosa
- [ ] Archivo aparece en la lista de pendientes

## 🚨 Errores Comunes

### **Error: "Backend no disponible"**
- **Causa**: Backend no está ejecutándose
- **Solución**: Ejecutar el backend

### **Error: "ECONNREFUSED"**
- **Causa**: Puerto incorrecto o backend no ejecutándose
- **Solución**: Verificar puerto y ejecutar backend

### **Error: "CORS policy"**
- **Causa**: CORS no configurado
- **Solución**: Configurar CORS en el backend

### **Error: "401 Unauthorized"**
- **Causa**: Token inválido o expirado
- **Solución**: Reautenticar usuario

### **Error: "404 Not Found"**
- **Causa**: Endpoint no disponible
- **Solución**: Verificar rutas del backend

## 📞 Soporte

Si el problema persiste después de seguir estos pasos:

1. **Ejecutar diagnóstico completo**:
   ```bash
   node scripts/diagnose-backend-connection.js
   ```

2. **Revisar logs del backend** para errores del servidor

3. **Verificar configuración** de la base de datos y archivos

4. **Contactar soporte** con los logs de la consola

---

**Estado**: 🔧 Diagnóstico Implementado
**Versión**: 1.0.0
**Última Actualización**: 2025-01-08
