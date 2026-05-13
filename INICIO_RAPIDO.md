# 🚀 Guía de Inicio Rápido - Plataforma de Denuncias

> **Todo configurado y listo para usar**. MongoDB Atlas conectado exitosamente.

## 📋 Requisitos Previos

- Node.js (v18 o superior) ✅
- npm ✅
- MongoDB Atlas (ya configurado) ✅

## ⚙️ Configuración Inicial

### 1. Configurar Variables de Entorno

#### Backend (Servidor/.env)

Abre el archivo `Servidor/.env` y configura las siguientes variables:

```env
# Configuración del servidor
PORT=5000
NODE_ENV=development

# MongoDB Atlas URI (obténla en MongoDB Atlas → Connect)
MONGODB_URI=mongodb+srv://<USUARIO>:<PASSWORD>@<CLUSTER>.mongodb.net/denuncias_db?retryWrites=true&w=majority&appName=Cluster0

# JWT Secret (cambia esto por una clave segura)
JWT_SECRET=tu_clave_secreta_super_segura_aqui_cambiar_en_produccion

# JWT Expiration
JWT_EXPIRES_IN=86400

# Configuración de Email (opcional por ahora)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_password_de_aplicacion
EMAIL_FROM=noreply@denuncias.com

# URL del frontend
FRONTEND_URL=http://localhost:5173

# Configuración de archivos
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

#### Frontend (.env)

El archivo `.env` en la raíz ya está configurado:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 2. Instalar Dependencias

```bash
# Instalar dependencias del frontend
npm install

# Instalar dependencias del backend
cd Servidor
npm install
cd ..
```

### 3. Inicializar Base de Datos

Este comando creará las categorías y estados iniciales en MongoDB:

```bash
npm run init-db
```

## 🎯 Comandos Disponibles

### Desarrollo

```bash
# Ejecutar SOLO el frontend
npm run dev:frontend

# Ejecutar SOLO el backend
npm run dev:backend

# Ejecutar AMBOS (Frontend + Backend) simultáneamente ⭐ RECOMENDADO
npm run dev:full
```

### Base de Datos

```bash
# Inicializar/Verificar datos iniciales (categorías y estados)
npm run init-db
```

### Producción

```bash
# Construir el frontend para producción
npm run build

# Previsualizar el build de producción
npm run preview
```

## 📡 URLs de Acceso

Una vez iniciados los servicios:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api/v1
- **Documentación API**: Ver endpoints en consola del backend

## 🔧 Flujo de Trabajo Recomendado

### Primera vez:

1. Configurar `Servidor/.env` con tu connection string de MongoDB
2. Instalar dependencias: `npm install` y `cd Servidor && npm install`
3. Inicializar base de datos: `npm run init-db`
4. Iniciar servicios: `npm run dev:full`

### Desarrollo diario:

```bash
npm run dev:full
```

Este comando iniciará automáticamente:
- ✅ Backend en puerto 5000
- ✅ Frontend en puerto 5173
- ✅ Conexión automática a MongoDB Atlas
- ✅ Hot reload en ambos servicios

## 🗄️ Estructura de la Base de Datos

Al ejecutar `npm run init-db`, se crearán:

### Categorías:
- Infraestructura
- Servicios Públicos
- Tránsito
- Seguridad
- Limpieza
- Medio Ambiente
- Transparencia
- Otros

### Estados de Denuncia:
1. Registrada
2. En Revisión
3. Asignada
4. En Proceso
5. Resuelta
6. Cerrada
7. Rechazada

## 🔐 Endpoints Principales de la API

### Autenticación (`/api/v1/auth`)
- `POST /register/ciudadano` - Registro de ciudadano
- `POST /register/autoridad` - Registro de autoridad
- `POST /login` - Inicio de sesión
- `GET /verify-token` - Verificar token JWT
- `POST /forgot-password` - Recuperar contraseña
- `POST /reset-password` - Resetear contraseña

### Denuncias (`/api/v1/denuncias`)
- `GET /` - Listar denuncias (filtradas por rol)
- `POST /` - Crear nueva denuncia
- `GET /:id` - Ver detalle de denuncia
- `PUT /:id` - Actualizar denuncia
- `PUT /:id/estado` - Cambiar estado (solo autoridades)
- `DELETE /:id` - Eliminar denuncia

### Categorías y Estados (`/api/v1`)
- `GET /categorias` - Listar todas las categorías
- `GET /estados` - Listar todos los estados

### Estadísticas (`/api/v1/estadisticas`)
- `GET /` - Obtener estadísticas generales
- `GET /resumen` - Resumen para dashboard

### Usuarios (`/api/v1/usuarios`)
- `GET /perfil` - Ver perfil del usuario autenticado
- `PUT /perfil` - Actualizar perfil
- `PUT /perfil/password` - Cambiar contraseña

## 🐛 Solución de Problemas

### Error de conexión a MongoDB
- Verifica que el `MONGODB_URI` en `Servidor/.env` sea correcto
- Asegúrate de que tu IP esté en la lista blanca de MongoDB Atlas
- Verifica tu conexión a internet

### Puerto en uso
Si el puerto 5000 o 5173 está en uso:
- Backend: Cambia `PORT` en `Servidor/.env`
- Frontend: Cambia el puerto en `vite.config.js`

### Dependencias faltantes
```bash
# Reinstalar todas las dependencias
npm install
cd Servidor && npm install && cd ..
```

## 📚 Documentación Adicional

- [Backend README](./Servidor/README_MONGODB.md)
- [Frontend README](./README_FRONTEND.md)
- [Historias de Usuario](./HISTORIAS_DE_USUARIO.md)
- [Sistema de Diseño](./DESIGN_SYSTEM.md)

## 🎨 Desarrollo

El proyecto usa:
- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Base de Datos**: MongoDB Atlas
- **Autenticación**: JWT

---

## ✅ Estado de Configuración

- ✅ MongoDB Atlas conectado (Base de datos: `denuncias_db`)
- ✅ 8 Categorías inicializadas
- ✅ 7 Estados de denuncia configurados
- ✅ Scripts de desarrollo listos
- ✅ Variables de entorno configuradas

---

**¡Todo listo para desarrollar! 🚀**

Para iniciar el proyecto completo:
```bash
npm run dev:full
```

Esto iniciará automáticamente el backend (puerto 5000) y el frontend (puerto 5173).

---

*Última actualización: 2025-01-22*
