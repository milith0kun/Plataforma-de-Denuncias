# 🔒 Mejoras de Validación - Dennis Ccapatinta

Este documento detalla las mejoras de validación implementadas en el sistema.

---

## 📋 Resumen

Las validaciones son fundamentales para la seguridad y experiencia de usuario. Se implementaron validaciones robustas en:

- Formularios de autenticación
- Creación de denuncias
- Actualización de perfil
- Cambio de contraseña

---

## ✅ Validaciones Implementadas

### 1. Validación de Email

**Ubicación:** `LoginPage.jsx`, `RegisterPage.jsx`

**Regex utilizado:**
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

**Validaciones:**
- ✅ Formato válido de email
- ✅ No permite espacios
- ✅ Requiere @ y dominio
- ✅ Mensaje de error específico

**Ejemplo de uso:**
```javascript
const validarEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return 'El email es obligatorio';
  }
  if (!emailRegex.test(email)) {
    return 'Ingrese un email válido';
  }
  return '';
};
```

---

### 2. Validación de Contraseña

**Ubicación:** `RegisterPage.jsx`, `CambioPasswordModal.jsx`

**Requisitos:**
- ✅ Mínimo 8 caracteres
- ✅ Al menos una mayúscula
- ✅ Al menos una minúscula
- ✅ Al menos un número
- ✅ Al menos un carácter especial

**Regex:**
```javascript
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
```

**Validación step-by-step:**
```javascript
const validarFortalezaPassword = (password) => {
  if (password.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Debe contener al menos una mayúscula';
  }
  if (!/[a-z]/.test(password)) {
    return 'Debe contener al menos una minúscula';
  }
  if (!/\d/.test(password)) {
    return 'Debe contener al menos un número';
  }
  if (!/[@$!%*?&]/.test(password)) {
    return 'Debe contener al menos un carácter especial (@$!%*?&)';
  }
  return '';
};
```

**Indicador de fortaleza:**
```javascript
const calcularFortaleza = (password) => {
  let fortaleza = 0;
  if (password.length >= 8) fortaleza++;
  if (password.length >= 12) fortaleza++;
  if (/[A-Z]/.test(password)) fortaleza++;
  if (/[a-z]/.test(password)) fortaleza++;
  if (/\d/.test(password)) fortaleza++;
  if (/[@$!%*?&]/.test(password)) fortaleza++;
  
  if (fortaleza <= 2) return { nivel: 'débil', color: 'danger' };
  if (fortaleza <= 4) return { nivel: 'media', color: 'warning' };
  return { nivel: 'fuerte', color: 'success' };
};
```

---

### 3. Validación de Confirmación de Contraseña

**Ubicación:** `RegisterPage.jsx`

**Validación:**
```javascript
if (formData.password !== formData.confirmarPassword) {
  setError('Las contraseñas no coinciden');
  return false;
}
```

**Mensajes de error:**
- ❌ "Las contraseñas no coinciden"
- ✅ Contraseñas coinciden

---

### 4. Validación de DNI/Documento de Identidad

**Ubicación:** `RegisterPage.jsx`

**Requisitos:**
- ✅ Exactamente 8 dígitos
- ✅ Solo números
- ✅ No permite letras ni caracteres especiales

**Regex:**
```javascript
const dniRegex = /^\d{8}$/;
```

**Validación:**
```javascript
const validarDNI = (dni) => {
  const dniRegex = /^\d{8}$/;
  if (!dniRegex.test(dni)) {
    return 'El DNI debe tener exactamente 8 dígitos';
  }
  return '';
};
```

---

### 5. Validación de Teléfono

**Ubicación:** `RegisterPage.jsx`, `PerfilPage.jsx`

**Formatos aceptados:**
- 9 dígitos: `987654321`
- Con código: `+51 987654321`
- Con paréntesis: `(01) 1234567`

**Regex:**
```javascript
const telefonoRegex = /^(\+51\s?)?(\d{9}|(\(01\)\s?\d{7}))$/;
```

**Validación:**
```javascript
const validarTelefono = (telefono) => {
  const telefonoRegex = /^(\+51\s?)?(\d{9}|(\(01\)\s?\d{7}))$/;
  if (!telefonoRegex.test(telefono)) {
    return 'Ingrese un teléfono válido (9 dígitos)';
  }
  return '';
};
```

---

### 6. Validación de Campos de Denuncia

**Ubicación:** `NuevaDenunciaPage.jsx`

#### Título
**Requisitos:**
- ✅ Mínimo 10 caracteres
- ✅ Máximo 100 caracteres
- ✅ Solo letras, números y espacios

**Validación:**
```javascript
if (formData.titulo.trim().length < 10) {
  return 'El título debe tener al menos 10 caracteres';
}
if (formData.titulo.trim().length > 100) {
  return 'El título no puede exceder 100 caracteres';
}
```

#### Descripción
**Requisitos:**
- ✅ Mínimo 50 caracteres
- ✅ Máximo 1000 caracteres
- ✅ Descripción detallada

**Validación:**
```javascript
if (formData.descripcion.trim().length < 50) {
  return 'La descripción debe tener al menos 50 caracteres para proveer detalles suficientes';
}
if (formData.descripcion.trim().length > 1000) {
  return 'La descripción no puede exceder 1000 caracteres';
}
```

