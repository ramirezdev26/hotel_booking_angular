# Análisis y Diseño de Componentes - Sistema de Reservas de Hotel

## Introducción

Este documento presenta el análisis y diseño de componentes para el sistema de reservas de hotel basado en las interfaces proporcionadas. El sistema incluye funcionalidades de búsqueda, filtrado, reserva y gestión de bookings.

## Análisis de Pantallas

### 1. Página Principal (Home)
- **Funcionalidad**: Mostrar hoteles disponibles con información básica
- **Elementos**: Header con login, grid de tarjetas de hoteles, footer

### 2. Página de Búsqueda con Filtros
- **Funcionalidad**: Filtrar hoteles por criterios específicos
- **Elementos**: Panel de filtros lateral, resultados filtrados, tags de búsqueda

### 3. Página de Detalles y Reserva
- **Funcionalidad**: Mostrar detalles del hotel y opciones de reserva
- **Elementos**: Información del hotel, selector de fechas, tipos de habitación

### 4. Página de Mis Reservas
- **Funcionalidad**: Gestionar reservas existentes del usuario
- **Elementos**: Lista de reservas, opciones de cancelación, menú de usuario

### 5. Modal de Confirmación
- **Funcionalidad**: Confirmar detalles de la reserva
- **Elementos**: Formulario de datos, política de cancelación, botones de acción

## Componentes Identificados

### Componentes de Layout

#### 1. HeaderComponent
```typescript
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
```
**Responsabilidades:**
- Mostrar logo de la aplicación
- Implementar barra de búsqueda global
- Gestionar formulario de login/registro
- Mostrar estado de autenticación del usuario

**Inputs:**
- `isLoggedIn: boolean`
- `userName?: string`

**Outputs:**
- `searchQuery: EventEmitter<string>`
- `loginEvent: EventEmitter<LoginData>`
- `logoutEvent: EventEmitter<void>`

#### 2. FooterComponent
```typescript
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
```
**Responsabilidades:**
- Mostrar información de copyright
- Selector de idioma
- Selector de moneda
- Enlaces a redes sociales

**Inputs:**
- `currentLanguage: string`
- `currentCurrency: string`

**Outputs:**
- `languageChange: EventEmitter<string>`
- `currencyChange: EventEmitter<string>`

### Componentes de Contenido

#### 3. HotelCardComponent
```typescript
@Component({
  selector: 'app-hotel-card',
  templateUrl: './hotel-card.component.html',
  styleUrls: ['./hotel-card.component.css']
})
```
**Responsabilidades:**
- Mostrar información básica del hotel
- Displayar imagen, nombre, ubicación y rating
- Botón de reserva

**Inputs:**
- `hotel: Hotel`
- `showBookButton: boolean = true`

**Outputs:**
- `bookHotel: EventEmitter<number>` // hotel ID

**Modelo de Datos:**
```typescript
interface Hotel {
  id: number;
  name: string;
  location: string;
  rating: number;
  imageUrl: string;
  description?: string;
}
```

#### 4. SearchFiltersComponent
```typescript
@Component({
  selector: 'app-search-filters',
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.css']
})
```
**Responsabilidades:**
- Panel lateral de filtros
- Filtros por número de huéspedes
- Filtros por características de habitación
- Filtros por ubicación y precio

**Inputs:**
- `initialFilters: SearchFilters`

**Outputs:**
- `filtersChange: EventEmitter<SearchFilters>`
- `clearFilters: EventEmitter<void>`

**Modelo de Datos:**
```typescript
interface SearchFilters {
  attendees: number;
  roomFeatures: RoomType[];
  location: string;
  priceRange: { min: number; max: number };
}

enum RoomType {
  SINGLE = 'single_room_1_bed',
  DOUBLE = 'single_room_2_bed',
  TRIPLE = 'single_room_3_bed',
  SUITE = 'suite_room_2_bed',
  SUITE_KID = 'suite_room_with_kid_bed'
}
```

#### 5. HotelDetailsComponent
```typescript
@Component({
  selector: 'app-hotel-details',
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.css']
})
```
**Responsabilidades:**
- Mostrar información detallada del hotel
- Header con imagen del hotel
- Rating y ubicación
- Integración con componentes de reserva

**Inputs:**
- `hotel: HotelDetails`

**Modelo de Datos:**
```typescript
interface HotelDetails extends Hotel {
  fullDescription: string;
  amenities: string[];
  images: string[];
  policies: string[];
}
```

#### 6. BookingDateComponent
```typescript
@Component({
  selector: 'app-booking-date',
  templateUrl: './booking-date.component.html',
  styleUrls: ['./booking-date.component.css']
})
```
**Responsabilidades:**
- Selector de fechas de llegada y salida
- Validación de fechas
- Cálculo automático de duración

**Inputs:**
- `arrivalDate: Date`
- `departureDate: Date`

**Outputs:**
- `dateChange: EventEmitter<DateRange>`

**Modelo de Datos:**
```typescript
interface DateRange {
  arrival: Date;
  departure: Date;
}
```

#### 7. RoomSelectionComponent
```typescript
@Component({
  selector: 'app-room-selection',
  templateUrl: './room-selection.component.html',
  styleUrls: ['./room-selection.component.css']
})
```
**Responsabilidades:**
- Lista de tipos de habitación disponibles
- Precios por noche
- Contador de habitaciones
- Control de disponibilidad

