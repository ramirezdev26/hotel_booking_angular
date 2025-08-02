/**
 * Rutas para endpoints de hoteles
 * Define las rutas HTTP y conecta con los controladores y validadores
 */

import express from 'express';
import {
  createHotel,
  getAllHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
  searchHotels,
  searchAvailableRooms,
  quickSearchRooms
} from '../controllers/hotelController.js';

import {
  createHotelValidator,
  updateHotelValidator,
  queryHotelsValidator,
  searchHotelsValidator,
  hotelIdValidator,
  validateRequest
} from '../../shared/validators/hotelValidators.js';

/**
 * Configuración de rutas de hoteles con autenticación
 * @param {Object} auth - Middleware de autenticación
 * @returns {express.Router} Router configurado
 */
const hotelRoutes = (auth) => {
  const router = express.Router();

  /**
   * @route   GET /api/hotels
   * @desc    Obtener todos los hoteles con filtros y paginación
   * @access  Public
   * @query   page, limit, city, country, minRating, amenities, search, sort
   */
  router.get('/',
    validateRequest(queryHotelsValidator, 'query'),
    getAllHotels
  );

  /**
   * @route   GET /api/hotels/:id
   * @desc    Obtener hotel específico por ID
   * @access  Public
   * @param   id - ObjectId del hotel
   */
  router.get('/:id',
    validateRequest(hotelIdValidator, 'params'),
    getHotelById
  );

  /**
   * @route   POST /api/hotels
   * @desc    Crear un nuevo hotel
   * @access  Private (requiere autenticación)
   * @body    Hotel data según createHotelValidator
   */
  router.post('/',
    auth.protect(), // Proteger con autenticación
    validateRequest(createHotelValidator, 'body'),
    createHotel
  );

  /**
   * @route   POST /api/hotels/search
   * @desc    Buscador de habitaciones disponibles (Actividad 4)
   * @access  Public
   * @body    location, numberOfGuests, priceRange, checkInDate, checkOutDate, amenities, sortBy, page, limit
   */
  router.post('/search', searchAvailableRooms);

  /**
   * @route   GET /api/hotels/search
   * @desc    Búsqueda rápida de habitaciones via query parameters
   * @access  Public
   * @query   location, numberOfGuests, minPrice, maxPrice, checkInDate, checkOutDate, amenities, sortBy, page, limit
   */
  router.get('/search/fast', quickSearchRooms);

  /**
   * @route   PUT /api/hotels/:id
   * @desc    Actualizar hotel completo
   * @access  Private (requiere autenticación y autorización)
   * @param   id - ObjectId del hotel
   * @body    Hotel data según updateHotelValidator
   */
  router.put('/:id',
    auth.protect(), // Proteger con autenticación
    validateRequest(hotelIdValidator, 'params'),
    validateRequest(updateHotelValidator, 'body'),
    updateHotel
  );

  /**
   * @route   DELETE /api/hotels/:id
   * @desc    Eliminar hotel (soft delete)
   * @access  Private (requiere autenticación y autorización)
   * @param   id - ObjectId del hotel
   */
  router.delete('/:id',
    auth.protect(), // Proteger con autenticación
    validateRequest(hotelIdValidator, 'params'),
    deleteHotel
  );

  return router;
};

export default hotelRoutes;
