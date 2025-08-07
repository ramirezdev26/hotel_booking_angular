import Joi from 'joi';

/**
 * Validadores para el buscador de habitaciones
 */

export const roomSearchValidator = Joi.object({
    location: Joi.string()
        .required()
        .trim()
        .min(2)
        .max(100)
        .messages({
            'string.empty': 'La ubicación es requerida',
            'string.min': 'La ubicación debe tener al menos 2 caracteres',
            'string.max': 'La ubicación no puede exceder 100 caracteres',
            'any.required': 'La ubicación es un campo obligatorio'
        }),

    numberOfGuests: Joi.number()
        .integer()
        .min(1)
        .max(12)
        .required()
        .messages({
            'number.base': 'El número de personas debe ser un número válido',
            'number.integer': 'El número de personas debe ser un número entero',
            'number.min': 'El número de personas debe ser mayor a cero',
            'number.max': 'El número máximo de personas permitido es 12',
            'any.required': 'El número de personas es obligatorio'
        }),

    priceRange: Joi.object({
        min: Joi.number()
            .min(0)
            .messages({
                'number.base': 'El precio mínimo debe ser un número válido',
                'number.min': 'El precio mínimo debe ser mayor o igual a cero'
            }),

        max: Joi.number()
            .min(0)
            .messages({
                'number.base': 'El precio máximo debe ser un número válido',
                'number.min': 'El precio máximo debe ser mayor o igual a cero'
            })
    }).custom((value, helpers) => {
        if (value.min !== undefined && value.max !== undefined && value.min >= value.max) {
            return helpers.error('priceRange.invalid');
        }
        return value;
    }).optional()
        .messages({
            'object.base': 'El rango de precios debe ser un objeto válido',
            'priceRange.invalid': 'El precio mínimo debe ser menor al precio máximo'
        }),

    checkInDate: Joi.date()
        .iso()
        .min('now')
        .optional()
        .messages({
            'date.base': 'La fecha de entrada debe ser una fecha válida',
            'date.format': 'La fecha de entrada debe estar en formato ISO (YYYY-MM-DD)',
            'date.min': 'La fecha de entrada no puede ser en el pasado'
        }),

    checkOutDate: Joi.date()
        .iso()
        .when('checkInDate', {
            is: Joi.exist(),
            then: Joi.date().greater(Joi.ref('checkInDate')).required(),
            otherwise: Joi.date().min('now')
        })
        .optional()
        .messages({
            'date.base': 'La fecha de salida debe ser una fecha válida',
            'date.format': 'La fecha de salida debe estar en formato ISO (YYYY-MM-DD)',
            'date.greater': 'La fecha de salida debe ser posterior a la fecha de entrada',
            'date.min': 'La fecha de salida no puede ser en el pasado',
            'any.required': 'La fecha de salida es requerida cuando se especifica fecha de entrada'
        }),

    amenities: Joi.array()
        .items(
            Joi.string().valid(
                'wifi', 'tv', 'air_conditioning', 'minibar', 'safe', 'balcony',
                'city_view', 'ocean_view', 'garden_view', 'bathtub', 'shower',
                'hair_dryer', 'coffee_maker', 'refrigerator', 'microwave',
                'room_service', 'housekeeping', 'iron', 'desk', 'sofa',
                'telephone', 'alarm_clock', 'blackout_curtains',
                'WiFi', 'Pool', 'Gym', 'Restaurant', 'Parking', 'Spa', 'Bar',
                'Conference Room', 'Business Center', 'Laundry Service'
            )
        )
        .unique()
        .max(10)
        .optional()
        .messages({
            'array.base': 'Las amenidades deben ser un arreglo válido',
            'array.unique': 'No se pueden repetir amenidades',
            'array.max': 'Máximo 10 amenidades permitidas',
            'any.only': 'Amenidad no válida'
        }),

    sortBy: Joi.string()
        .valid('relevance', 'price_low_to_high', 'price_high_to_low', 'rating', 'name')
        .default('relevance')
        .optional()
        .messages({
            'any.only': 'Criterio de ordenamiento no válido. Opciones: relevance, price_low_to_high, price_high_to_low, rating, name'
        }),

    page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .optional()
        .messages({
            'number.base': 'El número de página debe ser un número válido',
            'number.integer': 'El número de página debe ser un entero',
            'number.min': 'El número de página debe ser mayor a cero'
        }),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(50)
        .default(10)
        .optional()
        .messages({
            'number.base': 'El límite debe ser un número válido',
            'number.integer': 'El límite debe ser un entero',
            'number.min': 'El límite debe ser mayor a cero',
            'number.max': 'El límite máximo es 50 resultados por página'
        })
});

export const roomSearchQueryValidator = Joi.object({
    location: Joi.string().required().trim().min(2).max(100),
    numberOfGuests: Joi.number().integer().min(1).max(12).required(),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional(),
    checkInDate: Joi.date().iso().min('now').optional(),
    checkOutDate: Joi.date().iso().optional(),
    amenities: Joi.string().optional(), // Será convertido a array
    sortBy: Joi.string().valid('relevance', 'price_low_to_high', 'price_high_to_low', 'rating', 'name').default('relevance'),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10)
});

export const processQueryParams = (query) => {
    const processed = {...query};

    if (processed.numberOfGuests) {
        processed.numberOfGuests = parseInt(processed.numberOfGuests);
    }

    if (processed.priceRange.min || processed.priceRange.max) {
        processed.priceRange = {};
        if (processed.priceRange.min) {
            processed.priceRange.min = parseFloat(processed.priceRange.min);
            delete processed.priceRange.min;
        }
        if (processed.priceRange.max) {
            processed.priceRange.max = parseFloat(processed.priceRange.max);
            delete processed.priceRange.max;
        }
    }

    if (processed.checkInDate) {
        processed.checkInDate = new Date(processed.checkInDate);
    }
    if (processed.checkOutDate) {
        processed.checkOutDate = new Date(processed.checkOutDate);
    }

    if (processed.amenities && typeof processed.amenities === 'string') {
        processed.amenities = processed.amenities.split(',').map(a => a.trim()).filter(a => a.length > 0);
    }

    return processed;
};

export const validateSearchErrors = (searchCriteria) => {
    const errors = [];

    if (searchCriteria.checkInDate && searchCriteria.checkOutDate) {
        const daysDiff = Math.ceil((searchCriteria.checkOutDate - searchCriteria.checkInDate) / (1000 * 60 * 60 * 24));

        if (daysDiff > 30) {
            errors.push('La estadía no puede exceder 30 días');
        }

        if (daysDiff < 1) {
            errors.push('La estadía debe ser de al menos 1 día');
        }
    }

    if (searchCriteria.location && /^\s*$/.test(searchCriteria.location)) {
        errors.push('La ubicación no puede estar vacía o contener solo espacios');
    }

    if (searchCriteria.priceRange) {
        const {min, max} = searchCriteria.priceRange;
        if (min !== undefined && max !== undefined) {
            if (max - min < 10) {
                errors.push('El rango de precios debe tener una diferencia mínima de $10');
            }
            if (max > 10000) {
                errors.push('El precio máximo no puede exceder $10,000 por noche');
            }
        }
    }

    return errors;
};
