/**
 * Configuración de conexión a MongoDB usando Mongoose
 * Maneja la conexión, reconexión y eventos de la base de datos
 */

import mongoose from 'mongoose';
import logger from '../../shared/utils/logger.js';

// Configuración de Mongoose
mongoose.set('strictQuery', false);

// Opciones de conexión optimizadas
const connectionOptions = {
  // Configuración de connection pool
  maxPoolSize: 10, // Máximo 10 conexiones en el pool
  serverSelectionTimeoutMS: 5000, // Timeout para selección de servidor
  socketTimeoutMS: 45000, // Timeout para operaciones de socket

  // Configuración de heartbeat
  heartbeatFrequencyMS: 10000, // Verificar conexión cada 10 segundos
  
  // Configuración de retry
  retryWrites: true,
  retryReads: true,
  
  // Configuración de compresión
  compressors: ['zlib']
};

/**
 * Función para conectar a MongoDB
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel-booking';

    logger.info('Conectando a MongoDB...', { uri: mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') });

    const connection = await mongoose.connect(mongoURI, connectionOptions);

    logger.info('MongoDB conectado exitosamente', {
      host: connection.connection.host,
      port: connection.connection.port,
      database: connection.connection.name
    });

    return connection;
  } catch (error) {
    logger.error('Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

// Event listeners para la conexión
mongoose.connection.on('connected', () => {
  logger.info('Mongoose conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
  logger.error('Error de conexión MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('Mongoose desconectado de MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    logger.info('Conexión MongoDB cerrada por terminación de la aplicación');
    process.exit(0);
  } catch (error) {
    logger.error('Error cerrando conexión MongoDB:', error);
    process.exit(1);
  }
});

export default connectDB;
