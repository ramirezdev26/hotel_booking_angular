/**
 * Controlador para endpoints de reservas (bookings)
 * Maneja las peticiones HTTP y coordina con los casos de uso
 */

import BookingUseCases from '../../domain/usecases/BookingUseCases.js';
import MongoBookingRepository from '../../infrastructure/repositories/MongoBookingRepository.js';
import MongoHotelRepository from '../../infrastructure/repositories/MongoHotelRepository.js';
import MongoRoomTypeRepository from '../../infrastructure/repositories/MongoRoomTypeRepository.js';
import logger from '../../shared/utils/logger.js';

export class BookingController {
    constructor() {
        this.bookingRepository = new MongoBookingRepository();
        this.hotelRepository = new MongoHotelRepository();
        this.roomTypeRepository = new MongoRoomTypeRepository();
        this.bookingUseCases = new BookingUseCases(
            this.bookingRepository,
            this.hotelRepository,
            this.roomTypeRepository
        );
    }

    /**
     * Crear una nueva reserva
     * POST /api/bookings
     */
    async createBooking(req, res, next) {
        try {
            logger.info('Creando nueva reserva', { body: req.body });

            const result = await this.bookingUseCases.createBooking(req.body);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: 'Error al crear la reserva',
                    errors: result.errors
                });
            }

            logger.info('Reserva creada exitosamente', { bookingId: result.data.id });

            res.status(201).json({
                success: true,
                message: 'Reserva creada exitosamente',
                data: result.data
            });
        } catch (error) {
            logger.error('Error en createBooking:', error);
            next(error);
        }
    }

    /**
     * Obtener todas las reservas con filtros
     * GET /api/bookings
     */
    async getAllBookings(req, res, next) {
        try {
            logger.info('Obteniendo lista de reservas', { query: req.query });

            const { page, limit, ...filters } = req.query;
            const pagination = { page, limit };

            const result = await this.bookingUseCases.getAllBookings(filters, pagination);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: 'Error al obtener reservas',
                    errors: result.errors
                });
            }

            res.status(200).json({
                success: true,
                message: 'Reservas obtenidas exitosamente',
                data: result.data.bookings,
                pagination: result.data.pagination
            });
        } catch (error) {
            logger.error('Error en getAllBookings:', error);
            next(error);
        }
    }

    /**
     * Obtener reserva por ID
     * GET /api/bookings/:id
     */
    async getBookingById(req, res, next) {
        try {
            const { id } = req.params;
            logger.info('Obteniendo reserva por ID', { bookingId: id });

            const result = await this.bookingUseCases.getBookingById(id);

            if (!result.success) {
                const statusCode = result.errors.includes('Reserva no encontrada') ? 404 : 400;
                return res.status(statusCode).json({
                    success: false,
                    message: result.errors[0],
                    errors: result.errors
                });
            }

            res.status(200).json({
                success: true,
                message: 'Reserva encontrada',
                data: result.data
            });
        } catch (error) {
            logger.error('Error en getBookingById:', error);
            next(error);
        }
    }

    /**
     * Obtener reservas por email del huésped
     * GET /api/bookings/guest/:email
     */
    async getBookingsByGuestEmail(req, res, next) {
        try {
            const { email } = req.params;
            logger.info('Obteniendo reservas por email', { email });

            const result = await this.bookingUseCases.getBookingsByGuestEmail(email);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: 'Error al obtener reservas',
                    errors: result.errors
                });
            }

            res.status(200).json({
                success: true,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            logger.error('Error en getBookingsByGuestEmail:', error);
            next(error);
        }
    }

    /**
     * Eliminar reserva
     * DELETE /api/bookings/:id
     */
    async deleteBooking(req, res, next) {
        try {
            const { id } = req.params;
            logger.info('Eliminando reserva', { bookingId: id });

            const result = await this.bookingUseCases.deleteBooking(id);

            if (!result.success) {
                const statusCode = result.errors.includes('Reserva no encontrada') ? 404 : 400;
                return res.status(statusCode).json({
                    success: false,
                    message: 'Error al eliminar la reserva',
                    errors: result.errors
                });
            }

            logger.info('Reserva eliminada exitosamente', { bookingId: id });

            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            logger.error('Error en deleteBooking:', error);
            next(error);
        }
    }
}

const bookingController = new BookingController();

export const createBooking = bookingController.createBooking.bind(bookingController);
export const getAllBookings = bookingController.getAllBookings.bind(bookingController);
export const getBookingById = bookingController.getBookingById.bind(bookingController);
export const getBookingsByGuestEmail = bookingController.getBookingsByGuestEmail.bind(bookingController);
export const deleteBooking = bookingController.deleteBooking.bind(bookingController);

export default bookingController;
