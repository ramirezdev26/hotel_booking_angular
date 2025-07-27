# Hotel Booking API

## Descripción del Proyecto

Sistema de reservas de hoteles que permite a los usuarios buscar, filtrar y reservar habitaciones en diferentes hoteles. El sistema incluye funcionalidades de autenticación, gestión de reservas, y administración de hoteles y habitaciones.

## Funcionalidades Principales

### Para Usuarios
- **Autenticación**: Login y registro de usuarios
- **Búsqueda de Hoteles**: Filtrar por ubicación, fechas, número de huéspedes
- **Filtros Avanzados**: Por tipo de habitación, rango de precios
- **Reservas**: Crear, consultar y cancelar reservas
- **Gestión de Perfil**: Administrar información personal

### Para Hoteles/Administradores
- **Gestión de Hoteles**: CRUD de información hotelera
- **Gestión de Habitaciones**: Administrar tipos de habitación y precios
- **Gestión de Reservas**: Visualizar y administrar reservas

## Arquitectura del Proyecto

El proyecto utiliza **Arquitectura por Capas (Clean Architecture)** que organiza el código en las siguientes capas:

```
src/
├── domain/           # Entidades y lógica de negocio
│   ├── entities/     # Modelos de datos
│   ├── usecases/     # Casos de uso
│   └── repositories/ # Interfaces de repositorios
├── infrastructure/   # Implementaciones externas
│   ├── database/     # Configuración y modelos de MongoDB
│   ├── repositories/ # Implementaciones de repositorios
│   └── middleware/   # Middleware de Express
├── interfaces/       # Capa de interfaz
│   ├── controllers/  # Controladores HTTP
│   ├── routes/       # Definición de rutas
│   └── middleware/   # Middleware específico de rutas
├── shared/          # Utilidades compartidas
│   ├── utils/       # Funciones utilitarias
│   ├── constants/   # Constantes del sistema
│   └── validators/  # Validadores de datos
└── app.js           # Configuración principal de Express
```

## Diseño de Base de Datos MongoDB

### Entidades Principales

