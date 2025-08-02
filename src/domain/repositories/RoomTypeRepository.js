/**
 * RoomType Repository Interface
 * Define las operaciones que debe implementar cualquier repositorio de tipos de habitación
 * Esta interfaz sigue el patrón Repository del Domain-Driven Design
 */
class RoomTypeRepository {
  /**
   * Crear un nuevo tipo de habitación
   * @param {RoomType} roomType - Entidad del tipo de habitación a crear
   * @returns {Promise<RoomType>} Tipo de habitación creado con ID asignado
   */
  async create(roomType) {
    throw new Error('Method create must be implemented');
  }

  /**
   * Buscar un tipo de habitación por su ID
   * @param {string} id - ID del tipo de habitación
   * @returns {Promise<RoomType|null>} Tipo de habitación encontrado o null
   */
  async findById(id) {
    throw new Error('Method findById must be implemented');
  }

  /**
   * Buscar todos los tipos de habitación con filtros opcionales
   * @param {Object} filters - Filtros para la búsqueda
   * @param {number} [filters.page=1] - Número de página para paginación
   * @param {number} [filters.limit=10] - Límite de elementos por página
   * @param {string} [filters.sortBy='createdAt'] - Campo por el cual ordenar
   * @param {string} [filters.sortOrder='desc'] - Orden de clasificación (asc/desc)
   * @param {Object} [filters.priceRange] - Rango de precios
   * @param {number} [filters.priceRange.min] - Precio mínimo
   * @param {number} [filters.priceRange.max] - Precio máximo
   * @param {Array<string>} [filters.amenities] - Lista de amenidades requeridas
   * @param {boolean} [filters.availability=true] - Filtrar por disponibilidad
   * @returns {Promise<{data: RoomType[], pagination: Object}>} Resultado paginado
   */
  async findAll(filters = {}) {
    throw new Error('Method findAll must be implemented');
  }

  /**
   * Buscar tipos de habitación por ID de hotel
   * @param {string} hotelId - ID del hotel
   * @param {Object} filters - Filtros adicionales opcionales
   * @returns {Promise<RoomType[]>} Lista de tipos de habitación del hotel
   */
  async findByHotelId(hotelId, filters = {}) {
    throw new Error('Method findByHotelId must be implemented');
  }

  /**
   * Actualizar un tipo de habitación existente
   * @param {string} id - ID del tipo de habitación a actualizar
   * @param {Object} roomTypeData - Datos a actualizar
   * @returns {Promise<RoomType|null>} Tipo de habitación actualizado o null si no existe
   */
  async update(id, roomTypeData) {
    throw new Error('Method update must be implemented');
  }

  /**
   * Eliminar un tipo de habitación (soft delete)
   * @param {string} id - ID del tipo de habitación a eliminar
   * @returns {Promise<RoomType|null>} Tipo de habitación eliminado o null si no existe
   */
  async delete(id) {
    throw new Error('Method delete must be implemented');
  }

  /**
   * Verificar disponibilidad de un tipo de habitación para fechas específicas
   * @param {string} roomTypeId - ID del tipo de habitación
   * @param {Date} checkInDate - Fecha de entrada
   * @param {Date} checkOutDate - Fecha de salida
   * @returns {Promise<Object>} Objeto con información de disponibilidad
   */
  async checkAvailability(roomTypeId, checkInDate, checkOutDate) {
    throw new Error('Method checkAvailability must be implemented');
  }

  /**
   * Buscar tipos de habitación por capacidad mínima
   * @param {number} minCapacity - Capacidad mínima de huéspedes
   * @param {Object} filters - Filtros adicionales opcionales
   * @returns {Promise<RoomType[]>} Lista de tipos de habitación que cumplen la capacidad
   */
  async findByCapacity(minCapacity, filters = {}) {
    throw new Error('Method findByCapacity must be implemented');
  }

  /**
   * Actualizar únicamente los precios de un tipo de habitación
   * @param {string} id - ID del tipo de habitación
   * @param {Object} pricingData - Datos de precios a actualizar
   * @param {number} [pricingData.basePrice] - Nuevo precio base
   * @param {string} [pricingData.currency] - Nueva moneda
   * @param {Array} [pricingData.discounts] - Nuevos descuentos
   * @returns {Promise<RoomType|null>} Tipo de habitación con precios actualizados
   */
  async updatePricing(id, pricingData) {
    throw new Error('Method updatePricing must be implemented');
  }

  /**
   * Buscar tipos de habitación por rango de precios
   * @param {number} minPrice - Precio mínimo
   * @param {number} maxPrice - Precio máximo
   * @param {Object} filters - Filtros adicionales opcionales
   * @returns {Promise<RoomType[]>} Lista de tipos de habitación en el rango de precios
   */
  async findByPriceRange(minPrice, maxPrice, filters = {}) {
    throw new Error('Method findByPriceRange must be implemented');
  }

  /**
   * Buscar tipos de habitación que contengan todas las amenidades especificadas
   * @param {Array<string>} amenities - Lista de amenidades requeridas
   * @param {Object} filters - Filtros adicionales opcionales
   * @returns {Promise<RoomType[]>} Lista de tipos de habitación con las amenidades
   */
  async findByAmenities(amenities, filters = {}) {
    throw new Error('Method findByAmenities must be implemented');
  }

  /**
   * Contar el número total de tipos de habitación que cumplen los filtros
   * @param {Object} filters - Filtros para contar
   * @returns {Promise<number>} Número total de tipos de habitación
   */
  async count(filters = {}) {
    throw new Error('Method count must be implemented');
  }

  /**
   * Buscar tipos de habitación disponibles en un rango de fechas
   * @param {Date} checkInDate - Fecha de entrada
   * @param {Date} checkOutDate - Fecha de salida
   * @param {Object} filters - Filtros adicionales opcionales
   * @returns {Promise<RoomType[]>} Lista de tipos de habitación disponibles
   */
  async findAvailableByDateRange(checkInDate, checkOutDate, filters = {}) {
    throw new Error('Method findAvailableByDateRange must be implemented');
  }
}

export default RoomTypeRepository;
