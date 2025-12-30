# Revisión UX de Página

**IMPORTANTE**: Usa el skill `frontend-design` para realizar una auditoría UX profesional.

Revisa la experiencia de usuario de: $ARGUMENTS

## Áreas de Análisis UX

### 1. Primera Impresión (3 segundos)
- ¿El usuario entiende inmediatamente qué puede hacer aquí?
- ¿La jerarquía visual guía la atención correctamente?
- ¿Hay un "hero" claro o llamado a la acción principal?
- ¿Los colores/diseño transmiten profesionalismo?

### 2. Arquitectura de Información
- ¿La navegación es intuitiva?
- ¿Los elementos están agrupados lógicamente?
- ¿Hay demasiada o muy poca información?
- ¿El contenido importante está "above the fold"?

### 3. Flujos de Usuario
- ¿El camino del usuario es claro y directo?
- ¿Cuántos clics se necesitan para completar acciones clave?
- ¿Hay puntos de fricción innecesarios?
- ¿Los estados intermedios (loading, procesando) están bien manejados?

### 4. Feedback y Comunicación
- ¿El usuario recibe confirmación de sus acciones?
- ¿Los errores son claros y accionables?
- ¿Los estados vacíos motivan acción?
- ¿Las notificaciones son oportunas y relevantes?

### 5. Responsive y Accesibilidad
- ¿Funciona bien en móvil (< 768px)?
- ¿Los touch targets son suficientemente grandes (≥ 44px)?
- ¿El contraste cumple WCAG AA (4.5:1)?
- ¿Es navegable por teclado?
- ¿Los lectores de pantalla pueden entenderlo?

### 6. Performance Percibida
- ¿Usa skeleton loaders en lugar de spinners genéricos?
- ¿Las imágenes cargan progresivamente?
- ¿Las transiciones son suaves (< 300ms)?
- ¿Se siente rápida aunque tarde en cargar?

### 7. Micro-interacciones
- ¿Los botones responden visualmente al hover/click?
- ¿Los formularios validan en tiempo real?
- ¿Hay animaciones que guían la atención?
- ¿Los tooltips/ayudas están disponibles?

### 8. Consistencia con el Sistema
- ¿Usa el sistema de colores del proyecto?
- ¿Respeta la tipografía definida?
- ¿El espaciado es consistente (8px grid)?
- ¿Reutiliza componentes comunes?

## Checklist de Problemas Comunes

### Errores de UX Frecuentes
- [ ] Botón de acción principal no destacado
- [ ] Formularios sin validación en tiempo real
- [ ] Errores técnicos en lugar de mensajes amigables
- [ ] Loading genérico sin contexto
- [ ] Estados vacíos sin call-to-action
- [ ] Navegación confusa o escondida
- [ ] Texto demasiado pequeño en móvil
- [ ] Campos de formulario sin labels
- [ ] Acciones destructivas sin confirmación
- [ ] Feedback visual insuficiente

### Anti-patrones de Diseño
- [ ] Colores hardcodeados (no usar variables CSS)
- [ ] Espaciado inconsistente
- [ ] Demasiados colores/fuentes diferentes
- [ ] Botones que parecen links o viceversa
- [ ] Modales anidados o excesivos
- [ ] Scroll horizontal innecesario
- [ ] Animaciones excesivas o distractoras
- [ ] Contraste insuficiente

## Principios de UX a Aplicar

### Ley de Hick
Reduce opciones para decisiones más rápidas:
- ✅ Máximo 3 acciones principales por vista
- ✅ Usa navegación progresiva para flujos complejos
- ❌ No sobrecargues con opciones

### Ley de Fitts
Elementos frecuentes más grandes y cercanos:
- ✅ Botones principales > 44px de altura
- ✅ Acciones comunes cerca del thumb zone (móvil)
- ❌ Botones pequeños o esquinas difíciles

### Ley de Jakob
Los usuarios esperan patrones conocidos:
- ✅ Logo arriba izquierda lleva al home
- ✅ Carrito arriba derecha
- ✅ Formularios de arriba abajo
- ❌ No reinventes patrones establecidos

### Ley de Miller
Chunking de información (7±2 elementos):
- ✅ Agrupa elementos relacionados
- ✅ Divide listas largas en categorías
- ❌ No muestres todo de golpe

### Principio de Pareto (80/20)
El 80% de usuarios usa el 20% de features:
- ✅ Prioriza las acciones más comunes
- ✅ Esconde features avanzadas en menús
- ❌ No des igual peso a todo

## Métricas de Evaluación

Califica cada área de 1-10:

**Usabilidad**: ¿Qué tan fácil es usar? → [ /10]
**Claridad**: ¿Se entiende qué hacer? → [ /10]
**Eficiencia**: ¿Qué tan rápido se completan tareas? → [ /10]
**Feedback**: ¿El sistema comunica bien? → [ /10]
**Estética**: ¿Se ve profesional? → [ /10]
**Responsive**: ¿Funciona en todos los tamaños? → [ /10]
**Accesibilidad**: ¿Es inclusivo? → [ /10]

**Puntuación Total**: [ /70]
- 60-70: Excelente
- 45-59: Bueno, mejoras menores
- 30-44: Necesita mejoras significativas
- < 30: Requiere rediseño

## Formato de Reporte

### Resumen Ejecutivo
Breve descripción del estado actual (2-3 líneas)

### Problemas Críticos
Lista de 3-5 problemas que impactan severamente la UX

### Mejoras Rápidas (Quick Wins)
Cambios pequeños con gran impacto (15-30 min c/u)

### Mejoras de Mediano Plazo
Cambios que requieren más trabajo (1-4 horas)

### Visión a Largo Plazo
Mejoras estratégicas para el futuro

### Recomendaciones Específicas
Código o wireframes de las mejoras propuestas

## Contexto del Proyecto

**Usuarios**: Ciudadanos y Autoridades municipales
**Objetivo**: Reportar y gestionar problemas urbanos
**Plataforma**: Web responsive (móvil primero)
**Tono**: Profesional, accesible, cívico

## Entregable

Proporciona:
1. **Análisis detallado** de cada área
2. **Puntuación** por sección
3. **Lista priorizada** de mejoras
4. **Mockups o código** de las mejoras principales
5. **Plan de acción** con pasos concretos
