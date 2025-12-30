import { useEffect } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import './Toast.css';

/**
 * Componente Toast para notificaciones
 * @param {Object} props
 * @param {string} props.id - ID único de la notificación
 * @param {string} props.type - Tipo: 'success' | 'error' | 'warning' | 'info'
 * @param {string} props.message - Mensaje a mostrar
 * @param {number} props.duration - Duración en ms (default: 3000)
 * @param {Function} props.onClose - Callback al cerrar
 */
const Toast = ({ id, type = 'info', message, duration = 3000, onClose }) => {
  
  useEffect(() => {
    // Auto-cierre después de la duración especificada
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  // Configuración de iconos y clases según el tipo
  const toastConfig = {
    success: {
      icon: <CheckCircle size={20} />,
      className: 'toast-success'
    },
    error: {
      icon: <XCircle size={20} />,
      className: 'toast-error'
    },
    warning: {
      icon: <AlertTriangle size={20} />,
      className: 'toast-warning'
    },
    info: {
      icon: <Info size={20} />,
      className: 'toast-info'
    }
  };

  const config = toastConfig[type] || toastConfig.info;

  return (
    <div className={`toast ${config.className}`}>
      <div className="toast-icon">
        {config.icon}
      </div>
      <div className="toast-message">
        {message}
      </div>
      <button 
        className="toast-close"
        onClick={() => onClose(id)}
        aria-label="Cerrar notificación"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
