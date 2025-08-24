/**
 * Repositorio abstracto para Bookings
 * Define la interfaz para operaciones de persistencia de reservas
 */

export default class BookingRepository {
  async create(booking) {
    throw new Error('create method must be implemented');
  }

  async findById(id) {
    throw new Error('findById method must be implemented');
  }

  async findAll(filters = {}, pagination = {}) {
    throw new Error('findAll method must be implemented');
  }

  async findByGuestEmail(email) {
    throw new Error('findByGuestEmail method must be implemented');
  }

  async delete(id) {
    throw new Error('delete method must be implemented');
  }
}
