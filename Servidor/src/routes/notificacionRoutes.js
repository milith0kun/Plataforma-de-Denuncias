import express from 'express';
import NotificacionController from '../controllers/notificacionController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Obtener notificaciones
router.get('/', NotificacionController.obtenerNotificaciones);

// Marcar como leída
router.put('/:id/leer', NotificacionController.marcarComoLeida);

// Marcar todas como leídas
router.put('/leer-todas', NotificacionController.marcarTodasComoLeidas);

export default router;
