/**
 * Controlador para endpoints de hoteles
 * Maneja las peticiones HTTP y coordina con los casos de uso
 */

import HotelUseCases from '../../domain/usecases/HotelUseCases.js';
import RoomSearchUseCases from '../../domain/usecases/RoomSearchUseCases.js';
import MongoHotelRepository from '../../infrastructure/repositories/MongoHotelRepository.js';
import MongoRoomTypeRepository from '../../infrastructure/repositories/MongoRoomTypeRepository.js';
import {
    roomSearchValidator,
    roomSearchQueryValidator,
    processQueryParams,
    validateSearchErrors
} from '../../shared/validators/roomSearchValidators.js';
import logger from '../../shared/utils/logger.js';

export class HotelController {
    constructor() {
        this.hotelRepository = new MongoHotelRepository();
        this.roomTypeRepository = new MongoRoomTypeRepository();
        this.hotelUseCases = new HotelUseCases(this.hotelRepository);
        this.roomSearchUseCases = new RoomSearchUseCases(this.hotelRepository, this.roomTypeRepository);
    }

    /**
     * Crear un nuevo hotel
     * POST /api/hotels
     */
    async createHotel(req, res, next) {
        try {
            logger.info('Creando nuevo hotel', {body: req.body});

            const result = await this.hotelUseCases.createHotel(req.body);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: 'Error al crear el hotel',
                    errors: result.errors
                });
            }

            logger.info('Hotel creado exitosamente', {hotelId: result.data.id});

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
            logger.info('Obteniendo lista de hoteles', {query: req.query});

            const {page, limit, ...filters} = req.query;
            const pagination = {page, limit};

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
            const {id} = req.params;
            logger.info('Obteniendo hotel por ID', {hotelId: id});

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
            const {id} = req.params;
            logger.info('Actualizando hotel', {hotelId: id, body: req.body});

            const result = await this.hotelUseCases.updateHotel(id, req.body);

            if (!result.success) {
                const statusCode = result.errors.includes('Hotel no encontrado') ? 404 : 400;
                return res.status(statusCode).json({
                    success: false,
                    message: 'Error al actualizar el hotel',
                    errors: result.errors
                });
            }

            logger.info('Hotel actualizado exitosamente', {hotelId: id});

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
            const {id} = req.params;
            logger.info('Eliminando hotel', {hotelId: id});

            const result = await this.hotelUseCases.deleteHotel(id);

            if (!result.success) {
                const statusCode = result.errors.includes('Hotel no encontrado') ? 404 : 400;
                return res.status(statusCode).json({
                    success: false,
                    message: 'Error al eliminar el hotel',
                    errors: result.errors
                });
            }

            logger.info('Hotel eliminado exitosamente', {hotelId: id});

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
            logger.info('Buscando hoteles', {searchCriteria: req.body});

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

    /**
     * Buscar habitaciones disponibles con filtros específicos
     * GET /api/hotels/search
     *
     * Endpoint principal del buscador que combina:
     * - Hoteles por ubicación
     * - Tipos de habitaciones por capacidad y precio
     */
    async searchAvailableRooms(req, res, next) {
        try {
            logger.info('Iniciando búsqueda de habitaciones', {
                query: req.query,
                ip: req.ip
            });

            const queryObject = {
                location: req.query.location,
                numberOfGuests: req.query.numberOfGuests,
                checkInDate: req.query.checkInDate,
                checkOutDate: req.query.checkOutDate,
                amenities: req.query.amenities,
                sortBy: req.query.sortBy,
                page: req.query.page,
                limit: req.query.limit,
                priceRange: {
                    min: req.query["priceRange.min"],
                    max: req.query["priceRange.max"]
                }
            };
            const processedQuery = processQueryParams(queryObject);

            const {error, value} = roomSearchValidator.validate(processedQuery);
            if (error) {
                logger.warn('Error de validación en búsqueda de habitaciones', {
                    errors: error.details.map(detail => detail.message)
                });

                return res.status(400).json({
                    success: false,
                    message: 'Errores de validación en los criterios de búsqueda',
                    errors: error.details.map(detail => ({
                        field: detail.path.join('.'),
                        message: detail.message
                    }))
                });
            }

            const businessErrors = validateSearchErrors(value);
            if (businessErrors.length > 0) {
                logger.warn('Errores de lógica de negocio en búsqueda', {errors: businessErrors});

                return res.status(400).json({
                    success: false,
                    message: 'Los criterios de búsqueda no cumplen las reglas de negocio',
                    errors: businessErrors.map(error => ({message: error}))
                });
            }

            const searchResult = await this.roomSearchUseCases.searchAvailableRooms(value);

            if (!searchResult.success) {
                logger.error('Error en búsqueda de habitaciones', {
                    error: searchResult.error,
                    criteria: value
                });

                return res.status(500).json({
                    success: false,
                    message: searchResult.message || 'Error interno durante la búsqueda',
                    error: process.env.NODE_ENV === 'development' ? searchResult.error : undefined
                });
            }

            logger.info('Búsqueda de habitaciones completada exitosamente', {
                totalResults: searchResult.data.summary.totalHotels,
                totalRoomTypes: searchResult.data.summary.totalRoomTypes,
                criteria: value
            });

            if (value.sortBy && value.sortBy !== 'relevance') {
                searchResult.data.results = this._applySorting(searchResult.data.results, value.sortBy);
            }

            const paginatedResults = this._applyPagination(
                searchResult.data.results,
                value.page || 1,
                value.limit || 10
            );

            res.status(200).json({
                success: true,
                message: searchResult.message,
                data: paginatedResults.data,
                summary: {
                    ...searchResult.data.summary,
                    page: value.page || 1,
                    limit: value.limit || 10,
                    totalPages: paginatedResults.totalPages,
                    hasNextPage: paginatedResults.hasNextPage,
                    hasPrevPage: paginatedResults.hasPrevPage
                }
            });

        } catch (error) {
            logger.error('Error inesperado en búsqueda de habitaciones:', {
                error: error.message,
                stack: error.stack,
                query: req.query
            });
            next(error);
        }
    }

    /**
     * Búsqueda rápida de habitaciones via GET
     * GET /api/hotels/search
     */
    async quickSearchRooms(req, res, next) {
        try {
            logger.info('Búsqueda rápida de habitaciones via GET', {query: req.query});

            const processedQuery = processQueryParams(req.query);
            const {error, value} = roomSearchQueryValidator.validate(processedQuery);

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Parámetros de búsqueda inválidos',
                    errors: error.details.map(detail => ({
                        field: detail.path.join('.'),
                        message: detail.message
                    }))
                });
            }

            const businessErrors = validateSearchErrors(value);
            if (businessErrors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Los criterios de búsqueda no cumplen las reglas de negocio',
                    errors: businessErrors.map(error => ({message: error}))
                });
            }

            const searchResult = await this.roomSearchUseCases.searchAvailableRooms(value);

            if (!searchResult.success) {
                return res.status(500).json({
                    success: false,
                    message: searchResult.message,
                    error: process.env.NODE_ENV === 'development' ? searchResult.error : undefined
                });
            }

            if (value.sortBy && value.sortBy !== 'relevance') {
                searchResult.data.results = this._applySorting(searchResult.data.results, value.sortBy);
            }

            const paginatedResults = this._applyPagination(
                searchResult.data.results,
                value.page,
                value.limit
            );

            res.status(200).json({
                success: true,
                message: searchResult.message,
                data: paginatedResults.data,
                summary: {
                    ...searchResult.data.summary,
                    page: value.page,
                    limit: value.limit,
                    totalPages: paginatedResults.totalPages,
                    hasNextPage: paginatedResults.hasNextPage,
                    hasPrevPage: paginatedResults.hasPrevPage
                }
            });

        } catch (error) {
            logger.error('Error en búsqueda rápida:', error);
            next(error);
        }
    }

    /**
     * Aplicar ordenamiento a los resultados
     */
    _applySorting(results, sortBy) {
        const sortedResults = [...results];

        switch (sortBy) {
            case 'price_low_to_high':
                return sortedResults.sort((a, b) => {
                    const aMinPrice = Math.min(...a.availableRoomTypes.map(rt => rt.pricing.basePrice));
                    const bMinPrice = Math.min(...b.availableRoomTypes.map(rt => rt.pricing.basePrice));
                    return aMinPrice - bMinPrice;
                });

            case 'price_high_to_low':
                return sortedResults.sort((a, b) => {
                    const aMaxPrice = Math.max(...a.availableRoomTypes.map(rt => rt.pricing.basePrice));
                    const bMaxPrice = Math.max(...b.availableRoomTypes.map(rt => rt.pricing.basePrice));
                    return bMaxPrice - aMaxPrice;
                });

            case 'rating':
                return sortedResults.sort((a, b) => {
                    const aRating = a.hotel.rating?.average || 0;
                    const bRating = b.hotel.rating?.average || 0;
                    return bRating - aRating;
                });

            case 'name':
                return sortedResults.sort((a, b) =>
                    a.hotel.name.localeCompare(b.hotel.name)
                );

            default:
                return sortedResults;
        }
    }

    /**
     * Aplicar paginación a los resultados
     */
    _applyPagination(results, page, limit) {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = results.slice(startIndex, endIndex);
        const totalPages = Math.ceil(results.length / limit);

        return {
            data: paginatedData,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        };
    }
}

const hotelController = new HotelController();

export const createHotel = hotelController.createHotel.bind(hotelController);
export const getAllHotels = hotelController.getAllHotels.bind(hotelController);
export const getHotelById = hotelController.getHotelById.bind(hotelController);
export const updateHotel = hotelController.updateHotel.bind(hotelController);
export const deleteHotel = hotelController.deleteHotel.bind(hotelController);
export const searchHotels = hotelController.searchHotels.bind(hotelController);
export const searchAvailableRooms = hotelController.searchAvailableRooms.bind(hotelController);
export const quickSearchRooms = hotelController.quickSearchRooms.bind(hotelController);

export default hotelController;
