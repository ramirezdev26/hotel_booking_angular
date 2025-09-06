/**
 * Archivo central de rutas - Exporta todas las rutas de la API
 * Este archivo actúa como un barrel export pattern para simplificar
 * las importaciones en el archivo principal de la aplicación
 */

import hotelRoutes from './hotelRoutes.js';
import roomTypeRoutes from './roomTypeRoutes.js';
import bookingRoutes from './bookingRoutes.js';

/**
 * Función para configurar todas las rutas de la API
 * @param {Express} app - Instancia de la aplicación Express
 * @param {Object} auth - Middleware de autenticación
 */
export const setupRoutes = (app, auth) => {
  app.get('/api/auth/login', (req, res) => {
    res.redirect('/');
  });

  app.get('/api/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Hotel Booking API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });
  
  app.use('/api/hotels', hotelRoutes(auth));
  
  app.use('/api/rooms', roomTypeRoutes(auth));
  
  app.use('/api/bookings', bookingRoutes(auth));
};

export default setupRoutes;
