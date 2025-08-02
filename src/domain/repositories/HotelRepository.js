/**
 * Interfaz del repositorio de hoteles
 * Define el contrato para el acceso a datos de hoteles
 */

export class HotelRepository {
  /**
   * Crear un nuevo hotel
   * @param {Object} hotelData - Datos del hotel
   * @returns {Promise<Hotel>}
   */
  async create(hotelData) {
    throw new Error('Method create must be implemented');
  }

  /**
   * Obtener hotel por ID
   * @param {string} id - ID del hotel
   * @returns {Promise<Hotel|null>}
   */
  async findById(id) {
    throw new Error('Method findById must be implemented');
  }

  /**
   * Obtener todos los hoteles con filtros
   * @param {Object} filters - Filtros de búsqueda
   * @param {Object} pagination - Opciones de paginación
   * @returns {Promise<{hotels: Hotel[], total: number}>}
   */
  async findAll(filters = {}, pagination = {}) {
    throw new Error('Method findAll must be implemented');
  }

  /**
   * Actualizar hotel
   * @param {string} id - ID del hotel
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Hotel|null>}
   */
  async update(id, updateData) {
    throw new Error('Method update must be implemented');
  }

  /**
   * Eliminar hotel (soft delete)
   * @param {string} id - ID del hotel
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    throw new Error('Method delete must be implemented');
  }

  /**
   * Buscar hoteles por criterios específicos
   * @param {Object} searchCriteria - Criterios de búsqueda
   * @returns {Promise<Hotel[]>}
   */
  async search(searchCriteria) {
    throw new Error('Method search must be implemented');
  }

  /**
   * Verificar si un hotel existe
   * @param {string} id - ID del hotel
   * @returns {Promise<boolean>}
   */
  async exists(id) {
    throw new Error('Method exists must be implemented');
  }
}

export default HotelRepository;