#### 1. Users (Usuarios)
```javascript
{
  _id: ObjectId,
  email: String,          // Único
  password: String,       // Hash
  firstName: String,
  lastName: String,
  phone: String,
  dateOfBirth: Date,
  profileImage: String,   // URL
  role: String,          // 'customer', 'hotel_admin', 'admin'
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. Hotels (Hoteles)
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
  images: [String],        // URLs de imágenes
  amenities: [String],     // ['WiFi', 'Pool', 'Gym', etc.]
  rating: {
    average: Number,       // Promedio de ratings
    totalReviews: Number
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  policies: {
    checkIn: String,       // "14:00"
    checkOut: String,      // "12:00"
    cancellation: String,  // Política de cancelación
    children: String       // Política de niños
  },
  isActive: Boolean,
  ownerId: ObjectId,       // Referencia a Users
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. RoomTypes (Tipos de Habitación)
```javascript
{
  _id: ObjectId,
  hotelId: ObjectId,       // Referencia a Hotels
  name: String,            // "Single Room (1 bed)"
  description: String,
  capacity: {
    adults: Number,
    children: Number,
    totalGuests: Number
  },
  bedConfiguration: {
    singleBeds: Number,
    doubleBeds: Number,
    sofaBeds: Number
  },
  amenities: [String],     // ['TV', 'AC', 'Minibar', etc.]
  images: [String],        // URLs
  pricing: {
    basePrice: Number,     // Precio base por noche
    currency: String,      // "USD"
    discounts: [{
      type: String,        // "early_bird", "family", "extended_stay"
      description: String,
      percentage: Number,
      conditions: Object   // Condiciones específicas
    }]
  },
  availability: {
    totalRooms: Number,    // Total de habitaciones de este tipo
    isActive: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### 4. Bookings (Reservas)
```javascript
{
  _id: ObjectId,
  userId: ObjectId,        // Referencia a Users
  hotelId: ObjectId,       // Referencia a Hotels
  roomTypeId: ObjectId,    // Referencia a RoomTypes
  bookingDetails: {
    checkInDate: Date,
    checkOutDate: Date,
    nights: Number,
    guests: {
      adults: Number,
      children: Number
    }
  },
  guestInformation: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    specialRequests: String
  },
  pricing: {
    roomPrice: Number,     // Precio por noche
    totalNights: Number,
    subtotal: Number,
    taxes: Number,
    discounts: Number,
    totalAmount: Number,
    currency: String
  },
  payment: {
    method: String,        // "credit_card", "paypal", etc.
    status: String,        // "pending", "paid", "refunded"
    transactionId: String,
    paidAt: Date
  },
  status: String,          // "confirmed", "cancelled", "completed", "no_show"
  cancellation: {
    cancelledAt: Date,
    reason: String,
    refundAmount: Number,
    refundStatus: String   // "pending", "processed", "denied"
  },
  confirmationCode: String, // Código único de confirmación
  createdAt: Date,
  updatedAt: Date
}
```

#### 5. Reviews (Reseñas)
```javascript
{
  _id: ObjectId,
  userId: ObjectId,        // Referencia a Users
  hotelId: ObjectId,       // Referencia a Hotels
  bookingId: ObjectId,     // Referencia a Bookings
  rating: {
    overall: Number,       // 1-5
    cleanliness: Number,
    service: Number,
    location: Number,
    value: Number
  },
  comment: String,
  images: [String],        // URLs de fotos
  response: {              // Respuesta del hotel
    message: String,
    respondedAt: Date,
    respondedBy: ObjectId  // Referencia a Users (hotel admin)
  },
  isVerified: Boolean,     // Si la reseña está verificada
  helpfulVotes: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### 6. RoomAvailability (Disponibilidad de Habitaciones)
```javascript
{
  _id: ObjectId,
  roomTypeId: ObjectId,    // Referencia a RoomTypes
  date: Date,              // Fecha específica
  availableRooms: Number,  // Habitaciones disponibles ese día
  price: Number,           // Precio para esa fecha específica
  restrictions: {
    minimumStay: Number,   // Mínimo de noches
    maximumStay: Number,   // Máximo de noches
    closedToArrival: Boolean,
    closedToDeparture: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Índices Recomendados

```javascript
// Users
{ email: 1 }  // Único
{ role: 1 }

// Hotels
{ "address.city": 1 }
{ "address.country": 1 }
{ "rating.average": -1 }
{ ownerId: 1 }

// RoomTypes
{ hotelId: 1 }
{ "capacity.totalGuests": 1 }
{ "pricing.basePrice": 1 }

// Bookings
{ userId: 1 }
{ hotelId: 1 }
{ "bookingDetails.checkInDate": 1 }
{ "bookingDetails.checkOutDate": 1 }
{ confirmationCode: 1 }  // Único
{ status: 1 }

// Reviews
{ hotelId: 1 }
{ userId: 1 }
{ "rating.overall": 1 }

// RoomAvailability
{ roomTypeId: 1, date: 1 }  // Compuesto único
{ date: 1 }
```

### Relaciones entre Colecciones

1. **Users ↔ Hotels**: Un usuario puede ser propietario de múltiples hoteles
2. **Hotels ↔ RoomTypes**: Un hotel tiene múltiples tipos de habitaciones
3. **Users ↔ Bookings**: Un usuario puede tener múltiples reservas
4. **RoomTypes ↔ RoomAvailability**: Cada tipo de habitación tiene disponibilidad por fecha
5. **Bookings ↔ Reviews**: Una reserva puede tener una reseña

## Tecnologías Utilizadas

- **Runtime**: Node.js
- **Framework**: Express.js
- **Base de Datos**: MongoDB con Mongoose
- **Autenticación**: JWT (JSON Web Tokens)
- **Validación**: Joi
- **Documentación**: Swagger/OpenAPI
- **Testing**: Jest y Supertest
- **Logging**: Winston
- **Seguridad**: Helmet, CORS, bcrypt

## Instalación y Configuración

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd hotel-booking-api
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp ..env.example ..env
# Editar ..env con los valores apropiados
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

5. **Ejecutar tests**
```bash
npm test
```

## Variables de Entorno

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/hotel-booking
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
CORS_ORIGIN=http://localhost:3001
```

## Scripts Disponibles

- `npm start`: Ejecutar en producción
- `npm run dev`: Ejecutar en desarrollo con nodemon
- `npm test`: Ejecutar tests
- `npm run test:watch`: Ejecutar tests en modo watch
- `npm run lint`: Verificar linting
- `npm run docs`: Generar documentación API

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abrir un Pull Request