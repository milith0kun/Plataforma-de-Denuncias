import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../hooks/useIsMobile';
import Header from '../../components/common/Header/Header';
import BottomNavigation from '../../components/common/BottomNavigation/BottomNavigation';
import denunciaService from '../../services/denunciaService';
import styles from './SeguimientoDenunciaPage.module.css';

// Iconos SVG minimalistas
const TagIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
    <line x1="7" y1="7" x2="7.01" y2="7"></line>
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const FolderIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
);

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"></polyline>
    <polyline points="1 20 1 14 7 14"></polyline>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const SeguimientoDenunciaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [denuncia, setDenuncia] = useState(null);
  const [denuncias, setDenuncias] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarLista, setMostrarLista] = useState(!id);

  useEffect(() => {
    if (id) {
      cargarDatosDenuncia();
    } else {
      cargarListaDenuncias();
    }
  }, [id]);

  const cargarListaDenuncias = async () => {
    try {
      setCargando(true);
      setError(null);

      const response = await denunciaService.obtenerDenuncias();

      if (response.success) {
        setDenuncias(response.data.denuncias);
        setMostrarLista(true);
      } else {
        setError(response.message || 'Error al cargar denuncias');
      }
    } catch (err) {
      console.error('Error al cargar denuncias:', err);
      setError(err.message || 'Error al cargar denuncias');
    } finally {
      setCargando(false);
    }
  };

  const cargarDatosDenuncia = async () => {
    try {
      setCargando(true);
      setError(null);

      const response = await denunciaService.obtenerDenunciaPorId(id);

      if (response.success) {
        setDenuncia(response.data.denuncia);
        setHistorial(response.data.historial || []);
        setMostrarLista(false);
      } else {
        setError(response.message || 'Error al cargar el seguimiento');
      }
    } catch (err) {
      console.error('Error al cargar seguimiento:', err);
      setError(err.message || 'Error al cargar el seguimiento');
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearIdDenuncia = (numeroSecuencial) => {
    if (!numeroSecuencial) return '';
    // Retorna el número secuencial simple
    return numeroSecuencial.toString();
  };

  const calcularProgreso = () => {
    if (!denuncia) return 0;

    const estadoActual = denuncia.id_estado_actual;
    const totalEstados = 6; // Registrada, Pendiente, En Proceso, Asignada, Resuelta, Cerrada

    return Math.round((estadoActual / totalEstados) * 100);
  };

  const obtenerEstiloEstado = (estadoNombre) => {
    if (!estadoNombre) return {};
    const estado = estadoNombre.toLowerCase().replace(/\s+/g, '');

    const mapeo = {
      'registrada': { color: 'var(--color-estado-registrada)', icon: '📝' },
      'pendiente': { color: 'var(--color-estado-pendiente)', icon: '⏳' },
      'enrevision': { color: 'var(--color-estado-pendiente)', icon: '🔍' },
      'enproceso': { color: 'var(--color-estado-en-proceso)', icon: '⚙️' },
      'asignada': { color: 'var(--color-estado-asignada)', icon: '👤' },
      'resuelta': { color: 'var(--color-estado-resuelta)', icon: '✅' },
      'cerrada': { color: 'var(--color-estado-cerrada)', icon: '🔒' }
    };

    return mapeo[estado] || { color: 'var(--color-gray-500)', icon: '📋' };
  };

  if (cargando) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Cargando seguimiento...</p>
          </div>
        </div>
        {isMobile && <BottomNavigation userType="ciudadano" />}
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.container}>
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>⚠️ {error}</p>
            <button onClick={() => id ? cargarDatosDenuncia() : cargarListaDenuncias()} className={styles.retryButton}>
              Reintentar
            </button>
            <button onClick={() => navigate(-1)} className={styles.backButton}>
              Volver
            </button>
          </div>
        </div>
        {isMobile && <BottomNavigation userType="ciudadano" />}
      </div>
    );
  }

  // Si estamos en modo lista y no hay ID
  if (mostrarLista && !id) {
    const obtenerColorEstado = (estado) => {
      const colores = {
        'Pendiente': '#f59e0b',
        'En Proceso': '#3b82f6',
        'Resuelto': '#10b981',
        'Rechazado': '#ef4444',
        'Cerrado': '#6b7280'
      };
      return colores[estado] || '#94a3b8';
    };

    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Seguimiento de Denuncias</h1>
            <p className={styles.subtitle}>Selecciona una denuncia para ver su seguimiento detallado</p>
          </div>

          {denuncias.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No tienes denuncias registradas</p>
              <button onClick={() => navigate('/nueva-denuncia')} className={styles.btnPrimary}>
                Crear nueva denuncia
              </button>
            </div>
          ) : (
            <div className={styles.denunciasList}>
              {denuncias.map((den, index) => {
                const numeroSecuencial = index + 1001;
                return (
                  <div
                    key={den.id_denuncia}
                    className={styles.denunciaCard}
                    onClick={() => navigate(`/seguimiento/${den.id_denuncia}`)}
                  >
                    <div className={styles.denunciaCardHeader}>
                      <span className={styles.denunciaCardId}>{formatearIdDenuncia(numeroSecuencial)}</span>
                      <span
                        className={styles.denunciaCardEstado}
                        style={{ backgroundColor: obtenerColorEstado(den.estado_nombre) }}
                      >
                        {den.estado_nombre}
                      </span>
                    </div>
                    <h3 className={styles.denunciaCardTitle}>{den.titulo}</h3>
                    {den.descripcion && (
                      <p className={styles.denunciaCardDescripcion}>
                        {den.descripcion.length > 100
                          ? `${den.descripcion.substring(0, 100)}...`
                          : den.descripcion}
                      </p>
                    )}
                    <div className={styles.denunciaCardMeta}>
                      <span className={styles.denunciaCardCategoria}>
                        <TagIcon /> {den.categoria_nombre}
                      </span>
                      <span className={styles.denunciaCardFecha}>
                        <CalendarIcon /> {new Date(den.fecha_registro).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    <button className={styles.denunciaCardButton}>
                      Ver Detalles <ArrowRightIcon />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {isMobile && <BottomNavigation userType="ciudadano" />}
      </div>
    );
  }

  if (!denuncia) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.container}>
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>Denuncia no encontrada</p>
            <button onClick={() => navigate('/seguimiento')} className={styles.backButton}>
              Ver todas las denuncias
            </button>
          </div>
        </div>
        {isMobile && <BottomNavigation userType="ciudadano" />}
      </div>
    );
  }

  const progreso = calcularProgreso();
  const estiloEstadoActual = obtenerEstiloEstado(denuncia.estado_nombre);

  return (
    <div className={styles.pageContainer}>
      <Header />

      <div className={styles.container}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <button onClick={() => navigate(-1)} className={styles.breadcrumbLink}>
            ← Volver
          </button>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Seguimiento de Denuncia</span>
        </div>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Seguimiento de Denuncia</h1>
            <p className={styles.denunciaTitle}>{denuncia.titulo}</p>
            <p className={styles.denunciaId}>ID: #{denuncia.id_denuncia}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressSection}>
          <div className={styles.progressInfo}>
            <div className={styles.estadoActual}>
              <span className={styles.estadoIcon}>{estiloEstadoActual.icon}</span>
              <div>
                <p className={styles.estadoLabel}>Estado Actual</p>
                <p className={styles.estadoNombre} style={{ color: estiloEstadoActual.color }}>
                  {denuncia.estado_nombre}
                </p>
              </div>
            </div>
            <div className={styles.progresoNumero}>
              <span className={styles.progresoValue}>{progreso}%</span>
              <span className={styles.progresoLabel}>Completado</span>
            </div>
          </div>
          <div className={styles.progressBarContainer}>
            <div
              className={styles.progressBar}
              style={{
                width: `${progreso}%`,
                backgroundColor: estiloEstadoActual.color
              }}
            ></div>
          </div>
        </div>

        {/* Información adicional */}
        <div className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3 className={styles.infoCardTitle}>Información de la Denuncia</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}><FolderIcon /></span>
                <div>
                  <p className={styles.infoLabel}>Categoría</p>
                  <p className={styles.infoValue}>{denuncia.categoria_nombre}</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}><CalendarIcon /></span>
                <div>
                  <p className={styles.infoLabel}>Fecha de Registro</p>
                  <p className={styles.infoValue}>{formatearFecha(denuncia.fecha_registro)}</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}><RefreshIcon /></span>
                <div>
                  <p className={styles.infoLabel}>Última Actualización</p>
                  <p className={styles.infoValue}>{formatearFecha(denuncia.ultima_actualizacion)}</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}><MapPinIcon /></span>
                <div>
                  <p className={styles.infoLabel}>Ubicación</p>
                  <p className={styles.infoValue}>
                    {denuncia.direccion_geolocalizada || 'No especificada'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className={styles.timelineSection}>
          <h2 className={styles.sectionTitle}>Historial de Estados</h2>

          {historial.length > 0 ? (
            <div className={styles.timeline}>
              {historial.map((item, index) => {
                const estiloEstado = obtenerEstiloEstado(item.estado_nuevo_nombre);
                const esUltimo = index === historial.length - 1;

                return (
                  <div key={item.id_historial} className={styles.timelineItem}>
                    <div className={styles.timelineMarker}>
                      <div
                        className={`${styles.timelineDot} ${esUltimo ? styles.timelineDotActive : ''}`}
                        style={{ borderColor: estiloEstado.color }}
                      >
                        <span className={styles.timelineDotIcon}>{estiloEstado.icon}</span>
                      </div>
                      {index < historial.length - 1 && (
                        <div
                          className={styles.timelineLine}
                          style={{ backgroundColor: estiloEstado.color }}
                        ></div>
                      )}
                    </div>

                    <div className={`${styles.timelineContent} ${esUltimo ? styles.timelineContentActive : ''}`}>
                      <div className={styles.timelineCard}>
                        <div className={styles.timelineCardHeader}>
                          <h3
                            className={styles.timelineEstado}
                            style={{ color: estiloEstado.color }}
                          >
                            {item.estado_nuevo_nombre}
                          </h3>
                          <span className={styles.timelineFecha}>
                            {formatearFecha(item.fecha_cambio)}
                          </span>
                        </div>

                        {item.comentario && (
                          <p className={styles.timelineComentario}>{item.comentario}</p>
                        )}

                        {item.usuario_nombres && (
                          <div className={styles.timelineFooter}>
                            <span className={styles.timelineUsuario}>
                              <UserIcon /> {item.usuario_nombres} {item.usuario_apellidos}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyMessage}>No hay historial disponible</p>
            </div>
          )}
        </div>



        {/* Botones de acción */}
        <div className={styles.actionSection}>
          <button
            className={styles.actionButton}
            onClick={() => navigate(`/denuncias/${id}`)}
          >
            Ver Detalles Completos
          </button>
          <button
            className={styles.actionButtonSecondary}
            onClick={() => navigate(-1)}
          >
            Volver a Mis Denuncias
          </button>
        </div>
      </div>
      {isMobile && <BottomNavigation userType="ciudadano" />}
    </div>
  );
};

export default SeguimientoDenunciaPage;
