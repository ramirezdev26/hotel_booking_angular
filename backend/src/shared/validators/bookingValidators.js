/**
 * Validadores para endpoints de Bookings
 * Define las reglas de validación para las peticiones HTTP
 */

import Joi from 'joi';

export const createBookingValidator = Joi.object({
  hotelId: Joi.string()
    .required()
    .messages({
      'string.empty': 'Hotel ID es requerido',
      'any.required': 'Hotel ID es requerido'
    }),

  roomTypeId: Joi.string()
    .required()
    .messages({
      'string.empty': 'Room Type ID es requerido',
      'any.required': 'Room Type ID es requerido'
    }),

  guestName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Nombre del huésped es requerido',
      'string.min': 'Nombre debe tener al menos 2 caracteres',
      'string.max': 'Nombre no puede exceder 100 caracteres',
      'any.required': 'Nombre del huésped es requerido'
    }),

  guestLastName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Apellido del huésped es requerido',
      'string.min': 'Apellido debe tener al menos 2 caracteres',
      'string.max': 'Apellido no puede exceder 100 caracteres',
      'any.required': 'Apellido del huésped es requerido'
    }),

  guestPhone: Joi.string()
    .trim()
    .pattern(/^[+]?[\d\s\-\(\)]{7,20}$/)
    .required()
    .messages({
      'string.empty': 'Teléfono es requerido',
      'string.pattern.base': 'Teléfono debe tener un formato válido',
      'any.required': 'Teléfono es requerido'
    }),

  guestEmail: Joi.string()
    .email()
    .trim()
    .lowercase()
    .max(150)
    .required()
    .messages({
      'string.empty': 'Email es requerido',
      'string.email': 'Email debe tener un formato válido',
      'string.max': 'Email no puede exceder 150 caracteres',
      'any.required': 'Email es requerido'
    }),

  checkInDate: Joi.date()
    .min('now')
    .required()
    .messages({
      'date.base': 'Fecha de check-in debe ser válida',
      'date.min': 'Fecha de check-in no puede ser en el pasado',
      'any.required': 'Fecha de check-in es requerida'
    }),

  checkOutDate: Joi.date()
    .greater(Joi.ref('checkInDate'))
    .required()
    .messages({
      'date.base': 'Fecha de check-out debe ser válida',
      'date.greater': 'Fecha de check-out debe ser posterior a la fecha de check-in',
      'any.required': 'Fecha de check-out es requerida'
    }),

  numberOfGuests: Joi.number()
    .integer()
    .min(1)
    .max(20)
    .required()
    .messages({
      'number.base': 'Número de huéspedes debe ser un número',
      'number.integer': 'Número de huéspedes debe ser un número entero',
      'number.min': 'Debe haber al menos 1 huésped',
      'number.max': 'No se pueden acomodar más de 20 huéspedes',
      'any.required': 'Número de huéspedes es requerido'
    }),

  totalAmount: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.base': 'Monto total debe ser un número',
      'number.min': 'Monto total debe ser mayor o igual a 0',
      'any.required': 'Monto total es requerido'
    })
});

export const queryBookingsValidator = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.base': 'Página debe ser un número',
      'number.integer': 'Página debe ser un número entero',
      'number.min': 'Página debe ser mayor a 0'
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.base': 'Límite debe ser un número',
      'number.integer': 'Límite debe ser un número entero',
      'number.min': 'Límite debe ser mayor a 0',
      'number.max': 'Límite no puede exceder 100'
    }),

  status: Joi.string()
    .valid('pending', 'confirmed', 'cancelled')
    .messages({
      'any.only': 'Estado debe ser: pending, confirmed o cancelled'
    }),

  hotelId: Joi.string()
    .messages({
      'string.base': 'Hotel ID debe ser una cadena válida'
    }),

  guestEmail: Joi.string()
    .email()
    .messages({
      'string.email': 'Email debe tener un formato válido'
    }),

  fromDate: Joi.date()
    .messages({
      'date.base': 'Fecha desde debe ser válida'
    }),

  toDate: Joi.date()
    .when('fromDate', {
      is: Joi.exist(),
      then: Joi.date().greater(Joi.ref('fromDate')),
      otherwise: Joi.date()
    })
    .messages({
      'date.base': 'Fecha hasta debe ser válida',
      'date.greater': 'Fecha hasta debe ser posterior a fecha desde'
    })
});

export const bookingIdValidator = Joi.object({
  id: Joi.string()
    .required()
    .messages({
      'string.empty': 'ID de reserva es requerido',
      'any.required': 'ID de reserva es requerido'
    })
});

export const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors
      });
    }

    req[property] = value;
    next();
  };
};
