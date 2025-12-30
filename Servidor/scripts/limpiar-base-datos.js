/**
 * Script para limpiar la base de datos
 * Elimina usuarios y denuncias, manteniendo categorías y estados
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Modelos
import Usuario from '../src/models/Usuario.js';
import Denuncia from '../src/models/Denuncia.js';
import Comentario from '../src/models/Comentario.js';
import EvidenciaFoto from '../src/models/EvidenciaFoto.js';
import HistorialEstado from '../src/models/HistorialEstado.js';
import Notificacion from '../src/models/Notificacion.js';
import PasswordResetToken from '../src/models/PasswordResetToken.js';

const limpiarBaseDatos = async () => {
  try {
    console.log('🔌 Conectando a MongoDB...');
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/denuncias_db';

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    console.log('⚠️  ADVERTENCIA: Esta operación eliminará todos los usuarios y denuncias.');
    console.log('⚠️  Categorías y Estados se mantendrán intactos.\n');

    // Contar documentos antes de eliminar
    const conteos = {
      usuarios: await Usuario.countDocuments(),
      denuncias: await Denuncia.countDocuments(),
      comentarios: await Comentario.countDocuments(),
      evidencias: await EvidenciaFoto.countDocuments(),
      historial: await HistorialEstado.countDocuments(),
      notificaciones: await Notificacion.countDocuments(),
      tokens: await PasswordResetToken.countDocuments()
    };

    console.log('📊 Estado actual de la base de datos:');
    console.log(`   - Usuarios: ${conteos.usuarios}`);
    console.log(`   - Denuncias: ${conteos.denuncias}`);
    console.log(`   - Comentarios: ${conteos.comentarios}`);
    console.log(`   - Evidencias: ${conteos.evidencias}`);
    console.log(`   - Historial Estados: ${conteos.historial}`);
    console.log(`   - Notificaciones: ${conteos.notificaciones}`);
    console.log(`   - Tokens Reset: ${conteos.tokens}\n`);

    console.log('🗑️  Eliminando datos...\n');

    // Eliminar en orden (respetando relaciones)
    console.log('1️⃣  Eliminando tokens de reset de contraseña...');
    await PasswordResetToken.deleteMany({});
    console.log('   ✅ Tokens eliminados\n');

    console.log('2️⃣  Eliminando notificaciones...');
    await Notificacion.deleteMany({});
    console.log('   ✅ Notificaciones eliminadas\n');

    console.log('3️⃣  Eliminando comentarios...');
    await Comentario.deleteMany({});
    console.log('   ✅ Comentarios eliminados\n');

    console.log('4️⃣  Eliminando historial de estados...');
    await HistorialEstado.deleteMany({});
    console.log('   ✅ Historial eliminado\n');

    console.log('5️⃣  Eliminando evidencias fotográficas...');
    await EvidenciaFoto.deleteMany({});
    console.log('   ✅ Evidencias eliminadas\n');

    console.log('6️⃣  Eliminando denuncias...');
    await Denuncia.deleteMany({});
    console.log('   ✅ Denuncias eliminadas\n');

    console.log('7️⃣  Eliminando usuarios...');
    await Usuario.deleteMany({});
    console.log('   ✅ Usuarios eliminados\n');

    // Verificar limpieza
    const nuevosConteos = {
      usuarios: await Usuario.countDocuments(),
      denuncias: await Denuncia.countDocuments(),
      comentarios: await Comentario.countDocuments(),
      evidencias: await EvidenciaFoto.countDocuments(),
      historial: await HistorialEstado.countDocuments(),
      notificaciones: await Notificacion.countDocuments(),
      tokens: await PasswordResetToken.countDocuments()
    };

    console.log('✅ LIMPIEZA COMPLETADA\n');
    console.log('📊 Estado final de la base de datos:');
    console.log(`   - Usuarios: ${nuevosConteos.usuarios}`);
    console.log(`   - Denuncias: ${nuevosConteos.denuncias}`);
    console.log(`   - Comentarios: ${nuevosConteos.comentarios}`);
    console.log(`   - Evidencias: ${nuevosConteos.evidencias}`);
    console.log(`   - Historial Estados: ${nuevosConteos.historial}`);
    console.log(`   - Notificaciones: ${nuevosConteos.notificaciones}`);
    console.log(`   - Tokens Reset: ${nuevosConteos.tokens}\n`);

    console.log('ℹ️  Categorías y Estados se mantuvieron sin cambios.');
    console.log('✨ Base de datos limpiada exitosamente!\n');

  } catch (error) {
    console.error('❌ Error al limpiar la base de datos:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Desconectado de MongoDB');
    process.exit(0);
  }
};

// Ejecutar script
limpiarBaseDatos();
