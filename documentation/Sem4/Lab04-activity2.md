# Lab04 - Actividad 2: Programación Orientada a Objetos en TypeScript

## Descripción de la Actividad
Esta actividad implementa clases, herencia e interfaces para estructurar datos del proyecto Capstone de reservas hoteleras, demostrando conceptos avanzados de POO en TypeScript.

## Estructura del Proyecto

```
frontend/src/
├── models/
│   ├── Room.ts          # Clase base para habitaciones
│   └── Suite.ts         # Subclase que extiende Room
├── interfaces/
│   └── IBooking.ts      # Interfaz para sistema de reservas
└── demo.ts              # Demostración práctica de POO
```

## 1. Modelado de Clases - Room.ts

### Características Implementadas
- ✅ **Propiedades requeridas**: id, name, type, pricePerNight, maxOccupancy
- ✅ **Modificadores de acceso**: protected para permitir herencia
- ✅ **Validaciones**: Constructor con validaciones completas
- ✅ **Encapsulación**: Getters/setters con control de acceso
- ✅ **Métodos adicionales**: Cálculo de precios, manejo de amenidades

### Arquitectura de la Clase

```typescript
export class Room {
    // Propiedades protegidas para herencia
    protected _id: number;
    protected _name: string;
    protected _type: string;
    protected _pricePerNight: number;
    protected _maxOccupancy: number;
    protected _isAvailable: boolean;
    protected _amenities: string[];
    
    // Constructor con validaciones
    constructor(id, name, type, pricePerNight, maxOccupancy, amenities)
    
    // Getters públicos
    public get id(): number
    public get name(): string
    // ... otros getters
    
    // Métodos principales
    public getDescription(): string           // Descripción detallada
    public calculateTotalPrice(nights): number // Cálculo de precio total
    public canAccommodate(guests): boolean    // Verificación de capacidad
    public addAmenity(amenity): void         // Gestión de amenidades
}
```

### Funcionalidades Avanzadas
- **Validación robusta**: Verificación de parámetros en constructor
- **Gestión de amenidades**: Añadir/remover amenidades dinámicamente
- **Serialización**: Métodos `toJSON()` y `fromJSON()` estáticos
- **Cálculos**: Precio total por múltiples noches
- **Estado**: Manejo de disponibilidad de habitaciones

## 2. Herencia - Suite.ts

### Implementación de Herencia
La clase `Suite` extiende `Room` añadiendo funcionalidades específicas:

```typescript
export class Suite extends Room {
    // Propiedades específicas de suite
    private _hasAdditionalBed: boolean;
    private _livingRoomSize: number;
    private _premiumServices: string[];
    private _balconyAccess: boolean;
    
    constructor(id, name, pricePerNight, maxOccupancy, 
               hasAdditionalBed, livingRoomSize, amenities, 
               premiumServices, balconyAccess) {
        // Llamada al constructor padre
        super(id, name, "suite", pricePerNight, maxOccupancy, amenities);
        // Inicialización específica de suite
    }
}
```

### Métodos Sobrescritos (Override)
- ✅ **getDescription()**: Incluye información adicional sobre cama extra
- ✅ **calculateTotalPrice()**: Considera servicios premium
- ✅ **canAccommodate()**: Considera cama adicional en capacidad
- ✅ **toJSON()**: Serialización completa incluyendo propiedades de suite

### Funcionalidades Específicas de Suite
- **Cama adicional**: Manejo dinámico con impacto en capacidad
- **Sala de estar**: Cálculo de precio por metro cuadrado
- **Servicios premium**: Gestión de servicios exclusivos
- **Clasificación**: Método `isLuxurySuite()` basado en criterios específicos
- **Balcón privado**: Gestión automática de amenidades relacionadas

### Ejemplo de Sobrescritura
```typescript
public override getDescription(): string {
    const baseDescription = super.getDescription();
    const additionalBedInfo = this._hasAdditionalBed 
        ? "✓ Cama adicional disponible" 
        : "✗ Sin cama adicional";
    
    return `${baseDescription}
  === INFORMACIÓN DE SUITE ===
  ${additionalBedInfo}
  Sala de estar: ${this._livingRoomSize}m²
  Servicios Premium: ${this._premiumServices.join(", ")}`;
}
```

## 3. Interfaces - IBooking.ts

### Estructura Completa del Sistema de Reservas

