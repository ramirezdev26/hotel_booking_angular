/**
 * Archivo central de rutas - Exporta todas las rutas de la API
 * Este archivo actúa como un barrel export pattern para simplificar
 * las importaciones en el archivo principal de la aplicación
 */

// import authRoutes from './authRoutes.js';
import hotelRoutes from './hotelRoutes.js';
import roomTypeRoutes from './roomTypeRoutes.js';
// import bookingRoutes from './bookingRoutes.js';
// import userRoutes from './userRoutes.js';

/**
 * Función para configurar todas las rutas de la API
 * @param {Express} app - Instancia de la aplicación Express
 */
export const setupRoutes = (app) => {
  // Rutas de autenticación
  // app.use('/api/auth', authRoutes);
  //
  // Rutas de hoteles
  app.use('/api/hotels', hotelRoutes);
  //
  // Rutas de tipos de habitaciones
  app.use('/api/rooms', roomTypeRoutes);
  //
  // // Rutas de reservas
  // app.use('/api/bookings', bookingRoutes);
  //
  // // Rutas de usuarios
  // app.use('/api/users', userRoutes);
  //
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Hotel Booking API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });
};

// Exportación por defecto para compatibilidad
export default setupRoutes;
