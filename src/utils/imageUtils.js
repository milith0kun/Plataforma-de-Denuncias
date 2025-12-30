/**
 * Utilidades para optimización de imágenes
 */

import { BASE_URL } from '../services/api';

/**
 * Obtiene la URL completa de una imagen
 * @param {string} url - URL relativa o absoluta de la imagen
 * @returns {string} URL completa
 */
export const obtenerUrlImagen = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

/**
 * Obtiene la URL de la primera evidencia de una denuncia
 * @param {Array} evidencias - Array de evidencias
 * @returns {string|null} URL de la imagen o null
 */
export const obtenerUrlPrimeraEvidencia = (evidencias) => {
  if (!evidencias || evidencias.length === 0) return null;
  const foto = evidencias[0];
  if (!foto) return null;
  
  const url = foto.url_archivo || foto.url || foto.ruta;
  if (!url) return null;
  
  return obtenerUrlImagen(url);
};

/**
 * Genera un placeholder base64 para imágenes (blur placeholder)
 * @param {number} width - Ancho del placeholder
 * @param {number} height - Alto del placeholder
 * @returns {string} Data URL del placeholder
 */
export const generarPlaceholder = (width = 400, height = 300) => {
  // SVG placeholder minimalista
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">Cargando...</text>
    </svg>
  `.trim();
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Verifica si el navegador soporta WebP
 * @returns {Promise<boolean>}
 */
export const soportaWebP = () => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

