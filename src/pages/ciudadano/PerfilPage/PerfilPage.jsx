import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../../hooks/useIsMobile';
import UsuarioService from '../../../services/usuarioService';
import Header from '../../../components/common/Header/Header';
import BottomNavigation from '../../../components/common/BottomNavigation/BottomNavigation';
import FormularioEdicionPerfil from '../../../components/perfil/FormularioEdicionPerfil';
import CambioPasswordModal from '../../../components/perfil/CambioPasswordModal';
import HistorialActividad from '../../../components/perfil/HistorialActividad';
import styles from './PerfilPage.module.css';

/**
 * Página de gestión de perfil de usuario
 * Permite al usuario ver y editar su información personal, cambiar contraseña y ver historial
 */
const PerfilPage = () => {
  const { usuario, actualizarUsuario, esAutoridad } = useAuth();
  const isMobile = useIsMobile();
  const [perfilData, setPerfilData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('perfil');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Cargar datos del perfil al montar el componente
  useEffect(() => {
    cargarPerfil();
  }, []);

  /**
   * Carga los datos del perfil del usuario
   */
  const cargarPerfil = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await UsuarioService.obtenerPerfil();

      if (response.success) {
        const datosFormateados = UsuarioService.formatearDatosUsuario(response.data);
        setPerfilData(datosFormateados);
      } else {
        setError('No se pudieron cargar los datos del perfil');
      }
    } catch (err) {
      console.error('Error al cargar perfil:', err);
      setError(err.message || 'Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja la actualización del perfil
   * @param {Object} datosActualizados - Nuevos datos del perfil
   */
  const manejarActualizacionPerfil = async (datosActualizados) => {
    try {
      setError(null);
      setSuccess(null);

      const response = await UsuarioService.actualizarPerfil(datosActualizados);

      if (response.success) {
        // Actualizar los datos locales
        const datosFormateados = UsuarioService.formatearDatosUsuario(response.data);
        setPerfilData(datosFormateados);

        // Actualizar el contexto de autenticación si es necesario
        actualizarUsuario(response.data);

        setSuccess('Perfil actualizado correctamente');

        // Limpiar mensaje de éxito después de 5 segundos
        setTimeout(() => setSuccess(null), 5000);
      } else {
        setError('No se pudo actualizar el perfil');
      }
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      setError(err.message || 'Error al actualizar el perfil');
    }
  };

  /**
   * Maneja el cambio de contraseña
   * @param {Object} datosCambio - Datos para el cambio de contraseña
   */
  const manejarCambioPassword = async (datosCambio) => {
    try {
      setError(null);
      setSuccess(null);

      const response = await UsuarioService.cambiarPassword(datosCambio);

      if (response.success) {
        setShowPasswordModal(false);
        setSuccess('Contraseña cambiada correctamente');

        // Limpiar mensaje de éxito después de 5 segundos
        setTimeout(() => setSuccess(null), 5000);
      } else {
        throw new Error('No se pudo cambiar la contraseña');
      }
    } catch (err) {
      console.error('Error al cambiar contraseña:', err);
      throw err; // Re-lanzar para que el modal lo maneje
    }
  };

  /**
   * Limpia los mensajes de error y éxito
   */
  const limpiarMensajes = () => {
    setError(null);
    setSuccess(null);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Mi Perfil</h1>
          <p className={styles.subtitle}>
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className={styles.alert + ' ' + styles.alertError}>
            <span className={styles.alertIcon}>⚠️</span>
            <span>{error}</span>
            <button
              className={styles.alertClose}
              onClick={limpiarMensajes}
              aria-label="Cerrar mensaje"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className={styles.alert + ' ' + styles.alertSuccess}>
            <span className={styles.alertIcon}>✅</span>
            <span>{success}</span>
            <button
              className={styles.alertClose}
              onClick={limpiarMensajes}
              aria-label="Cerrar mensaje"
            >
              ×
            </button>
          </div>
        )}

        {/* Navegación por pestañas */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'perfil' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('perfil')}
            title="Información Personal"
          >
            <svg className={styles.tabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span className={styles.tabText}>Perfil</span>
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'seguridad' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('seguridad')}
            title="Seguridad"
          >
            <svg className={styles.tabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span className={styles.tabText}>Seguridad</span>
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'historial' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('historial')}
            title="Historial"
          >
            <svg className={styles.tabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 11 12 14 22 4"></polyline>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
            <span className={styles.tabText}>Historial</span>
          </button>
        </div>

        {/* Contenido de las pestañas */}
        <div className={styles.tabContent}>
          {activeTab === 'perfil' && (
            <div className={styles.tabPanel}>
              <h2 className={styles.sectionTitle}>Información Personal</h2>
              <p className={styles.sectionDescription}>
                Actualiza tu información personal. Los campos marcados con * son obligatorios.
              </p>

              {perfilData && (
                <FormularioEdicionPerfil
                  datosIniciales={perfilData}
                  onActualizar={manejarActualizacionPerfil}
                  loading={loading}
                  esAutoridad={esAutoridad}
                />
              )}
            </div>
          )}

          {activeTab === 'seguridad' && (
            <div className={styles.tabPanel}>
              <h2 className={styles.sectionTitle}>Configuración de Seguridad</h2>
              <p className={styles.sectionDescription}>
                Gestiona la seguridad de tu cuenta y cambia tu contraseña.
              </p>

              <div className={styles.securitySection}>
                <div className={styles.securityItem}>
                  <div className={styles.securityInfo}>
                    <h3>Contraseña</h3>
                    <p>Última actualización: Hace 30 días</p>
                  </div>
                  <button
                    className={styles.btnSecondary}
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Cambiar Contraseña
                  </button>
                </div>

                <div className={styles.securityItem}>
                  <div className={styles.securityInfo}>
                    <h3>Sesiones Activas</h3>
                    <p>Dispositivo actual: Navegador Web</p>
                  </div>
                  <button className={styles.btnSecondary} disabled>
                    Ver Sesiones
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'historial' && (
            <div className={styles.tabPanel}>
              <h2 className={styles.sectionTitle}>Historial de Actividad</h2>
              <p className={styles.sectionDescription}>
                Revisa tu actividad reciente en la plataforma.
              </p>

              <HistorialActividad />
            </div>
          )}
        </div>

        {/* Modal de cambio de contraseña */}
        {showPasswordModal && (
          <CambioPasswordModal
            onCambiar={manejarCambioPassword}
            onCerrar={() => setShowPasswordModal(false)}
          />
        )}
      </div>
      {isMobile && <BottomNavigation userType={esAutoridad ? "autoridad" : "ciudadano"} />}
    </>
  );
};

export default PerfilPage;