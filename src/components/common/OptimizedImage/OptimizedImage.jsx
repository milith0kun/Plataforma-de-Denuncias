import { useState, useEffect } from 'react';
import { obtenerUrlImagen, generarPlaceholder } from '../../../utils/imageUtils';
import styles from './OptimizedImage.module.css';

/**
 * Componente de imagen optimizada con lazy loading y placeholder
 */
const OptimizedImage = ({
  src,
  alt = '',
  className = '',
  placeholder = null,
  loading = 'lazy',
  decoding = 'async',
  onError,
  onLoad,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (src) {
      const fullUrl = obtenerUrlImagen(src);
      setImageSrc(fullUrl);
      setIsLoading(true);
      setHasError(false);
    }
  }, [src]);

  const handleLoad = (e) => {
    setIsLoading(false);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setIsLoading(false);
    setHasError(true);
    if (onError) onError(e);
  };

  const placeholderSrc = placeholder || generarPlaceholder();

  return (
    <div className={`${styles.imageWrapper} ${className}`}>
      {isLoading && !hasError && (
        <div className={styles.placeholder}>
          <img
            src={placeholderSrc}
            alt=""
            className={styles.placeholderImg}
            aria-hidden="true"
          />
        </div>
      )}
      {!hasError && imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          loading={loading}
          decoding={decoding}
          className={`${styles.image} ${isLoading ? styles.loading : styles.loaded}`}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
      {hasError && (
        <div className={styles.errorPlaceholder}>
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span>Error al cargar imagen</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;

