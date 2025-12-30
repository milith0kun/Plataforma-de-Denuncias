import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/common/Header/Header';
import BottomNavigation from '../../../components/common/BottomNavigation/BottomNavigation';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { useAuth } from '../../../hooks/useAuth';
import denunciaService from '../../../services/denunciaService';
import { BASE_URL } from '../../../services/api';
import styles from './DenunciasPage.module.css';

// Iconos SVG minimalistas
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const TagIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
    <line x1="7" y1="7" x2="7.01" y2="7"></line>
  </svg>
);

const ClipboardIcon = () => (
  <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
    <line x1="8" y1="10" x2="16" y2="10"></line>
    <line x1="8" y1="14" x2="16" y2="14"></line>
    <line x1="8" y1="18" x2="12" y2="18"></line>
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const ImagePlaceholderIcon = () => (
  <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

// Función para obtener URL de imagen
const obtenerUrlImagen = (evidencias) => {
  if (!evidencias || evidencias.length === 0) return null;
  // En este proyecto todas las evidencias en evidencias_foto son fotos
  const foto = evidencias[0];
  if (!foto || !foto.url_archivo) return null;

  const url = foto.url_archivo;
  if (url.startsWith('http')) return url;
  return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const DenunciasPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { esAutoridad } = useAuth();
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [denuncias, setDenuncias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Cargar denuncias de la API
  useEffect(() => {
    cargarDenuncias();
  }, []);

  const cargarDenuncias = async () => {
    try {
      setCargando(true);
      setError(null);

      const response = await denunciaService.obtenerDenuncias({
        limite: 100,
        orden: 'fecha_registro',
        direccion: 'DESC'
      });

      if (response.success) {
        setDenuncias(response.data.denuncias);
      }
    } catch (err) {
      console.error('Error al cargar denuncias:', err);
      setError(err.message || 'Error al cargar las denuncias');
    } finally {
      setCargando(false);
    }
  };

  // Mapear estados de la BD a los filtros
  const mapearEstadoAFiltro = (estadoNombre) => {
    if (!estadoNombre) return 'pendiente';
    // Normalizar: minúsculas, sin acentos
    const estado = estadoNombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '');

    if (['registrada', 'enrevision'].includes(estado)) return 'pendiente';
    if (['asignada', 'enproceso'].includes(estado)) return 'enproceso';
    if (['resuelta', 'cerrada', 'rechazada'].includes(estado)) return 'resuelta';
    return 'pendiente';
  };

  // Filtrar denuncias según el estado seleccionado
  const denunciasFiltradas = filtroEstado === 'todas'
    ? denuncias
    : denuncias.filter(denuncia => mapearEstadoAFiltro(denuncia.estado_nombre) === filtroEstado);

  // Función para obtener el color del estado
  const obtenerColorEstado = (estadoNombre) => {
    if (!estadoNombre) return '';
    const estado = estadoNombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '');

    if (['registrada', 'enrevision', 'pendiente'].includes(estado)) return styles.estadoPendiente;
    if (['asignada', 'enproceso'].includes(estado)) return styles.estadoProceso;
    if (['resuelta', 'cerrada', 'rechazada'].includes(estado)) return styles.estadoResuelta;

    return styles.estadoPendiente;
  };

  // Función para obtener el color de la prioridad
  const obtenerColorPrioridad = (prioridad) => {
    switch (prioridad.toLowerCase()) {
      case 'alta':
        return styles.prioridadAlta;
      case 'media':
        return styles.prioridadMedia;
      case 'baja':
        return styles.prioridadBaja;
      default:
        return '';
    }
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Mostrar estado de carga
  if (cargando) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Cargando denuncias...</p>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.container}>
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>⚠️ {error}</p>
            <button onClick={cargarDenuncias} className={styles.retryButton}>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Header />

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Mis Denuncias</h1>
          <p className={styles.subtitle}>
            Gestiona y da seguimiento a todas tus denuncias realizadas
          </p>
        </div>

        {/* Filtros */}
        <div className={styles.filtros}>
          <div className={styles.filtroGroup}>
            <label className={styles.filtroLabel}>Filtrar por estado:</label>
            <select
              className={styles.filtroSelect}
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="todas">Todas</option>
              <option value="pendiente">Pendientes</option>
              <option value="enproceso">En Proceso</option>
              <option value="resuelta">Resueltas</option>
            </select>
          </div>

          <div className={styles.estadisticas}>
            <div className={styles.estadistica}>
              <span className={styles.estadisticaNumero}>{denuncias.length}</span>
              <span className={styles.estadisticaLabel}>Total</span>
            </div>
            <div className={styles.estadistica}>
              <span className={styles.estadisticaNumero}>
                {denuncias.filter(d => mapearEstadoAFiltro(d.estado_nombre) === 'pendiente').length}
              </span>
              <span className={styles.estadisticaLabel}>Pendientes</span>
            </div>
            <div className={styles.estadistica}>
              <span className={styles.estadisticaNumero}>
                {denuncias.filter(d => mapearEstadoAFiltro(d.estado_nombre) === 'enproceso').length}
              </span>
              <span className={styles.estadisticaLabel}>En Proceso</span>
            </div>
            <div className={styles.estadistica}>
              <span className={styles.estadisticaNumero}>
                {denuncias.filter(d => mapearEstadoAFiltro(d.estado_nombre) === 'resuelta').length}
              </span>
              <span className={styles.estadisticaLabel}>Resueltas</span>
            </div>
          </div>
        </div>
        {/* Lista de denuncias */}
        <div className={styles.denunciasList}>
          {denunciasFiltradas.length > 0 ? (
            denunciasFiltradas.map((denuncia) => {
              const imagenUrl = obtenerUrlImagen(denuncia.evidencias);

              return (
                <div
                  key={denuncia.id_denuncia}
                  className={styles.denunciaCard}
                  onClick={() => navigate(`/denuncias/${denuncia.id_denuncia}`)}
                >
                  {/* Imagen o placeholder */}
                  <div className={styles.cardImage}>
                    {imagenUrl ? (
                      <img
                        src={imagenUrl}
                        alt={denuncia.titulo}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={styles.imagePlaceholder} style={{ display: imagenUrl ? 'none' : 'flex' }}>
                      <ImagePlaceholderIcon />
                    </div>
                    {/* Badge de estado sobre la imagen */}
                    <span className={`${styles.estado} ${obtenerColorEstado(denuncia.estado_nombre)}`}>
                      {denuncia.estado_nombre}
                    </span>
                  </div>

                  {/* Contenido */}
                  <div className={styles.cardBody}>
                    <h3 className={styles.denunciaTitle}>{denuncia.titulo}</h3>
                    <p className={styles.denunciaDescripcion}>
                      {denuncia.descripcion_detallada?.substring(0, 80)}
                      {denuncia.descripcion_detallada?.length > 80 ? '...' : ''}
                    </p>

                    {/* Meta info */}
                    <div className={styles.cardMeta}>
                      <span className={styles.metaItem}>
                        <CalendarIcon />
                        {formatearFecha(denuncia.fecha_registro)}
                      </span>
                      <span className={styles.metaItem}>
                        <TagIcon />
                        {denuncia.categoria_nombre}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}><ClipboardIcon /></div>
              <h3 className={styles.emptyTitle}>No hay denuncias</h3>
              <p className={styles.emptyText}>
                {filtroEstado === 'todas'
                  ? 'Aún no has realizado ninguna denuncia.'
                  : `No tienes denuncias con estado "${filtroEstado}".`
                }
              </p>
              <button
                className={styles.emptyAction}
                onClick={() => navigate('/nueva-denuncia')}
              >
                Crear Primera Denuncia
              </button>
            </div>
          )}
        </div>
      </div>
      {isMobile && <BottomNavigation userType={esAutoridad ? "autoridad" : "ciudadano"} />}
    </div>
  );
};

export default DenunciasPage;