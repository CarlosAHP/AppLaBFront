# Integración de Pacientes con Resultados de Laboratorio

## Resumen de Cambios

Se ha implementado un nuevo flujo de trabajo en la página de resultados de laboratorio (`/lab-results`) que permite a los doctores seleccionar pacientes existentes o registrar nuevos pacientes antes de crear resultados de laboratorio.

## ⚠️ Estado Actual: MODO MOCK ACTIVO

**El frontend está funcionando con un servicio mock** que simula la API de pacientes. Esto permite probar toda la funcionalidad mientras se implementa el backend real.

### 🔧 Configuración Actual:
- **Modo Mock**: Activado automáticamente en desarrollo
- **Datos de Prueba**: 3 pacientes predefinidos
- **Funcionalidad Completa**: Búsqueda, registro, validación

## Nuevos Componentes

### 1. `PatientService` (`src/services/patientService.js`)
Servicio completo para manejar la API de pacientes con todos los endpoints disponibles:
- Crear, actualizar, eliminar pacientes
- Buscar por DPI, código, email, nombre
- Obtener estadísticas
- Activar/desactivar pacientes

### 2. `PatientSearch` (`src/components/PatientSearch.js`)
Componente para buscar pacientes existentes con:
- Búsqueda por nombre, DPI, código o email
- Resultados en tiempo real con debounce
- Información detallada del paciente
- Opción para registrar nuevo paciente

### 3. `PatientRegistrationForm` (`src/components/PatientRegistrationForm.js`)
Formulario completo de registro de pacientes con pestañas:
- **Básico**: Nombres, DPI, contacto
- **Personal**: Fecha nacimiento, género, dirección
- **Médico**: Tipo sangre, alergias, historial
- **Emergencia**: Contacto de emergencia
- **Seguro**: Información de seguros

## Flujo de Trabajo Actualizado

### Para Doctores y Administradores:
1. **Clic en "Nuevo Resultado"** → Se abre la búsqueda de pacientes
2. **Buscar paciente existente** → Seleccionar de los resultados
3. **Si no existe** → Clic en "Nuevo Paciente" para registrar
4. **Después de seleccionar/registrar** → Formulario de resultado de laboratorio
5. **El resultado se asocia automáticamente** al paciente seleccionado

### Para Técnicos:
- Mantienen el flujo anterior (formulario directo)
- Pueden ingresar manualmente el nombre del paciente

## Campos de la Tabla de Pacientes

### Campos Básicos:
- `patient_code` - Código único (generado automáticamente)
- `dpi` - Documento Personal de Identificación (único)
- `first_name`, `last_name`, `middle_name` - Nombres completos
- `email`, `phone`, `phone_secondary` - Información de contacto

### Información Personal:
- `date_of_birth`, `gender`, `marital_status`
- `occupation`, `nationality`
- `address`, `city`, `department`, `postal_code`

### Información Médica:
- `blood_type`, `allergies`, `medical_history`
- `current_medications`, `chronic_conditions`

### Contacto de Emergencia:
- `emergency_contact_name`, `emergency_contact_phone`, `emergency_contact_relationship`

### Información de Seguros:
- `insurance_company`, `insurance_policy_number`, `insurance_phone`

## Endpoints de API Utilizados

```
POST /api/patients - Crear paciente
GET /api/patients/{id} - Obtener por ID
GET /api/patients/code/{code} - Obtener por código
GET /api/patients/dpi/{dpi} - Obtener por DPI
GET /api/patients/search - Buscar pacientes
GET /api/patients - Listar todos (con paginación)
PUT /api/patients/{id} - Actualizar paciente
DELETE /api/patients/{id} - Desactivar paciente
POST /api/patients/{id}/activate - Reactivar paciente
GET /api/patients/statistics - Estadísticas
```

## Archivos Modificados

1. **`src/pages/LabResults.js`** - Flujo principal actualizado
2. **`src/services/labResultsService.js`** - Agregado método para resultados por paciente
3. **`src/config/api.js`** - Agregados endpoints de pacientes

## Archivos Nuevos

1. **`src/services/patientService.js`** - Servicio principal de pacientes
2. **`src/services/patientServiceMock.js`** - Servicio mock para desarrollo
3. **`src/components/PatientSearch.js`** - Búsqueda de pacientes
4. **`src/components/PatientRegistrationForm.js`** - Registro de pacientes
5. **`src/config/patientConfig.js`** - Configuración del servicio
6. **`scripts/test-patient-frontend.js`** - Script de prueba del frontend

## Pruebas

### 🧪 Pruebas del Frontend (Mock)
Para probar la funcionalidad del frontend con datos mock:

```bash
node scripts/test-patient-frontend.js
```

Este script simula:
1. Búsqueda de pacientes existentes
2. Registro de nuevos pacientes
3. Creación de resultados de laboratorio
4. Validación de formularios
5. Navegación entre vistas

### 🌐 Pruebas en el Navegador
1. Navega a `http://localhost:3000/lab-results`
2. Haz clic en "Nuevo Resultado"
3. Prueba buscar pacientes existentes (ej: "Carlos Alfonso")
4. Registra un nuevo paciente
5. Crea un resultado de laboratorio

### 📊 Datos de Prueba Disponibles
El servicio mock incluye 3 pacientes predefinidos:
- **Juan Carlos Pérez García** (DPI: 1234567890123)
- **María Elena Rodríguez López** (DPI: 9876543210987)
- **Carlos Alfonso Hernández Pérez** (DPI: 4567891234567)

## Beneficios del Nuevo Flujo

1. **Mejor organización**: Los resultados se asocian directamente a pacientes
2. **Datos consistentes**: Evita duplicación de información de pacientes
3. **Historial completo**: Permite ver todos los resultados de un paciente
4. **Experiencia mejorada**: Flujo intuitivo para doctores
5. **Flexibilidad**: Mantiene compatibilidad con el flujo anterior para técnicos

## Consideraciones Técnicas

- Los resultados existentes siguen funcionando normalmente
- El campo `patient_name` se mantiene para compatibilidad
- Se agrega `patient_id` para asociación directa
- Validación de DPI (13 dígitos)
- Búsqueda con debounce para mejor rendimiento
- Formulario con validación completa

## 🔄 Cambiar al Backend Real

Cuando el backend real esté implementado, el frontend cambiará automáticamente:

### Configuración Automática:
- **Desarrollo**: Usa mock por defecto
- **Producción**: Usa backend real por defecto
- **Fallback**: Si el backend no está disponible, usa mock

### Para Forzar el Uso del Backend Real:
1. Crear archivo `.env.local` en la raíz del proyecto:
```env
REACT_APP_USE_PATIENT_MOCK=false
REACT_APP_API_URL=http://localhost:5000/api
```

2. O modificar `src/config/patientConfig.js`:
```javascript
export const PATIENT_CONFIG = {
  USE_MOCK: false, // Cambiar a false
  // ... resto de configuración
};
```

### Verificación:
- Abre la consola del navegador
- Busca el mensaje: `🌐 Usando servicio real de pacientes`
- Si aparece `🔧 Usando servicio mock de pacientes`, el mock está activo
