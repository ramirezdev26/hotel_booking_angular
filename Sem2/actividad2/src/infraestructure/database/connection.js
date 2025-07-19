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
  compressors: ['zlib'],
  
  // Configuración de autenticación
  authSource: process.env.MONGO_AUTH_SOURCE || 'admin'
};

/**
 * Establece conexión con MongoDB
 */
const connectDB = async () => {
  try {
    // Obtener URI de conexión desde variables de entorno
    const mongoURI = process.env.MONGODB_URI || 
                     process.env.MONGO_URI || 
                     'mongodb://localhost:27017/hotel_booking_dev';

    // Log del intento de conexión (sin mostrar credenciales)
    const sanitizedURI = mongoURI.replace(/\/\/[^@]*@/, '//***:***@');
    logger.info('Attempting to connect to MongoDB', { uri: sanitizedURI });

    // Establecer conexión
    const connection = await mongoose.connect(mongoURI, connectionOptions);

    logger.info('MongoDB connected successfully', {
      host: connection.connection.host,
      port: connection.connection.port,
      database: connection.connection.name,
      readyState: connection.connection.readyState
    });

    return connection;

  } catch (error) {
    logger.error('MongoDB connection failed', {
      error: error.message,
      stack: error.stack
    });
    
    // En desarrollo, esperar y reintentar
    if (process.env.NODE_ENV === 'development') {
      logger.info('Retrying connection in 5 seconds...');
      setTimeout(connectDB, 5000);
    } else {
      // En producción, terminar el proceso
      process.exit(1);
    }
  }
};

// Event listeners para la conexión
mongoose.connection.on('connected', () => {
  logger.info('MongoDB connection established');
});

mongoose.connection.on('error', (error) => {
  logger.error('MongoDB connection error', {
    error: error.message,
    stack: error.stack
  });
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB connection lost');
  
  // En producción, intentar reconectar
  if (process.env.NODE_ENV === 'production') {
    logger.info('Attempting to reconnect to MongoDB...');
    setTimeout(connectDB, 5000);
  }
});

mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB reconnected successfully');
});

// Exportar funciones
export default connectDB;
