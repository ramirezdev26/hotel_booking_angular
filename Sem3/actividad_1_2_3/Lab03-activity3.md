# Laboratorio 3 - Actividad 3: Persistencia de Datos con MongoDB

## Descripción de la Actividad
Conexión de la API a una base de datos MongoDB para almacenar y recuperar datos de manera persistente, siguiendo la arquitectura limpia implementada en el proyecto.

## Implementaciones Realizadas

### 1. Configuración Inicial

#### Instalación de Dependencias

Para la implementación de la persistencia de datos con MongoDB, se instalaron las siguientes dependencias:

- **mongoose**: ODM (Object Document Mapper) para MongoDB
- **dotenv**: Para gestionar variables de entorno

```bash
npm install mongoose dotenv
```

#### Configuración de Variables de Entorno

Se creó un archivo `.env` para almacenar la URI de conexión a MongoDB y otras variables sensibles:

```
MONGODB_URI=mongodb://localhost:27017/hotel-booking
NODE_ENV=development
PORT=3000
```

#### Configuración de la Conexión

La conexión a MongoDB se implementó en el archivo `src/infrastructure/database/connection.js`, siguiendo buenas prácticas:

- Uso de variables de entorno para la URI de conexión
- Manejo de eventos de conexión (éxito, error, desconexión)
- Implementación de mecanismos de reconexión
- Integración con el sistema de logging

### 2. Definición de Modelos

Los modelos se implementaron siguiendo la arquitectura limpia del proyecto, manteniendo la separación entre las entidades de dominio y los modelos de la base de datos.

#### Modelo de Hotel

El modelo `Hotel` implementado en `src/infrastructure/database/models/Hotel.js` incluye:

- Nombre y descripción del hotel
- Dirección estructurada (calle, ciudad, estado, país, código postal, coordenadas)
- Imágenes del hotel
- Amenidades disponibles
- Información de contacto
- Políticas del hotel (check-in, check-out, cancelación, etc.)
- Estado del hotel (activo/inactivo)
- Campos de auditoría (fechas de creación/actualización)

#### Modelo de Tipo de Habitación

El modelo `RoomType` implementado en `src/infrastructure/database/models/RoomType.js` incluye:

- Referencia al hotel al que pertenece
- Nombre y descripción del tipo de habitación
- Capacidad (número de adultos y niños)
- Precio base y precios por temporada
- Amenidades específicas de la habitación
- Disponibilidad y estado
- Imágenes de la habitación
- Campos de auditoría

### 3. Implementación del Repositorio

Siguiendo el patrón Repository, se implementaron clases que abstraen las operaciones de acceso a datos:

#### Repositorio de Hotel

El repositorio `MongoHotelRepository` implementado en `src/infrastructure/repositories/MongoHotelRepository.js` proporciona:

- Métodos para operaciones CRUD básicas (crear, leer, actualizar, eliminar)
- Métodos para búsquedas especializadas (por ubicación, disponibilidad, etc.)
- Implementación de los métodos definidos en la interfaz `HotelRepository`

#### Repositorio de Tipo de Habitación

El repositorio `MongoRoomTypeRepository` implementado en `src/infrastructure/repositories/MongoRoomTypeRepository.js` proporciona:

- Métodos para operaciones CRUD básicas
- Métodos para búsquedas filtradas (por hotel, capacidad, precio, etc.)
- Implementación de los métodos definidos en la interfaz `RoomTypeRepository`

### 4. Actualización de Rutas y Controladores

Los controladores y rutas se actualizaron para utilizar los repositorios con MongoDB:

- Los controladores ahora reciben instancias de los repositorios a través de inyección de dependencias
- Las rutas mantienen su estructura, pero ahora persisten los datos en MongoDB
- Se implementó manejo de errores específico para operaciones de base de datos

### 5. Pruebas Realizadas

Se realizaron pruebas completas para verificar la correcta persistencia de datos en MongoDB:

#### Prueba 1: Creación de Hotel

