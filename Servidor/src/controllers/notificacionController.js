/**
 * Controlador para gestión de Notificaciones
 */
import Notificacion from '../models/Notificacion.js';

class NotificacionController {
    /**
     * Obtener notificaciones del usuario autenticado
     * GET /api/v1/notificaciones
     */
    static async obtenerNotificaciones(req, res) {
        try {
            const { id_usuario } = req.usuario;
            const { solo_no_leidas, limite } = req.query;

            const notificaciones = await Notificacion.obtenerPorUsuario(
                id_usuario,
                solo_no_leidas === 'true',
                parseInt(limite) || 20
            );

            res.status(200).json({
                success: true,
                data: notificaciones
            });
        } catch (error) {
            console.error('Error al obtener notificaciones:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener notificaciones'
            });
        }
    }

    /**
     * Marcar notificación como leída
     * PUT /api/v1/notificaciones/:id/leer
     */
    static async marcarComoLeida(req, res) {
        try {
            const { id_usuario } = req.usuario;
            const { id } = req.params;

            const notificacion = await Notificacion.marcarComoLeida(id, id_usuario);

            if (!notificacion) {
                return res.status(404).json({
                    success: false,
                    message: 'Notificación no encontrada o no pertenece al usuario'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Notificación marcada como leída',
                data: notificacion
            });
        } catch (error) {
            console.error('Error al marcar notificación como leída:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar notificación'
            });
        }
    }

    /**
     * Marcar todas las notificaciones como leídas
     * PUT /api/v1/notificaciones/leer-todas
     */
    static async marcarTodasComoLeidas(req, res) {
        try {
            const { id_usuario } = req.usuario;

            const count = await Notificacion.marcarTodasComoLeidas(id_usuario);

            res.status(200).json({
                success: true,
                message: 'Todas las notificaciones marcadas como leídas',
                data: { count }
            });
        } catch (error) {
            console.error('Error al marcar todas como leídas:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar notificaciones'
            });
        }
    }
}

export default NotificacionController;
