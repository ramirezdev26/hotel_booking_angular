/**
 * Validadores para endpoints de hoteles
 * Utiliza Joi para validar datos de entrada
 */

import Joi from 'joi';

// Esquema para coordenadas geográficas
const coordinatesSchema = Joi.object({
  latitude: Joi.number().min(-90).max(90),
  longitude: Joi.number().min(-180).max(180)
});

// Esquema para dirección
const addressSchema = Joi.object({
  street: Joi.string().trim().min(1).max(200).required()
    .messages({
      'string.empty': 'La calle es requerida',
      'string.max': 'La calle no puede exceder 200 caracteres'
    }),
  city: Joi.string().trim().min(1).max(100).required()
    .messages({
      'string.empty': 'La ciudad es requerida',
      'string.max': 'La ciudad no puede exceder 100 caracteres'
    }),
  state: Joi.string().trim().max(100).allow(''),
  country: Joi.string().trim().min(1).max(100).required()
    .messages({
      'string.empty': 'El país es requerido',
      'string.max': 'El país no puede exceder 100 caracteres'
    }),
  zipCode: Joi.string().trim().max(20).allow(''),
  coordinates: coordinatesSchema
});

// Esquema para contacto
const contactSchema = Joi.object({
  phone: Joi.string().trim().min(1).required()
    .messages({
      'string.empty': 'El teléfono es requerido'
    }),
  email: Joi.string().email().trim().lowercase().required()
    .messages({
      'string.email': 'El email debe tener un formato válido',
      'string.empty': 'El email es requerido'
    }),
  website: Joi.string().uri().allow('')
});

// Esquema para políticas
const policiesSchema = Joi.object({
  checkIn: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .messages({
      'string.pattern.base': 'La hora de check-in debe tener formato HH:MM'
    }),
  checkOut: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .messages({
      'string.pattern.base': 'La hora de check-out debe tener formato HH:MM'
    }),
  cancellation: Joi.string().trim().allow(''),
  children: Joi.string().trim().allow('')
});

// Amenidades permitidas
const allowedAmenities = [
  'WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Parking',
  'Room Service', 'Laundry', 'Business Center', 'Conference Rooms',
  'Pet Friendly', 'Airport Shuttle', 'Concierge', 'Air Conditioning',
  'Elevator', 'Balcony', 'Kitchen', 'TV', 'Minibar', 'Safe'
];

/**
 * Validador para crear hotel
 */
export const createHotelValidator = Joi.object({
  name: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.empty': 'El nombre del hotel es requerido',
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 100 caracteres'
    }),
  description: Joi.string().trim().min(10).max(1000).required()
    .messages({
      'string.empty': 'La descripción es requerida',
      'string.min': 'La descripción debe tener al menos 10 caracteres',
      'string.max': 'La descripción no puede exceder 1000 caracteres'
    }),
  address: addressSchema.required(),
  images: Joi.array().items(Joi.string().uri()).default([]),
  amenities: Joi.array().items(Joi.string().valid(...allowedAmenities)).default([]),
  contact: contactSchema.required(),
  policies: policiesSchema.default({}),
  ownerId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).allow(null)
    .messages({
      'string.pattern.base': 'El ID del propietario debe ser un ObjectId válido'
    })
});

/**
 * Validador para actualizar hotel
 */
export const updateHotelValidator = Joi.object({
  name: Joi.string().trim().min(2).max(100)
    .messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 100 caracteres'
    }),
  description: Joi.string().trim().min(10).max(1000)
    .messages({
      'string.min': 'La descripción debe tener al menos 10 caracteres',
      'string.max': 'La descripción no puede exceder 1000 caracteres'
    }),
  address: addressSchema,
  images: Joi.array().items(Joi.string().uri()),
  amenities: Joi.array().items(Joi.string().valid(...allowedAmenities)),
  contact: contactSchema,
  policies: policiesSchema,
  isActive: Joi.boolean(),
  ownerId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).allow(null)
    .messages({
      'string.pattern.base': 'El ID del propietario debe ser un ObjectId válido'
    })
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar'
});

/**
 * Validador para parámetros de consulta (GET /hotels)
 */
export const queryHotelsValidator = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  city: Joi.string().trim().allow(''),
  country: Joi.string().trim().allow(''),
  minRating: Joi.number().min(1).max(5),
  amenities: Joi.string().trim().allow(''),
  search: Joi.string().trim().allow(''),
  sort: Joi.string().valid('rating', 'name', 'newest', 'oldest').default('rating')
});

/**
 * Validador para búsqueda de hoteles (POST /hotels/search)
 */
export const searchHotelsValidator = Joi.object({
  destination: Joi.string().trim().min(1).required()
    .messages({
      'string.empty': 'El destino es requerido'
    }),
  checkInDate: Joi.date().iso().greater('now').required()
    .messages({
      'date.greater': 'La fecha de entrada debe ser posterior a hoy',
      'any.required': 'La fecha de entrada es requerida'
    }),
  checkOutDate: Joi.date().iso().greater(Joi.ref('checkInDate')).required()
    .messages({
      'date.greater': 'La fecha de salida debe ser posterior a la fecha de entrada',
      'any.required': 'La fecha de salida es requerida'
    }),
  guests: Joi.object({
    adults: Joi.number().integer().min(1).default(1),
    children: Joi.number().integer().min(0).default(0)
  }).default({ adults: 1, children: 0 }),
  filters: Joi.object({
    minRating: Joi.number().min(1).max(5),
    maxPrice: Joi.number().min(0),
    amenities: Joi.array().items(Joi.string().valid(...allowedAmenities))
  }).default({})
});

/**
 * Validador para parámetros de ruta (ID)
 */
export const hotelIdValidator = Joi.object({
  id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
    .messages({
      'string.pattern.base': 'El ID del hotel debe ser un ObjectId válido',
      'any.required': 'El ID del hotel es requerido'
    })
});

/**
 * Middleware para validar datos con Joi
 */
export const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors
      });
    }

    req[property] = value;
    next();
  };
};

export default {
  createHotelValidator,
  updateHotelValidator,
  queryHotelsValidator,
  searchHotelsValidator,
  hotelIdValidator,
  validateRequest
};
