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
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  // Determinar status code y mensaje
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Error interno del servidor';

  // Manejar errores específicos de MongoDB
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Error de validación de datos';
  }

  if (error.name === 'CastError') {
    statusCode = 400;
    message = 'ID inválido';
  }

  if (error.code === 11000) {
    statusCode = 400;
    message = 'Datos duplicados';
  }

  // Respuesta de error
  const errorResponse = {
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      error: error.message,
      stack: error.stack
    })
  };

  res.status(statusCode).json(errorResponse);
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
