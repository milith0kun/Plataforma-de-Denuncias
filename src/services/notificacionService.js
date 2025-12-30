import api from './api';

const notificacionService = {
    // Obtener todas las notificaciones
    obtenerNotificaciones: async (filtros = {}) => {
        try {
            const params = new URLSearchParams();
            
            // Agregar filtros válidos
            if (filtros.solo_no_leidas !== undefined) {
                params.append('solo_no_leidas', filtros.solo_no_leidas);
            }
            if (filtros.limite) {
                params.append('limite', filtros.limite);
            }

            const queryString = params.toString();
            const url = queryString ? `/notificaciones?${queryString}` : '/notificaciones';
            
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            console.error('Error al obtener notificaciones:', error);
            // Retornar estructura vacía en lugar de lanzar error para evitar romper la UI
            if (error.response?.status === 401) {
                throw error; // Re-lanzar errores de autenticación
            }
            return { success: false, data: [] };
        }
    },

    // Marcar una notificación como leída
    marcarComoLeida: async (id) => {
        try {
            if (!id) {
                throw new Error('ID de notificación requerido');
            }
            const response = await api.put(`/notificaciones/${id}/leer`);
            return response.data;
        } catch (error) {
            console.error('Error al marcar notificación como leída:', error);
            throw error;
        }
    },

    // Marcar todas las notificaciones como leídas
    marcarTodasLeidas: async () => {
        try {
            const response = await api.put('/notificaciones/leer-todas');
            return response.data;
        } catch (error) {
            console.error('Error al marcar todas las notificaciones como leídas:', error);
            throw error;
        }
    }
};

export default notificacionService;
