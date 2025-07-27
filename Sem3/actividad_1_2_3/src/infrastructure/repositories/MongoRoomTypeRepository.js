import RoomTypeRepository from '../../domain/repositories/RoomTypeRepository.js';
import RoomTypeModel from '../database/models/RoomType.js';
import RoomType from '../../domain/entities/RoomType.js';
import mongoose from 'mongoose';


/**
 * MongoDB implementation of RoomType Repository
 */
class MongoRoomTypeRepository extends RoomTypeRepository {
    constructor() {
        super();
        this.model = RoomTypeModel;
    }

    async create(roomType) {
        try {
            const roomTypeDoc = new this.model({
                hotelId: roomType.hotelId,
                name: roomType.name,
                description: roomType.description,
                capacity: roomType.capacity,
                bedConfiguration: roomType.bedConfiguration,
                amenities: roomType.amenities,
                images: roomType.images,
                pricing: roomType.pricing,
                availability: roomType.availability
            });

            const savedRoomType = await roomTypeDoc.save();
            return this._mapToEntity(savedRoomType);
        } catch (error) {
            throw new Error(`Error creating room type: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            const roomType = await this.model.findById(id).populate('hotelId');
            return roomType ? this._mapToEntity(roomType) : null;
        } catch (error) {
            throw new Error(`Error finding room type by ID: ${error.message}`);
        }
    }

    async findAll(filters = {}) {
        try {
            const {
                page = 1,
                limit = 10,
                sortBy = 'createdAt',
                sortOrder = 'desc',
                priceRange,
                amenities,
                availability = true,
                capacity,
                ...otherFilters
            } = filters;

            let query = {availability, ...otherFilters};

            if (priceRange) {
                query['pricing.basePrice'] = {};
                if (priceRange.min) query['pricing.basePrice'].$gte = priceRange.min;
                if (priceRange.max) query['pricing.basePrice'].$lte = priceRange.max;
            }

            if (amenities && amenities.length > 0) {
                query.amenities = {$all: amenities};
            }

            if (capacity) {
                query['capacity.totalGuests'] = {$gte: capacity};
            }

            const skip = (page - 1) * limit;
            const sort = {[sortBy]: sortOrder === 'desc' ? -1 : 1};

            const [roomTypes, total] = await Promise.all([
                this.model.find(query)
                    .populate('hotelId')
                    .sort(sort)
                    .skip(skip)
                    .limit(parseInt(limit)),
                this.model.countDocuments(query)
            ]);

            return {
                data: roomTypes.map(rt => this._mapToEntity(rt)),
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw new Error(`Error finding room types: ${error.message}`);
        }
    }

    async findByHotelId(hotelId, filters = {}) {
        try {
            const {
                page = 1,
                limit = 10,
                sortBy = 'createdAt',
                sortOrder = 'desc',
                availability = true,
                ...otherFilters
            } = filters;

            const query = {
                hotelId: new mongoose.Types.ObjectId(hotelId),
                availability,
                ...otherFilters
            };

            const skip = (page - 1) * limit;
            const sort = {[sortBy]: sortOrder === 'desc' ? -1 : 1};

            const [roomTypes, total] = await Promise.all([
                this.model.find(query)
                    .populate('hotelId')
                    .sort(sort)
                    .skip(skip)
                    .limit(parseInt(limit)),
                this.model.countDocuments(query)
            ]);

            return {
                data: roomTypes.map(rt => this._mapToEntity(rt)),
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw new Error(`Error finding room types by hotel ID: ${error.message}`);
        }
    }

    async update(id, roomTypeData) {
        try {
            const updatedRoomType = await this.model.findByIdAndUpdate(
                id,
                {...roomTypeData, updatedAt: new Date()},
                {new: true, runValidators: true}
            ).populate('hotelId');

            return updatedRoomType ? this._mapToEntity(updatedRoomType) : null;
        } catch (error) {
            throw new Error(`Error updating room type: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            const deletedRoomType = await this.model.findByIdAndDelete(id);
            return deletedRoomType ? this._mapToEntity(deletedRoomType) : null;
        } catch (error) {
            throw new Error(`Error deleting room type: ${error.message}`);
        }
    }

    async checkAvailability(roomTypeId, checkInDate, checkOutDate) {
        try {
            const roomType = await this.model.findById(roomTypeId);

            if (!roomType || !roomType.availability) {
                return {
                    available: false,
                    reason: 'Room type not found or not available'
                };
            }

            return {
                available: true,
                roomType: this._mapToEntity(roomType),
                checkInDate,
                checkOutDate
            };
        } catch (error) {
            throw new Error(`Error checking availability: ${error.message}`);
        }
    }

    async findByCapacity(minCapacity, filters = {}) {
        try {
            const {
                page = 1,
                limit = 10,
                sortBy = 'createdAt',
                sortOrder = 'desc',
                availability = true,
                priceRange,
                amenities,
                ...otherFilters
            } = filters;

            const query = {
                'capacity.totalGuests': {$gte: minCapacity},
                availability,
                ...otherFilters
            };

            if (priceRange) {
                query['pricing.basePrice'] = {};
                if (priceRange.min) query['pricing.basePrice'].$gte = priceRange.min;
                if (priceRange.max) query['pricing.basePrice'].$lte = priceRange.max;
            }

            if (amenities && amenities.length > 0) {
                query.amenities = {$all: amenities};
            }

            const skip = (page - 1) * limit;
            const sort = {[sortBy]: sortOrder === 'desc' ? -1 : 1};

            const [roomTypes, total] = await Promise.all([
                this.model.find(query)
                    .populate('hotelId')
                    .sort(sort)
                    .skip(skip)
                    .limit(parseInt(limit)),
                this.model.countDocuments(query)
            ]);

            return {
                data: roomTypes.map(rt => this._mapToEntity(rt)),
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw new Error(`Error finding room types by capacity: ${error.message}`);
        }
    }

    async updatePricing(id, pricingData) {
        try {
            const update = {};

            if (pricingData.basePrice) {
                update['pricing.basePrice'] = pricingData.basePrice;
            }

            if (pricingData.currency) {
                update['pricing.currency'] = pricingData.currency;
            }

            if (pricingData.discounts) {
                update['pricing.discounts'] = pricingData.discounts;
            }

            update.updatedAt = new Date();

            const updatedRoomType = await this.model.findByIdAndUpdate(
                id,
                update,
                {new: true, runValidators: true}
            ).populate('hotelId');

            return updatedRoomType ? this._mapToEntity(updatedRoomType) : null;
        } catch (error) {
            throw new Error(`Error updating room type pricing: ${error.message}`);
        }
    }

    /**
     * Mapea un documento de MongoDB a una entidad del dominio
     */
    _mapToEntity(doc) {
        if (!doc) return null;

        return new RoomType({
            id: doc._id.toString(),
            hotelId: doc.hotelId._id ? doc.hotelId._id.toString() : doc.hotelId.toString(),
            name: doc.name,
            description: doc.description,
            capacity: doc.capacity,
            bedConfiguration: doc.bedConfiguration,
            amenities: doc.amenities,
            images: doc.images,
            pricing: doc.pricing,
            availability: doc.availability,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            hotel: doc.hotelId && doc.hotelId._id ? {
                id: doc.hotelId._id.toString(),
                name: doc.hotelId.name,
                address: doc.hotelId.address
            } : undefined
        });
    }
}

export default MongoRoomTypeRepository;
