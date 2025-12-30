# Crear Componente con Diseño de Calidad

**IMPORTANTE**: Usa el skill `frontend-design` para crear componentes con diseño distintivo y producción-ready.

Crea un componente React para: $ARGUMENTS

## Stack y Estructura

**Framework**: React 19 + Vite
**Estilos**: CSS Modules
**Ubicación**:
- Componentes comunes → `src/components/common/[ComponentName]/`
- Componentes de página → `src/components/[contexto]/[ComponentName]/`

## Estructura de Archivos del Componente

```
ComponentName/
├── ComponentName.jsx       # Componente principal
├── ComponentName.module.css # Estilos CSS Module
└── index.js                # Export barrel
```

## Template Base

```jsx
import styles from './ComponentName.module.css';
import PropTypes from 'prop-types';

const ComponentName = ({ prop1, prop2 }) => {
  return (
    <div className={styles.container}>
      {/* Contenido */}
    </div>
  );
};

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.bool,
};

ComponentName.defaultProps = {
  prop2: false,
};

export default ComponentName;
```

## Sistema de Diseño (OBLIGATORIO)

### Colores - Siempre usar variables CSS
```css
.container {
  /* Correcto ✅ */
  background-color: var(--color-primary);
  color: var(--color-text);

  /* Incorrecto ❌ */
  background-color: #153595;
  color: #333;
}
```

### Espaciado - Múltiplos de 8px
```css
.container {
  padding: 16px;      /* 8px × 2 */
  margin: 24px;       /* 8px × 3 */
  gap: 32px;          /* 8px × 4 */
}
```

### Tipografía
```css
.title {
  font-family: 'DM Serif Text', serif; /* Para títulos */
}

.text {
  font-family: 'Montserrat', sans-serif; /* Para texto/UI */
  font-weight: 400; /* Regular */
}
```

### Responsive - Mobile First
```css
/* Mobile primero (< 768px) */
.container {
  padding: 16px;
  flex-direction: column;
}

/* Tablet (≥ 768px) */
@media (min-width: 768px) {
  .container {
    padding: 24px;
    flex-direction: row;
  }
}

/* Desktop (≥ 1024px) */
@media (min-width: 1024px) {
  .container {
    padding: 32px;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

## Características Requeridas

### Estados de UI
- ✅ **Loading**: Usar `<LoadingSkeleton />` o `<Loading />`
- ✅ **Empty**: Estado vacío con ilustración/mensaje
- ✅ **Error**: Manejo de errores con `<Alert />`
- ✅ **Success**: Feedback positivo claro

### Interactividad
- ✅ **Hover states**: Cambios visuales al pasar el mouse
- ✅ **Focus states**: Estilos claros para teclado
- ✅ **Active states**: Feedback al hacer clic
- ✅ **Transiciones**: 150-300ms para suavidad

```css
.button {
  transition: all 0.2s ease;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.button:active {
  transform: translateY(0);
}
```

### Accesibilidad
- ✅ **Semantic HTML**: `<button>`, `<nav>`, `<main>`, etc.
- ✅ **ARIA labels**: `aria-label`, `aria-describedby`
- ✅ **Keyboard navigation**: Tab, Enter, Esc
- ✅ **Screen reader friendly**: Texto descriptivo

```jsx
<button
  className={styles.button}
  aria-label="Cerrar modal"
  onClick={handleClose}
>
  <X size={20} aria-hidden="true" />
</button>
```

## Componentes Comunes Reutilizables

Importa y usa componentes existentes:

```jsx
import Button from '../common/Button/Button';
import Input from '../common/Input/Input';
import Alert from '../common/Alert/Alert';
import Loading from '../common/Loading/Loading';
import { useToast } from '../../hooks/useToast';
```

## Convenciones de Código

### Naming
- **Componentes**: PascalCase (`UserCard`, `DenunciaList`)
- **Funciones**: camelCase (`handleClick`, `fetchData`)
- **CSS Classes**: camelCase en módulos (`buttonPrimary`, `cardContainer`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`, `API_URL`)

### Hooks Pattern
```jsx
import { useState, useEffect } from 'react';

const MyComponent = () => {
  // 1. State declarations
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 2. Effects
  useEffect(() => {
    // Logic
  }, []);

  // 3. Event handlers
  const handleClick = () => {
    // Logic
  };

  // 4. Render
  return <div>...</div>;
};
```

## Objetivos de Calidad

- 🎨 **Diseño Distintivo**: No parecer template genérico
- 📱 **Mobile-First**: Optimizado para móvil
- ♿ **Accesible**: WCAG AA mínimo
- ⚡ **Performante**: Lazy loading, memoization
- 🧩 **Reutilizable**: Props bien definidos
- 🎯 **Testeable**: Lógica separada, fácil de testear

## Checklist Final

Antes de considerar completo:
- [ ] Usa variables CSS (NO colores hardcodeados)
- [ ] Espaciado en múltiplos de 8px
- [ ] Responsive mobile-first
- [ ] Estados de loading/error/empty
- [ ] Hover/focus/active states
- [ ] PropTypes definidos
- [ ] Accesibilidad (ARIA, semantic HTML)
- [ ] Exportado correctamente
- [ ] CSS Module sin conflictos
