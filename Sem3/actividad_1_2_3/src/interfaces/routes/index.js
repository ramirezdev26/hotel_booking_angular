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
 * @param {Object} auth - Middleware de autenticación
 */
export const setupRoutes = (app, auth) => {
  // Ruta para autenticación de Keycloak (login)
  app.get('/api/auth/login', (req, res) => {
    res.redirect('/');
  });

  // Health check endpoint (público)
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Hotel Booking API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Rutas de hoteles - GET endpoints sin protección, otros endpoints protegidos
  app.use('/api/hotels', hotelRoutes(auth));

  // Rutas de tipos de habitaciones - GET endpoints sin protección, otros endpoints protegidos
  app.use('/api/rooms', roomTypeRoutes(auth));

  // Otras rutas comentadas por ahora
  // app.use('/api/bookings', bookingRoutes);
  // app.use('/api/users', userRoutes);
};

// Exportación por defecto para compatibilidad
export default setupRoutes;
