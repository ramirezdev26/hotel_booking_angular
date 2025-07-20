import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import {fileURLToPath} from 'url';

dotenv.config();

// Para obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar el archivo YAML de Swagger
const swaggerDocument = YAML.load(path.join(__dirname, '../swaggerAPI.yml'));

import {setupRoutes} from './interfaces/routes/index.js';
import errorHandler from './infrastructure/middleware/errorHandler.js';
import logger from './shared/utils/logger.js';
import connectDB from './infrastructure/database/connection.js';

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

// Configuración CORS y rate limiting (mantener igual)
const corsOptions = {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200
};

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error: 'Demasiadas solicitudes desde esta IP, intente nuevamente más tarde.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

app.use(limiter);
app.use(cors(corsOptions));
app.use(compression());
app.use(morgan('combined'));

// Middlewares de parsing
app.use(express.json({
    limit: '10mb',
    type: 'application/json'
}));

app.use(express.urlencoded({
    extended: true,
    limit: '10mb',
    type: 'application/x-www-form-urlencoded'
}));

// Configurar Swagger UI
const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Hotel Booking API Documentation",
    customfavIcon: "/assets/favicon.ico"
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Hotel Booking API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        documentation: `http://localhost:${PORT}/api-docs`
    });
});

// Configurar rutas de la API
setupRoutes(app);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint no encontrado',
        message: `No se pudo encontrar ${req.originalUrl} en este servidor`,
        availableEndpoints: [
            '/api/health',
            '/api-docs',
            '/api/auth',
            '/api/hotels',
            '/api/rooms',
            '/api/bookings',
            '/api/users'
        ]
    });
});

// Error handler
app.use(errorHandler);

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (err, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', err);
    process.exit(1);
});

app.listen(PORT, () => {
    logger.info(`Servidor ejecutándose en puerto ${PORT}`);
    logger.info(`Health check disponible en: http://localhost:${PORT}/api/health`);
    logger.info(`Documentación Swagger disponible en: http://localhost:${PORT}/api-docs`);
});

export default app;