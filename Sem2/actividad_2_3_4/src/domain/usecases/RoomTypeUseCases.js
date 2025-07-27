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
    const hotel = await this.hotelRepository.findById(roomTypeData.hotelId);
    if (!hotel) {
      throw new Error('Hotel not found');
    }

    const roomType = new RoomType({
      ...roomTypeData,
      id: undefined
    });

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

    if (updateData.hotelId && updateData.hotelId !== existingRoomType.hotelId) {
      const hotel = await this.hotelRepository.findById(updateData.hotelId);
      if (!hotel) {
        throw new Error('Hotel not found');
      }
    }

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

    if (hotelId) {
      filters.hotelId = hotelId;
    }

    if (capacity) {
      filters.capacity = capacity;
    }

    if (priceRange) {
      filters.priceRange = priceRange;
    }

    if (amenities && amenities.length > 0) {
      filters.amenities = amenities;
    }

    return await this.roomTypeRepository.findAll(filters);
  }
}

export default RoomTypeUseCases;