**Solicitud:**
```bash
curl -X POST http://localhost:3000/api/hotels \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Grand Hotel Oceanview",
    "description": "Un lujoso hotel frente al mar con todas las comodidades",
    "address": {
      "street": "Avenida del Mar 123",
      "city": "Cartagena",
      "state": "Bolívar",
      "country": "Colombia",
      "zipCode": "130001",
      "coordinates": {
        "latitude": 10.4236,
        "longitude": -75.5503
      }
    },
    "contact": {
      "phone": "+57 300 1234567",
      "email": "info@grandhotel.com",
      "website": "https://www.grandhotel.com"
    },
    "policies": {
      "checkIn": "15:00",
      "checkOut": "12:00"
    }
  }'
```

**Resultado:** El hotel se crea correctamente y se almacena en MongoDB, devolviendo el objeto creado con su ID único.

[Captura de pantalla: POST-Hotel.png]

#### Prueba 2: Obtención de Hoteles

**Solicitud:**
```bash
curl -X GET http://localhost:3000/api/hotels
```

**Resultado:** Se recuperan todos los hoteles almacenados en la base de datos.

[Captura de pantalla: GET-All-Hotels.png]

#### Prueba 3: Creación de Tipo de Habitación

**Solicitud:**
```bash
curl -X POST http://localhost:3000/api/roomtypes \
  -H "Content-Type: application/json" \
  -d '{
    "hotelId": "60d21b4667d0d8992e610c85",
    "name": "Suite Presidencial",
    "description": "Amplia suite con vista al mar y todas las comodidades",
    "capacity": {
      "adults": 2,
      "children": 2
    },
    "pricing": {
      "basePrice": 350,
      "taxes": 56
    },
    "amenities": ["Minibar", "TV", "Air Conditioning", "Balcony", "Safe"]
  }'
```

**Resultado:** El tipo de habitación se crea correctamente y se asocia al hotel especificado.

[Captura de pantalla: POST-RoomType.png]

#### Prueba 4: Búsqueda de Habitaciones

**Solicitud:**
```bash
curl -X POST http://localhost:3000/api/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Cartagena",
    "guests": {
      "adults": 2,
      "children": 1
    },
    "dates": {
      "checkIn": "2025-08-15",
      "checkOut": "2025-08-20"
    },
    "priceRange": {
      "min": 100,
      "max": 500
    }
  }'
```

**Resultado:** Se obtienen los hoteles en Cartagena con habitaciones disponibles para las fechas especificadas, filtrando por capacidad y rango de precios.

[Captura de pantalla: POST-SearchRooms.png]

## Conclusión

La implementación de MongoDB como sistema de persistencia ha permitido:

1. **Almacenamiento Estructurado**: Guardar los datos de hoteles y tipos de habitación de manera organizada y eficiente.

2. **Consultas Flexibles**: Realizar búsquedas complejas utilizando las capacidades de consulta de MongoDB.

3. **Escalabilidad**: Preparar la aplicación para crecer en volumen de datos y usuarios.

4. **Mantenimiento de la Arquitectura**: Conservar la estructura de arquitectura limpia del proyecto, manteniendo la separación de responsabilidades.

La implementación sigue buenas prácticas como:
- Uso de índices para optimizar consultas frecuentes
- Validación de esquemas para garantizar la integridad de los datos
- Manejo adecuado de relaciones entre colecciones
- Gestión de errores específicos de la base de datos

## Estructura de la Base de Datos

### Colección: Hotels
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  images: [String],
  amenities: [String],
  contact: {
    phone: String,
    email: String,
    website: String
  },
  policies: {
    checkIn: String,
    checkOut: String,
    cancellation: String,
    children: String
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Colección: RoomTypes
```javascript
{
  _id: ObjectId,
  hotelId: ObjectId,
  name: String,
  description: String,
  capacity: {
    adults: Number,
    children: Number
  },
  pricing: {
    basePrice: Number,
    taxes: Number,
    currency: String
  },
  amenities: [String],
  images: [String],
  availability: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```
