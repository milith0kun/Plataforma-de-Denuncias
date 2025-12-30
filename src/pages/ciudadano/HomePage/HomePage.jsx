import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useIsMobile } from '../../../hooks/useIsMobile';
import {
  LayoutDashboard, FileText, MapPin, User, Clock, AlertCircle,
  CheckCircle2, TrendingUp, Plus, Eye, ChevronRight, Menu,
  Camera, Shield, MessageSquare, Info, Map
} from 'lucide-react';
import Header from '../../../components/common/Header/Header';
import BottomNavigation from '../../../components/common/BottomNavigation/BottomNavigation';
import denunciaService from '../../../services/denunciaService';
import styles from './HomePageNew.module.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const isMobile = useIsMobile();

  // Inicializar el sidebar solo para desktop
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === 'undefined') return true;
    const savedState = localStorage.getItem('sidebarOpen');
    return savedState !== null ? JSON.parse(savedState) : false;
  });

  const [estadisticas, setEstadisticas] = useState({
    denunciasRealizadas: 0,
    denunciasPendientes: 0,
    denunciasEnProceso: 0,
    denunciasResueltas: 0
  });
  const [denunciasRecientes, setDenunciasRecientes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  // Persistir el estado del sidebar solo en desktop
  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
    }
  }, [sidebarOpen, isMobile]);

  const cargarDatos = async () => {
    try {
      setCargando(true);

      const stats = await denunciaService.obtenerEstadisticasUsuario();
      setEstadisticas({
        denunciasRealizadas: stats.total,
        denunciasPendientes: stats.pendientes,
        denunciasEnProceso: stats.enProceso,
        denunciasResueltas: stats.resueltas
      });

      const response = await denunciaService.obtenerDenuncias({
        limite: 5,
        orden: 'fecha_registro',
        direccion: 'DESC'
      });

      if (response.success) {
        setDenunciasRecientes(response.data.denuncias);
      }
    } catch (err) {
      console.error('Error al cargar datos:', err);
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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

  if (cargando) {
    return (
      <>
        <Header />
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Cargando datos...</p>
        </div>
      </>
    );
  }

  const toggleSidebar = () => {
    if (!isMobile) {
      setSidebarOpen(prev => !prev);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.dashboardContainer}>
        {/* Sidebar solo para desktop */}
        {!isMobile && (
          <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
            <div className={styles.sidebarHeader}>
              <button
                className={styles.toggleButton}
                onClick={toggleSidebar}
                aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
              >
                <Menu size={24} />
              </button>
            </div>

            <nav className={styles.sidebarNav}>
              <a href="/home" className={`${styles.navItem} ${styles.active}`}>
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </a>
              <a href="/denuncias" className={styles.navItem}>
                <FileText size={20} />
                <span>Mis Denuncias</span>
              </a>
              <a href="/nueva-denuncia" className={styles.navItem}>
                <Plus size={20} />
                <span>Nueva Denuncia</span>
              </a>
              <a href="/seguimiento" className={styles.navItem}>
                <MapPin size={20} />
                <span>Seguimiento</span>
              </a>
              <a href="/perfil" className={styles.navItem}>
                <User size={20} />
                <span>Mi Perfil</span>
              </a>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className={styles.mainContent}>
          {/* Hero Section */}
          <div className={styles.heroSection}>
            <div className={styles.heroContent}>
              <div className={styles.heroLeft}>
                <h1>Hola, {usuario?.nombres} 👋</h1>
                <p>Gestiona tus denuncias y contribuye a mejorar tu comunidad</p>
                {/* Solo mostrar botones en desktop, en móvil ya están en BottomNavigation */}
                {!isMobile && (
                  <div className={styles.heroActions}>
                    <button
                      className={styles.btnPrimary}
                      onClick={() => navigate('/nueva-denuncia')}
                    >
                      <Plus size={20} />
                      Nueva Denuncia
                    </button>
                    <button
                      className={styles.btnSecondary}
                      onClick={() => navigate('/denuncias')}
                    >
                      <FileText size={20} />
                      Ver Mis Denuncias
                    </button>
                    <button
                      className={styles.btnSecondary}
                      onClick={() => navigate('/perfil')}
                    >
                      <User size={20} />
                      Mi Perfil
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard} data-type="primary">
              <div className={styles.metricHeader}>
                <FileText size={24} />
                <span className={styles.metricLabel}>Total</span>
              </div>
              <p className={styles.metricValue}>{estadisticas.denunciasRealizadas}</p>
              <p className={styles.metricChange}>Denuncias registradas</p>
            </div>

            <div className={styles.metricCard} data-type="warning">
              <div className={styles.metricHeader}>
                <Clock size={24} />
                <span className={styles.metricLabel}>Pendientes</span>
              </div>
              <p className={styles.metricValue}>{estadisticas.denunciasPendientes}</p>
              <p className={styles.metricChange}>Esperando revisión</p>
            </div>

            <div className={styles.metricCard} data-type="info">
              <div className={styles.metricHeader}>
                <TrendingUp size={24} />
                <span className={styles.metricLabel}>En Proceso</span>
              </div>
              <p className={styles.metricValue}>{estadisticas.denunciasEnProceso}</p>
              <p className={styles.metricChange}>En gestión</p>
            </div>

            <div className={styles.metricCard} data-type="success">
              <div className={styles.metricHeader}>
                <CheckCircle2 size={24} />
                <span className={styles.metricLabel}>Resueltas</span>
              </div>
              <p className={styles.metricValue}>{estadisticas.denunciasResueltas}</p>
              <p className={styles.metricChange}>Completadas</p>
            </div>
          </div>

          {/* Recent Denuncias Table */}
          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <h3 className={styles.tableTitle}>
                <FileText size={20} />
                Denuncias Recientes
              </h3>
              <a href="/denuncias" className={styles.viewAllLink}>
                Ver todas
                <ChevronRight size={16} />
              </a>
            </div>

            <div className={styles.tableWrapper}>
              {denunciasRecientes.length === 0 ? (
                <div className={styles.emptyState}>
                  <FileText size={48} />
                  <p>No hay denuncias registradas</p>
                  <button
                    className={styles.btnPrimary}
                    onClick={() => navigate('/nueva-denuncia')}
                    style={{ marginTop: '1rem' }}
                  >
                    <Plus size={20} />
                    Crear primera denuncia
                  </button>
                </div>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Categoría</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {denunciasRecientes.map((denuncia) => (
                      <tr key={denuncia.id_denuncia}>
                        <td>
                          <strong>{denuncia.titulo}</strong>
                        </td>
                        <td>
                          <span className={styles.categoryBadge}>
                            {denuncia.categoria_nombre}
                          </span>
                        </td>
                        <td>
                          <span
                            className={styles.statusBadge}
                            style={{ backgroundColor: obtenerColorEstado(denuncia.estado_nombre) }}
                          >
                            {denuncia.estado_nombre}
                          </span>
                        </td>
                        <td>{formatearFecha(denuncia.fecha_registro)}</td>
                        <td>
                          <button
                            className={styles.actionButton}
                            onClick={() => navigate(`/denuncias/${denuncia.id_denuncia}`)}
                          >
                            <Eye size={16} />
                            Ver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Tips Section */}
          <div className={styles.quickActionsGrid}>
            <div className={`${styles.actionCard} ${styles.primary}`}>
              <div className={styles.actionCardIcon}>
                <Info size={24} />
              </div>
              <h3 className={styles.actionCardTitle}>Sé específico</h3>
              <p className={styles.actionCardDesc}>Proporciona detalles claros sobre la ubicación y el problema</p>
            </div>

            <div className={`${styles.actionCard} ${styles.secondary}`}>
              <div className={styles.actionCardIcon}>
                <Camera size={24} />
              </div>
              <h3 className={styles.actionCardTitle}>Incluye fotos</h3>
              <p className={styles.actionCardDesc}>Las evidencias visuales aceleran la resolución</p>
            </div>

            <div className={`${styles.actionCard} ${styles.tertiary}`}>
              <div className={styles.actionCardIcon}>
                <Shield size={24} />
              </div>
              <h3 className={styles.actionCardTitle}>Mantente informado</h3>
              <p className={styles.actionCardDesc}>Revisa regularmente el estado de tus denuncias</p>
            </div>

            <div className={`${styles.actionCard} ${styles.quaternary}`}>
              <div className={styles.actionCardIcon}>
                <MessageSquare size={24} />
              </div>
              <h3 className={styles.actionCardTitle}>Sé respetuoso</h3>
              <p className={styles.actionCardDesc}>Mantén un tono profesional en tus comunicaciones</p>
            </div>
          </div>
        </main>
      </div>

      {/* Navegación inferior para móviles */}
      {isMobile && <BottomNavigation userType="ciudadano" />}
    </>
  );
};

export default HomePage;
