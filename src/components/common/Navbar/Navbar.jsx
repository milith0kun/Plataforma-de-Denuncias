import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import ThemeToggle from '../ThemeToggle';
import styles from './Navbar.module.css';

/**
 * Componente de navegación principal
 * Incluye menú responsive y gestión de usuario
 */
const Navbar = () => {
  const { usuario, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [perfilMenuAbierto, setPerfilMenuAbierto] = useState(false);
  const dropdownRef = useRef(null);

  // Función para obtener las iniciales del usuario
  const obtenerIniciales = (nombres, apellidos) => {
    const inicial1 = nombres ? nombres.charAt(0).toUpperCase() : '';
    const inicial2 = apellidos ? apellidos.charAt(0).toUpperCase() : '';
    return inicial1 + inicial2;
  };

  // Función para alternar el menú móvil
  const alternarMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  // Función para alternar el menú de perfil
  const alternarPerfilMenu = () => {
    setPerfilMenuAbierto(!perfilMenuAbierto);
  };

  // Función para manejar el logout
  const manejarLogout = () => {
    logout();
    setPerfilMenuAbierto(false);
  };

  // Función para cerrar menús
  const cerrarMenus = () => {
    setMenuAbierto(false);
    setPerfilMenuAbierto(false);
  };

  // Función para verificar si una ruta está activa
  const esRutaActiva = (ruta) => {
    return location.pathname === ruta;
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const manejarClickFuera = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setPerfilMenuAbierto(false);
      }
    };

    document.addEventListener('mousedown', manejarClickFuera);
    return () => {
      document.removeEventListener('mousedown', manejarClickFuera);
    };
  }, []);

  // Cerrar menús al cambiar de ruta
  useEffect(() => {
    setMenuAbierto(false);
    setPerfilMenuAbierto(false);
  }, [location.pathname]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>🏛️</span>
          <span className={styles.logoText}>Plataforma Denuncias</span>
        </Link>

        {/* Menú de navegación */}
        <ul className={`${styles.navMenu} ${menuAbierto ? styles.navMenuActivo : ''}`}>
          <li>
            <Link
              to="/inicio"
              className={`${styles.navLink} ${esRutaActiva('/inicio') ? styles.navLinkActivo : ''}`}
            >
              <span className={styles.navIcon}>🏠</span>
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/denuncias"
              className={`${styles.navLink} ${esRutaActiva('/denuncias') ? styles.navLinkActivo : ''}`}
            >
              <span className={styles.navIcon}>📋</span>
              Mis Denuncias
            </Link>
          </li>
          <li>
            <Link
              to="/nueva-denuncia"
              className={`${styles.navLink} ${esRutaActiva('/nueva-denuncia') ? styles.navLinkActivo : ''}`}
            >
              <span className={styles.navIcon}>📝</span>
              Nueva Denuncia
            </Link>
          </li>
        </ul>

        {/* Sección de usuario */}
        <div className={styles.userSection}>
          {/* Toggle de tema */}
          <ThemeToggle />

          {/* Notificaciones */}
          <button className={styles.notificationBtn} title="Notificaciones">
            <span className={styles.notificationIcon}>🔔</span>
            <span className={styles.notificationBadge}>3</span>
          </button>

          {/* Menú de perfil */}
          <div className={styles.profileMenu} ref={dropdownRef}>
            <button
              className={styles.profileBtn}
              onClick={alternarPerfilMenu}
              title="Menú de usuario"
            >
              <div className={styles.avatar}>
                {obtenerIniciales(usuario?.nombres, usuario?.apellidos)}
              </div>
              <span className={styles.userName}>
                {usuario?.nombres}
              </span>
              <span className={styles.dropdownIcon}>▼</span>
            </button>

            {/* Dropdown del perfil */}
            {perfilMenuAbierto && (
              <div className={styles.profileDropdown}>
                <div className={styles.profileInfo}>
                  <div className={styles.profileAvatar}>
                    {obtenerIniciales(usuario?.nombres, usuario?.apellidos)}
                  </div>
                  <div className={styles.profileDetails}>
                    <div className={styles.profileName}>
                      {usuario?.nombres} {usuario?.apellidos}
                    </div>
                    <div className={styles.profileEmail}>
                      {usuario?.email}
                    </div>
                    <div className={styles.profileType}>
                      {usuario?.tipo_usuario}
                    </div>
                  </div>
                </div>

                <div className={styles.profileActions}>
                  <Link
                    to="/perfil"
                    className={styles.profileAction}
                    onClick={cerrarMenus}
                  >
                    <span className={styles.actionIcon}>👤</span>
                    Mi Perfil
                  </Link>

                  {/* Rutas temporalmente comentadas hasta implementar
                  <Link
                    to="/configuracion"
                    className={styles.profileAction}
                    onClick={cerrarMenus}
                  >
                    <span className={styles.actionIcon}>⚙️</span>
                    Configuración
                  </Link>
                  
                  <Link
                    to="/ayuda"
                    className={styles.profileAction}
                    onClick={cerrarMenus}
                  >
                    <span className={styles.actionIcon}>❓</span>
                    Ayuda
                  </Link>
                  */}

                  <button
                    className={styles.logoutAction}
                    onClick={manejarLogout}
                  >
                    <span className={styles.actionIcon}>🚪</span>
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Botón de menú móvil */}
          <button
            className={styles.mobileMenuBtn}
            onClick={alternarMenu}
            aria-label="Abrir menú"
          >
            <span className={styles.hamburger}></span>
            <span className={styles.hamburger}></span>
            <span className={styles.hamburger}></span>
          </button>
        </div>
      </div>

      {/* Overlay para cerrar menús en móvil */}
      {(menuAbierto || perfilMenuAbierto) && (
        <div className={styles.overlay} onClick={cerrarMenus}></div>
      )}
    </nav>
  );
};

export default Navbar;