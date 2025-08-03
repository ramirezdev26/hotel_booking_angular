/**
 * IBooking.ts - Interfaz para manejar reservas de habitaciones
 * Define la estructura de datos para reservas en el sistema de hotel
 */

/**
 * Enumeración para los estados posibles de una reserva
 */
export enum BookingStatus {
    PENDING = "PENDING",           // Reserva pendiente de confirmación
    CONFIRMED = "CONFIRMED",       // Reserva confirmada
    CHECKED_IN = "CHECKED_IN",     // Huésped ya hizo check-in
    CHECKED_OUT = "CHECKED_OUT",   // Huésped ya hizo check-out
    CANCELLED = "CANCELLED",       // Reserva cancelada
    NO_SHOW = "NO_SHOW"           // No se presentó el huésped
}

/**
 * Enumeración para métodos de pago
 */
export enum PaymentMethod {
    CREDIT_CARD = "CREDIT_CARD",
    DEBIT_CARD = "DEBIT_CARD",
    CASH = "CASH",
    BANK_TRANSFER = "BANK_TRANSFER",
    DIGITAL_WALLET = "DIGITAL_WALLET"
}

/**
 * Interfaz para información de contacto del huésped
 */
export interface IGuestContact {
    email: string;
    phone: string;
    emergencyContact?: {
        name: string;
        phone: string;
        relationship: string;
    };
}

/**
 * Interfaz para información de pago
 */
export interface IPaymentInfo {
    method: PaymentMethod;
    amount: number;
    currency: string;
    transactionId?: string;
    isPaid: boolean;
    paymentDate?: Date;
}

/**
 * Interfaz para servicios adicionales en la reserva
 */
export interface IAdditionalService {
    serviceId: string;
    serviceName: string;
    price: number;
    quantity: number;
    description?: string;
}

/**
 * Interfaz principal IBooking - Define la estructura completa de una reserva
 * Contiene todas las propiedades necesarias para manejar reservas de habitaciones
 */
export interface IBooking {
    // Identificadores únicos
    readonly bookingId: string;          // ID único de la reserva
    readonly roomId: number;             // ID de la habitación reservada
    readonly userId: string;             // ID del usuario que hace la reserva

    // Información temporal
    readonly startDate: Date;            // Fecha de inicio de la reserva
    readonly endDate: Date;              // Fecha de fin de la reserva
    readonly createdAt: Date;            // Fecha de creación de la reserva
    readonly updatedAt: Date;            // Fecha de última actualización

    // Información de huéspedes
    readonly numberOfGuests: number;     // Número de huéspedes
    readonly guestNames: string[];       // Nombres de los huéspedes
    readonly primaryGuestContact: IGuestContact; // Información de contacto principal

    // Estado y gestión
    status: BookingStatus;               // Estado actual de la reserva
    readonly specialRequests?: string;   // Solicitudes especiales del huésped
    readonly notes?: string;             // Notas internas del hotel

    // Información financiera
    readonly basePrice: number;          // Precio base de la habitación
    readonly additionalServices: IAdditionalService[]; // Servicios adicionales
    readonly totalAmount: number;        // Monto total de la reserva
    readonly paymentInfo: IPaymentInfo; // Información de pago

    // Información adicional
    readonly checkInTime?: Date;         // Hora real de check-in
    readonly checkOutTime?: Date;        // Hora real de check-out
    readonly cancellationReason?: string; // Razón de cancelación si aplica
}

/**
 * Interfaz para crear una nueva reserva (sin campos readonly automáticos)
 */
export interface ICreateBookingRequest {
    roomId: number;
    userId: string;
    startDate: Date;
    endDate: Date;
    numberOfGuests: number;
    guestNames: string[];
    primaryGuestContact: IGuestContact;
    specialRequests?: string;
    additionalServices?: IAdditionalService[];
    paymentInfo: Omit<IPaymentInfo, 'paymentDate'>;
}

/**
 * Interfaz para actualizar una reserva existente
 */
export interface IUpdateBookingRequest {
    status?: BookingStatus;
    specialRequests?: string;
    notes?: string;
    additionalServices?: IAdditionalService[];
    checkInTime?: Date;
    checkOutTime?: Date;
    cancellationReason?: string;
}

