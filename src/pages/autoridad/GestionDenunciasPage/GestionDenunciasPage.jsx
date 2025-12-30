import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../../hooks/useIsMobile';
import Header from '../../../components/common/Header/Header';
import BottomNavigation from '../../../components/common/BottomNavigation/BottomNavigation';
import MetricCard from '../../../components/common/MetricCard/MetricCard';
import { TableSkeleton } from '../../../components/common/LoadingSkeleton/LoadingSkeleton';
import { useToast } from '../../../components/common/ToastContainer/ToastContainer';
import ModalAsignarArea from '../../../components/denuncias/ModalAsignarArea';
import denunciaService from '../../../services/denunciaService';
import { BASE_URL } from '../../../services/api';
import styles from './GestionDenunciasPage.module.css';

// Función para obtener URL de imagen
const obtenerUrlImagen = (evidencias) => {
  if (!evidencias || evidencias.length === 0) return null;
  const foto = evidencias[0];
  if (!foto || !foto.url_archivo) return null;

  const url = foto.url_archivo;
  if (url.startsWith('http')) return url;
  return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const GestionDenunciasPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const isMobile = useIsMobile();

  const [denuncias, setDenuncias] = useState([]);
  const [estados, setEstados] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [modalCambiarEstado, setModalCambiarEstado] = useState(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('');
  const [comentario, setComentario] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [modalAsignarArea, setModalAsignarArea] = useState(null);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const denunciasPorPagina = 10;

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError(null);

      const [responseDenuncias, responseEstados] = await Promise.all([
        denunciaService.obtenerDenuncias({
          limite: 500,
          orden: 'fecha_registro',
          direccion: 'DESC'
        }),
        denunciaService.obtenerEstados()
      ]);

      if (responseDenuncias.success) {
        setDenuncias(responseDenuncias.data.denuncias);
      }

      if (responseEstados.success) {
        setEstados(responseEstados.data.estados);
      }
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError(err.message || 'Error al cargar los datos');
      toast.error('Error al cargar los datos');
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearIdDenuncia = (idDenuncia) => {
    if (!idDenuncia) return '';
    // Convertir ObjectId a número secuencial simple
    const hash = idDenuncia.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (1000 + (hash % 9000)).toString();
  };

  const obtenerColorEstado = (estadoNombre) => {
    if (!estadoNombre) return styles.estadoPendiente;
    const estado = estadoNombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '');

    const mapeo = {
      'registrada': styles.estadoRegistrada,
      'pendiente': styles.estadoPendiente,
      'enrevision': styles.estadoPendiente,
      'enproceso': styles.estadoProceso,
      'asignada': styles.estadoAsignada,
      'resuelta': styles.estadoResuelta,
      'cerrada': styles.estadoCerrada
    };

    return mapeo[estado] || styles.estadoPendiente;
  };

  // Filtrado y búsqueda
  const denunciasFiltradas = denuncias.filter(denuncia => {
    const currentStateId = denuncia.id_estado_actual?._id || denuncia.id_estado_actual;
    const cumpleFiltroEstado = filtroEstado === 'todas' ||
      currentStateId?.toString() === filtroEstado;

    const cumpleBusqueda = busqueda === '' ||
      denuncia.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      (denuncia.descripcion_detallada || denuncia.descripcion || '').toLowerCase().includes(busqueda.toLowerCase()) ||
      denuncia.id_denuncia.toString().includes(busqueda);

    return cumpleFiltroEstado && cumpleBusqueda;
  });

  // Paginación
  const indiceUltimo = paginaActual * denunciasPorPagina;
  const indicePrimero = indiceUltimo - denunciasPorPagina;
  const denunciasPaginadas = denunciasFiltradas.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(denunciasFiltradas.length / denunciasPorPagina);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const abrirModalCambiarEstado = (denuncia) => {
    setModalCambiarEstado(denuncia);
    const currentStateId = denuncia.id_estado_actual?._id || denuncia.id_estado_actual;
    setEstadoSeleccionado(currentStateId?.toString() || '');
    setComentario('');
  };

  const cerrarModal = () => {
    setModalCambiarEstado(null);
    setEstadoSeleccionado('');
    setComentario('');
  };

  const handleCambiarEstado = async (e) => {
    e.preventDefault();

    if (!estadoSeleccionado || estadoSeleccionado === modalCambiarEstado.id_estado_actual.toString()) {
      toast.warning('Debes seleccionar un estado diferente');
      return;
    }

    if (!comentario.trim() || comentario.trim().length < 10) {
      toast.warning('El comentario debe tener al menos 10 caracteres');
      return;
    }

    try {
      setProcesando(true);

      await denunciaService.cambiarEstado(
        modalCambiarEstado.id_denuncia,
        estadoSeleccionado,
        comentario.trim()
      );

      toast.success('Estado actualizado exitosamente');
      cerrarModal();
      cargarDatos();
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      toast.error(err.message || 'Error al cambiar el estado');
    } finally {
      setProcesando(false);
    }
  };

  const abrirModalAsignarArea = (denuncia) => {
    setModalAsignarArea(denuncia);
  };

  const cerrarModalAsignarArea = () => {
    setModalAsignarArea(null);
  };

  const handleAsignarArea = async (idDenuncia, areaAsignada, comentario) => {
    try {
      setProcesando(true);

      await denunciaService.asignarArea(idDenuncia, areaAsignada, comentario);

      toast.success('Área asignada exitosamente');
      cerrarModalAsignarArea();
      cargarDatos();
    } catch (err) {
      console.error('Error al asignar área:', err);
      toast.error(err.message || 'Error al asignar el área');
    } finally {
      setProcesando(false);
    }
  };

  // Calcular estadísticas
  const estadisticas = {
    total: denuncias.length,
    pendientes: denuncias.filter(d => ['Registrada', 'En Revisión'].includes(d.estado_nombre)).length,
    enProceso: denuncias.filter(d => ['Asignada', 'En Proceso'].includes(d.estado_nombre)).length,
    resueltas: denuncias.filter(d => d.estado_nombre === 'Resuelta').length
  };

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.container}>
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>⚠️</div>
            <h2 className={styles.errorTitle}>Error al cargar datos</h2>
            <p className={styles.errorMessage}>{error}</p>
            <button onClick={cargarDatos} className={styles.retryButton}>
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
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Gestión de Denuncias</h1>
            <p className={styles.subtitle}>
              Administra y actualiza el estado de todas las denuncias del sistema
            </p>
          </div>
        </div>

        {/* Estadísticas */}
        {cargando ? (
          <div className={styles.metricsGrid}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={styles.metricSkeleton} />
            ))}
          </div>
        ) : (
          <div className={styles.metricsGrid}>
            <MetricCard
              title="Total Denuncias"
              value={estadisticas.total}
              icon="📊"
              color="primary"
            />
            <MetricCard
              title="Pendientes"
              value={estadisticas.pendientes}
              icon="⏳"
              color="warning"
            />
            <MetricCard
              title="En Proceso"
              value={estadisticas.enProceso}
              icon="🔄"
              color="info"
            />
            <MetricCard
              title="Resueltas"
              value={estadisticas.resueltas}
              icon="✅"
              color="success"
            />
          </div>
        )}

        {/* Filtros y búsqueda */}
        <div className={styles.filtrosContainer}>
          <div className={styles.searchBox}>
            <svg className={styles.searchIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Buscar por título, descripción o ID..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1);
              }}
            />
            {busqueda && (
              <button
                className={styles.clearButton}
                onClick={() => setBusqueda('')}
                aria-label="Limpiar búsqueda"
              >
                ×
              </button>
            )}
          </div>

          <div className={styles.filtroGroup}>
            <label className={styles.filtroLabel}>Estado:</label>
            <select
              className={styles.filtroSelect}
              value={filtroEstado}
              onChange={(e) => {
                setFiltroEstado(e.target.value);
                setPaginaActual(1);
              }}
            >
              <option value="todas">Todas</option>
              {estados.map((estado) => (
                <option key={estado.id_estado} value={estado.id_estado}>
                  {estado.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Resultados */}
        <div className={styles.resultInfo}>
          <p className={styles.resultText}>
            Mostrando {indicePrimero + 1} - {Math.min(indiceUltimo, denunciasFiltradas.length)} de {denunciasFiltradas.length} denuncias
          </p>
        </div>

        {/* Tabla de denuncias */}
        <div className={styles.tableWrapper}>
          {cargando ? (
            <TableSkeleton rows={10} columns={7} />
          ) : denunciasPaginadas.length > 0 ? (
            <>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Imagen</th>
                      <th>Denuncia</th>
                      <th>Categoría</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {denunciasPaginadas.map((denuncia, index) => {
                      return (
                        <tr key={denuncia.id_denuncia} className={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                          <td className={styles.idCell}>
                            <span className={styles.idBadge}>{formatearIdDenuncia(denuncia.id_denuncia)}</span>
                          </td>
                          <td className={styles.imageCell}>
                            <div className={styles.thumbnailContainer} onClick={() => navigate(`/denuncias/${denuncia.id_denuncia}`)}>
                              {obtenerUrlImagen(denuncia.evidencias) ? (
                                <img
                                  src={obtenerUrlImagen(denuncia.evidencias)}
                                  alt={denuncia.titulo}
                                  className={styles.thumbnail}
                                  loading="lazy"
                                  decoding="async"
                                />
                              ) : (
                                <div className={styles.noImage}>
                                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className={styles.denunciaCell}>
                            <div className={styles.denunciaContent}>
                              <div className={styles.denunciaTitle}>{denuncia.titulo}</div>
                              {(denuncia.descripcion_detallada || denuncia.descripcion) && (
                                <div className={styles.denunciaDescripcion}>
                                  {((denuncia.descripcion_detallada || denuncia.descripcion).length > 80
                                    ? `${(denuncia.descripcion_detallada || denuncia.descripcion).substring(0, 80)}...`
                                    : (denuncia.descripcion_detallada || denuncia.descripcion))}
                                </div>
                              )}
                              <div className={styles.denunciaUbicacion}>
                                📍 {denuncia.direccion_geolocalizada || 'Sin ubicación'}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={styles.categoriaTag}>
                              {denuncia.categoria_nombre}
                            </span>
                          </td>
                          <td>
                            <span className={`${styles.estadoBadge} ${obtenerColorEstado(denuncia.estado_nombre)}`}>
                              {denuncia.estado_nombre}
                            </span>
                          </td>
                          <td className={styles.fechaCell}>{formatearFecha(denuncia.fecha_registro)}</td>
                          <td>
                            <div className={styles.actionButtons}>
                              <button
                                className={styles.btnVer}
                                onClick={() => navigate(`/denuncias/${denuncia.id_denuncia}`)}
                                title="Ver detalles completos"
                              >
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span>Detalles</span>
                              </button>
                              <button
                                className={styles.btnEstado}
                                onClick={() => abrirModalCambiarEstado(denuncia)}
                                title="Cambiar estado de la denuncia"
                              >
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>Cambiar</span>
                              </button>
                              <button
                                className={styles.btnArea}
                                onClick={() => abrirModalAsignarArea(denuncia)}
                                title="Asignar a un área específica"
                              >
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span>Asignar</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {totalPaginas > 1 && (
                <div className={styles.pagination}>
                  <button
                    className={styles.paginationButton}
                    onClick={() => cambiarPagina(paginaActual - 1)}
                    disabled={paginaActual === 1}
                  >
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Anterior
                  </button>

                  <div className={styles.paginationNumbers}>
                    {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                      .filter(num => {
                        return num === 1 ||
                          num === totalPaginas ||
                          Math.abs(num - paginaActual) <= 1;
                      })
                      .map((num, index, array) => (
                        <React.Fragment key={num}>
                          {index > 0 && array[index - 1] !== num - 1 && (
                            <span className={styles.paginationEllipsis}>...</span>
                          )}
                          <button
                            className={`${styles.paginationNumber} ${paginaActual === num ? styles.active : ''}`}
                            onClick={() => cambiarPagina(num)}
                          >
                            {num}
                          </button>
                        </React.Fragment>
                      ))}
                  </div>

                  <button
                    className={styles.paginationButton}
                    onClick={() => cambiarPagina(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                  >
                    Siguiente
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🔍</div>
              <h3 className={styles.emptyTitle}>No se encontraron denuncias</h3>
              <p className={styles.emptyMessage}>
                {busqueda || filtroEstado !== 'todas'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'No hay denuncias registradas en el sistema'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Asignar Área */}
      {modalAsignarArea && (
        <ModalAsignarArea
          denuncia={modalAsignarArea}
          onClose={cerrarModalAsignarArea}
          onAsignar={handleAsignarArea}
          procesando={procesando}
        />
      )}

      {/* Modal Cambiar Estado */}
      {modalCambiarEstado && (
        <div className={styles.modal} onClick={cerrarModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Cambiar Estado de Denuncia</h2>
              <button className={styles.modalClose} onClick={cerrarModal} aria-label="Cerrar modal">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Denuncia:</span>
                  <span className={styles.infoValue}>{modalCambiarEstado.titulo}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Estado actual:</span>
                  <span className={`${styles.estadoBadge} ${obtenerColorEstado(modalCambiarEstado.estado_nombre)}`}>
                    {modalCambiarEstado.estado_nombre}
                  </span>
                </div>
              </div>

              <form onSubmit={handleCambiarEstado}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Nuevo Estado <span className={styles.required}>*</span>
                  </label>
                  <select
                    className={styles.formSelect}
                    value={estadoSeleccionado}
                    onChange={(e) => setEstadoSeleccionado(e.target.value)}
                    required
                  >
                    <option value="">Seleccionar estado</option>
                    {estados.map((estado) => {
                      const currentStateId = modalCambiarEstado.id_estado_actual?._id || modalCambiarEstado.id_estado_actual;
                      const isCurrent = estado.id_estado === currentStateId?.toString();
                      return (
                        <option
                          key={estado.id_estado}
                          value={estado.id_estado}
                          disabled={isCurrent}
                        >
                          {estado.nombre} {isCurrent ? '(actual)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Comentario <span className={styles.required}>*</span>
                    <span className={styles.helpText}>(mínimo 10 caracteres)</span>
                  </label>
                  <textarea
                    className={styles.formTextarea}
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Describe el motivo del cambio de estado..."
                    rows={4}
                    required
                    minLength={10}
                  ></textarea>
                  <div className={styles.charCount}>
                    {comentario.length} / 10 caracteres mínimo
                  </div>
                </div>

                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.btnCancelar}
                    onClick={cerrarModal}
                    disabled={procesando}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={styles.btnGuardar}
                    disabled={procesando}
                  >
                    {procesando ? (
                      <>
                        <span className={styles.spinner}></span>
                        Guardando...
                      </>
                    ) : (
                      'Guardar Cambio'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {isMobile && <BottomNavigation userType="autoridad" />}
    </div>
  );
};

export default GestionDenunciasPage;
