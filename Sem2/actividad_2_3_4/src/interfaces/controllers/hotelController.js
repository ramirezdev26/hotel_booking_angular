/**
 * Controlador para endpoints de hoteles
 * Maneja las peticiones HTTP y coordina con los casos de uso
 */

import HotelUseCases from '../../domain/usecases/HotelUseCases.js';
import MongoHotelRepository from '../../infrastructure/repositories/MongoHotelRepository.js';
import logger from '../../shared/utils/logger.js';

export class HotelController {
  constructor() {
    this.hotelRepository = new MongoHotelRepository();
    this.hotelUseCases = new HotelUseCases(this.hotelRepository);
  }

  /**
   * Crear un nuevo hotel
   * POST /api/hotels
   */
  async createHotel(req, res, next) {
    try {
      logger.info('Creando nuevo hotel', { body: req.body });

      const result = await this.hotelUseCases.createHotel(req.body);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: 'Error al crear el hotel',
          errors: result.errors
        });
      }

      logger.info('Hotel creado exitosamente', { hotelId: result.data.id });

      res.status(201).json({
        success: true,
        message: 'Hotel creado exitosamente',
        data: result.data
      });
    } catch (error) {
      logger.error('Error en createHotel:', error);
      next(error);
    }
  }

  /**
   * Obtener todos los hoteles con filtros
   * GET /api/hotels
   */
  async getAllHotels(req, res, next) {
    try {
      logger.info('Obteniendo lista de hoteles', { query: req.query });

      const { page, limit, ...filters } = req.query;
      const pagination = { page, limit };

      const result = await this.hotelUseCases.getAllHotels(filters, pagination);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: 'Error al obtener hoteles',
          errors: result.errors
        });
      }

      res.status(200).json({
        success: true,
        message: 'Hoteles obtenidos exitosamente',
        data: result.data.hotels,
        pagination: result.data.pagination
      });
    } catch (error) {
      logger.error('Error en getAllHotels:', error);
      next(error);
    }
  }

  /**
   * Obtener hotel por ID
   * GET /api/hotels/:id
   */
  async getHotelById(req, res, next) {
    try {
      const { id } = req.params;
      logger.info('Obteniendo hotel por ID', { hotelId: id });

      const result = await this.hotelUseCases.getHotelById(id);

      if (!result.success) {
        const statusCode = result.errors.includes('Hotel no encontrado') ? 404 : 400;
        return res.status(statusCode).json({
          success: false,
          message: result.errors[0],
          errors: result.errors
        });
      }

      res.status(200).json({
        success: true,
        message: 'Hotel encontrado',
        data: result.data
      });
    } catch (error) {
      logger.error('Error en getHotelById:', error);
      next(error);
    }
  }

  /**
   * Actualizar hotel
   * PUT /api/hotels/:id
   */
  async updateHotel(req, res, next) {
    try {
      const { id } = req.params;
      logger.info('Actualizando hotel', { hotelId: id, body: req.body });

      const result = await this.hotelUseCases.updateHotel(id, req.body);

      if (!result.success) {
        const statusCode = result.errors.includes('Hotel no encontrado') ? 404 : 400;
        return res.status(statusCode).json({
          success: false,
          message: 'Error al actualizar el hotel',
          errors: result.errors
        });
      }

      logger.info('Hotel actualizado exitosamente', { hotelId: id });

      res.status(200).json({
        success: true,
        message: 'Hotel actualizado exitosamente',
        data: result.data
      });
    } catch (error) {
      logger.error('Error en updateHotel:', error);
      next(error);
    }
  }

  /**
   * Eliminar hotel (soft delete)
   * DELETE /api/hotels/:id
   */
  async deleteHotel(req, res, next) {
    try {
      const { id } = req.params;
      logger.info('Eliminando hotel', { hotelId: id });

      const result = await this.hotelUseCases.deleteHotel(id);

      if (!result.success) {
        const statusCode = result.errors.includes('Hotel no encontrado') ? 404 : 400;
        return res.status(statusCode).json({
          success: false,
          message: 'Error al eliminar el hotel',
          errors: result.errors
        });
      }

      logger.info('Hotel eliminado exitosamente', { hotelId: id });

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      logger.error('Error en deleteHotel:', error);
      next(error);
    }
  }

  /**
   * Buscar hoteles por criterios específicos
   * POST /api/hotels/search
   */
  async searchHotels(req, res, next) {
    try {
      logger.info('Buscando hoteles', { searchCriteria: req.body });

      const result = await this.hotelUseCases.searchHotels(req.body);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: 'Error en la búsqueda de hoteles',
          errors: result.errors
        });
      }

      res.status(200).json({
        success: true,
        message: 'Búsqueda completada exitosamente',
        data: result.data.hotels,
        searchCriteria: result.data.searchCriteria,
        resultsCount: result.data.resultsCount
      });
    } catch (error) {
      logger.error('Error en searchHotels:', error);
      next(error);
    }
  }
}

// Crear instancia del controlador
const hotelController = new HotelController();

// Exportar métodos con bind para mantener el contexto
export const createHotel = hotelController.createHotel.bind(hotelController);
export const getAllHotels = hotelController.getAllHotels.bind(hotelController);
export const getHotelById = hotelController.getHotelById.bind(hotelController);
export const updateHotel = hotelController.updateHotel.bind(hotelController);
export const deleteHotel = hotelController.deleteHotel.bind(hotelController);
export const searchHotels = hotelController.searchHotels.bind(hotelController);

export default hotelController;
