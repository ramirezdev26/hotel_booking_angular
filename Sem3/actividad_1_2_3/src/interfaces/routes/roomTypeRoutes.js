import express from 'express';
import RoomTypeController from '../controllers/roomTypeController.js';

/**
 * Configuración de rutas de tipos de habitaciones con autenticación
 * @param {Object} auth - Middleware de autenticación
 * @returns {express.Router} Router configurado
 */
const roomTypeRoutes = (auth) => {
  const router = express.Router();
  const roomTypeController = new RoomTypeController();

  /**
   * @route GET /api/rooms
   * @desc Obtener todos los tipos de habitaciones con filtros opcionales
   * @access Public
   * @query {number} page - Número de página (default: 1)
   * @query {number} limit - Elementos por página (default: 10)
   * @query {string} hotelId - ID del hotel para filtrar
   * @query {boolean} availability - Filtrar por disponibilidad (default: true)
   * @query {string} sortBy - Campo de ordenamiento
   * @query {string} sortOrder - Orden (asc/desc)
   */
  router.get('/', async (req, res, next) => {
    await roomTypeController.getAllRoomTypes(req, res, next);
  });

  /**
   * @route GET /api/rooms/:id
   * @desc Obtener un tipo de habitación específico por ID
   * @access Public
   * @param {string} id - ID del tipo de habitación
   */
  router.get('/:id', async (req, res, next) => {
    await roomTypeController.getRoomTypeById(req, res, next);
  });

  /**
   * @route POST /api/rooms
   * @desc Crear un nuevo tipo de habitación
   * @access Private (hotel_admin, admin)
   * @body {Object} roomTypeData - Datos del tipo de habitación
   */
  router.post(
    '/',
    auth.protect(), // Proteger con autenticación
    async (req, res, next) => {
      await roomTypeController.createRoomType(req, res, next);
    }
  );

  /**
   * @route PUT /api/rooms/:id
   * @desc Actualizar un tipo de habitación completamente
   * @access Private (hotel_admin, admin)
   * @param {string} id - ID del tipo de habitación
   * @body {Object} roomTypeData - Datos actualizados del tipo de habitación
   */
  router.put(
    '/:id',
    auth.protect(), // Proteger con autenticación
    async (req, res, next) => {
      await roomTypeController.updateRoomType(req, res, next);
    }
  );

  /**
   * @route DELETE /api/rooms/:id
   * @desc Eliminar un tipo de habitación (soft delete)
   * @access Private (hotel_admin, admin)
   * @param {string} id - ID del tipo de habitación
   */
  router.delete(
    '/:id',
    auth.protect(), // Proteger con autenticación
    async (req, res, next) => {
      await roomTypeController.deleteRoomType(req, res, next);
    }
  );

  /**
   * @route GET /api/rooms/hotel/:hotelId
   * @desc Obtener todos los tipos de habitaciones de un hotel específico
   * @access Public
   * @param {string} hotelId - ID del hotel
   * @query {number} page - Número de página
   * @query {number} limit - Elementos por página
   */
  router.get('/hotel/:hotelId', async (req, res, next) => {
    await roomTypeController.getRoomTypesByHotel(req, res, next);
  });

  /**
   * @route POST /api/rooms/:id/availability
   * @desc Verificar disponibilidad de un tipo de habitación para fechas específicas
   * @access Public
   * @param {string} id - ID del tipo de habitación
   * @body {Date} checkInDate - Fecha de entrada
   * @body {Date} checkOutDate - Fecha de salida
   */
  router.post('/:id/availability', async (req, res, next) => {
    await roomTypeController.checkAvailability(req, res, next);
  });

  /**
   * @route PUT /api/rooms/:id/pricing
   * @desc Actualizar precios y promociones de un tipo de habitación
   * @access Private (hotel_admin, admin)
   * @param {string} id - ID del tipo de habitación
   * @body {Object} pricingData - Datos de precios y descuentos
   */
  router.put(
    '/:id/pricing',
    auth.protect(), // Proteger con autenticación
    async (req, res, next) => {
      await roomTypeController.updatePricing(req, res, next);
    }
  );

  /**
   * @route POST /api/rooms/search
   * @desc Búsqueda avanzada de tipos de habitaciones con múltiples criterios
   * @access Public
   * @body {Object} searchCriteria - Criterios de búsqueda
   */
  router.post('/search', async (req, res, next) => {
    await roomTypeController.searchRoomTypes(req, res, next);
  });

  return router;
};

export default roomTypeRoutes;
