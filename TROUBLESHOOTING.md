# 🔧 Guía de Solución de Problemas - Laboratorio Esperanza

## 🚨 Problemas Comunes y Soluciones

### 1. Error 429 - Too Many Requests

**Síntomas:**
- Error: "Failed to load resource: the server responded with a status of 429"
- El login falla repetidamente

**Soluciones:**
1. **Esperar**: El error 429 indica que se han hecho demasiadas solicitudes. Espera 1-2 minutos antes de intentar de nuevo.
2. **Reiniciar el backend**: Si el problema persiste, reinicia el servidor backend.
3. **Limpiar caché**: Limpia el caché del navegador (Ctrl+Shift+R o Cmd+Shift+R).

### 2. Error CORS - Access to XMLHttpRequest blocked

**Síntomas:**
- Error: "Access to XMLHttpRequest at 'http://localhost:5000' has been blocked by CORS policy"
- Las peticiones al backend fallan

**Soluciones:**

#### En el Backend (Flask):
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])

# O para desarrollo, permitir todos los orígenes:
CORS(app, origins=['*'])
```

#### Verificar configuración:
1. Asegúrate de que el backend esté ejecutándose en el puerto 5000
2. Verifica que CORS esté configurado correctamente
3. Revisa que no haya firewall bloqueando las conexiones

### 3. Error de URL Duplicada

**Síntomas:**
- URL: `http://localhost:5000/api/api/auth/login` (tiene `/api` duplicado)
- Las peticiones van a URLs incorrectas

**Solución:**
✅ **Ya corregido** - Los endpoints en `authService.js` ahora usan rutas relativas correctas.

### 4. Backend No Responde

**Síntomas:**
- Error: "ERR_NETWORK" o "ERR_FAILED"
- El frontend no puede conectar con el backend

**Soluciones:**
1. **Verificar que el backend esté ejecutándose:**
   ```bash
   # En el directorio del backend
   python app.py
   # o
   flask run --port=5000
   ```

2. **Verificar el puerto:**
   - Backend debe estar en: `http://localhost:5000`
   - Frontend debe estar en: `http://localhost:3000`

3. **Verificar logs del backend:**
   - Revisa la consola donde ejecutas el backend
   - Busca errores o mensajes de conexión

### 5. Problemas de Autenticación

**Síntomas:**
- Login falla con credenciales correctas
- Token no se guarda correctamente

**Soluciones:**
1. **Verificar credenciales de prueba:**
   - Admin: `admin` / `Admin123!`
   - Doctor: `doctor1` / `Doctor123!`
   - Secretaria: `secretaria1` / `Secret123!`
   - Técnico: `tecnico1` / `Tecnic123!`

2. **Limpiar localStorage:**
   ```javascript
   // En la consola del navegador
   localStorage.clear();
   ```

3. **Verificar que el usuario exista en el backend**

## 🛠️ Herramientas de Diagnóstico

### 1. Componente de Diagnóstico
- Haz clic en "Diagnóstico de Conexión" en la página de login
- Verifica el estado de red, backend y CORS
- Sigue las recomendaciones mostradas

### 2. Consola del Navegador
- Abre DevTools (F12)
- Ve a la pestaña "Console"
- Busca errores en rojo
- Ve a la pestaña "Network" para ver las peticiones HTTP

### 3. Verificación Manual
```bash
# Verificar que el backend responda
curl http://localhost:5000/api/auth/roles

# Verificar CORS
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:5000/api/auth/login
```

## 📋 Checklist de Verificación

Antes de reportar un problema, verifica:

- [ ] Backend ejecutándose en puerto 5000
- [ ] Frontend ejecutándose en puerto 3000
- [ ] CORS configurado en el backend
- [ ] No hay firewall bloqueando conexiones
- [ ] Credenciales correctas
- [ ] localStorage limpio
- [ ] Consola del navegador sin errores críticos

## 🔄 Pasos de Recuperación

Si nada funciona:

1. **Reiniciar todo:**
   ```bash
   # Detener frontend (Ctrl+C)
   # Detener backend (Ctrl+C)
   
   # Reiniciar backend
   cd backend
   python app.py
   
   # En otra terminal, reiniciar frontend
   cd frontend
   npm start
   ```

2. **Limpiar completamente:**
   ```bash
   # Limpiar caché del navegador
   # Limpiar localStorage
   # Reiniciar navegador
   ```

3. **Verificar configuración:**
   - Revisar archivo `.env` en el frontend
   - Verificar configuración de CORS en el backend
   - Comprobar que no haya conflictos de puertos

## 📞 Soporte

Si el problema persiste:
1. Ejecuta el diagnóstico de conexión
2. Captura los errores de la consola
3. Verifica los logs del backend
4. Documenta los pasos que llevaron al error

---

**Nota:** La mayoría de problemas de conexión se resuelven reiniciando el backend y limpiando el caché del navegador.
