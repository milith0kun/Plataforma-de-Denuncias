# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2025-12-29

### ✨ Added - Por Dennis Ccapatinta

#### Sistema de Notificaciones
- **Toast Component** - Componente de notificaciones reutilizable
  - 4 tipos: Success, Error, Warning, Info
  - Auto-cierre configurable (3s por defecto)
  - Stack de múltiples notificaciones
  - Animaciones suaves
  - Diseño responsive
  
- **NotificationContext** - Context API para manejo global de notificaciones
  - Métodos: `showSuccess()`, `showError()`, `showWarning()`, `showInfo()`
  - Cola de notificaciones
  - Control de ciclo de vida

#### Integración de Componentes
- **Upload de Evidencias** - Integración completa en formulario de denuncias
  - Drag & drop de imágenes
  - Preview antes de enviar
  - Validación de formato y tamaño
  - Soporte para hasta 5 imágenes

#### Mejoras de Validación
- **Login Form** - Validaciones mejoradas
  - Validación de formato de email
  - Mensajes de error claros
  - Loading states
  
- **Register Form** - Validaciones en tiempo real
  - Fortaleza de contraseña
  - Confirmación de contraseña
  - Validación de DNI (8 dígitos)
  - Validación de teléfono
  
- **Nueva Denuncia Form** - Campos obligatorios
  - Título: mínimo 10 caracteres
  - Descripción: mínimo 50 caracteres
  - Categoría: selección obligatoria
  - Ubicación: validación de coordenadas

#### UX/UI Improvements
- **Tooltips** - Ayuda contextual en formularios
- **Loading States** - Spinners en botones durante peticiones
- **Confirmation Modals** - Confirmación en acciones críticas

#### Documentación
- **README_DENNIS.md** - Documentación completa de contribuciones
- **CHANGELOG.md** - Este archivo de registro de cambios
- **README.md** - Actualización de tareas completadas

### 🔧 Changed

- **LoginPage.jsx** - Integración de Toast para feedback
- **RegisterPage.jsx** - Validaciones mejoradas y Toast
- **NuevaDenunciaPage.jsx** - Upload de fotos y validaciones
- **PerfilPage.jsx** - Notificaciones de actualización
- **App.jsx** - Provider de NotificationContext

### 🐛 Fixed

- Mensajes de error genéricos reemplazados por específicos
- Validación de email mejorada con regex
- Loading states faltantes en formularios
- Feedback visual ausente en acciones

### 📝 Documentation

- Documentación técnica completa en README_DENNIS.md
- Comentarios en código para componentes nuevos
- README principal actualizado con nuevas funcionalidades

---

## [1.0.0] - 2025-01-22

### ✨ Added - Por Edmil y Equipo

#### Backend (95% Completado)
- Sistema de autenticación JWT completo
- API REST con Express.js y MongoDB Atlas
- CRUD de denuncias
- Sistema de comentarios
- Upload de evidencias fotográficas
- Estadísticas y reportes
- 8 Categorías iniciales
- 7 Estados de denuncia

#### Frontend (70% Completado)
- Sistema de autenticación completo
- Dashboard ciudadano
- Dashboard autoridad
- Gestión de perfil
- Componentes reutilizables (Button, Input, Alert, Loading)
- Rutas protegidas por roles
- Diseño responsive
- Sistema de colores unificado

#### Infraestructura
- Configuración de Vite para Frontend
- Configuración de Express para Backend
- MongoDB Atlas conectado
- Scripts de desarrollo automatizados
- Variables de entorno configuradas

### 🎨 Design System
- Paleta de colores definida
- Tipografía: DM Serif Text + Montserrat
- Componentes base implementados
- Mobile-first responsive design

---

## [0.1.0] - 2025-01-15

### ✨ Initial Release

- Estructura inicial del proyecto
- Configuración de repositorio
- Setup de desarrollo
- Configuración de dependencias

---

## Tipos de Cambios

- `✨ Added` - Nueva funcionalidad
- `🔧 Changed` - Cambios en funcionalidad existente
- `🗑️ Deprecated` - Funcionalidad que será removida
- `❌ Removed` - Funcionalidad removida
- `🐛 Fixed` - Corrección de bugs
- `🔒 Security` - Correcciones de seguridad
- `📝 Documentation` - Cambios en documentación

---

**Última actualización:** 29 de Diciembre de 2025
