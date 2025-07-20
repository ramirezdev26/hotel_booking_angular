import HotelUseCases from './HotelUseCases.js';
import RoomTypeUseCases from './RoomTypeUseCases.js';

/**
 * Room Search Use Cases
 * Lógica de negocio para búsquedas avanzadas de habitaciones
 * Combina hoteles por ubicación con tipos de habitaciones por capacidad y precio
 */
class RoomSearchUseCases {
  constructor(hotelRepository, roomTypeRepository) {
    this.hotelUseCases = new HotelUseCases(hotelRepository);
    this.roomTypeUseCases = new RoomTypeUseCases(roomTypeRepository, hotelRepository);
  }

  /**
   * Buscar habitaciones disponibles con filtros específicos
   * @param {Object} searchCriteria - Criterios de búsqueda
   * @param {string} searchCriteria.location - Ubicación (ciudad, estado o país)
   * @param {number} searchCriteria.numberOfGuests - Número de personas
   * @param {Object} [searchCriteria.priceRange] - Rango de precios
   * @param {number} [searchCriteria.priceRange.min] - Precio mínimo por noche
   * @param {number} [searchCriteria.priceRange.max] - Precio máximo por noche
   * @param {Date} [searchCriteria.checkInDate] - Fecha de entrada
   * @param {Date} [searchCriteria.checkOutDate] - Fecha de salida
   * @param {Array<string>} [searchCriteria.amenities] - Amenidades deseadas
   * @returns {Promise<Object>} Resultados de búsqueda con hoteles y habitaciones
   */
  async searchAvailableRooms(searchCriteria) {
    try {
      const {
        location,
        numberOfGuests,
        priceRange,
        checkInDate,
        checkOutDate,
        amenities = []
      } = searchCriteria;

      this._validateSearchCriteria(searchCriteria);

      const hotelFilters = this._buildHotelFilters(location);
      const hotelsResult = await this.hotelUseCases.searchHotels(hotelFilters);
      
      if (!hotelsResult.success || hotelsResult.data.length === 0) {
        return {
          success: true,
          message: 'No se encontraron hoteles en la ubicación especificada',
          data: {
            results: [],
            summary: {
              totalHotels: 0,
              totalRoomTypes: 0,
              searchCriteria: searchCriteria
            }
          }
        };
      }

      const roomSearchResults = [];
      
      for (const hotel of hotelsResult.data.hotels) {
        const roomTypeFilters = this._buildRoomTypeFilters({
          hotelId: hotel.id,
          numberOfGuests,
          amenities,
          checkInDate,
          checkOutDate
        });

        try {
          const roomTypesResult = await this.roomTypeUseCases.searchRoomTypes(roomTypeFilters);
          
          if (roomTypesResult.data.length > 0) {
            const roomTypesWithPricing = roomTypesResult.data.map(roomType => ({
              ...roomType,
              calculatedPricing: this._calculateRoomPricing(roomType, checkInDate, checkOutDate)
            }));

            const filteredRoomTypes = this._filterByPriceRange(roomTypesWithPricing, priceRange);

            if (filteredRoomTypes.length > 0) {
              const hotelWithRooms = {
                hotel: {
                  id: hotel.id,
                  name: hotel.name,
                  description: hotel.description,
                  address: hotel.address,
                  contact: hotel.contact,
                  amenities: hotel.amenities,
                  rating: hotel.rating,
                  images: hotel.images
                },
                availableRoomTypes: filteredRoomTypes,
                matchScore: this._calculateMatchScore(hotel, filteredRoomTypes, searchCriteria)
              };

              roomSearchResults.push(hotelWithRooms);
            }
          }
        } catch (roomSearchError) {
          console.warn(`Error buscando habitaciones para hotel ${hotel.id}:`, roomSearchError.message);
        }
      }
      const sortedResults = this._sortResultsByRelevance(roomSearchResults, searchCriteria);

      return {
        success: true,
        message: `Se encontraron ${sortedResults.length} hoteles con habitaciones disponibles`,
        data: {
          results: sortedResults,
          summary: {
            totalHotels: sortedResults.length,
            totalRoomTypes: sortedResults.reduce((sum, result) => sum + result.availableRoomTypes.length, 0),
            searchCriteria: searchCriteria,
            priceRange: this._calculateResultsPriceRange(sortedResults)
          }
        }
      };

    } catch (error) {
      console.error('Error en searchAvailableRooms:', error);
      return {
        success: false,
        message: 'Error interno del servidor durante la búsqueda',
        error: error.message
      };
    }
  }

