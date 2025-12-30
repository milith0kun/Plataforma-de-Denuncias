import mongoose from 'mongoose';

const notificacionSchema = new mongoose.Schema({
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    id_denuncia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Denuncia',
        default: null
    },
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    mensaje: {
        type: String,
        required: true,
        trim: true
    },
    tipo: {
        type: String,
        enum: ['INFO', 'SUCCESS', 'WARNING', 'ERROR'],
        default: 'INFO'
    },
    leida: {
        type: Boolean,
        default: false
    },
    fecha_creacion: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: { createdAt: 'fecha_creacion', updatedAt: false },
    collection: 'notificaciones'
});

// Índices para optimizar consultas
notificacionSchema.index({ id_usuario: 1, leida: 1 });
notificacionSchema.index({ fecha_creacion: -1 });

// Métodos estáticos
notificacionSchema.statics.crear = async function (datos) {
    try {
        const notificacion = await this.create(datos);
        return notificacion;
    } catch (error) {
        console.error('Error al crear notificación:', error);
        throw error;
    }
};

notificacionSchema.statics.obtenerPorUsuario = async function (id_usuario, soloNoLeidas = false, limite = 20) {
    try {
        const query = { id_usuario };
        if (soloNoLeidas) {
            query.leida = false;
        }

        return await this.find(query)
            .sort({ fecha_creacion: -1 })
            .limit(limite)
            .populate('id_denuncia', 'titulo')
            .lean();
    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        throw error;
    }
};

notificacionSchema.statics.marcarComoLeida = async function (id_notificacion, id_usuario) {
    try {
        const notificacion = await this.findOneAndUpdate(
            { _id: id_notificacion, id_usuario },
            { leida: true },
            { new: true }
        );
        return notificacion;
    } catch (error) {
        console.error('Error al marcar notificación como leída:', error);
        throw error;
    }
};

notificacionSchema.statics.marcarTodasComoLeidas = async function (id_usuario) {
    try {
        const resultado = await this.updateMany(
            { id_usuario, leida: false },
            { leida: true }
        );
        return resultado.modifiedCount;
    } catch (error) {
        console.error('Error al marcar todas las notificaciones como leídas:', error);
        throw error;
    }
};

const Notificacion = mongoose.model('Notificacion', notificacionSchema);

export default Notificacion;
