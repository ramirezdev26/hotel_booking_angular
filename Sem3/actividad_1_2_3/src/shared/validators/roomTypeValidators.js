import Joi from 'joi';

/**
 * Validadores para operaciones con tipos de habitación
 */

    // Validador para crear un nuevo tipo de habitación
export const createRoomTypeValidator = Joi.object({
        hotelId: Joi.string()
            .required()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .messages({
                'string.pattern.base': 'Hotel ID must be a valid MongoDB ObjectId',
                'any.required': 'Hotel ID is required'
            }),

        name: Joi.string()
            .required()
            .trim()
            .min(2)
            .max(100)
            .messages({
                'string.min': 'Name must be at least 2 characters',
                'string.max': 'Name cannot exceed 100 characters',
                'any.required': 'Name is required'
            }),

        description: Joi.string()
            .trim()
            .max(1000)
            .optional()
            .messages({
                'string.max': 'Description cannot exceed 1000 characters'
            }),

        capacity: Joi.object({
            adults: Joi.number()
                .integer()
                .min(1)
                .max(10)
                .required()
                .messages({
                    'number.min': 'Adults capacity must be at least 1',
                    'number.max': 'Adults capacity cannot exceed 10',
                    'any.required': 'Adults capacity is required'
                }),

            children: Joi.number()
                .integer()
                .min(0)
                .max(8)
                .default(0)
                .messages({
                    'number.min': 'Children capacity cannot be negative',
                    'number.max': 'Children capacity cannot exceed 8'
                }),

            totalGuests: Joi.number()
                .integer()
                .min(1)
                .max(12)
                .required()
                .messages({
                    'number.min': 'Total guests capacity must be at least 1',
                    'number.max': 'Total guests capacity cannot exceed 12',
                    'any.required': 'Total guests capacity is required'
                })
        }).required(),

        bedConfiguration: Joi.object({
            singleBeds: Joi.number()
                .integer()
                .min(0)
                .max(6)
                .default(0),

            doubleBeds: Joi.number()
                .integer()
                .min(0)
                .max(4)
                .default(0),

            sofaBeds: Joi.number()
                .integer()
                .min(0)
                .max(2)
                .default(0)
        }).optional(),

        amenities: Joi.array()
            .items(
                Joi.string().valid(
                    'wifi', 'tv', 'air_conditioning', 'minibar', 'safe', 'balcony',
                    'city_view', 'ocean_view', 'garden_view', 'bathtub', 'shower',
                    'hair_dryer', 'coffee_maker', 'refrigerator', 'microwave',
                    'room_service', 'housekeeping', 'iron', 'desk', 'sofa',
                    'telephone', 'alarm_clock', 'blackout_curtains'
                )
            )
            .default([])
            .messages({
                'any.only': 'Invalid amenity type'
            }),

        images: Joi.array()
            .items(
                Joi.string()
                    .uri()
                    .pattern(/\.(jpg|jpeg|png|webp)$/i)
                    .messages({
                        'string.pattern.base': 'Image must be a valid URL with jpg, jpeg, png, or webp format',
                        'string.uri': 'Image must be a valid URL'
                    })
            )
            .default([]),

        pricing: Joi.object({
            basePrice: Joi.number()
                .positive()
                .required()
                .messages({
                    'number.positive': 'Base price must be a positive number',
                    'any.required': 'Base price is required'
                }),

            currency: Joi.string()
                .valid('USD', 'EUR', 'BOB')
                .default('USD')
                .messages({
                    'any.only': 'Currency must be USD, EUR, or BOB'
                }),

            discounts: Joi.array()
                .items(
                    Joi.object({
                        type: Joi.string()
                            .valid('early_bird', 'family', 'extended_stay', 'seasonal')
                            .required(),

                        description: Joi.string()
                            .required()
                            .max(200),

                        percentage: Joi.number()
                            .min(0)
                            .max(100)
                            .required(),

                        validFrom: Joi.date().optional(),
                        validTo: Joi.date().optional(),
                        minNights: Joi.number().integer().min(1).optional()
                    })
                )
                .default([])
        }).required(),

        availability: Joi.boolean()
            .default(true),

        maxOccupancy: Joi.number()
            .integer()
            .min(1)
            .default(1)
    });

