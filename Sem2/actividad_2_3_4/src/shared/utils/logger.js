/**
 * Logger simple para la aplicación
 * Sistema básico de logging usando Winston
 */

import winston from 'winston';

// Formato simple y legible para desarrollo
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
  })
);

// Crear logger simple
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: logFormat
    })
  ]
});

// En desarrollo, usar nivel debug
if (process.env.NODE_ENV !== 'production') {
  logger.level = 'debug';
}

export default logger;
