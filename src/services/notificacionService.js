import api from './api';

const notificacionService = {
    // Obtener todas las notificaciones
    obtenerNotificaciones: async (filtros = {}) => {
        try {
            const params = new URLSearchParams(filtros).toString();
            const response = await api.get(`/notificaciones?${params}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Marcar una notificación como leída
    marcarComoLeida: async (id) => {
        try {
            const response = await api.put(`/notificaciones/${id}/leer`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Marcar todas las notificaciones como leídas
    marcarTodasLeidas: async () => {
        try {
            const response = await api.put('/notificaciones/leer-todas');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default notificacionService;