// Validador para actualizar un tipo de habitación
export const updateRoomTypeValidator = Joi.object({
    hotelId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
            'string.pattern.base': 'Hotel ID must be a valid MongoDB ObjectId'
        }),

    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .messages({
            'string.min': 'Name must be at least 2 characters',
            'string.max': 'Name cannot exceed 100 characters'
        }),

    description: Joi.string()
        .trim()
        .max(1000)
        .messages({
            'string.max': 'Description cannot exceed 1000 characters'
        }),

    capacity: Joi.object({
        adults: Joi.number()
            .integer()
            .min(1)
            .max(10)
            .messages({
                'number.min': 'Adults capacity must be at least 1',
                'number.max': 'Adults capacity cannot exceed 10'
            }),

        children: Joi.number()
            .integer()
            .min(0)
            .max(8)
            .messages({
                'number.min': 'Children capacity cannot be negative',
                'number.max': 'Children capacity cannot exceed 8'
            }),

        totalGuests: Joi.number()
            .integer()
            .min(1)
            .max(12)
            .messages({
                'number.min': 'Total guests capacity must be at least 1',
                'number.max': 'Total guests capacity cannot exceed 12'
            })
    }),

    bedConfiguration: Joi.object({
        singleBeds: Joi.number().integer().min(0).max(6),
        doubleBeds: Joi.number().integer().min(0).max(4),
        sofaBeds: Joi.number().integer().min(0).max(2)
    }),

    amenities: Joi.array()
        .items(
            Joi.string().valid(
                'wifi', 'tv', 'air_conditioning', 'minibar', 'safe', 'balcony',
                'city_view', 'ocean_view', 'garden_view', 'bathtub', 'shower',
                'hair_dryer', 'coffee_maker', 'refrigerator', 'microwave',
                'room_service', 'housekeeping', 'iron', 'desk', 'sofa',
                'telephone', 'alarm_clock', 'blackout_curtains'
            )
        ),

    images: Joi.array()
        .items(
            Joi.string()
                .uri()
                .pattern(/\.(jpg|jpeg|png|webp)$/i)
        ),

    pricing: Joi.object({
        basePrice: Joi.number().positive(),
        currency: Joi.string().valid('USD', 'EUR', 'BOB'),
        discounts: Joi.array()
            .items(
                Joi.object({
                    type: Joi.string()
                        .valid('early_bird', 'family', 'extended_stay', 'seasonal')
                        .required(),
                    description: Joi.string().required().max(200),
                    percentage: Joi.number().min(0).max(100).required(),
                    validFrom: Joi.date().optional(),
                    validTo: Joi.date().optional(),
                    minNights: Joi.number().integer().min(1).optional()
                })
            )
    }),

    availability: Joi.boolean(),
    maxOccupancy: Joi.number().integer().min(1)
});

// Validador para búsqueda de tipos de habitación
export const searchRoomTypesValidator = Joi.object({
    hotelId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
            'string.pattern.base': 'Hotel ID must be a valid MongoDB ObjectId'
        }),

    capacity: Joi.number()
        .integer()
        .min(1)
        .messages({
            'number.min': 'Capacity must be at least 1'
        }),

    priceRange: Joi.object({
        min: Joi.number().positive().optional(),
        max: Joi.number().positive().optional()
    }).optional(),

    amenities: Joi.array()
        .items(Joi.string())
        .optional(),

    checkInDate: Joi.date()
        .iso()
        .min('now')
        .optional(),

    checkOutDate: Joi.date()
        .iso()
        .greater(Joi.ref('checkInDate'))
        .optional(),

    page: Joi.number()
        .integer()
        .min(1)
        .default(1),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10),

    sortBy: Joi.string()
        .valid('name', 'pricing.basePrice', 'capacity.totalGuests', 'createdAt')
        .default('createdAt'),

    sortOrder: Joi.string()
        .valid('asc', 'desc')
        .default('desc')
});

// Validador para verificar disponibilidad
export const checkAvailabilityValidator = Joi.object({
    roomTypeId: Joi.string()
        .required()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
            'string.pattern.base': 'Room Type ID must be a valid MongoDB ObjectId',
            'any.required': 'Room Type ID is required'
        }),

    checkInDate: Joi.date()
        .iso()
        .required()
        .min('now')
        .messages({
            'date.min': 'Check-in date must be today or in the future',
            'any.required': 'Check-in date is required'
        }),

    checkOutDate: Joi.date()
        .iso()
        .required()
        .greater(Joi.ref('checkInDate'))
        .messages({
            'date.greater': 'Check-out date must be after check-in date',
            'any.required': 'Check-out date is required'
        })
});

// Validador para actualizar precios
export const updatePricingValidator = Joi.object({
    basePrice: Joi.number()
        .positive()
        .messages({
            'number.positive': 'Base price must be a positive number'
        }),

    currency: Joi.string()
        .valid('USD', 'EUR', 'BOB')
        .messages({
            'any.only': 'Currency must be USD, EUR, or BOB'
        }),

    discounts: Joi.array()
        .items(
            Joi.object({
                type: Joi.string()
                    .valid('early_bird', 'family', 'extended_stay', 'seasonal')
                    .required(),
                description: Joi.string().required().max(200),
                percentage: Joi.number().min(0).max(100).required(),
                validFrom: Joi.date().optional(),
                validTo: Joi.date().optional(),
                minNights: Joi.number().integer().min(1).optional()
            })
        )
}).min(1);

// Validador para parámetros de ID
export const roomTypeIdValidator = Joi.object({
    id: Joi.string()
        .required()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
            'string.pattern.base': 'ID must be a valid MongoDB ObjectId',
            'any.required': 'ID is required'
        })
});

// Validador para query parameters comunes
export const queryParamsValidator = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    hotelId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
    availability: Joi.boolean().default(true)
});

// Función helper para validar capacidad consistente
export const validateCapacityConsistency = (capacity) => {
    if (capacity.adults + capacity.children > capacity.totalGuests) {
        throw new Error('Total guests capacity must be at least the sum of adults and children');
    }
    return true;
};