# Optimizar Performance de Componente

Optimiza el rendimiento de: $ARGUMENTS

## Análisis de Performance

### 1. Auditoría Inicial
Revisa estos aspectos en el código:
- [ ] Re-renders innecesarios
- [ ] Cálculos pesados sin memoización
- [ ] Dependencias de useEffect incorrectas
- [ ] Componentes grandes sin code splitting
- [ ] Imágenes no optimizadas
- [ ] Listas sin virtualización
- [ ] CSS no optimizado
- [ ] Peticiones API duplicadas

### 2. Herramientas de React

#### React.memo
Para componentes que re-renderean con las mismas props:
```jsx
import { memo } from 'react';

const ExpensiveComponent = memo(({ data }) => {
  return <div>{/* Render pesado */}</div>;
});

// Con comparación personalizada
const MemoizedComponent = memo(
  Component,
  (prevProps, nextProps) => {
    return prevProps.id === nextProps.id;
  }
);
```

#### useMemo
Para cálculos costosos:
```jsx
import { useMemo } from 'react';

const Component = ({ items }) => {
  // ❌ Malo: Se recalcula en cada render
  const sortedItems = items.sort((a, b) => a.value - b.value);

  // ✅ Bueno: Solo recalcula si items cambia
  const sortedItems = useMemo(
    () => items.sort((a, b) => a.value - b.value),
    [items]
  );

  return <List items={sortedItems} />;
};
```

#### useCallback
Para funciones que se pasan como props:
```jsx
import { useCallback } from 'react';

const Parent = () => {
  // ❌ Malo: Nueva función en cada render
  const handleClick = () => {
    console.log('clicked');
  };

  // ✅ Bueno: Misma función entre renders
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);

  return <ChildComponent onClick={handleClick} />;
};
```

### 3. Lazy Loading

#### Code Splitting
```jsx
import { lazy, Suspense } from 'react';
import Loading from './components/Loading';

// ❌ Malo: Importa todo upfront
import HeavyComponent from './HeavyComponent';

// ✅ Bueno: Carga bajo demanda
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

#### Lazy Images
```jsx
const LazyImage = ({ src, alt }) => {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  );
};
```

### 4. Optimización de Listas

#### Virtualización
Para listas largas (> 100 items):
```jsx
// Considerar usar react-window o react-virtualized
import { FixedSizeList } from 'react-window';

const VirtualList = ({ items }) => (
  <FixedSizeList
    height={600}
    itemCount={items.length}
    itemSize={50}
    width="100%"
  >
    {({ index, style }) => (
      <div style={style}>{items[index].name}</div>
    )}
  </FixedSizeList>
);
```

#### Keys Estables
```jsx
// ❌ Malo: Index como key
items.map((item, index) => <Item key={index} {...item} />)

// ✅ Bueno: ID único estable
items.map(item => <Item key={item.id} {...item} />)
```

### 5. Optimización de Estado

#### Evitar Estado Derivado
```jsx
// ❌ Malo: Estado duplicado
const [users, setUsers] = useState([]);
const [activeUsers, setActiveUsers] = useState([]);

// ✅ Bueno: Calcular on-demand
const [users, setUsers] = useState([]);
const activeUsers = users.filter(u => u.isActive);
```

#### Estado Local vs Global
```jsx
// ❌ Malo: Todo en Context
const GlobalContext = createContext({
  modalOpen: false,
  buttonHover: false,
  // ...muchos estados locales
});

// ✅ Bueno: Solo estado compartido en Context
const GlobalContext = createContext({
  user: null,
  theme: 'light',
});

// Estado UI local en componente
const [modalOpen, setModalOpen] = useState(false);
```

### 6. Optimización de Imágenes

#### Formato y Compresión
```jsx
// ✅ Usar WebP con fallback
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Description" loading="lazy" />
</picture>

// ✅ Responsive images
<img
  srcSet="
    image-small.webp 480w,
    image-medium.webp 768w,
    image-large.webp 1200w
  "
  sizes="(max-width: 768px) 100vw, 50vw"
  src="image-medium.webp"
  alt="Description"
  loading="lazy"
