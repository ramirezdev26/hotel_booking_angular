/**
 * Modelo MongoDB para Bookings usando Mongoose
 * Define el esquema de datos para las reservas en la base de datos
 */

import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
    index: true
  },
  roomTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RoomType', 
    required: true,
    index: true
  },
  guestName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  guestLastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  guestPhone: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20
  },
  guestEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 150,
    index: true
  },
  checkInDate: {
    type: Date,
    required: true,
    index: true
  },
  checkOutDate: {
    type: Date,
    required: true,
    index: true
  },
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'bookings'
});

bookingSchema.index({ hotelId: 1, checkInDate: 1, checkOutDate: 1 });
bookingSchema.index({ guestEmail: 1, status: 1 });
bookingSchema.index({ status: 1, createdAt: -1 });

bookingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