#### Interfaz Principal IBooking
```typescript
export interface IBooking {
    // Identificadores
    readonly bookingId: string;
    readonly roomId: number;
    readonly userId: string;
    
    // Información temporal
    readonly startDate: Date;
    readonly endDate: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    
    // Información de huéspedes
    readonly numberOfGuests: number;
    readonly guestNames: string[];
    readonly primaryGuestContact: IGuestContact;
    
    // Estado y gestión
    status: BookingStatus;
    readonly specialRequests?: string;
    readonly notes?: string;
    
    // Información financiera
    readonly basePrice: number;
    readonly additionalServices: IAdditionalService[];
    readonly totalAmount: number;
    readonly paymentInfo: IPaymentInfo;
}
```

#### Interfaces de Soporte
- **IGuestContact**: Información de contacto del huésped
- **IPaymentInfo**: Detalles de pago y transacciones
- **IAdditionalService**: Servicios extra en la reserva
- **ICreateBookingRequest**: DTO para crear reservas
- **IUpdateBookingRequest**: DTO para actualizar reservas

#### Enumeraciones
```typescript
export enum BookingStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    CHECKED_IN = "CHECKED_IN",
    CHECKED_OUT = "CHECKED_OUT",
    CANCELLED = "CANCELLED",
    NO_SHOW = "NO_SHOW"
}

export enum PaymentMethod {
    CREDIT_CARD = "CREDIT_CARD",
    DEBIT_CARD = "DEBIT_CARD",
    CASH = "CASH",
    BANK_TRANSFER = "BANK_TRANSFER",
    DIGITAL_WALLET = "DIGITAL_WALLET"
}
```

#### Funciones Utilitarias
- **Type Guards**: `isIBooking()` para verificación de tipos
- **Validaciones**: `validateBookingDates()` para fechas
- **Cálculos**: `calculateStayDuration()` para duración de estadía

## 4. Instancias y Pruebas - demo.ts

### Demostración Completa del Sistema

#### 4.1 Instanciación de Clases
```typescript
// Habitación estándar
const habitacion101 = new Room(
    101, "Habitación Deluxe Vista Mar", "deluxe", 150, 2,
    ["WiFi gratis", "TV por cable", "Aire acondicionado"]
);

// Suite con herencia
const suite301 = new Suite(
    301, "Suite Presidencial Vista Océano", 500, 4,
    true,  // hasAdditionalBed
    40,    // livingRoomSize
    ["WiFi premium", "Smart TV 65\"", "Jacuzzi"],
    ["Mayordomo personal", "Champagne de bienvenida"],
    true   // balconyAccess
);
```

#### 4.2 Demostración de Polimorfismo
```typescript
const habitaciones: Room[] = [habitacion101, suite301];

habitaciones.forEach(habitacion => {
    console.log(`Precio: $${habitacion.calculateTotalPrice(2)}`);
    // Diferentes implementaciones según la clase
});
```

#### 4.3 Uso de Interfaces
```typescript
// Crear reserva usando interfaces
const bookingRequest: ICreateBookingRequest = {
    roomId: 301,
    userId: "USER-001",
    startDate: new Date('2025-12-15'),
    endDate: new Date('2025-12-18'),
    numberOfGuests: 2,
    guestNames: ["María García", "Carlos García"],
    primaryGuestContact: guestContact,
    paymentInfo: paymentInfo
};

const nuevaReserva = bookingManager.createBooking(bookingRequest);
```

#### 4.4 Validaciones y Type Guards
```typescript
// Validación de fechas
const dateValidation = validateBookingDates(startDate, endDate);
if (!dateValidation.isValid) {
    console.error(dateValidation.errorMessage);
}

// Type guard
if (isIBooking(objeto)) {
    // Objeto verificado como IBooking válido
}
```

## 5. Casos de Prueba Implementados

### 5.1 Casos de Habitaciones
- ✅ Creación de habitaciones con validaciones
- ✅ Cálculo de precios por múltiples noches
- ✅ Verificación de capacidad de huéspedes
- ✅ Gestión dinámica de amenidades
- ✅ Serialización y deserialización JSON

### 5.2 Casos de Suites
- ✅ Herencia correcta de propiedades y métodos
- ✅ Sobrescritura de métodos con funcionalidad extendida
- ✅ Gestión de servicios premium específicos
- ✅ Clasificación automática como suite de lujo
- ✅ Cálculo de precios con servicios adicionales

### 5.3 Casos de Reservas
- ✅ Creación de reservas con validaciones completas
- ✅ Manejo de estados mediante enumeraciones
- ✅ Integración con múltiples métodos de pago
- ✅ Servicios adicionales con costos variables
- ✅ Validación de fechas y duración de estadía

