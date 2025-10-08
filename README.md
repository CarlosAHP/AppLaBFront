# 🏥 Laboratorio Esperanza - Frontend

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.2.7-38B2AC?style=for-the-badge&logo=tailwind-css)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript)
![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=for-the-badge&logo=node.js)

**Sistema de gestión de laboratorio clínico moderno y escalable**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)

</div>

---

## 📋 Descripción

Sistema web desarrollado en React.js para la gestión integral de laboratorios clínicos. Permite la administración de resultados de laboratorio, gestión de pagos, control de usuarios y sincronización de datos en tiempo real.

## ✨ Características Principales

### 🔐 **Sistema de Autenticación Robusto**
- Autenticación JWT segura
- Control de roles y permisos
- Protección de rutas sensibles
- Gestión de sesiones

### 📊 **Dashboard Inteligente**
- Interfaz adaptativa según rol de usuario
- Métricas en tiempo real
- Acciones rápidas contextuales
- Visualización de estadísticas

### 🧪 **Gestión de Resultados**
- CRUD completo para resultados de laboratorio
- Estados de procesamiento (Pendiente, Completado, Cancelado)
- Búsqueda y filtrado avanzado
- Exportación de reportes

### 💳 **Sistema de Pagos**
- Gestión integral de pagos de pacientes
- Múltiples métodos de pago
- Historial de transacciones
- Reportes financieros

### 🔄 **Sincronización en Tiempo Real**
- Estado de conexión con la nube
- Sincronización automática
- Manejo de errores de conectividad
- Historial de sincronizaciones

## 🛠️ Stack Tecnológico

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.2.7-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)

