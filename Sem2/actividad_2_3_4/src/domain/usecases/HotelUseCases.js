/**
 * Casos de uso para la gestión de hoteles
 * Contiene toda la lógica de negocio relacionada con hoteles
 */

import { Hotel } from '../entities/Hotel.js';

export class HotelUseCases {
  constructor(hotelRepository) {
    this.hotelRepository = hotelRepository;
  }

  /**
   * Crear un nuevo hotel
   * @param {Object} hotelData - Datos del hotel
   * @returns {Promise<{success: boolean, data?: Hotel, errors?: string[]}>}
   */
  async createHotel(hotelData) {
    try {
      // Crear instancia de la entidad Hotel
      const hotel = new Hotel(hotelData);
      
      // Validar la entidad
      const validation = hotel.validate();
      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors
        };
      }

      // Guardar en el repositorio
      const savedHotel = await this.hotelRepository.create(hotel.toDatabase());
      
      return {
        success: true,
        data: savedHotel
      };
    } catch (error) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }

  /**
   * Obtener hotel por ID
   * @param {string} id - ID del hotel
   * @returns {Promise<{success: boolean, data?: Hotel, errors?: string[]}>}
   */
  async getHotelById(id) {
    try {
      if (!id) {
        return {
          success: false,
          errors: ['ID del hotel es requerido']
        };
      }

      const hotel = await this.hotelRepository.findById(id);
      
      if (!hotel) {
        return {
          success: false,
          errors: ['Hotel no encontrado']
        };
      }

      return {
        success: true,
        data: hotel
      };
    } catch (error) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }

  /**
   * Obtener todos los hoteles con filtros y paginación
   * @param {Object} filters - Filtros de búsqueda
   * @param {Object} pagination - Opciones de paginación
   * @returns {Promise<{success: boolean, data?: Object, errors?: string[]}>}
   */
  async getAllHotels(filters = {}, pagination = {}) {
    try {
      // Configurar paginación por defecto
      const paginationOptions = {
        page: parseInt(pagination.page) || 1,
        limit: parseInt(pagination.limit) || 10
      };

      // Validar límites de paginación
      if (paginationOptions.limit > 50) {
        paginationOptions.limit = 50;
      }

      const result = await this.hotelRepository.findAll(filters, paginationOptions);
      
      return {
        success: true,
        data: {
          hotels: result.hotels,
          pagination: {
            page: paginationOptions.page,
            limit: paginationOptions.limit,
            total: result.total,
            pages: Math.ceil(result.total / paginationOptions.limit)
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }

  /**
   * Actualizar un hotel
   * @param {string} id - ID del hotel
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<{success: boolean, data?: Hotel, errors?: string[]}>}
   */
  async updateHotel(id, updateData) {
    try {
      if (!id) {
        return {
          success: false,
          errors: ['ID del hotel es requerido']
        };
      }

      // Verificar que el hotel existe
      const exists = await this.hotelRepository.exists(id);
      if (!exists) {
        return {
          success: false,
          errors: ['Hotel no encontrado']
        };
      }

      // Crear instancia temporal para validar datos
      const tempHotel = new Hotel({ ...updateData, id });
      const validation = tempHotel.validate();
      
      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors
        };
      }

      // Actualizar timestamp
      updateData.updatedAt = new Date();

      const updatedHotel = await this.hotelRepository.update(id, updateData);
      
      return {
        success: true,
        data: updatedHotel
      };
    } catch (error) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }

  /**
   * Eliminar un hotel (soft delete)
   * @param {string} id - ID del hotel
   * @returns {Promise<{success: boolean, message?: string, errors?: string[]}>}
   */
  async deleteHotel(id) {
    try {
      if (!id) {
        return {
          success: false,
          errors: ['ID del hotel es requerido']
        };
      }

      // Verificar que el hotel existe
      const exists = await this.hotelRepository.exists(id);
      if (!exists) {
        return {
          success: false,
          errors: ['Hotel no encontrado']
        };
      }

      const deleted = await this.hotelRepository.delete(id);
      
      if (deleted) {
        return {
          success: true,
          message: 'Hotel eliminado exitosamente'
        };
      } else {
        return {
          success: false,
          errors: ['No se pudo eliminar el hotel']
        };
      }
    } catch (error) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }

  /**
   * Buscar hoteles por criterios específicos
   * @param {Object} searchCriteria - Criterios de búsqueda
   * @returns {Promise<{success: boolean, data?: Object, errors?: string[]}>}
   */
  async searchHotels(searchCriteria) {
    try {
      // Validar criterios de búsqueda requeridos
      if (!searchCriteria.destination || !searchCriteria.checkInDate || !searchCriteria.checkOutDate) {
        return {
          success: false,
          errors: ['Destino, fecha de entrada y fecha de salida son requeridos']
        };
      }

      // Validar fechas
      const checkIn = new Date(searchCriteria.checkInDate);
      const checkOut = new Date(searchCriteria.checkOutDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkIn < today) {
        return {
          success: false,
          errors: ['La fecha de entrada no puede ser anterior a hoy']
        };
      }

      if (checkOut <= checkIn) {
        return {
          success: false,
          errors: ['La fecha de salida debe ser posterior a la fecha de entrada']
        };
      }

      const hotels = await this.hotelRepository.search(searchCriteria);
      
      return {
        success: true,
        data: {
          hotels,
          searchCriteria,
          resultsCount: hotels.length
        }
      };
    } catch (error) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }
}

export default HotelUseCases;
