/**
 * Entidad Hotel - Representa el modelo de dominio de un hotel
 * Define la estructura y reglas de negocio para los hoteles
 */

export class Hotel {
  constructor({
    id,
    name,
    description,
    address,
    images = [],
    amenities = [],
    rating = { average: 0, totalReviews: 0 },
    contact,
    policies = {},
    isActive = true,
    ownerId,
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.address = address;
    this.images = images;
    this.amenities = amenities;
    this.rating = rating;
    this.contact = contact;
    this.policies = policies;
    this.isActive = isActive;
    this.ownerId = ownerId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Valida que los datos del hotel sean correctos
   */
  validate() {
    const errors = [];

    if (!this.name || this.name.trim().length < 2) {
      errors.push('El nombre del hotel debe tener al menos 2 caracteres');
    }

    if (!this.description || this.description.trim().length < 10) {
      errors.push('La descripción debe tener al menos 10 caracteres');
    }

    if (!this.address || !this.address.street || !this.address.city || !this.address.country) {
      errors.push('La dirección debe incluir calle, ciudad y país');
    }

    if (!this.contact || !this.contact.phone || !this.contact.email) {
      errors.push('Debe proporcionar teléfono y email de contacto');
    }

    if (this.contact && this.contact.email && !this.isValidEmail(this.contact.email)) {
      errors.push('El email de contacto no tiene un formato válido');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valida formato de email
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Actualiza el rating del hotel
   */
  updateRating(newRating, reviewsCount) {
    this.rating = {
      average: Number(newRating.toFixed(1)),
      totalReviews: reviewsCount
    };
    this.updatedAt = new Date();
  }

  /**
   * Marca el hotel como activo/inactivo
   */
  setActiveStatus(isActive) {
    this.isActive = isActive;
    this.updatedAt = new Date();
  }

  /**
   * Convierte la entidad a un objeto plano para la base de datos
   */
  toDatabase() {
    return {
      name: this.name,
      description: this.description,
      address: this.address,
      images: this.images,
      amenities: this.amenities,
      rating: this.rating,
      contact: this.contact,
      policies: this.policies,
      isActive: this.isActive,
      ownerId: this.ownerId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Crea una instancia desde datos de base de datos
   */
  static fromDatabase(data) {
    return new Hotel({
      id: data.id?.toString() || data._id?.toString() ,
      name: data.name,
      description: data.description,
      address: data.address,
      images: data.images,
      amenities: data.amenities,
      rating: data.rating,
      contact: data.contact,
      policies: data.policies,
      isActive: data.isActive,
      ownerId: data.ownerId?.toString(),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }
}

export default Hotel;
