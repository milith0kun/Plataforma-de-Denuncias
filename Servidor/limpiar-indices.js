import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/denuncias_db';

async function limpiarIndices() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    const db = mongoose.connection.db;
    
    // Obtener todas las colecciones
    const collections = await db.listCollections().toArray();
    
    console.log('\n📋 Limpiando índices de todas las colecciones...\n');
    
    for (const collection of collections) {
      const collectionName = collection.name;
      console.log(`  Procesando: ${collectionName}`);
      
      try {
        // Obtener índices actuales
        const indexes = await db.collection(collectionName).indexes();
        console.log(`    Índices actuales: ${indexes.length}`);
        
        // Eliminar todos los índices excepto _id
        for (const index of indexes) {
          if (index.name !== '_id_') {
            await db.collection(collectionName).dropIndex(index.name);
            console.log(`    ✓ Eliminado: ${index.name}`);
          }
        }
      } catch (error) {
        console.log(`    ⚠️  Error: ${error.message}`);
      }
    }
    
    console.log('\n✅ Limpieza de índices completada');
    console.log('💡 Ahora puedes iniciar el servidor para que Mongoose recree los índices correctamente\n');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

limpiarIndices();
