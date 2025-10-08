# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir al proyecto Laboratorio Esperanza Frontend! 

## 📋 Cómo Contribuir

### **1. Fork y Clone**
```bash
# Fork el repositorio en GitHub
# Luego clona tu fork
git clone https://github.com/tu-usuario/AppLaBFront.git
cd AppLaBFront
```

### **2. Configurar el Entorno**
```bash
# Instalar dependencias
npm install

# Crear archivo de configuración
cp env.example .env
```

### **3. Crear una Rama**
```bash
# Crear rama para tu feature
git checkout -b feature/nombre-de-tu-feature

# O para bugfix
git checkout -b fix/descripcion-del-bug
```

### **4. Desarrollar**
- Escribe código limpio y bien documentado
- Sigue las convenciones del proyecto
- Agrega tests si es necesario
- Actualiza documentación si es relevante

### **5. Commit y Push**
```bash
# Agregar cambios
git add .

# Commit con mensaje descriptivo
git commit -m "feat: agregar nueva funcionalidad X"

# Push a tu fork
git push origin feature/nombre-de-tu-feature
```

### **6. Pull Request**
- Abre un Pull Request desde tu fork
- Describe claramente los cambios realizados
- Menciona cualquier issue relacionado
- Espera la revisión del equipo

## 🎯 Tipos de Contribuciones

### **🐛 Bug Reports**
- Usa el template de issue para bugs
- Incluye pasos para reproducir el problema
- Especifica versión del navegador y OS
- Adjunta capturas de pantalla si es relevante

### **✨ Feature Requests**
- Describe la funcionalidad deseada
- Explica el caso de uso
- Considera la implementación
- Discute con la comunidad antes de desarrollar

### **📚 Documentación**
- Mejora el README
- Agrega comentarios al código
- Crea guías de uso
- Traduce documentación

### **🧪 Testing**
- Agrega tests unitarios
- Mejora cobertura de tests
- Reporta bugs encontrados
- Sugiere mejoras de testing

## 📝 Convenciones de Código

### **Commits**
Usa el formato de commits semánticos:
```
feat: nueva funcionalidad
fix: corrección de bug
docs: actualización de documentación
style: cambios de formato
refactor: refactorización de código
test: agregar o modificar tests
chore: tareas de mantenimiento
```

### **Nombres de Ramas**
```
feature/nombre-descriptivo
fix/descripcion-del-bug
docs/actualizacion-documentacion
refactor/mejora-codigo
```

### **Estilo de Código**
- Usa ESLint y Prettier
- Sigue las convenciones de React
- Comenta código complejo
- Usa nombres descriptivos para variables y funciones

## 🧪 Testing

### **Antes de Enviar PR**
```bash
# Ejecutar tests
npm test

# Verificar linting
npm run lint

# Verificar build
npm run build
```

### **Tipos de Tests**
- **Unitarios**: Componentes individuales
- **Integración**: Flujos completos
- **E2E**: Casos de uso reales

## 🔍 Proceso de Revisión

### **Criterios de Aceptación**
- ✅ Código funciona correctamente
- ✅ Tests pasan
- ✅ No hay conflictos de merge
- ✅ Documentación actualizada
- ✅ Sigue convenciones del proyecto

### **Feedback**
- El equipo revisará tu PR
- Puede solicitar cambios
- Responde a comentarios constructivamente
- Aprende de las sugerencias

## 🚫 Qué NO Hacer

- ❌ No subir archivos sensibles (firmas, logos reales)
- ❌ No hacer commits grandes sin dividir
- ❌ No ignorar feedback del equipo
- ❌ No trabajar en la rama main directamente
- ❌ No incluir datos de producción

## 📞 Soporte

### **¿Necesitas Ayuda?**
- 📖 Revisa la documentación
- 🐛 Busca en issues existentes
- 💬 Abre una discusión
- 📧 Contacta al equipo

### **Recursos Útiles**
- [Documentación de React](https://reactjs.org/docs)
- [Guía de Tailwind CSS](https://tailwindcss.com/docs)
- [Convenciones de Git](https://www.conventionalcommits.org/)

## 🎉 Reconocimiento

¡Gracias por contribuir! Tu trabajo ayuda a mejorar el sistema para todos los usuarios.

---

**¿Tienes preguntas?** No dudes en abrir un issue o discusión. ¡Estamos aquí para ayudar!