  /**
   * Validar criterios de búsqueda
   */
  _validateSearchCriteria(criteria) {
    const { location, numberOfGuests, priceRange, checkInDate, checkOutDate } = criteria;

    if (!location || typeof location !== 'string' || location.trim().length === 0) {
      throw new Error('La ubicación es requerida y debe ser una cadena válida');
    }

    if (!numberOfGuests || !Number.isInteger(numberOfGuests) || numberOfGuests <= 0) {
      throw new Error('El número de personas debe ser un entero mayor a cero');
    }

    if (numberOfGuests > 12) {
      throw new Error('El número máximo de personas permitido es 12');
    }

    if (priceRange) {
      if (priceRange.min !== undefined && (typeof priceRange.min !== 'number' || priceRange.min < 0)) {
        throw new Error('El precio mínimo debe ser un número mayor o igual a cero');
      }

      if (priceRange.max !== undefined && (typeof priceRange.max !== 'number' || priceRange.max < 0)) {
        throw new Error('El precio máximo debe ser un número mayor o igual a cero');
      }

      if (priceRange.min !== undefined && priceRange.max !== undefined && priceRange.min > priceRange.max) {
        throw new Error('El precio mínimo no puede ser mayor al precio máximo');
      }
    }

    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      
      if (checkIn >= checkOut) {
        throw new Error('La fecha de entrada debe ser anterior a la fecha de salida');
      }

      if (checkIn < new Date().setHours(0, 0, 0, 0)) {
        throw new Error('La fecha de entrada no puede ser en el pasado');
      }
    }
  }

  /**
   * Construir filtros para búsqueda de hoteles
   */
  _buildHotelFilters(location) {
    return {
      $or: [
        { 'address.city': { $regex: location, $options: 'i' } },
        { 'address.state': { $regex: location, $options: 'i' } },
        { 'address.country': { $regex: location, $options: 'i' } }
      ],
      availability: true
    };
  }

  /**
   * Construir filtros para búsqueda de tipos de habitaciones
   */
  _buildRoomTypeFilters({ hotelId, numberOfGuests, amenities, checkInDate, checkOutDate }) {
    const filters = {
      hotelId,
      capacity: numberOfGuests,
      availability: true
    };

    if (amenities && amenities.length > 0) {
      filters.amenities = amenities;
    }

    if (checkInDate && checkOutDate) {
      filters.checkInDate = checkInDate;
      filters.checkOutDate = checkOutDate;
    }

    return filters;
  }

  /**
   * Calcular precio total para estadía
   */
  _calculateRoomPricing(roomType, checkInDate, checkOutDate) {
    if (!checkInDate || !checkOutDate) {
      return {
        pricePerNight: roomType.pricing.basePrice,
        currency: roomType.pricing.currency,
        nights: 1,
        totalPrice: roomType.pricing.basePrice
      };
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    return roomType.calculatePrice ?
        roomType.calculatePrice(nights) :
        {
          basePrice: roomType.pricing.basePrice,
          nights,
          totalPrice: roomType.pricing.basePrice * nights,
          currency: roomType.pricing.currency
        };
  }

  /**
   * Filtrar tipos de habitaciones por rango de precios basado en el precio calculado
   * @param {Array} roomTypes - Array de tipos de habitaciones con calculatedPricing
   * @param {Object} priceRange - Rango de precios a aplicar
   * @param {number} [priceRange.min] - Precio mínimo total de estadía
   * @param {number} [priceRange.max] - Precio máximo total de estadía
   * @returns {Array} Array filtrado de tipos de habitaciones
   */
  _filterByPriceRange(roomTypes, priceRange) {
    if (!priceRange || (!priceRange.min && !priceRange.max)) {
      return roomTypes;
    }

    return roomTypes.filter(roomType => {
      const totalPrice = roomType.calculatedPricing.totalPrice;

      let meetsPriceRange = true;

      if (priceRange.min !== undefined) {
        meetsPriceRange = meetsPriceRange && totalPrice >= priceRange.min;
      }

      if (priceRange.max !== undefined) {
        meetsPriceRange = meetsPriceRange && totalPrice <= priceRange.max;
      }

      return meetsPriceRange;
    });
  }

  /**
   * Calcular puntuación de coincidencia
   */
  _calculateMatchScore(hotel, roomTypes, searchCriteria) {
    let score = 0;

    score += 10;

    score += Math.min(roomTypes.length * 2, 10);

    if (searchCriteria.amenities && hotel.amenities) {
      const matchingAmenities = searchCriteria.amenities.filter(amenity =>
        hotel.amenities.some(hotelAmenity =>
          hotelAmenity.toLowerCase().includes(amenity.toLowerCase())
        )
      );
      score += matchingAmenities.length * 3;
    }

    if (hotel.rating && hotel.rating.average) {
      score += hotel.rating.average * 2;
    }

    const priceVariety = new Set(roomTypes.map(rt => Math.floor(rt.pricing.basePrice / 50))).size;
    score += priceVariety * 2;

    return Math.min(score, 100);
  }

  /**
   * Ordenar resultados por relevancia
   */
  _sortResultsByRelevance(results, searchCriteria) {
    return results.sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }

      if (b.availableRoomTypes.length !== a.availableRoomTypes.length) {
        return b.availableRoomTypes.length - a.availableRoomTypes.length;
      }

      const aRating = a.hotel.rating?.average || 0;
      const bRating = b.hotel.rating?.average || 0;
      return bRating - aRating;
    });
  }

  /**
   * Calcular rango de precios de los resultados
   */
  _calculateResultsPriceRange(results) {
    if (results.length === 0) return null;

    let minPrice = Infinity;
    let maxPrice = -Infinity;

    results.forEach(result => {
      result.availableRoomTypes.forEach(roomType => {
        const price = roomType.pricing.basePrice;
        minPrice = Math.min(minPrice, price);
        maxPrice = Math.max(maxPrice, price);
      });
    });

    return {
      min: minPrice === Infinity ? 0 : minPrice,
      max: maxPrice === -Infinity ? 0 : maxPrice,
      currency: results[0].availableRoomTypes[0]?.pricing?.currency || 'USD'
    };
  }
}

export default RoomSearchUseCases;
