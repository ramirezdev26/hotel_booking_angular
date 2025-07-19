/**
 * Middleware simple de manejo de errores
 * Versión básica para aplicación inicial
 */

import logger from '../../shared/utils/logger.js';

/**
 * Clase de error personalizada básica
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
  }
}

/**
 * Middleware principal de manejo de errores
 */
const errorHandler = (error, req, res, next) => {
  // Log del error
  logger.error('Error occurred:', {
    message: error.message,
    url: req.originalUrl,
    method: req.method
  });

  // Determinar status code
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Something went wrong';

  // Manejar errores específicos de MongoDB
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (error.code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value';
  }

  // Respuesta básica
  const response = {
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  };

  res.status(statusCode).json(response);
};

/**
 * Wrapper simple para funciones async
 */
export const asyncWrapper = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default errorHandler;
