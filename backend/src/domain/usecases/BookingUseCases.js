/**
 * Casos de uso para Bookings
 * Contiene la lógica de negocio para operaciones de reservas
 */

import { Booking } from '../entities/Booking.js';
import logger from '../../shared/utils/logger.js';

export default class BookingUseCases {
  constructor(bookingRepository, hotelRepository, roomTypeRepository) {
    this.bookingRepository = bookingRepository;
    this.hotelRepository = hotelRepository;
    this.roomTypeRepository = roomTypeRepository;
  }

  /**
   * Crear una nueva reserva
   */
  async createBooking(bookingData) {
    try {
      logger.info('Iniciando proceso de creación de reserva', { bookingData });

      const booking = new Booking(bookingData);
      const validation = booking.validate();

      if (!validation.isValid) {
        logger.warn('Datos de reserva inválidos', { errors: validation.errors });
        return {
          success: false,
          errors: validation.errors
        };
      }

      const hotel = await this.hotelRepository.findById(bookingData.hotelId);
      if (!hotel) {
        return {
          success: false,
          errors: ['Hotel no encontrado']
        };
      }

      const roomType = await this.roomTypeRepository.findById(bookingData.roomTypeId);
      if (!roomType) {
        return {
          success: false,
          errors: ['Tipo de habitación no encontrado']
        };
      }

      if (bookingData.numberOfGuests > roomType.maxOccupancy) {
        return {
          success: false,
          errors: [`La habitación solo permite ${roomType.maxOccupancy} huéspedes máximo`]
        };
      }

      const createdBooking = await this.bookingRepository.create(bookingData);

      logger.info('Reserva creada exitosamente', { bookingId: createdBooking.id });

      return {
        success: true,
        data: createdBooking,
        message: 'Reserva creada exitosamente'
      };

    } catch (error) {
      logger.error('Error en createBooking:', error);
      return {
        success: false,
        errors: ['Error interno del servidor'],
        error: error.message
      };
    }
  }

  /**
   * Obtener todas las reservas con filtros y paginación
   */
  async getAllBookings(filters = {}, pagination = {}) {
    try {
      logger.info('Obteniendo todas las reservas', { filters, pagination });

      const result = await this.bookingRepository.findAll(filters, pagination);

      return {
        success: true,
        data: result,
        message: 'Reservas obtenidas exitosamente'
      };

    } catch (error) {
      logger.error('Error en getAllBookings:', error);
      return {
        success: false,
        errors: ['Error al obtener reservas'],
        error: error.message
      };
    }
  }

  /**
   * Obtener reserva por ID
   */
  async getBookingById(id) {
    try {
      logger.info('Obteniendo reserva por ID', { bookingId: id });

      if (!id) {
        return {
          success: false,
          errors: ['ID de reserva es requerido']
        };
      }

      const booking = await this.bookingRepository.findById(id);

      if (!booking) {
        return {
          success: false,
          errors: ['Reserva no encontrada']
        };
      }

      return {
        success: true,
        data: booking,
        message: 'Reserva encontrada'
      };

    } catch (error) {
      logger.error('Error en getBookingById:', error);
      return {
        success: false,
        errors: ['Error al obtener reserva'],
        error: error.message
      };
    }
  }

  /**
   * Obtener reservas por email del huésped
   */
  async getBookingsByGuestEmail(email) {
    try {
      logger.info('Obteniendo reservas por email', { email });

      if (!email) {
        return {
          success: false,
          errors: ['Email es requerido']
        };
      }

      const bookings = await this.bookingRepository.findByGuestEmail(email);

      return {
        success: true,
        data: bookings,
        message: `${bookings.length} reservas encontradas`
      };

    } catch (error) {
      logger.error('Error en getBookingsByGuestEmail:', error);
      return {
        success: false,
        errors: ['Error al obtener reservas por email'],
        error: error.message
      };
    }
  }

  /**
   * Eliminar una reserva (hard delete)
   */
  async deleteBooking(id) {
    try {
      logger.info('Eliminando reserva', { bookingId: id });

      if (!id) {
        return {
          success: false,
          errors: ['ID de reserva es requerido']
        };
      }

      const deleted = await this.bookingRepository.delete(id);

      if (!deleted) {
        return {
          success: false,
          errors: ['Reserva no encontrada']
        };
      }

      return {
        success: true,
        message: 'Reserva eliminada exitosamente'
      };

    } catch (error) {
      logger.error('Error en deleteBooking:', error);
      return {
        success: false,
        errors: ['Error al eliminar reserva'],
        error: error.message
      };
    }
  }

  _canCancelBooking(booking) {
    const now = new Date();
    const checkInDate = new Date(booking.checkInDate);
    const hoursUntilCheckIn = (checkInDate - now) / (1000 * 60 * 60);

    if (hoursUntilCheckIn < 24) {
      return {
        allowed: false,
        reason: 'No se puede cancelar la reserva con menos de 24 horas de anticipación'
      };
    }

    return {
      allowed: true,
      reason: null
    };
  }
}
