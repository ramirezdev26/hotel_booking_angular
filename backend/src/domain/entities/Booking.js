/**
 * Entidad Booking para el dominio
 * Define la estructura y reglas de negocio para las reservas
 */

export class Booking {
  constructor({
    id,
    hotelId,
    roomTypeId,
    guestName,
    guestLastName,
    guestPhone,
    guestEmail,
    checkInDate,
    checkOutDate,
    numberOfGuests,
    totalAmount,
    status = 'pending',
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id;
    this.hotelId = hotelId;
    this.roomTypeId = roomTypeId;
    this.guestName = guestName;
    this.guestLastName = guestLastName;
    this.guestPhone = guestPhone;
    this.guestEmail = guestEmail;
    this.checkInDate = checkInDate;
    this.checkOutDate = checkOutDate;
    this.numberOfGuests = numberOfGuests;
    this.totalAmount = totalAmount;
    this.status = status; // pending, confirmed, cancelled
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  validate() {
    const errors = [];

    if (!this.hotelId) errors.push('Hotel ID es requerido');
    if (!this.roomTypeId) errors.push('Room Type ID es requerido');
    if (!this.guestName?.trim()) errors.push('Nombre del huésped es requerido');
    if (!this.guestLastName?.trim()) errors.push('Apellido del huésped es requerido');
    if (!this.guestPhone?.trim()) errors.push('Teléfono es requerido');
    if (!this.guestEmail?.trim()) errors.push('Email es requerido');
    if (!this.checkInDate) errors.push('Fecha de check-in es requerida');
    if (!this.checkOutDate) errors.push('Fecha de check-out es requerida');
    if (!this.numberOfGuests || this.numberOfGuests < 1) errors.push('Número de huéspedes debe ser mayor a 0');
    if (!this.totalAmount || this.totalAmount < 0) errors.push('Monto total debe ser mayor o igual a 0');

    if (this.checkInDate && this.checkOutDate) {
      const checkIn = new Date(this.checkInDate);
      const checkOut = new Date(this.checkOutDate);
      
      if (checkIn >= checkOut) {
        errors.push('La fecha de check-out debe ser posterior a la fecha de check-in');
      }
      
      if (checkIn < new Date()) {
        errors.push('La fecha de check-in no puede ser en el pasado');
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.guestEmail && !emailRegex.test(this.guestEmail)) {
      errors.push('Email debe tener un formato válido');
    }

    const phoneRegex = /^[+]?[\d\s\-\(\)]{7,}$/;
    if (this.guestPhone && !phoneRegex.test(this.guestPhone)) {
      errors.push('Teléfono debe tener un formato válido');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
