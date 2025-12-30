import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/common/Toast';

const NotificationContext = createContext();

/**
 * Hook personalizado para usar el contexto de notificaciones
 */
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification debe usarse dentro de NotificationProvider');
    }
    return context;
};

/**
 * Provider del contexto de notificaciones
 * Maneja el estado global de las notificaciones Toast
 */
export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    /**
     * Agregar una nueva notificación
     * @param {string} type - Tipo: 'success' | 'error' | 'warning' | 'info'
     * @param {string} message - Mensaje a mostrar
     * @param {number} duration - Duración en ms (default: 3000)
     */
    const addNotification = useCallback((type, message, duration = 3000) => {
        const id = Date.now() + Math.random();
        const newNotification = {
            id,
            type,
            message,
            duration
        };

        setNotifications(prev => [...prev, newNotification]);
    }, []);

    /**
     * Remover una notificación por ID
     * @param {number} id - ID de la notificación
     */
    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, []);

    /**
     * Métodos de utilidad para tipos específicos
     */
    const showSuccess = useCallback((message, duration) => {
        addNotification('success', message, duration);
    }, [addNotification]);

    const showError = useCallback((message, duration) => {
        addNotification('error', message, duration);
    }, [addNotification]);

    const showWarning = useCallback((message, duration) => {
        addNotification('warning', message, duration);
    }, [addNotification]);

    const showInfo = useCallback((message, duration) => {
        addNotification('info', message, duration);
    }, [addNotification]);

    const value = {
        showSuccess,
        showError,
        showWarning,
        showInfo,
        // Exponer también el método genérico
        addNotification,
        removeNotification
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}

            {/* Contenedor de Toasts */}
            <div className="toast-container">
                {notifications.map(notification => (
                    <Toast
                        key={notification.id}
                        id={notification.id}
                        type={notification.type}
                        message={notification.message}
                        duration={notification.duration}
                        onClose={removeNotification}
                    />
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

export default NotificationContext;
