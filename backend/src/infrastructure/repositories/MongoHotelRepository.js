/**
 * Implementación del repositorio de hoteles para MongoDB
 * Implementa la interfaz HotelRepository del dominio
 */

import HotelModel from '../database/models/Hotel.js';
import { Hotel } from '../../domain/entities/Hotel.js';
import { HotelRepository } from '../../domain/repositories/HotelRepository.js';

export class MongoHotelRepository extends HotelRepository {
  /**
   * Crear un nuevo hotel
   * @param {Object} hotelData - Datos del hotel
   * @returns {Promise<Hotel>}
   */
  async create(hotelData) {
    try {
      const hotelDoc = new HotelModel(hotelData);
      const savedDoc = await hotelDoc.save();
      return Hotel.fromDatabase(savedDoc.toJSON());
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new Error(`Error de validación: ${Object.values(error.errors).map(e => e.message).join(', ')}`);
      }
      throw error;
    }
  }

  /**
   * Obtener hotel por ID
   * @param {string} id - ID del hotel
   * @returns {Promise<Hotel|null>}
   */
  async findById(id) {
    try {
      const hotelDoc = await HotelModel.findById(id);
      return hotelDoc ? Hotel.fromDatabase(hotelDoc.toJSON()) : null;
    } catch (error) {
      if (error.name === 'CastError') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Obtener todos los hoteles con filtros
   * @param {Object} filters - Filtros de búsqueda
   * @param {Object} pagination - Opciones de paginación
   * @returns {Promise<{hotels: Hotel[], total: number}>}
   */
  async findAll(filters = {}, pagination = {}) {
    try {
      const query = this.buildQuery(filters);
      const { page = 1, limit = 10 } = pagination;
      const skip = (page - 1) * limit;

      // Ejecutar consulta con paginación
      const [hotels, total] = await Promise.all([
        HotelModel.find(query)
          .sort(this.buildSort(filters.sort))
          .skip(skip)
          .limit(limit)
          .lean(),
        HotelModel.countDocuments(query)
      ]);

      return {
        hotels: hotels.map(hotel => Hotel.fromDatabase(hotel)),
        total
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualizar hotel
   * @param {string} id - ID del hotel
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Hotel|null>}
   */
  async update(id, updateData) {
    try {
      const updatedDoc = await HotelModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      return updatedDoc ? Hotel.fromDatabase(updatedDoc.toJSON()) : null;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new Error(`Error de validación: ${Object.values(error.errors).map(e => e.message).join(', ')}`);
      }
      if (error.name === 'CastError') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Eliminar hotel (hard delete)
   * @param {string} id - ID del hotel
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    try {
      const result = await HotelModel.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      if (error.name === 'CastError') {
        return false;
      }
      throw error;
    }
  }

  /**
   * Buscar hoteles por criterios específicos
   * @param {Object} searchCriteria - Criterios de búsqueda
   * @returns {Promise<Hotel[]>}
   */
  async search(searchCriteria) {
    try {
      const query = this.buildSearchQuery(searchCriteria);

      const hotels = await HotelModel.find(query)
        .sort({ 'rating.average': -1 })
        .lean();

      return hotels.map(hotel => Hotel.fromDatabase(hotel));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verificar si un hotel existe
   * @param {string} id - ID del hotel
   * @returns {Promise<boolean>}
   */
  async exists(id) {
    try {
      const hotel = await HotelModel.findById(id).select('_id').lean();
      return hotel !== null;
    } catch (error) {
      if (error.name === 'CastError') {
        return false;
      }
      throw error;
    }
  }

  /**
   * Construir query de MongoDB basado en filtros
   * @param {Object} filters - Filtros
   * @returns {Object} Query de MongoDB
   */
  buildQuery(filters) {
    const query = { isActive: true };

    if (filters.city) {
      query['address.city'] = { $regex: filters.city, $options: 'i' };
    }

    if (filters.country) {
      query['address.country'] = { $regex: filters.country, $options: 'i' };
    }

    if (filters.minRating) {
      query['rating.average'] = { $gte: parseFloat(filters.minRating) };
    }

    if (filters.amenities) {
      const amenitiesArray = filters.amenities.split(',').map(a => a.trim());
      query.amenities = { $in: amenitiesArray };
    }

    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    return query;
  }

  /**
   * Construir query de búsqueda específica
   * @param {Object} searchCriteria - Criterios de búsqueda
   * @returns {Object} Query de MongoDB
   */
  buildSearchQuery(searchCriteria) {
    const query = { isActive: true };

    // Búsqueda por destino (ciudad, estado o país)
    if (searchCriteria.destination) {
      const destination = searchCriteria.destination;
      query.$or = [
        { 'address.city': { $regex: destination, $options: 'i' } },
        { 'address.state': { $regex: destination, $options: 'i' } },
        { 'address.country': { $regex: destination, $options: 'i' } }
      ];
    }

    // Aplicar filtros adicionales
    if (searchCriteria.filters) {
      const { minRating, maxPrice, amenities } = searchCriteria.filters;

      if (minRating) {
        query['rating.average'] = { $gte: parseFloat(minRating) };
      }

      if (amenities && amenities.length > 0) {
        query.amenities = { $in: amenities };
      }
    }

    return query;
  }

  /**
   * Construir opciones de ordenamiento
   * @param {string} sort - Criterio de ordenamiento
   * @returns {Object} Opciones de sort de MongoDB
   */
  buildSort(sort) {
    switch (sort) {
      case 'rating':
        return { 'rating.average': -1 };
      case 'name':
        return { name: 1 };
      case 'newest':
        return { createdAt: -1 };
      case 'oldest':
        return { createdAt: 1 };
      default:
        return { 'rating.average': -1, name: 1 };
    }
  }
}

export default MongoHotelRepository;
