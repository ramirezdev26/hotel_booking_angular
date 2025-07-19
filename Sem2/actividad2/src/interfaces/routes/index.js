/**
 * Archivo central de rutas - Exporta todas las rutas de la API
 * Este archivo actúa como un barrel export pattern para simplificar
 * las importaciones en el archivo principal de la aplicación
 */

// import authRoutes from './authRoutes.js';
// import hotelRoutes from './hotelRoutes.js';
// import roomRoutes from './roomRoutes.js';
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
  // // Rutas de hoteles
  // app.use('/api/hotels', hotelRoutes);
  //
  // // Rutas de habitaciones
  // app.use('/api/rooms', roomRoutes);
  //
  // // Rutas de reservas
  // app.use('/api/bookings', bookingRoutes);
  //
  // // Rutas de usuarios
  // app.use('/api/users', userRoutes);
};

// Exportación por defecto para compatibilidad