#### Categoría
**Validación:**
```javascript
if (!formData.categoria_id) {
  return 'Debe seleccionar una categoría';
}
```

#### Ubicación
**Validación:**
```javascript
if (!formData.ubicacion || formData.ubicacion.trim().length < 10) {
  return 'Ingrese una ubicación válida (mínimo 10 caracteres)';
}

// Validación de coordenadas si están presentes
if (formData.latitud && formData.longitud) {
  if (formData.latitud < -90 || formData.latitud > 90) {
    return 'Latitud inválida';
  }
  if (formData.longitud < -180 || formData.longitud > 180) {
    return 'Longitud inválida';
  }
}
```

---

### 7. Validación de Archivos/Imágenes

**Ubicación:** `UploadFotos.jsx`

**Requisitos:**
- ✅ Máximo 5 archivos
- ✅ Formatos: JPG, JPEG, PNG, WebP
- ✅ Tamaño máximo: 5MB por archivo
- ✅ Tamaño total máximo: 25MB

**Validación:**
```javascript
const validarArchivo = (file) => {
  // Validar tipo
  const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!tiposPermitidos.includes(file.type)) {
    return 'Solo se permiten imágenes JPG, PNG o WebP';
  }
  
  // Validar tamaño (5MB)
  const maxSizeMB = 5;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `El archivo excede el tamaño máximo de ${maxSizeMB}MB`;
  }
  
  return '';
};

const validarCantidadArchivos = (archivos) => {
  if (archivos.length > 5) {
    return 'Solo se permiten máximo 5 imágenes';
  }
  return '';
};
```

---

## 🎨 Mensajes de Error Mejorados

### Antes ❌
```
"Error en el formulario"
"Datos incorrectos"
"Intente nuevamente"
```

### Después ✅
```
"El email debe tener un formato válido (ejemplo@dominio.com)"
"La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial"
"El DNI debe tener exactamente 8 dígitos numéricos"
```

---

## 💡 Feedback Visual

### Loading States
```jsx
<button disabled={loading}>
  {loading ? (
    <>
      <Loader className="animate-spin" size={16} />
      <span>Enviando...</span>
    </>
  ) : (
    'Crear Denuncia'
  )}
</button>
```

### Campos con Error
```jsx
<div className={`input-group ${errors.email ? 'error' : ''}`}>
  <input 
    type="email"
    value={formData.email}
    onChange={handleChange}
    className={errors.email ? 'input-error' : ''}
  />
  {errors.email && (
    <span className="error-message">{errors.email}</span>
  )}
</div>
```

### Tooltips Informativos
```jsx
<div className="input-with-tooltip">
  <label>
    Contraseña
    <Info 
      size={16} 
      title="Mínimo 8 caracteres, debe incluir mayúsculas, minúsculas, números y símbolos"
    />
  </label>
  <input type="password" />
</div>
```

---

## 🧪 Casos de Prueba

### Test Plan - Validación de Email

| Entrada | Esperado | Resultado |
|---------|----------|-----------|
| `test@example.com` | ✅ Válido | ✅ Pass |
| `test` | ❌ Inválido | ✅ Pass |
| `test@` | ❌ Inválido | ✅ Pass |
| `@example.com` | ❌ Inválido | ✅ Pass |
| `` | ❌ Obligatorio | ✅ Pass |

### Test Plan - Validación de Contraseña

| Entrada | Esperado | Resultado |
|---------|----------|-----------|
| `Pass123!` | ✅ Válida | ✅ Pass |
| `password` | ❌ Sin mayúscula/número | ✅ Pass |
| `PASSWORD123!` | ❌ Sin minúscula | ✅ Pass |
| `Pass!` | ❌ Muy corta | ✅ Pass |
| `Pass1234` | ❌ Sin carácter especial | ✅ Pass |

### Test Plan - Validación de DNI

| Entrada | Esperado | Resultado |
|---------|----------|-----------|
| `12345678` | ✅ Válido | ✅ Pass |
| `1234567` | ❌ Solo 7 dígitos | ✅ Pass |
| `123456789` | ❌ 9 dígitos | ✅ Pass |
| `1234567a` | ❌ Contiene letra | ✅ Pass |

---

## 🚀 Mejoras Futuras

### Corto Plazo
- [ ] Validación asíncrona de email único (backend)
- [ ] Validación de DNI duplicado
- [ ] Verificación de email por código
- [ ] CAPTCHA en registro

### Mediano Plazo
- [ ] Validación de dirección con API de geolocalización
- [ ] Sugerencias de autocompletado en forms
- [ ] Validación de archivos con magic numbers
- [ ] Rate limiting en validaciones

### Largo Plazo
- [ ] Machine learning para detectar denuncias spam
- [ ] Validación biométrica
- [ ] 2FA (Two-Factor Authentication)

---

## 📚 Referencias

- [HTML5 Form Validation](https://developer.mozilla.org/es/docs/Learn/Forms/Form_validation)
- [OWASP Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [React Hook Form](https://react-hook-form.com/)
- [Formik Validation](https://formik.org/docs/guides/validation)

---

**Autor:** Dennis Ccapatinta  
**Fecha:** 29 de Diciembre de 2025  
**Versión:** 1.0
