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
        // Convertir id_usuario a ObjectId si es necesario
        const datosNormalizados = { ...datos };
        if (datosNormalizados.id_usuario) {
            datosNormalizados.id_usuario = mongoose.Types.ObjectId.isValid(datosNormalizados.id_usuario)
                ? new mongoose.Types.ObjectId(datosNormalizados.id_usuario)
                : datosNormalizados.id_usuario;
        }
        // Convertir id_denuncia a ObjectId si es necesario y existe
        if (datosNormalizados.id_denuncia) {
            datosNormalizados.id_denuncia = mongoose.Types.ObjectId.isValid(datosNormalizados.id_denuncia)
                ? new mongoose.Types.ObjectId(datosNormalizados.id_denuncia)
                : datosNormalizados.id_denuncia;
        }
        
        const notificacion = await this.create(datosNormalizados);
        return notificacion;
    } catch (error) {
        console.error('Error al crear notificación:', error);
        throw error;
    }
};

notificacionSchema.statics.obtenerPorUsuario = async function (id_usuario, soloNoLeidas = false, limite = 20) {
    try {
        // Convertir id_usuario a ObjectId si es necesario
        const usuarioId = mongoose.Types.ObjectId.isValid(id_usuario) 
            ? new mongoose.Types.ObjectId(id_usuario) 
            : id_usuario;

        const query = { id_usuario: usuarioId };
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
        // Convertir ids a ObjectId si es necesario
        const notificacionId = mongoose.Types.ObjectId.isValid(id_notificacion) 
            ? new mongoose.Types.ObjectId(id_notificacion) 
            : id_notificacion;
        const usuarioId = mongoose.Types.ObjectId.isValid(id_usuario) 
            ? new mongoose.Types.ObjectId(id_usuario) 
            : id_usuario;

        const notificacion = await this.findOneAndUpdate(
            { _id: notificacionId, id_usuario: usuarioId },
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
        // Convertir id_usuario a ObjectId si es necesario
        const usuarioId = mongoose.Types.ObjectId.isValid(id_usuario) 
            ? new mongoose.Types.ObjectId(id_usuario) 
            : id_usuario;

        const resultado = await this.updateMany(
            { id_usuario: usuarioId, leida: false },
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
