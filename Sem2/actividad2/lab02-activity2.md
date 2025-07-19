# Laboratorio Semana 2: Backend Fundamentos
## Actividad 2: Introducción a Node.js y Express

### Configuración del Proyecto

El proyecto ha sido configurado con la siguiente estructura de arquitectura por capas (Clean Architecture), que separa las responsabilidades y facilita el mantenimiento del código:

```
hotel-booking-api/
├── src/
│   ├── domain/              # Lógica de negocio
│   │   ├── entities/        # Entidades del dominio
│   │   ├── usecases/        # Casos de uso
│   │   └── repositories/    # Interfaces de repositorios
│   ├── infrastructure/      # Implementaciones externas
│   │   ├── database/        # MongoDB y modelos
│   │   ├── repositories/    # Implementación de repositorios
│   │   └── middleware/      # Middleware de Express
│   ├── interfaces/          # Capa de interfaz
│   │   ├── controllers/     # Controladores HTTP
│   │   ├── routes/          # Definición de rutas
│   │   └── middleware/      # Middleware de rutas
│   ├── shared/             # Utilidades compartidas
│   │   ├── utils/          # Funciones utilitarias
│   │   ├── constants/      # Constantes
│   │   └── validators/     # Validadores
│   └── app.js              # Configuración principal
├── package.json
├── README.md
└── swaggerAPI.yml             # Documentación Swagger
```

### Dependencias Instaladas

```bash
# Dependencias principales
npm install express mongoose cors morgan joi dotenv winston express-rate-limit compression 

# Dependencias de desarrollo
npm install --save-dev nodemon jest supertest eslint yamljs swagger-ui-express
```

### Configuración del Servidor Express

El servidor ha sido configurado en `src/app.js` con los siguientes componentes esenciales:

#### Middleware de Seguridad
- **CORS**: Permite solicitudes desde cualquier origen para facilitar el desarrollo y testing
- **Rate Limiting**: Limita el número de solicitudes por IP para prevenir ataques

#### Body Parsing
- **express.json()**: Middleware integrado para parsear requests JSON
- **express.urlencoded()**: Middleware para parsear datos de formularios

#### Logging
- **Morgan**: Registra todas las solicitudes HTTP para monitoreo y debugging

### ¿Qué es CORS?

**CORS (Cross-Origin Resource Sharing)** es un mecanismo de seguridad implementado por los navegadores web que controla cómo las páginas web en un dominio pueden acceder a recursos de otro dominio. Por defecto, los navegadores implementan la "política del mismo origen" (same-origin policy) que bloquea solicitudes entre diferentes dominios por razones de seguridad.

**Ejemplo práctico**: Si tu frontend está en `http://localhost:3000` y tu API en `http://localhost:3001`, sin CORS configurado, el navegador bloquearía automáticamente las solicitudes entre estos puertos.

En nuestro proyecto, CORS ha sido configurado para permitir el máximo acceso durante el desarrollo:

```javascript
const corsOptions = {
  origin: true, // Permite solicitudes desde cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true, // Permite el envío de cookies y headers de autenticación
  optionsSuccessStatus: 200 // Para compatibilidad con navegadores legacy
};
```

**Características de la configuración actual**:
- **`origin: true`**: Permite solicitudes desde cualquier dominio (útil para desarrollo y testing)
- **Métodos HTTP completos**: Soporta todos los métodos REST necesarios
- **Headers flexibles**: Incluye headers comunes para APIs modernas

### Métodos HTTP y su Propósito

#### GET
- **Propósito**: Obtener recursos del servidor sin modificarlos
- **Características**: Idempotente, cacheable, seguro
- **Uso en el proyecto**: Obtener listas de hoteles, detalles de habitaciones, información de reservas

#### POST
- **Propósito**: Crear nuevos recursos en el servidor
- **Características**: No idempotente, no cacheable
- **Uso en el proyecto**: Crear hoteles, realizar reservas, registro de usuarios, búsqueda con filtros complejos

#### PUT
- **Propósito**: Actualizar completamente un recurso existente o crearlo si no existe
- **Características**: Idempotente
- **Uso en el proyecto**: Actualizar información completa de hoteles, modificar datos de usuarios

#### DELETE
- **Propósito**: Eliminar recursos del servidor
- **Características**: Idempotente
- **Uso en el proyecto**: Eliminar hoteles (soft delete), cancelar reservas

#### PATCH
- **Propósito**: Actualizar parcialmente un recurso existente
- **Características**: No necesariamente idempotente
- **Uso en el proyecto**: Cancelar reservas, actualizar estado de booking, cambios parciales en perfil

### Diseño de Endpoints RESTful

#### Recursos de Autenticación (/api/auth)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Registrar nuevo usuario | No |
| POST | `/auth/login` | Iniciar sesión | No |
| POST | `/auth/logout` | Cerrar sesión | Sí |
| POST | `/auth/refresh` | Renovar token JWT | Sí |
| POST | `/auth/forgot-password` | Solicitar recuperación de contraseña | No |
| POST | `/auth/reset-password` | Restablecer contraseña | No |

