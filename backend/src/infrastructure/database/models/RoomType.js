import mongoose from 'mongoose';

const roomTypeSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  capacity: {
    adults: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    children: {
      type: Number,
      default: 0,
      min: 0,
      max: 8
    },
    totalGuests: {
      type: Number,
      required: true,
      min: 1,
      max: 12
    }
  },
  bedConfiguration: {
    singleBeds: {
      type: Number,
      default: 0,
      min: 0,
      max: 6
    },
    doubleBeds: {
      type: Number,
      default: 0,
      min: 0,
      max: 4
    },
    sofaBeds: {
      type: Number,
      default: 0,
      min: 0,
      max: 2
    }
  },
  amenities: [{
    type: String,
    trim: true,
    enum: [
      'wifi', 'tv', 'air_conditioning', 'minibar', 'safe', 'balcony',
      'city_view', 'ocean_view', 'garden_view', 'bathtub', 'shower',
      'hair_dryer', 'coffee_maker', 'refrigerator', 'microwave',
      'room_service', 'housekeeping', 'iron', 'desk', 'sofa',
      'telephone', 'alarm_clock', 'blackout_curtains'
    ]
  }],
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(v);
      },
      message: 'Invalid image URL format'
    }
  }],
  pricing: {
    basePrice: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      required: true,
      enum: ['USD', 'EUR', 'BOB'],
      default: 'USD'
    },
    discounts: [{
      type: {
        type: String,
        enum: ['early_bird', 'family', 'extended_stay', 'seasonal'],
        required: true
      },
      description: {
        type: String,
        required: true,
        maxlength: 200
      },
      percentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
      },
      validFrom: {
        type: Date
      },
      validTo: {
        type: Date
      },
      minNights: {
        type: Number,
        min: 1
      }
    }]
  },
  availability: {
    type: Boolean,
    default: true
  },
  maxOccupancy: {
    type: Number,
    default: 1,
    min: 1
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices compuestos para búsquedas optimizadas
roomTypeSchema.index({ hotelId: 1, availability: 1 });
roomTypeSchema.index({ 'capacity.totalGuests': 1, 'pricing.basePrice': 1 });
roomTypeSchema.index({ amenities: 1 });
roomTypeSchema.index({ 'pricing.basePrice': 1 });

// Virtual para obtener información del hotel
roomTypeSchema.virtual('Hotel', {
  ref: 'Hotel',
  localField: 'hotelId',
  foreignField: '_id',
  justOne: true
});

// Middleware para validar que totalGuests sea consistente
roomTypeSchema.pre('save', function(next) {
  if (this.capacity.adults + this.capacity.children > this.capacity.totalGuests) {
    next(new Error('Total guests capacity is inconsistent with adults and children capacity'));
  } else {
    next();
  }
});

// Métodos de instancia
roomTypeSchema.methods.canAccommodate = function(adults, children = 0) {
  const totalGuests = adults + children;
  return totalGuests <= this.capacity.totalGuests && adults <= this.capacity.adults;
};

roomTypeSchema.methods.calculatePrice = function(nights = 1, discountType = null) {
  let basePrice = this.pricing.basePrice * nights;

  if (discountType && this.pricing.discounts.length > 0) {
    const discount = this.pricing.discounts.find(d =>
      d.type === discountType &&
      (!d.validFrom || d.validFrom <= new Date()) &&
      (!d.validTo || d.validTo >= new Date())
    );

    if (discount && (!discount.minNights || nights >= discount.minNights)) {
      const discountAmount = basePrice * (discount.percentage / 100);
      basePrice -= discountAmount;
    }
  }

  return {
    basePrice: this.pricing.basePrice,
    nights,
    subtotal: this.pricing.basePrice * nights,
    discount: (this.pricing.basePrice * nights) - basePrice,
    totalPrice: basePrice,
    currency: this.pricing.currency
  };
};

// Métodos estáticos
roomTypeSchema.statics.findByCapacity = function(minCapacity) {
  return this.find({
    'capacity.totalGuests': { $gte: minCapacity },
    availability: true
  });
};

roomTypeSchema.statics.findByPriceRange = function(minPrice, maxPrice) {
  return this.find({
    'pricing.basePrice': { $gte: minPrice, $lte: maxPrice },
    availability: true
  });
};

roomTypeSchema.statics.findByAmenities = function(amenities) {
  return this.find({
    amenities: { $all: amenities },
    availability: true
  });
};

export default mongoose.model('RoomType', roomTypeSchema);