/**
 * Interfaz para buscar reservas con filtros
 */
export interface IBookingSearchFilters {
    userId?: string;
    roomId?: number;
    status?: BookingStatus;
    startDate?: Date;
    endDate?: Date;
    dateRange?: {
        from: Date;
        to: Date;
    };
    guestName?: string;
    paymentStatus?: boolean;
}

/**
 * Interfaz para el resumen de una reserva
 */
export interface IBookingSummary {
    bookingId: string;
    roomId: number;
    roomName: string;
    userId: string;
    primaryGuestName: string;
    startDate: Date;
    endDate: Date;
    numberOfNights: number;
    numberOfGuests: number;
    status: BookingStatus;
    totalAmount: number;
    isPaid: boolean;
}

/**
 * Interfaz para validación de disponibilidad
 */
export interface IAvailabilityCheck {
    roomId: number;
    startDate: Date;
    endDate: Date;
    numberOfGuests: number;
}

/**
 * Interfaz para respuesta de disponibilidad
 */
export interface IAvailabilityResponse {
    isAvailable: boolean;
    roomId: number;
    conflictingBookings?: string[]; // IDs de reservas que causan conflicto
    alternativeRooms?: number[];    // IDs de habitaciones alternativas
    priceEstimate?: number;         // Estimación del precio
}

/**
 * Interfaz para estadísticas de reservas
 */
export interface IBookingStatistics {
    totalBookings: number;
    activeBookings: number;
    cancelledBookings: number;
    totalRevenue: number;
    averageStayLength: number;
    occupancyRate: number;
    mostPopularRoomType: string;
}

/**
 * Type guard para verificar si un objeto implementa IBooking
 * @param obj - Objeto a verificar
 * @returns true si el objeto implementa IBooking
 */
export function isIBooking(obj: any): obj is IBooking {
    return obj &&
        typeof obj.bookingId === 'string' &&
        typeof obj.roomId === 'number' &&
        typeof obj.userId === 'string' &&
        obj.startDate instanceof Date &&
        obj.endDate instanceof Date &&
        obj.createdAt instanceof Date &&
        obj.updatedAt instanceof Date &&
        typeof obj.numberOfGuests === 'number' &&
        Array.isArray(obj.guestNames) &&
        obj.primaryGuestContact &&
        typeof obj.primaryGuestContact.email === 'string' &&
        typeof obj.primaryGuestContact.phone === 'string' &&
        Object.values(BookingStatus).includes(obj.status) &&
        typeof obj.basePrice === 'number' &&
        Array.isArray(obj.additionalServices) &&
        typeof obj.totalAmount === 'number' &&
        obj.paymentInfo &&
        Object.values(PaymentMethod).includes(obj.paymentInfo.method);
}

/**
 * Función utilitaria para calcular la duración de la estadía
 * @param startDate - Fecha de inicio
 * @param endDate - Fecha de fin
 * @returns Número de noches
 */
export function calculateStayDuration(startDate: Date, endDate: Date): number {
    const timeDifference = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDifference / (1000 * 3600 * 24));
}

/**
 * Función utilitaria para validar fechas de reserva
 * @param startDate - Fecha de inicio
 * @param endDate - Fecha de fin
 * @returns Objeto con resultado de validación y mensaje de error si existe
 */
export function validateBookingDates(startDate: Date, endDate: Date): {
    isValid: boolean;
    errorMessage?: string;
} {
    const now = new Date();

    if (startDate <= now) {
        return {
            isValid: false,
            errorMessage: "La fecha de inicio debe ser posterior a la fecha actual"
        };
    }

    if (endDate <= startDate) {
        return {
            isValid: false,
            errorMessage: "La fecha de fin debe ser posterior a la fecha de inicio"
        };
    }

    const stayDuration = calculateStayDuration(startDate, endDate);
    if (stayDuration > 365) {
        return {
            isValid: false,
            errorMessage: "La estadía no puede exceder 365 días"
        };
    }

    return { isValid: true };
}
