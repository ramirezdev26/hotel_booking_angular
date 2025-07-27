/**
 * Modelo de MongoDB para hoteles
 * Define el esquema y validaciones de base de datos
 */

import mongoose from 'mongoose';

const coordinatesSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,
    min: -180,
    max: 180
  }
}, { _id: false });

const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  city: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  state: {
    type: String,
    trim: true,
    maxlength: 100
  },
  country: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  zipCode: {
    type: String,
    trim: true,
    maxlength: 20
  },
  coordinates: coordinatesSchema
}, { _id: false });

const ratingSchema = new mongoose.Schema({
  average: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalReviews: {
    type: Number,
    min: 0,
    default: 0
  }
}, { _id: false });

const contactSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email no válido']
  },
  website: {
    type: String,
    trim: true
  }
}, { _id: false });

const policiesSchema = new mongoose.Schema({
  checkIn: {
    type: String,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)']
  },
  checkOut: {
    type: String,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)']
  },
  cancellation: {
    type: String,
    trim: true
  },
  children: {
    type: String,
    trim: true
  }
}, { _id: false });

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del hotel es requerido'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true,
    minlength: [10, 'La descripción debe tener al menos 10 caracteres'],
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  address: {
    type: addressSchema,
    required: [true, 'La dirección es requerida']
  },
  images: [{
    type: String,
    trim: true
  }],
  amenities: [{
    type: String,
    trim: true,
    enum: [
      'WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Parking',
      'Room Service', 'Laundry', 'Business Center', 'Conference Rooms',
      'Pet Friendly', 'Airport Shuttle', 'Concierge', 'Air Conditioning',
      'Elevator', 'Balcony', 'Kitchen', 'TV', 'Minibar', 'Safe'
    ]
  }],
  rating: {
    type: ratingSchema,
    default: () => ({ average: 0, totalReviews: 0 })
  },
  contact: {
    type: contactSchema,
    required: [true, 'La información de contacto es requerida']
  },
  policies: {
    type: policiesSchema,
    default: () => ({})
  },
  isActive: {
    type: Boolean,
    default: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Será requerido cuando implementemos autenticación
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Índices para mejorar rendimiento de consultas
hotelSchema.index({ 'address.city': 1 });
hotelSchema.index({ 'address.country': 1 });
hotelSchema.index({ 'rating.average': -1 });
hotelSchema.index({ name: 'text', description: 'text' });
hotelSchema.index({ amenities: 1 });
hotelSchema.index({ isActive: 1 });

// Middleware para actualizar updatedAt en updates
hotelSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function() {
  this.set({ updatedAt: new Date() });
});

export default mongoose.model('Hotel', hotelSchema);
