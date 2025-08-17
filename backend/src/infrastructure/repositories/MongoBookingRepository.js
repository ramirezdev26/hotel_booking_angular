/**
 * Implementación MongoDB del repositorio de Bookings
 * Maneja la persistencia de reservas en MongoDB usando Mongoose
 */

import BookingRepository from '../../domain/repositories/BookingRepository.js';
import { Booking as BookingEntity } from '../../domain/entities/Booking.js';
import BookingModel from '../database/models/Booking.js';
import logger from '../../shared/utils/logger.js';

export default class MongoBookingRepository extends BookingRepository {
  
  async create(bookingData) {
    try {
      logger.info('Creando nueva reserva', { bookingData });

      const booking = new BookingModel(bookingData);
      const savedBooking = await booking.save();
      
      logger.info('Reserva creada exitosamente', { bookingId: savedBooking._id });
      
      return this._mapToEntity(savedBooking);
    } catch (error) {
      logger.error('Error al crear reserva:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      logger.info('Buscando reserva por ID', { bookingId: id });

      const booking = await BookingModel.findById(id)
        .populate('hotelId', 'name address')
        .populate('roomTypeId', 'name pricePerNight');

      if (!booking) {
        logger.warn('Reserva no encontrada', { bookingId: id });
        return null;
      }

      return this._mapToEntity(booking);
    } catch (error) {
      logger.error('Error al buscar reserva por ID:', error);
      throw error;
    }
  }

  async findAll(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const skip = (page - 1) * limit;

      logger.info('Obteniendo todas las reservas', { filters, pagination });

      const query = this._buildQuery(filters);
      
      const [bookings, total] = await Promise.all([
        BookingModel.find(query)
          .populate('hotelId', 'name address')
          .populate('roomTypeId', 'name pricePerNight')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        BookingModel.countDocuments(query)
      ]);

      const mappedBookings = bookings.map(booking => this._mapToEntity(booking));

      return {
        bookings: mappedBookings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error al obtener todas las reservas:', error);
      throw error;
    }
  }

  async findByGuestEmail(email) {
    try {
      logger.info('Buscando reservas por email del huésped', { email });

      const bookings = await BookingModel.find({ guestEmail: email })
        .populate('hotelId', 'name address')
        .populate('roomTypeId', 'name pricePerNight')
        .sort({ createdAt: -1 });

      return bookings.map(booking => this._mapToEntity(booking));
    } catch (error) {
      logger.error('Error al buscar reservas por email:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      logger.info('Eliminando reserva', { bookingId: id });

      const booking = await BookingModel.findByIdAndDelete(id);

      if (!booking) {
        logger.warn('Reserva no encontrada para eliminar', { bookingId: id });
        return false;
      }

      logger.info('Reserva eliminada exitosamente', { bookingId: id });
      return true;
    } catch (error) {
      logger.error('Error al eliminar reserva:', error);
      throw error;
    }
  }

  _buildQuery(filters) {
    const query = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.hotelId) {
      query.hotelId = filters.hotelId;
    }

    if (filters.fromDate) {
      query.checkInDate = { $gte: new Date(filters.fromDate) };
    }

    if (filters.toDate) {
      query.checkOutDate = { $lte: new Date(filters.toDate) };
    }

    if (filters.guestEmail) {
      query.guestEmail = { $regex: filters.guestEmail, $options: 'i' };
    }

    return query;
  }

  _mapToEntity(bookingDoc) {
    return new BookingEntity({
      id: bookingDoc._id.toString(),
      hotelId: bookingDoc.hotelId?._id?.toString() || bookingDoc.hotelId,
      roomTypeId: bookingDoc.roomTypeId?._id?.toString() || bookingDoc.roomTypeId,
      guestName: bookingDoc.guestName,
      guestLastName: bookingDoc.guestLastName,
      guestPhone: bookingDoc.guestPhone,
      guestEmail: bookingDoc.guestEmail,
      checkInDate: bookingDoc.checkInDate,
      checkOutDate: bookingDoc.checkOutDate,
      numberOfGuests: bookingDoc.numberOfGuests,
      totalAmount: bookingDoc.totalAmount,
      status: bookingDoc.status,
      createdAt: bookingDoc.createdAt,
      updatedAt: bookingDoc.updatedAt,
      hotel: bookingDoc.hotelId?.name ? {
        id: bookingDoc.hotelId._id.toString(),
        name: bookingDoc.hotelId.name,
        address: bookingDoc.hotelId.address
      } : undefined,
      roomType: bookingDoc.roomTypeId?.name ? {
        id: bookingDoc.roomTypeId._id.toString(),
        name: bookingDoc.roomTypeId.name,
        pricePerNight: bookingDoc.roomTypeId.pricePerNight
      } : undefined
    });
  }
}
