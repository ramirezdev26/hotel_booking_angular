/**
 * Rutas para endpoints de reservas (bookings)
 * Define las rutas HTTP y conecta con los controladores y validadores
 */

import express from 'express';
import {
    createBooking,
    getAllBookings,
    getBookingById,
    getBookingsByGuestEmail,
    deleteBooking
} from '../controllers/bookingController.js';

import {
    createBookingValidator,
    queryBookingsValidator,
    bookingIdValidator,
    validateRequest
} from '../../shared/validators/bookingValidators.js';

/**
 * Configuración de rutas de reservas con autenticación
 * @param {Object} auth - Middleware de autenticación
 * @returns {express.Router} Router configurado
 */
const bookingRoutes = (auth) => {
    const router = express.Router();

    /**
     * @route   GET /api/bookings
     * @desc    Obtener todas las reservas con filtros y paginación
     * @access  Private (requiere autenticación)
     * @query   page, limit, status, hotelId, guestEmail, fromDate, toDate
     */
    router.get('/',
        auth.protect(),
        validateRequest(queryBookingsValidator, 'query'),
        getAllBookings
    );

    /**
     * @route   GET /api/bookings/guest/:email
     * @desc    Obtener reservas por email del huésped
     * @access  Private (requiere autenticación)
     * @param   email - Email del huésped
     */
    router.get('/guest/:email',
        auth.protect(),
        getBookingsByGuestEmail
    );

    /**
     * @route   GET /api/bookings/:id
     * @desc    Obtener reserva específica por ID
     * @access  Private (requiere autenticación)
     * @param   id - ObjectId de la reserva
     */
    router.get('/:id',
        auth.protect(),
        validateRequest(bookingIdValidator, 'params'),
        getBookingById
    );

    /**
     * @route   POST /api/bookings
     * @desc    Crear una nueva reserva
     * @access  Public (para permitir reservas sin autenticación)
     * @body    Booking data según createBookingValidator
     */
    router.post('/',
        auth.protect(),
        validateRequest(createBookingValidator, 'body'),
        createBooking
    );

    /**
     * @route   DELETE /api/bookings/:id
     * @desc    Eliminar reserva (hard delete)
     * @access  Private (requiere autenticación y autorización admin)
     * @param   id - ObjectId de la reserva
     */
    router.delete('/:id',
        auth.protect(),
        validateRequest(bookingIdValidator, 'params'),
        deleteBooking
    );

    return router;
};

export default bookingRoutes;
