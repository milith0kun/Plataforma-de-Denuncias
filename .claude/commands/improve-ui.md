# Mejorar UI/UX de Componente

**IMPORTANTE**: Este comando utiliza el agente de diseño frontend especializado. Ejecuta el skill de diseño frontend INMEDIATAMENTE antes de cualquier análisis.

Usa el skill `frontend-design` para analizar y mejorar: $ARGUMENTS

## Contexto del Proyecto

**Stack**: React 19 + Vite + CSS Modules

## Sistema de Diseño a Seguir

### Paleta de Colores (OBLIGATORIO usar variables CSS)
```css
/* Colores Principales */
--color-primary: #153595        /* Azul principal oscuro */
--color-primary-light: #A5C1EB  /* Azul claro */
--color-primary-dark: #03193B   /* Azul navy */

/* Colores de Estado */
--color-success: #10b981        /* Verde */
--color-warning: #f59e0b        /* Ámbar */
--color-danger: #ef4444         /* Rojo */
--color-info: #3b82f6           /* Azul */
```

**NUNCA uses colores hardcodeados** - siempre usa `var(--color-primary)`, etc.

### Tipografía
- **Títulos (H1-H6)**: DM Serif Text
- **Contenido/UI**: Montserrat (weights: 300, 400, 500, 700)

### Principios de Diseño
- ✅ **Mobile-first** con breakpoints responsive
- ✅ Espaciado basado en múltiplos de **8px**
- ✅ Feedback visual inmediato en interacciones
- ✅ Accesibilidad WCAG AA (contraste adecuado)
- ✅ Componentes reutilizables y modulares

## Componentes Comunes Disponibles

Reutiliza estos componentes existentes en `src/components/common/`:
- **Alert** - Alertas y mensajes
- **Button** - Botones con variantes
- **Input** - Campos de entrada
- **Loading** / **LoadingSkeleton** - Estados de carga
- **Toast** - Notificaciones
- **MetricCard** - Tarjetas de métricas
- **Navbar** / **Header** / **BottomNavigation** - Navegación

## Convenciones de React

- ✅ Solo componentes funcionales (NO class components)
- ✅ Hooks pattern (useState, useEffect, custom hooks)
- ✅ CSS Modules para estilos componentes
- ✅ PropTypes o TypeScript para validación
- ✅ Destructuring en props

## Proceso de Mejora

1. **Analizar** el componente/página actual
2. **Identificar** problemas de UX:
   - Estados de carga faltantes
   - Feedback visual insuficiente
   - Problemas de accesibilidad
   - Diseño no responsive
   - Colores hardcodeados
   - Espaciado inconsistente

3. **Proponer mejoras** concretas:
   - UI más moderna y distintiva (evitar diseño genérico AI)
   - Mejor jerarquía visual
   - Micro-interacciones
   - Animaciones sutiles (Lottie si es apropiado)
   - Estados vacíos atractivos

4. **Implementar** las mejoras siguiendo el sistema de diseño

5. **Verificar**:
   - Responsive en móvil (< 768px)
   - Accesibilidad (contraste, aria-labels)
   - Consistencia con el sistema de diseño
   - Performance (lazy loading, optimización de imágenes)

## Objetivos de Calidad

- 🎨 **Diseño Distintivo**: Evitar apariencia genérica de plantillas
- 📱 **Mobile-First**: Perfecto en móviles, mejorado en desktop
- ⚡ **Performance**: Componentes ligeros y optimizados
- ♿ **Accesibilidad**: WCAG AA como mínimo
- 🎯 **UX Intuitiva**: Flujos claros, feedback inmediato

## Notas

- Usa imágenes WebP en lugar de PNG/JPG para mejor performance
- Implementa skeleton loaders para mejor percepción de velocidad
- Añade transiciones CSS sutiles (150-300ms) para interacciones
- Considera dark mode como mejora futura (usar variables CSS)
