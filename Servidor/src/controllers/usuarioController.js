import bcrypt from 'bcrypt';
import Usuario from '../models/Usuario.js';

class UsuarioController {
  // Obtener perfil del usuario autenticado
  static async obtenerPerfil(req, res) {
    try {
      const { id_usuario } = req.usuario; // Viene del middleware de autenticación

      const usuario = await Usuario.buscarPorId(id_usuario);
      
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Convertir documento de Mongoose a objeto plano e incluir virtuals
      const perfilUsuario = usuario.toObject();
      
      // Remover información sensible
      delete perfilUsuario.password_hash;

      res.json({
        success: true,
        data: perfilUsuario,
        message: 'Perfil obtenido exitosamente'
      });

    } catch (error) {
      console.error('Error al obtener perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Actualizar perfil del usuario
  static async actualizarPerfil(req, res) {
    try {
      const { id_usuario, id_tipo_usuario } = req.usuario;
      const { 
        nombres, 
        apellidos, 
        telefono, 
        direccion_registro,
        email,
        documento_identidad,
        cargo,
        area_responsabilidad,
        numero_empleado
      } = req.body;

      // Validar que el usuario existe
      const usuarioExiste = await Usuario.buscarPorId(id_usuario);
      if (!usuarioExiste) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Validar email si se proporciona (no debe existir en otro usuario)
      if (email && email !== usuarioExiste.email) {
        const emailExiste = await Usuario.emailExisteParaOtroUsuario(email, id_usuario);
        if (emailExiste) {
          return res.status(409).json({
            success: false,
            message: 'El email ya está en uso por otro usuario'
          });
        }
      }

      // Validar documento si se proporciona (no debe existir en otro usuario)
      if (documento_identidad && documento_identidad !== usuarioExiste.documento_identidad) {
        const documentoExiste = await Usuario.documentoExisteParaOtroUsuario(documento_identidad, id_usuario);
        if (documentoExiste) {
          return res.status(409).json({
            success: false,
            message: 'El número de documento ya está en uso por otro usuario'
          });
        }
      }

      // Validar número de empleado si se proporciona (solo para autoridades)
      if (numero_empleado && id_tipo_usuario === 2) {
        if (numero_empleado !== usuarioExiste.numero_empleado) {
          const numeroExiste = await Usuario.numeroEmpleadoExisteParaOtroUsuario(numero_empleado, id_usuario);
          if (numeroExiste) {
            return res.status(409).json({
              success: false,
              message: 'El número de empleado ya está en uso por otro usuario'
            });
          }
        }
      }

      // Preparar datos de actualización
      const datosActualizacion = {};
      if (nombres !== undefined) datosActualizacion.nombres = nombres;
      if (apellidos !== undefined) datosActualizacion.apellidos = apellidos;
      if (telefono !== undefined) datosActualizacion.telefono = telefono || null;
      if (direccion_registro !== undefined) datosActualizacion.direccion_registro = direccion_registro || null;
      if (email !== undefined) datosActualizacion.email = email.toLowerCase();
      if (documento_identidad !== undefined) datosActualizacion.documento_identidad = documento_identidad;
      
      // Campos específicos de autoridad
      if (id_tipo_usuario === 2) {
        if (cargo !== undefined) datosActualizacion.cargo = cargo || null;
        if (area_responsabilidad !== undefined) datosActualizacion.area_responsabilidad = area_responsabilidad || null;
        if (numero_empleado !== undefined) datosActualizacion.numero_empleado = numero_empleado || null;
      }

      // Actualizar perfil usando el método del modelo
      const actualizado = await Usuario.actualizar(id_usuario, datosActualizacion);

      if (!actualizado) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo actualizar el perfil'
        });
      }

      // Obtener usuario actualizado
      const usuarioActualizado = await Usuario.buscarPorId(id_usuario);
      const { password_hash, ...perfilActualizado } = usuarioActualizado.toObject();

      res.json({
        success: true,
        data: perfilActualizado,
        message: 'Perfil actualizado exitosamente'
      });

    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Cambiar contraseña
  static async cambiarPassword(req, res) {
    try {
      const { id_usuario } = req.usuario;
      const { password_actual, password_nuevo } = req.body;

      // Obtener usuario y contraseña actual
      const usuario = await Usuario.buscarPorId(id_usuario).select('password_hash');
      
      if (!usuario || !usuario.password_hash) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado o no tiene contraseña configurada'
        });
      }

      const passwordHashActual = usuario.password_hash;

      // Verificar contraseña actual
      const passwordValida = await bcrypt.compare(password_actual, passwordHashActual);
      
      if (!passwordValida) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña actual es incorrecta'
        });
      }

      // Hashear nueva contraseña
      const nuevoPasswordHash = await bcrypt.hash(password_nuevo, 10);

      // Actualizar contraseña
      const actualizado = await Usuario.cambiarPassword(id_usuario, nuevoPasswordHash);

      if (!actualizado) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo cambiar la contraseña'
        });
      }

      res.json({
        success: true,
        message: 'Contraseña cambiada exitosamente'
      });

    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtener historial de actividad del usuario
  static async obtenerHistorialActividad(req, res) {
    try {
      const { id_usuario } = req.usuario;
      const limite = parseInt(req.query.limite) || 10;

      const historial = await Usuario.obtenerHistorialActividad(id_usuario, limite);

      res.json({
        success: true,
        data: historial,
        message: 'Historial obtenido exitosamente'
      });

    } catch (error) {
      console.error('Error al obtener historial:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}

export default UsuarioController;