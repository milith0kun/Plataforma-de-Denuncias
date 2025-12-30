# 🤝 Guía de Contribución

## Contribución de Dennis Ccapatinta

Esta guía documenta el proceso de contribución al proyecto Plataforma de Denuncias Ciudadanas.

---

## 📋 Proceso de Contribución

### 1. Preparación del Entorno

```bash
# Clonar el repositorio
git clone https://github.com/milith0kun/Plataforma-de-Denuncias-.git

# Navegar al directorio
cd Plataforma-de-Denuncias-

# Instalar dependencias del frontend
npm install

# Instalar dependencias del backend
cd Servidor
npm install
cd ..

# Configurar variables de entorno
# Copiar .env.example a .env en Servidor/
# Editar con tus configuraciones
```

### 2. Crear Rama de Trabajo

```bash
# Crear y cambiar a tu rama
git checkout -b tu-nombre

# Ejemplo:
git checkout -b dennis-ccapatinta
```

### 3. Desarrollo

#### Estructura de Commits

Seguir **Conventional Commits**:

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `feat:` | Nueva funcionalidad | `feat: Agregar sistema de notificaciones` |
| `fix:` | Corrección de bug | `fix: Corregir validación de email` |
| `docs:` | Documentación | `docs: Actualizar README con nuevas funcionalidades` |
| `style:` | Cambios de estilo/formato | `style: Mejorar espaciado en formularios` |
| `refactor:` | Refactorización | `refactor: Optimizar componente Toast` |
| `test:` | Agregar/modificar tests | `test: Agregar tests para NotificationContext` |
| `chore:` | Tareas de mantenimiento | `chore: Actualizar dependencias` |

#### Ejemplo de Flujo de Trabajo

```bash
# 1. Hacer cambios en el código
# ... editar archivos ...

# 2. Ver cambios
git status

# 3. Añadir cambios al stage
git add src/components/common/Toast.jsx
git add src/contexts/NotificationContext.jsx

# 4. Commit con mensaje descriptivo
git commit -m "feat: Implementar sistema de notificaciones Toast"

# 5. Continuar desarrollando
# ... más cambios ...

git add .
git commit -m "feat: Integrar Toast en LoginPage"

# 6. Push a rama remota
git push origin dennis-ccapatinta
```

### 4. Pull Request

#### Crear Pull Request

1. Ir a https://github.com/milith0kun/Plataforma-de-Denuncias-
2. Click en "Pull requests" → "New pull request"
3. Seleccionar tu rama: `dennis-ccapatinta → main`
4. Completar información:

```markdown
## 📝 Descripción

Implementación de sistema de notificaciones Toast y mejoras de validación.

## ✨ Cambios Realizados

- Sistema completo de notificaciones Toast
- Integración de NotificationContext con Context API
- Mejoras de validación en formularios
- Documentación actualizada

## 🧪 Testing

- [x] Probado login exitoso con notificación
- [x] Probado registro con notificaciones
- [x] Validaciones funcionando correctamente
- [x] Responsive en móvil y desktop

## 📸 Screenshots

[Adjuntar capturas de pantalla]

## 🔗 Issues Relacionados

Cierra #XX (si aplica)

## ✅ Checklist

- [x] Código sigue las convenciones del proyecto
- [x] Commits tienen mensajes descriptivos
- [x] Documentación actualizada
- [x] Testing manual realizado
- [x] No hay conflictos con main
```

5. Asignar reviewers: **Edmil**
6. Agregar labels apropiados: `enhancement`, `frontend`

#### Revisión de Código

- Esperar revisión de Edmil
- Responder comentarios constructivamente
- Hacer cambios solicitados
- Push de correcciones:

```bash
git add .
git commit -m "fix: Aplicar cambios solicitados en code review"
git push origin dennis-ccapatinta
```

### 5. Merge

Una vez aprobado:
- Edmil hará el merge a `main`
- Eliminar rama local (opcional):

```bash
git checkout main
git pull origin main
git branch -d dennis-ccapatinta
```

---

## 📝 Estándares de Código

### JavaScript/React

```javascript
// ✅ BIEN: Componentes funcionales con hooks
import { useState, useEffect } from 'react';

const MiComponente = ({ prop1, prop2 }) => {
  const [estado, setEstado] = useState('');
  
  useEffect(() => {
    // Lógica del efecto
  }, []);
  
  return <div>{estado}</div>;
};

export default MiComponente;

// ❌ MAL: Clases antiguas
class MiComponente extends React.Component {
  // ...
}
```

### Naming Conventions

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Componentes | PascalCase | `ToastNotification.jsx` |
| Hooks | camelCase con `use` | `useNotification.js` |
| Funciones | camelCase | `handleSubmit()` |
| Constantes | UPPER_SNAKE_CASE | `MAX_FILE_SIZE` |
| CSS Files | kebab-case | `toast-notification.css` |

### CSS