### Routing & State
![React Router](https://img.shields.io/badge/React_Router-6.8.1-CA4245?style=flat-square&logo=react-router&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-7.43.5-EC5990?style=flat-square&logo=react-hook-form&logoColor=white)

### HTTP & UI
![Axios](https://img.shields.io/badge/Axios-1.3.4-5A29E4?style=flat-square&logo=axios&logoColor=white)
![Lucide React](https://img.shields.io/badge/Lucide_React-0.263.1-FF6B6B?style=flat-square&logo=lucide&logoColor=white)

</div>

### 📚 **Librerías Principales**
- **React.js 18.2.0** - Framework principal con hooks modernos
- **React Router 6.8.1** - Navegación declarativa y protegida
- **Tailwind CSS 3.2.7** - Framework de utilidades CSS
- **Axios 1.3.4** - Cliente HTTP con interceptores
- **React Hook Form 7.43.5** - Manejo eficiente de formularios
- **React Hot Toast 2.4.0** - Sistema de notificaciones
- **Lucide React 0.263.1** - Iconografía moderna y consistente

## 📋 Requisitos del Sistema

### **Requisitos Mínimos**
- **Node.js** 16.0.0 o superior
- **npm** 7.0.0 o **yarn** 1.22.0
- **Backend API** ejecutándose en `http://localhost:5000`
- **Navegador** moderno (Chrome, Firefox, Safari, Edge)

### **Requisitos Recomendados**
- **Node.js** 18.0.0 o superior
- **RAM** 4GB mínimo, 8GB recomendado
- **Espacio en disco** 500MB libres

## 🚀 Instalación Rápida

### **1. Clonar el Repositorio**
```bash
git clone https://github.com/CarlosAHP/AppLaBFront.git
cd AppLaBFront
```

### **2. Instalar Dependencias**
```bash
# Con npm
npm install

# O con yarn
yarn install
```

### **3. Configurar Variables de Entorno**
```bash
# Copiar archivo de ejemplo
cp env.example .env

# Editar configuración
nano .env
```

**Configuración mínima en `.env`:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

### **4. Ejecutar en Desarrollo**
```bash
# Iniciar servidor de desarrollo
npm start

# La aplicación estará disponible en:
# http://localhost:3000
```

### **5. Construir para Producción**
```bash
# Crear build optimizado
npm run build

# Los archivos se generarán en la carpeta 'build/'
```

## 👥 Sistema de Roles y Permisos

<div align="center">

| Rol | Permisos | Acceso |
|-----|----------|--------|
| 🔐 **Administrador** | Completo | Sistema completo |
| 👩‍💼 **Secretaria** | Gestión | Resultados y pagos |
| 👨‍⚕️ **Médico** | Consulta | Visualización de datos |

</div>

### 🔐 **Administrador**
- ✅ **Gestión completa del sistema**
- ✅ **Registro y administración de usuarios**
- ✅ **Acceso a sincronización y configuración**
- ✅ **Gestión de pagos y resultados**
- ✅ **Reportes y estadísticas avanzadas**
- ✅ **Configuración de roles y permisos**

### 👩‍💼 **Secretaria**
- ✅ **Gestión de resultados de laboratorio**
- ✅ **Registro y seguimiento de pagos**
- ✅ **Dashboard operativo**
- ✅ **Búsqueda de pacientes**
- ❌ **Configuración del sistema**

### 👨‍⚕️ **Médico**
- ✅ **Visualización de resultados de laboratorio**
- ✅ **Dashboard médico**
- ✅ **Consulta de información de pacientes**
- ✅ **Historial médico**
- ❌ **Gestión de pagos**
- ❌ **Administración de usuarios**

## 📱 Páginas y Funcionalidades

### 🔑 Login (`/login`)
- Autenticación con email y contraseña
- Validación de formularios
- Redirección según rol de usuario
- Usuario de prueba: `testuser` / `password123`

### 📊 Dashboard (`/dashboard`)
- Resumen de actividades según rol
- Estadísticas de resultados y pagos
- Acciones rápidas
- Información personalizada

### 🧪 Resultados de Laboratorio (`/lab-results`)
- Lista de resultados con filtros
- Crear, editar y eliminar resultados
- Búsqueda por paciente o tipo de prueba
- Estados: Pendiente, Completado, Cancelado

### 💳 Pagos (`/payments`)
- Gestión de pagos de pacientes
- Métodos de pago: Efectivo, Tarjeta, Transferencia, Cheque
- Resumen de totales
- Historial de transacciones

### 🔄 Sincronización (`/sync`)
- Estado de conexión con la nube
- Progreso de sincronización
- Historial de sincronizaciones
- Manejo de errores

### 👤 Registro de Usuarios (`/register`)
- Solo para administradores
- Registro de nuevos usuarios
- Asignación de roles
- Validación de datos

## 🎨 Diseño y UX

- **Interfaz Moderna**: Diseño limpio y profesional
- **Responsive**: Adaptado para móviles, tablets y desktop
- **Accesibilidad**: Cumple estándares de accesibilidad web
- **Iconografía**: Iconos consistentes con Lucide React
- **Colores**: Paleta de colores profesional con Tailwind CSS

## 🏗️ Arquitectura del Proyecto

### **Estructura de Directorios**
```
src/
├── 📁 components/          # Componentes reutilizables
│   ├── 🔐 AuthDiagnostic.js
│   ├── 🛡️ ErrorBoundary.js
│   ├── 📊 Layout.js
│   ├── ⏳ LoadingSpinner.js
│   └── 🔒 ProtectedRoute.js
├── 📁 contexts/           # Context API para estado global
│   └── 🔑 AuthContext.js
├── 📁 pages/             # Páginas principales
│   ├── 📊 Dashboard.js
│   ├── 🧪 LabResults.js
│   ├── 🔑 Login.js
│   ├── 💳 Payments.js
│   └── 🔄 Sync.js
├── 📁 services/          # Servicios para API
│   ├── 🌐 api.js
│   ├── 🔐 authService.js
│   ├── 🧪 labResultsService.js
│   └── 💳 paymentsService.js
├── 📁 utils/             # Utilidades y helpers
│   ├── 📋 constants.js
│   └── 🛠️ helpers.js
├── 📁 hooks/             # Custom hooks
│   ├── 📄 usePDFGenerator.js
│   └── 🔐 usePermissions.js
├── 📁 config/            # Configuración
│   ├── 🌐 api.js
│   └── 👤 patientConfig.js
├── 📄 App.js            # Componente principal
├── 📄 index.js          # Punto de entrada
└── 🎨 index.css         # Estilos globales
```

### **Características Técnicas**

#### 🔒 **Seguridad**
- **Autenticación JWT** con tokens seguros
- **Rutas protegidas** con verificación de permisos
- **Control de roles** granular
- **Validación de datos** en frontend y backend

#### 🎨 **Interfaz de Usuario**
- **Diseño responsive** con Tailwind CSS
- **Componentes reutilizables** y modulares
- **Iconografía consistente** con Lucide React
- **Notificaciones en tiempo real** con React Hot Toast

#### ⚡ **Rendimiento**
- **Lazy loading** de componentes
- **Optimización de bundle** con React Scripts
- **Caché inteligente** de datos
- **Interceptores HTTP** para manejo de errores

## 🔌 API Endpoints

El frontend se conecta con los siguientes endpoints del backend:

- `POST /auth/login` - Autenticación
- `POST /auth/register` - Registro de usuarios
- `GET /lab-results` - Obtener resultados
- `POST /lab-results` - Crear resultado
- `PUT /lab-results/:id` - Actualizar resultado
- `DELETE /lab-results/:id` - Eliminar resultado
- `GET /payments` - Obtener pagos
- `POST /payments` - Crear pago
- `GET /sync` - Estado de sincronización

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm start

# Construcción para producción
npm run build

# Ejecutar tests
npm test

# Eyectar configuración (no recomendado)
npm run eject
```

## 🔒 Seguridad

- **JWT Tokens**: Almacenados en localStorage
- **Rutas Protegidas**: Verificación de autenticación
- **Control de Roles**: Acceso basado en permisos
- **Validación**: Validación tanto en frontend como backend
- **HTTPS**: Recomendado para producción

## 🐛 Solución de Problemas

### Error de Conexión con Backend
```bash
# Verificar que el backend esté ejecutándose
curl http://localhost:5000/health

# Verificar configuración de CORS en el backend
```

### Problemas de Autenticación
- Verificar que el token JWT sea válido
- Limpiar localStorage si hay problemas
- Verificar configuración de roles en el backend

### Errores de Build
```bash
# Limpiar caché
npm start -- --reset-cache

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Roadmap y Próximas Mejoras

### **Versión 2.0** 🎯
- [ ] **PWA (Progressive Web App)** - Aplicación instalable
- [ ] **Tests automatizados** - Unitarios y de integración
- [ ] **Caché offline** - Funcionalidad sin conexión
- [ ] **Exportación avanzada** - PDF, Excel, CSV
- [ ] **Notificaciones push** - Alertas en tiempo real

### **Versión 2.1** 🔮
- [ ] **Modo oscuro** - Tema oscuro/claro
- [ ] **Internacionalización** - Soporte multi-idioma
- [ ] **Dashboard avanzado** - Gráficos y métricas
- [ ] **API REST completa** - Documentación Swagger
- [ ] **Docker** - Containerización

## 🤝 Contribuir al Proyecto

### **¿Cómo Contribuir?**

1. **Fork** el repositorio
2. **Clona** tu fork localmente
   ```bash
   git clone https://github.com/tu-usuario/AppLaBFront.git
   cd AppLaBFront
   ```
3. **Crea** una rama para tu feature
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
4. **Desarrolla** tu funcionalidad
5. **Commit** tus cambios
   ```bash
   git commit -m "feat: agregar nueva funcionalidad"
   ```
6. **Push** a tu fork
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
7. **Abre** un Pull Request

### **Guías de Contribución**
- 📝 **Commits semánticos** - Usa convenciones claras
- 🧪 **Testing** - Agrega tests para nuevas funcionalidades
- 📚 **Documentación** - Actualiza README si es necesario
- 🎨 **Estilo de código** - Sigue las convenciones del proyecto

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**. Ver el archivo [LICENSE](LICENSE) para más detalles.

```
MIT License

Copyright (c) 2024 Laboratorio Esperanza

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 📞 Soporte y Contacto

### **Soporte Técnico**
- 🐛 **Reportar bugs** - [Issues](https://github.com/CarlosAHP/AppLaBFront/issues)
- 💡 **Sugerir mejoras** - [Discussions](https://github.com/CarlosAHP/AppLaBFront/discussions)
- 📧 **Contacto directo** - Disponible en el repositorio

### **Documentación Adicional**
- 📖 **Wiki del proyecto** - [Wiki](https://github.com/CarlosAHP/AppLaBFront/wiki)
- 🔧 **Guías de desarrollo** - Disponibles en `/docs`
- 🚀 **Guías de despliegue** - Configuración de producción

---

<div align="center">

### **Desarrollado con ❤️ para Laboratorio Esperanza**

[![GitHub stars](https://img.shields.io/github/stars/CarlosAHP/AppLaBFront?style=social)](https://github.com/CarlosAHP/AppLaBFront/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/CarlosAHP/AppLaBFront?style=social)](https://github.com/CarlosAHP/AppLaBFront/network)
[![GitHub issues](https://img.shields.io/github/issues/CarlosAHP/AppLaBFront)](https://github.com/CarlosAHP/AppLaBFront/issues)

**⭐ Si te gusta el proyecto, ¡dale una estrella! ⭐**

</div>