**Inputs:**
- `availableRooms: RoomOption[]`
- `selectedRooms: SelectedRoom[]`

**Outputs:**
- `roomSelectionChange: EventEmitter<SelectedRoom[]>`

**Modelo de Datos:**
```typescript
interface RoomOption {
  type: RoomType;
  pricePerNight: number;
  available: number;
  description: string;
}

interface SelectedRoom {
  type: RoomType;
  quantity: number;
  totalPrice: number;
}
```

#### 8. PromotionsComponent
```typescript
@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.css']
})
```
**Responsabilidades:**
- Mostrar promociones activas
- Descuentos por edad
- Descuentos familiares

**Inputs:**
- `promotions: Promotion[]`

**Modelo de Datos:**
```typescript
interface Promotion {
  id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  conditions: string[];
}
```

#### 9. UserMenuComponent
```typescript
@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
})
```
**Responsabilidades:**
- Dropdown menu del usuario
- Navegación a "My Bookings"
- Opción de logout

**Inputs:**
- `userName: string`
- `isOpen: boolean`

**Outputs:**
- `navigate: EventEmitter<string>`
- `logout: EventEmitter<void>`

#### 10. BookingListComponent
```typescript
@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css']
})
```
**Responsabilidades:**
- Lista de reservas del usuario
- Información de cada reserva
- Opciones de cancelación

**Inputs:**
- `bookings: Booking[]`

**Outputs:**
- `cancelBooking: EventEmitter<number>` // booking ID

**Modelo de Datos:**
```typescript
interface Booking {
  id: number;
  hotelName: string;
  checkIn: Date;
  checkOut: Date;
  roomType: RoomType;
  status: 'confirmed' | 'cancelled' | 'pending';
  totalAmount: number;
  guestName: string;
}
```

#### 11. BookingModalComponent
```typescript
@Component({
  selector: 'app-booking-modal',
  templateUrl: './booking-modal.component.html',
  styleUrls: ['./booking-modal.component.css']
})
```
**Responsabilidades:**
- Modal de confirmación de reserva
- Formulario de datos del huésped
- Mostrar política de cancelación
- Confirmación final

**Inputs:**
- `isOpen: boolean`
- `bookingData: BookingRequest`

**Outputs:**
- `confirmBooking: EventEmitter<BookingConfirmation>`
- `closeModal: EventEmitter<void>`

**Modelo de Datos:**
```typescript
interface BookingRequest {
  hotelId: number;
  dateRange: DateRange;
  selectedRooms: SelectedRoom[];
  totalAmount: number;
}

interface BookingConfirmation {
  guestEmail: string;
  guestPhone: string;
  guestName: string;
  acceptsPolicy: boolean;
}
```

## Diagrama de Relación de Componentes

```
App Component
├── HeaderComponent
│   ├── LoginFormComponent (child)
│   └── SearchBarComponent (child)
├── Router Outlet
│   ├── HomePageComponent
│   │   └── HotelCardComponent (multiple)
│   ├── SearchPageComponent
│   │   ├── SearchFiltersComponent
│   │   └── HotelCardComponent (multiple)
│   ├── HotelDetailsPageComponent
│   │   ├── HotelDetailsComponent
│   │   ├── BookingDateComponent
│   │   ├── RoomSelectionComponent
│   │   └── PromotionsComponent
│   └── MyBookingsPageComponent
│       ├── UserMenuComponent
│       └── BookingListComponent
├── BookingModalComponent (global)
└── FooterComponent
```

## Estrategia de Reutilización

### Componentes Reutilizables
1. **HotelCardComponent**: Usado en home y search pages
2. **HeaderComponent**: Presente en todas las páginas
3. **FooterComponent**: Presente en todas las páginas
4. **BookingDateComponent**: Reutilizable en diferentes contextos de fecha

### Servicios Compartidos
1. **HotelService**: Gestión de datos de hoteles
2. **BookingService**: Gestión de reservas
3. **AuthService**: Autenticación de usuarios
4. **FilterService**: Lógica de filtrado

## Consideraciones de Implementación

### State Management
- Usar servicios para estado global
- Considerar NgRx para aplicaciones más complejas
- Local state para componentes individuales

### Comunicación Entre Componentes
- **Parent-Child**: @Input y @Output
- **Sibling**: Servicios compartidos
- **Global**: Event emitters y subjects

### Responsive Design
- Usar CSS Grid y Flexbox
- Breakpoints para mobile, tablet, desktop
- Componentes adaptables

### Accesibilidad
- ARIA labels en todos los elementos interactivos
- Navegación por teclado
- Contraste de colores adecuado

## Conclusiones

El diseño modular propuesto permite:
- **Reutilización**: Componentes como HotelCard se usan en múltiples páginas
- **Mantenibilidad**: Separación clara de responsabilidades
- **Escalabilidad**: Fácil agregar nuevas funcionalidades
- **Testeo**: Componentes aislados facilitan unit testing

Esta arquitectura facilita el desarrollo colaborativo y el mantenimiento a largo plazo del sistema de reservas.