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
  searchHotels
} from '../controllers/hotelController.js';

import {
  createHotelValidator,
  updateHotelValidator,
  queryHotelsValidator,
  searchHotelsValidator,
  hotelIdValidator,
  validateRequest
} from '../../shared/validators/hotelValidators.js';

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
 * @access  Private (requiere autenticación - por implementar)
 * @body    Hotel data según createHotelValidator
 */
router.post('/',
  validateRequest(createHotelValidator, 'body'),
  createHotel
);

/**
 * @route   POST /api/hotels/search
 * @desc    Buscar hoteles por criterios específicos
 * @access  Public
 * @body    Search criteria según searchHotelsValidator
 */
router.post('/search',
  validateRequest(searchHotelsValidator, 'body'),
  searchHotels
);

/**
 * @route   PUT /api/hotels/:id
 * @desc    Actualizar hotel completo
 * @access  Private (requiere autenticación y autorización)
 * @param   id - ObjectId del hotel
 * @body    Hotel data según updateHotelValidator
 */
router.put('/:id',
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
  validateRequest(hotelIdValidator, 'params'),
  deleteHotel
);

export default router;