**Propósito**: Gestionar la autenticación y autorización de usuarios en el sistema. Incluye registro, login, manejo de tokens JWT y recuperación de contraseñas.

#### Recursos de Hoteles (/api/hotels)

| Método | Endpoint | Descripción | Autenticación | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/hotels` | Obtener lista de hoteles con filtros | No | - |
| GET | `/hotels/:id` | Obtener detalles de un hotel específico | No | - |
| POST | `/hotels` | Crear nuevo hotel | Sí | hotel_admin, admin |
| PUT | `/hotels/:id` | Actualizar información completa del hotel | Sí | hotel_admin, admin |
| DELETE | `/hotels/:id` | Eliminar hotel (soft delete) | Sí | hotel_admin, admin |
| POST | `/hotels/search` | Búsqueda avanzada con filtros complejos | No | - |

**Propósito**: Gestionar la información de hoteles, incluyendo datos básicos, ubicación, amenidades, políticas y imágenes. Permite operaciones CRUD completas con control de acceso basado en roles.

#### Recursos de Habitaciones (/api/rooms)

| Método | Endpoint | Descripción | Autenticación | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/rooms` | Obtener tipos de habitaciones (filtrable por hotel) | No | - |
| GET | `/rooms/:id` | Obtener detalles de un tipo de habitación | No | - |
| POST | `/rooms` | Crear nuevo tipo de habitación | Sí | hotel_admin, admin |
| PUT | `/rooms/:id` | Actualizar tipo de habitación | Sí | hotel_admin, admin |
| DELETE | `/rooms/:id` | Eliminar tipo de habitación | Sí | hotel_admin, admin |
| GET | `/rooms/:id/availability` | Verificar disponibilidad por fechas | No | - |
| PUT | `/rooms/:id/pricing` | Actualizar precios y promociones | Sí | hotel_admin, admin |

**Propósito**: Administrar los diferentes tipos de habitaciones disponibles en cada hotel, incluyendo capacidad, configuración de camas, amenidades, precios y disponibilidad.

#### Recursos de Reservas (/api/bookings)

| Método | Endpoint | Descripción | Autenticación | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/bookings` | Obtener reservas del usuario autenticado | Sí | customer, hotel_admin, admin |
| GET | `/bookings/:id` | Obtener detalles de una reserva específica | Sí | customer, hotel_admin, admin |
| POST | `/bookings` | Crear nueva reserva | Sí | customer |
| PUT | `/bookings/:id` | Modificar reserva existente | Sí | customer, hotel_admin |
| PATCH | `/bookings/:id/cancel` | Cancelar reserva | Sí | customer, hotel_admin |
| GET | `/bookings/:id/confirmation` | Obtener confirmación de reserva | Sí | customer |
| POST | `/bookings/:id/payment` | Procesar pago de reserva | Sí | customer |

**Propósito**: Gestionar el ciclo completo de reservas, desde la creación hasta la cancelación, incluyendo validación de disponibilidad, cálculo de precios y procesamiento de pagos.

#### Recursos de Usuarios (/api/users)

| Método | Endpoint | Descripción | Autenticación | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/users/profile` | Obtener perfil del usuario autenticado | Sí | customer, hotel_admin, admin |
| PUT | `/users/profile` | Actualizar perfil del usuario | Sí | customer, hotel_admin, admin |
| PATCH | `/users/password` | Cambiar contraseña | Sí | customer, hotel_admin, admin |
| DELETE | `/users/account` | Eliminar cuenta de usuario | Sí | customer |
| GET | `/users/:id/bookings` | Obtener historial de reservas | Sí | admin |

**Propósito**: Administrar perfiles de usuario, configuraciones de cuenta y acceso a información personal.

### Características de Implementación

#### Validación de Datos
Utilizamos `joi` para validar datos de entrada en todos los endpoints:
- Validación de formato de email
- Verificación de longitud de campos
- Validación de tipos de datos
- Sanitización de inputs

#### Manejo de Errores
Implementamos un middleware centralizado de manejo de errores que:
- Captura errores de validación
- Maneja errores de base de datos
- Proporciona respuestas consistentes
- Registra errores para debugging

#### Paginación y Filtrado
Todos los endpoints de listado incluyen:
- Paginación con `page` y `limit`
- Filtros específicos por recurso
- Ordenamiento configurable
- Metadata de paginación en respuestas

#### Respuestas Consistentes
Todas las respuestas siguen el formato:
```json
{
  "success": boolean,
  "message": "string",
  "data": object|array,
  "pagination": object // solo en listados
}
```

### Seguridad Implementada

1. **Rate Limiting**: Previene ataques de fuerza bruta y DoS
2. **CORS Configurado**: Controla acceso desde dominios específicos
3. **Validación de Entrada**: Previene inyecciones y datos malformados

### Health Check y Monitoreo

El endpoint `/api/health` proporciona:
- Estado del servidor
- Timestamp actual
- Información del ambiente
- Conectividad a base de datos

### Documentación API

La documentación completa está disponible en:
- **Swagger UI**: `/api-docs` (solo en desarrollo)
- **OpenAPI Spec**: `swaggerAPI.yml`
