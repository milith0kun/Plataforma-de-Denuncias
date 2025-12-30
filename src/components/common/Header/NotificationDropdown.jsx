import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NotificationDropdown.module.css';
import notificacionService from '../../../services/notificacionService';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// Iconos
const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

const InfoIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);

const CheckIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notificaciones, setNotificaciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Cerrar al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Cargar notificaciones
    const cargarNotificaciones = async () => {
        try {
            const data = await notificacionService.obtenerNotificaciones({ limite: 10 });
            setNotificaciones(data.data || []);
        } catch (error) {
            console.error('Error cargando notificaciones:', error);
        }
    };

    // Efecto inicial y polling
    useEffect(() => {
        cargarNotificaciones();
        // Polling cada 30 segundos
        const interval = setInterval(cargarNotificaciones, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            cargarNotificaciones(); // Recargar al abrir
        }
    };

    const handleMarcarLeida = async (id, idDenuncia) => {
        try {
            await notificacionService.marcarComoLeida(id);
            // Actualizar estado local
            setNotificaciones(prev =>
                prev.map(n => n._id === id ? { ...n, leida: true } : n)
            );

            // Navegar a la denuncia si existe
            if (idDenuncia) {
                setIsOpen(false);
                navigate(`/denuncias/${idDenuncia._id || idDenuncia}`);
            }
        } catch (error) {
            console.error('Error marcando leída:', error);
        }
    };

    const handleMarcarTodasLeidas = async () => {
        try {
            await notificacionService.marcarTodasLeidas();
            setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
        } catch (error) {
            console.error('Error marcando todas:', error);
        }
    };

    const noLeidas = notificaciones.filter(n => !n.leida).length;

    const getIcon = (tipo) => {
        switch (tipo) {
            case 'SUCCESS': return <CheckIcon />;
            case 'WARNING': return <InfoIcon />; // Puedes cambiar por otro
            case 'ERROR': return <InfoIcon />; // Puedes cambiar por otro
            default: return <InfoIcon />;
        }
    };

    const getIconClass = (tipo) => {
        switch (tipo) {
            case 'SUCCESS': return styles.iconSuccess;
            case 'WARNING': return styles.iconWarning;
            case 'ERROR': return styles.iconError;
            default: return styles.iconInfo;
        }
    };

    return (
        <div className={styles.container} ref={dropdownRef}>
            <button
                className={`${styles.bellButton} ${isOpen ? styles.active : ''}`}
                onClick={handleToggle}
                aria-label="Notificaciones"
            >
                <BellIcon />
                {noLeidas > 0 && (
                    <span className={styles.badge}>
                        {noLeidas > 9 ? '9+' : noLeidas}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    <div className={styles.header}>
                        <span className={styles.title}>Notificaciones</span>
                        {noLeidas > 0 && (
                            <button className={styles.markAll} onClick={handleMarcarTodasLeidas}>
                                Marcar todas leídas
                            </button>
                        )}
                    </div>

                    <div className={styles.list}>
                        {notificaciones.length === 0 ? (
                            <div className={styles.emptyState}>
                                <BellIcon className={styles.emptyIcon} />
                                <p>No tienes notificaciones</p>
                            </div>
                        ) : (
                            notificaciones.map(notif => (
                                <div
                                    key={notif._id}
                                    className={`${styles.item} ${!notif.leida ? styles.unread : ''}`}
                                    onClick={() => handleMarcarLeida(notif._id, notif.id_denuncia)}
                                >
                                    <div className={`${styles.iconContainer} ${getIconClass(notif.tipo)}`}>
                                        {getIcon(notif.tipo)}
                                    </div>
                                    <div className={styles.content}>
                                        <p className={styles.itemTitle}>{notif.titulo}</p>
                                        <p className={styles.itemMessage}>{notif.mensaje}</p>
                                        <span className={styles.time}>
                                            {formatDistanceToNow(new Date(notif.fecha_creacion), { addSuffix: true, locale: es })}
                                        </span>
                                    </div>
                                    {!notif.leida && <div className={styles.unreadIndicator} />}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
