import RoomType from '../entities/RoomType.js';

/**
 * RoomType Use Cases
 * Contiene la lógica de negocio para operaciones con tipos de habitación
 */
class RoomTypeUseCases {
  constructor(roomTypeRepository, hotelRepository) {
    this.roomTypeRepository = roomTypeRepository;
    this.hotelRepository = hotelRepository;
  }

  async createRoomType(roomTypeData) {
    // Validar que el hotel existe
    const hotel = await this.hotelRepository.findById(roomTypeData.hotelId);
    if (!hotel) {
      throw new Error('Hotel not found');
    }

    // Crear entidad RoomType
    const roomType = new RoomType({
      ...roomTypeData,
      id: undefined // Se generará en la base de datos
    });

    // Validaciones de negocio
    if (!roomType.canAccommodate(roomType.capacity.adults, roomType.capacity.children)) {
      throw new Error('Invalid capacity configuration');
    }

    return this.roomTypeRepository.create(roomType);
  }

  async getRoomTypeById(id) {
    const roomType = await this.roomTypeRepository.findById(id);
    if (!roomType) {
      throw new Error('Room type not found');
    }
    return roomType;
  }

  async getAllRoomTypes(filters = {}) {
    return await this.roomTypeRepository.findAll(filters);
  }

  async getRoomTypesByHotel(hotelId, filters = {}) {
    // Validar que el hotel existe
    const hotel = await this.hotelRepository.findById(hotelId);
    if (!hotel) {
      throw new Error('Hotel not found');
    }

    return await this.roomTypeRepository.findByHotelId(hotelId, filters);
  }

  async updateRoomType(id, updateData) {
    const existingRoomType = await this.roomTypeRepository.findById(id);
    if (!existingRoomType) {
      throw new Error('Room type not found');
    }

    // Si se actualiza el hotel, validar que existe
    if (updateData.hotelId && updateData.hotelId !== existingRoomType.hotelId) {
      const hotel = await this.hotelRepository.findById(updateData.hotelId);
      if (!hotel) {
        throw new Error('Hotel not found');
      }
    }

    // Validar capacidad si se actualiza
    if (updateData.capacity) {
      const tempRoomType = new RoomType({ ...existingRoomType, ...updateData });
      if (!tempRoomType.canAccommodate(tempRoomType.capacity.adults, tempRoomType.capacity.children)) {
        throw new Error('Invalid capacity configuration');
      }
    }

    return await this.roomTypeRepository.update(id, {
      ...updateData,
      updatedAt: new Date()
    });
  }

  async deleteRoomType(id) {
    const roomType = await this.roomTypeRepository.findById(id);
    if (!roomType) {
      throw new Error('Room type not found');
    }

    return await this.roomTypeRepository.delete(id);
  }

  async checkAvailability(roomTypeId, checkInDate, checkOutDate) {
    const roomType = await this.roomTypeRepository.findById(roomTypeId);
    if (!roomType) {
      throw new Error('Room type not found');
    }

    if (!roomType.isAvailable()) {
      return { available: false, reason: 'Room type is not available' };
    }

    const availability = await this.roomTypeRepository.checkAvailability(
      roomTypeId,
      checkInDate,
      checkOutDate
    );

    return availability;
  }

  async updatePricing(id, pricingData) {
    const roomType = await this.roomTypeRepository.findById(id);
    if (!roomType) {
      throw new Error('Room type not found');
    }

    // Validar que el precio sea positivo
    if (pricingData.basePrice && pricingData.basePrice <= 0) {
      throw new Error('Base price must be greater than 0');
    }

    return await this.roomTypeRepository.updatePricing(id, pricingData);
  }

  async searchRoomTypes(searchCriteria) {
    const {
      hotelId,
      capacity,
      priceRange,
      amenities,
      checkInDate,
      checkOutDate,
      ...otherFilters
    } = searchCriteria;

    let filters = { ...otherFilters };

    // Filtrar por hotel si se especifica
    if (hotelId) {
      filters.hotelId = hotelId;
    }

    // Filtrar por capacidad
    if (capacity) {
      const roomTypes = await this.roomTypeRepository.findByCapacity(capacity, filters);
      return roomTypes;
    }

    // Aplicar otros filtros
    if (priceRange) {
      filters.priceRange = priceRange;
    }

    if (amenities && amenities.length > 0) {
      filters.amenities = amenities;
    }

    let roomTypes = await this.roomTypeRepository.findAll(filters);

    // Si se especifican fechas, verificar disponibilidad
    if (checkInDate && checkOutDate) {
      const availableRoomTypes = [];
      for (const roomType of roomTypes) {
        const availability = await this.checkAvailability(
          roomType.id,
          checkInDate,
          checkOutDate
        );
        if (availability.available) {
          availableRoomTypes.push(roomType);
        }
      }
      roomTypes = availableRoomTypes;
    }

    return roomTypes;
  }
}

export default RoomTypeUseCases;