```css
/* ✅ BIEN: Usar variables CSS */
.toast {
  background-color: var(--primary);
  padding: var(--spacing-md);
}

/* ❌ MAL: Valores hardcoded */
.toast {
  background-color: #153595;
  padding: 16px;
}
```

### Comentarios

```javascript
/**
 * Descripción breve del componente/función
 * @param {string} message - Mensaje a mostrar
 * @param {number} duration - Duración en milisegundos
 * @returns {JSX.Element} Componente Toast
 */
const Toast = ({ message, duration }) => {
  // Implementación
};
```

---

## 🧪 Testing

### Testing Manual

Antes de hacer PR, verificar:

#### Funcionalidad
- [ ] Todas las funciones nuevas funcionan correctamente
- [ ] No se rompió funcionalidad existente
- [ ] Casos edge están cubiertos

#### UI/UX
- [ ] Diseño responsive (móvil, tablet, desktop)
- [ ] Transiciones suaves
- [ ] Estados de loading visibles
- [ ] Mensajes de error claros

#### Performance
- [ ] No hay memory leaks
- [ ] Componentes se renderizan eficientemente
- [ ] Imágenes optimizadas

### Checklist de Testing por Funcionalidad

#### Sistema de Notificaciones
- [ ] Notificación success aparece correctamente
- [ ] Notificación error aparece correctamente
- [ ] Notificación warning aparece correctamente
- [ ] Notificación info aparece correctamente
- [ ] Auto-cierre funciona (3 segundos)
- [ ] Cierre manual con botón X funciona
- [ ] Múltiples notificaciones se apilan bien
- [ ] Responsive en móvil

#### Validaciones
- [ ] Email inválido muestra error
- [ ] Contraseña débil muestra advertencia
- [ ] Campos vacíos no permiten submit
- [ ] Mensajes de error son claros
- [ ] Loading state durante submit

---

## 📚 Recursos

### Documentación del Proyecto
- [README.md](./README.md) - Documentación principal
- [README_DENNIS.md](./README_DENNIS.md) - Contribuciones de Dennis
- [CHANGELOG.md](./CHANGELOG.md) - Historial de cambios
- [INICIO_RAPIDO.md](./INICIO_RAPIDO.md) - Guía de inicio rápido

### Tecnologías
- [React 19 Docs](https://react.dev/)
- [React Router v7](https://reactrouter.com/)
- [Vite](https://vitejs.dev/)
- [MongoDB Atlas](https://www.mongodb.com/docs/atlas/)
- [Express.js](https://expressjs.com/)

### Convenciones
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)

---

## 🎯 Buenas Prácticas

### 1. Commits Pequeños y Frecuentes
✅ Mejor: Commits pequeños por funcionalidad
```bash
git commit -m "feat: Crear componente Toast"
git commit -m "feat: Agregar estilos a Toast"
git commit -m "feat: Integrar Toast en LoginPage"
```

❌ Evitar: Un commit gigante
```bash
git commit -m "feat: Agregar todo el sistema de notificaciones"
```

### 2. Mensajes Descriptivos
✅ Claro y específico:
```bash
git commit -m "fix: Corregir validación de email en RegisterPage"
```

❌ Vago:
```bash
git commit -m "fix: arreglo"
```

### 3. Revisar Antes de Commit
```bash
# Ver cambios antes de commitear
git diff

# Ver archivos modificados
git status

# Añadir solo archivos relevantes
git add src/components/Toast.jsx
```

### 4. Pull Frecuente del Main
```bash
# Mantener tu rama actualizada
git checkout main
git pull origin main
git checkout dennis-ccapatinta
git merge main
```

---

## ❓ Preguntas Frecuentes

### ¿Qué hago si hay conflictos con main?

```bash
# 1. Actualizar main local
git checkout main
git pull origin main

# 2. Volver a tu rama
git checkout dennis-ccapatinta

# 3. Merge main en tu rama
git merge main

# 4. Resolver conflictos manualmente
# Editar archivos con conflictos
# Buscar marcadores: <<<<<<< HEAD

# 5. Añadir archivos resueltos
git add archivo-resuelto.jsx

# 6. Completar el merge
git commit -m "merge: Resolver conflictos con main"
```

### ¿Cómo deshago mi último commit?

```bash
# Deshacer último commit (mantener cambios)
git reset --soft HEAD~1

# Deshacer último commit (descartar cambios) ⚠️
git reset --hard HEAD~1
```

### ¿Cómo actualizo mi PR después de cambios?

```bash
# Hacer cambios solicitados
# ... editar archivos ...

# Commit y push
git add .
git commit -m "fix: Aplicar cambios de code review"
git push origin dennis-ccapatinta

# El PR se actualizará automáticamente
```

---

## 📞 Contacto

**Dennis Ccapatinta**
- GitHub: @dennis-ccapatinta
- Email: dennis.ccapatinta@example.com

**Edmil (Reviewer)**
- GitHub: @edmil-saire
- Email: edmil.saire@example.com

---

**¡Gracias por contribuir!** 🚀

*Última actualización: 29 de Diciembre de 2025*
