import RoomTypeUseCases from '../../domain/usecases/RoomTypeUseCases.js';
import MongoRoomTypeRepository from '../../infrastructure/repositories/MongoRoomTypeRepository.js';
import MongoHotelRepository from '../../infrastructure/repositories/MongoHotelRepository.js';
import {
  createRoomTypeValidator,
  updateRoomTypeValidator,
  searchRoomTypesValidator,
  checkAvailabilityValidator,
  updatePricingValidator,
  roomTypeIdValidator,
  queryParamsValidator,
  validateCapacityConsistency
} from '../../shared/validators/roomTypeValidators.js';

/**
 * Controlador para operaciones con tipos de habitación
 */
class RoomTypeController {
  constructor() {
    this.roomTypeRepository = new MongoRoomTypeRepository();
    this.hotelRepository = new MongoHotelRepository();
    this.roomTypeUseCases = new RoomTypeUseCases(
      this.roomTypeRepository,
      this.hotelRepository
    );
  }

  /**
   * Crear un nuevo tipo de habitación
   */
  async createRoomType(req, res, next) {
    try {
      // Validar datos de entrada
      const { error, value } = createRoomTypeValidator.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        });
      }

      // Validar consistencia de capacidad
      if (value.capacity) {
        validateCapacityConsistency(value.capacity);
      }

      // Crear tipo de habitación
      const roomType = await this.roomTypeUseCases.createRoomType(value);

      res.status(201).json({
        success: true,
        message: 'Room type created successfully',
        data: roomType
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener todos los tipos de habitación con filtros
   */
  async getAllRoomTypes(req, res, next) {
    try {
      // Validar query parameters
      const { error, value } = queryParamsValidator.validate(req.query);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid query parameters',
          errors: error.details.map(detail => detail.message)
        });
      }

      const result = await this.roomTypeUseCases.getAllRoomTypes(value);

      res.status(200).json({
        success: true,
        message: 'Room types retrieved successfully',
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener un tipo de habitación por ID
   */
  async getRoomTypeById(req, res, next) {
    try {
      // Validar ID
      const { error, value } = roomTypeIdValidator.validate(req.params);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid room type ID',
          errors: error.details.map(detail => detail.message)
        });
      }

      const roomType = await this.roomTypeUseCases.getRoomTypeById(value.id);

      res.status(200).json({
        success: true,
        message: 'Room type retrieved successfully',
        data: roomType
      });
    } catch (error) {
      if (error.message === 'Room type not found') {
        return res.status(404).json({
          success: false,
          message: 'Room type not found'
        });
      }
      next(error);
    }
  }

  /**
   * Obtener tipos de habitación por hotel
   */
  async getRoomTypesByHotel(req, res, next) {
    try {
      const hotelId = req.params.hotelId;

      // Validar hotel ID
      if (!/^[0-9a-fA-F]{24}$/.test(hotelId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid hotel ID format'
        });
      }

      const { error, value } = queryParamsValidator.validate(req.query);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid query parameters',
          errors: error.details.map(detail => detail.message)
        });
      }

      const roomTypes = await this.roomTypeUseCases.getRoomTypesByHotel(hotelId, value);

      res.status(200).json({
        success: true,
        message: 'Hotel room types retrieved successfully',
        data: roomTypes
      });
    } catch (error) {
      if (error.message === 'Hotel not found') {
        return res.status(404).json({
          success: false,
          message: 'Hotel not found'
        });
      }
      next(error);
    }
  }

  /**
   * Actualizar un tipo de habitación
   */
  async updateRoomType(req, res, next) {
    try {
      // Validar ID
      const { error: idError, value: idValue } = roomTypeIdValidator.validate(req.params);
      if (idError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid room type ID',
          errors: idError.details.map(detail => detail.message)
        });
      }

      // Validar datos de actualización
      const { error, value } = updateRoomTypeValidator.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        });
      }

      // Validar consistencia de capacidad si se proporciona
      if (value.capacity) {
        validateCapacityConsistency(value.capacity);
      }

      const updatedRoomType = await this.roomTypeUseCases.updateRoomType(idValue.id, value);

      res.status(200).json({
        success: true,
        message: 'Room type updated successfully',
        data: updatedRoomType
      });
    } catch (error) {
      if (error.message === 'Room type not found') {
        return res.status(404).json({
          success: false,
          message: 'Room type not found'
        });
      }
      if (error.message === 'Hotel not found') {
        return res.status(404).json({
          success: false,
          message: 'Hotel not found'
        });
      }
      next(error);
    }
  }

  /**
   * Eliminar un tipo de habitación (soft delete)
   */
  async deleteRoomType(req, res, next) {
    try {
      // Validar ID
      const { error, value } = roomTypeIdValidator.validate(req.params);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid room type ID',
          errors: error.details.map(detail => detail.message)
        });
      }

      await this.roomTypeUseCases.deleteRoomType(value.id);

      res.status(200).json({
        success: true,
        message: 'Room type deleted successfully'
      });
    } catch (error) {
      if (error.message === 'Room type not found') {
        return res.status(404).json({
          success: false,
          message: 'Room type not found'
        });
      }
      next(error);
    }
  }

  /**
   * Verificar disponibilidad de un tipo de habitación
   */
  async checkAvailability(req, res, next) {
    try {
      // Validar datos
      const { error, value } = checkAvailabilityValidator.validate({
        roomTypeId: req.params.id,
        ...req.body
      });

      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        });
      }

      const availability = await this.roomTypeUseCases.checkAvailability(
        value.roomTypeId,
        value.checkInDate,
        value.checkOutDate
      );

      res.status(200).json({
        success: true,
        message: 'Availability checked successfully',
        data: availability
      });
    } catch (error) {
      if (error.message === 'Room type not found') {
        return res.status(404).json({
          success: false,
          message: 'Room type not found'
        });
      }
      next(error);
    }
  }

  /**
   * Actualizar precios de un tipo de habitación
   */
  async updatePricing(req, res, next) {
    try {
      // Validar ID
      const { error: idError, value: idValue } = roomTypeIdValidator.validate(req.params);
      if (idError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid room type ID',
          errors: idError.details.map(detail => detail.message)
        });
      }

      // Validar datos de pricing
      const { error, value } = updatePricingValidator.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        });
      }

      const updatedRoomType = await this.roomTypeUseCases.updatePricing(idValue.id, value);

      res.status(200).json({
        success: true,
        message: 'Room type pricing updated successfully',
        data: updatedRoomType
      });
    } catch (error) {
      if (error.message === 'Room type not found') {
        return res.status(404).json({
          success: false,
          message: 'Room type not found'
        });
      }
      next(error);
    }
  }

  /**
   * Buscar tipos de habitación con criterios específicos
   */
  async searchRoomTypes(req, res, next) {
    try {
      // Validar criterios de búsqueda
      const { error, value } = searchRoomTypesValidator.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        });
      }

      const roomTypes = await this.roomTypeUseCases.searchRoomTypes(value);

      res.status(200).json({
        success: true,
        message: 'Room types search completed successfully',
        data: roomTypes,
        searchCriteria: value
      });
    } catch (error) {
      next(error);
    }
  }
}

export default RoomTypeController;