/>
```

### 7. Optimización de CSS

#### CSS Modules Optimizado
```css
/* ❌ Evitar selectores complejos */
.container div > p:first-child span {
  color: red;
}

/* ✅ Selectores simples y específicos */
.firstParagraphText {
  color: red;
}

/* ✅ Usar transforms y opacity para animaciones */
.animated {
  transition: transform 0.2s, opacity 0.2s;
}

.animated:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

/* ❌ Evitar animaciones de propiedades pesadas */
.bad {
  transition: width 0.2s, height 0.2s, margin 0.2s;
}
```

### 8. Optimización de Peticiones

#### Debouncing
```jsx
import { useState, useEffect } from 'react';

const SearchInput = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery) {
      // Hacer búsqueda
      fetchResults(debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
};
```

#### Cache de Peticiones
```jsx
const cache = new Map();

const fetchWithCache = async (url) => {
  if (cache.has(url)) {
    return cache.get(url);
  }

  const response = await fetch(url);
  const data = await response.json();
  cache.set(url, data);
  return data;
};
```

### 9. useEffect Optimization

```jsx
// ❌ Malo: Dependencias faltantes
useEffect(() => {
  fetchData(userId);
}, []); // ESLint warning

// ✅ Bueno: Dependencias correctas
useEffect(() => {
  fetchData(userId);
}, [userId]);

// ✅ Bueno: Cleanup
useEffect(() => {
  const controller = new AbortController();

  fetchData(userId, { signal: controller.signal });

  return () => controller.abort();
}, [userId]);
```

## Métricas de Performance

### Antes de Optimizar
- Time to Interactive: ___ms
- First Contentful Paint: ___ms
- Largest Contentful Paint: ___ms
- Re-renders por segundo: ___
- Bundle size: ___KB

### Después de Optimizar
- Time to Interactive: ___ms (mejora: ___%)
- First Contentful Paint: ___ms (mejora: ___%)
- Largest Contentful Paint: ___ms (mejora: ___%)
- Re-renders por segundo: ___ (mejora: ___%)
- Bundle size: ___KB (reducción: ___%)

## Checklist de Optimización

### React Específico
- [ ] Componentes pesados envueltos en `React.memo`
- [ ] Cálculos costosos con `useMemo`
- [ ] Callbacks con `useCallback`
- [ ] Code splitting con `lazy` y `Suspense`
- [ ] Keys estables en listas
- [ ] Estado local en lugar de global donde sea posible

### Assets
- [ ] Imágenes en WebP
- [ ] Imágenes con `loading="lazy"`
- [ ] Sprites o SVG inline para iconos
- [ ] Fuentes optimizadas (woff2)

### Red
- [ ] Debouncing en inputs de búsqueda
- [ ] Cache de peticiones frecuentes
- [ ] AbortController para cleanup
- [ ] Parallel loading donde sea posible

### CSS
- [ ] Animaciones usando transform/opacity
- [ ] Selectores simples
- [ ] CSS crítico inline (si aplica)
- [ ] Eliminar CSS no usado

### Bundle
- [ ] Tree shaking habilitado
- [ ] Dependencias pesadas lazy loaded
- [ ] Análisis de bundle (vite-bundle-visualizer)

## Herramientas de Medición

```bash
# Analizar bundle
npm run build
npx vite-bundle-visualizer

# React DevTools Profiler
# Usar en navegador para medir re-renders

# Lighthouse
# Correr en Chrome DevTools
```

## Objetivos

- 🎯 **First Paint** < 1s
- 🎯 **Interactive** < 3s
- 🎯 **Re-renders mínimos** (< 5 por interacción)
- 🎯 **Bundle size** < 200KB (gzipped)
- 🎯 **Lighthouse Score** > 90

## Notas

- No optimices prematuramente - mide primero
- Prioriza UX sobre micro-optimizaciones
- El código más rápido es el que no se ejecuta
- Considera el tradeoff complejidad vs ganancia
