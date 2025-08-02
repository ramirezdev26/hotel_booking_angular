/**
 * RoomType Entity
 * Representa un tipo de habitación en el dominio
 */
class RoomType {
  constructor({
    id,
    hotelId,
    name,
    description,
    capacity,
    bedConfiguration,
    amenities = [],
    images = [],
    pricing,
    availability = true,
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id;
    this.hotelId = hotelId;
    this.name = name;
    this.description = description;
    this.capacity = capacity;
    this.bedConfiguration = bedConfiguration;
    this.amenities = amenities;
    this.images = images;
    this.pricing = pricing;
    this.availability = availability;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Métodos de negocio
  isAvailable() {
    return this.availability;
  }

  canAccommodate(adults, children = 0) {
    const totalGuests = adults + children;
    return totalGuests <= this.capacity.totalGuests && 
           adults <= this.capacity.adults;
  }

  calculatePrice(nights = 1, discountType = null) {
    let basePrice = this.pricing.basePrice * nights;
    
    if (discountType && this.pricing.discounts) {
      const discount = this.pricing.discounts.find(d => d.type === discountType);
      if (discount) {
        basePrice = basePrice * (1 - discount.percentage / 100);
      }
    }
    
    return {
      basePrice: this.pricing.basePrice,
      nights,
      subtotal: this.pricing.basePrice * nights,
      discount: basePrice !== this.pricing.basePrice * nights ? 
                (this.pricing.basePrice * nights) - basePrice : 0,
      totalPrice: basePrice,
      currency: this.pricing.currency
    };
  }

  updatePricing(newPricing) {
    this.pricing = { ...this.pricing, ...newPricing };
    this.updatedAt = new Date();
  }

  addAmenity(amenity) {
    if (!this.amenities.includes(amenity)) {
      this.amenities.push(amenity);
      this.updatedAt = new Date();
    }
  }

  removeAmenity(amenity) {
    this.amenities = this.amenities.filter(a => a !== amenity);
    this.updatedAt = new Date();
  }
}

export default RoomType;