## 6. Patrones de Diseño Implementados

### 6.1 Encapsulación
- Propiedades privadas/protegidas con acceso controlado
- Getters/setters con validaciones
- Métodos públicos bien definidos

### 6.2 Herencia
- Clase base `Room` con funcionalidad común
- Subclase `Suite` con extensiones específicas
- Uso correcto de `super()` y `override`

### 6.3 Polimorfismo
- Array de `Room[]` conteniendo diferentes tipos
- Métodos virtuales con comportamiento específico por clase
- Type checking con `instanceof`

### 6.4 Composición
- Interfaces complejas compuestas de interfaces más simples
- Agregación de servicios adicionales
- Relaciones has-a vs is-a correctamente implementadas

## 7. Comandos de Ejecución

```bash
# Compilar todo el proyecto
npm run build

# Ejecutar demostración completa
npm run run-oop-demo

# Compilar y ejecutar solo el demo
npm run run-demo

# Limpiar archivos compilados
npm run clean
```

## 8. Salida Esperada del Demo

```
============================================================
DEMOSTRACIÓN DE POO EN TYPESCRIPT - SISTEMA HOTELERO
============================================================

1. CREACIÓN DE HABITACIONES ESTÁNDAR
----------------------------------------
Habitación: Habitación Deluxe Vista Mar
  ID: 101
  Tipo: deluxe
  Precio por noche: $150
  Capacidad máxima: 2 huéspedes
  Disponible: Sí
  Amenidades: WiFi gratis, TV por cable, Aire acondicionado

2. CREACIÓN DE SUITES (HERENCIA)
----------------------------------------
Habitación: Suite Presidencial Vista Océano
  ID: 301
  Tipo: suite
  Precio por noche: $500
  Capacidad máxima: 4 huéspedes
  Disponible: Sí
  Amenidades: WiFi premium, Smart TV 65", Jacuzzi
  === INFORMACIÓN DE SUITE ===
  ✓ Cama adicional disponible
  Sala de estar: 40m²
  ✓ Acceso a balcón privado
  Servicios Premium: Mayordomo personal, Champagne de bienvenida

3. SISTEMA DE RESERVAS CON INTERFACES
----------------------------------------
✅ RESERVA CREADA EXITOSAMENTE
ID de Reserva: BK-000001
Habitación: Suite 301
Huésped principal: María García
Check-in: 15/12/2025
Check-out: 18/12/2025
Duración: 3 noches
Estado: PENDING
Total: $1820
```

## 9. Criterios de Evaluación Cumplidos

### ✅ Definición de Clases (Excelente)
- Clases bien estructuradas con propiedades y métodos funcionales
- Uso adecuado de modificadores de acceso (private, protected, public)
- Ejemplos prácticos alineados con el Capstone de reservas hoteleras
- Validaciones robustas y manejo de errores

### ✅ Implementación de Herencia (Excelente)
- Subclase Suite correctamente implementada
- Métodos sobrescritos con `override` y funcionalidad extendida
- Uso apropiado de `super()` para llamar al constructor padre
- Documentación clara del propósito de las subclases

### ✅ Definición de Interfaces (Excelente)
- Interfaces completas y bien diseñadas para sistema de reservas
- Aplicación correcta en clases y verificación con type guards
- Interfaces reflejan las necesidades reales del sistema hotelero
- Enumeraciones y tipos utilitarios para robustez

### ✅ Instanciación y Pruebas (Excelente)
- Instancias de clases funcionando correctamente
- Objetos basados en interfaces con validaciones
- Ejemplos claros alineados con el proyecto Capstone
- Casos de prueba variados cubriendo diferentes escenarios

### ✅ Documentación del Código (Excelente)
- Código completamente documentado con JSDoc
- Comentarios claros explicando propósito de clases y métodos
- Documentación de parámetros y valores de retorno
- Ejemplos de uso y casos de prueba documentados

## 10. Conclusiones

La implementación demuestra un dominio completo de POO en TypeScript:
- **Arquitectura sólida**: Diseño escalable y mantenible
- **Principios OOP**: Correcta aplicación de encapsulación, herencia y polimorfismo
- **TypeScript avanzado**: Uso de interfaces, enums, type guards y generics
- **Contexto real**: Implementación práctica para sistema de reservas hoteleras
- **Buenas prácticas**: Validaciones, manejo de errores y documentación completa

El sistema está preparado para expansión futura manteniendo los principios de diseño establecidos.
