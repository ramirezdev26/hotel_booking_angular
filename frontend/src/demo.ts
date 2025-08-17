/**
 * demo.ts - Demostración práctica de POO en TypeScript
 * Muestra el uso de clases, herencia e interfaces en el sistema de reservas hoteleras
 */

import { Room } from './models/Room.js';
import { Suite } from './models/Suite.js';
import { 
    IBooking, 
    ICreateBookingRequest,
    BookingStatus, 
    PaymentMethod,
    IGuestContact,
    IPaymentInfo,
    IAdditionalService,
    calculateStayDuration,
    validateBookingDates,
    isIBooking
} from './interfaces/IBooking.js';

/**
 * Clase BookingManager para gestionar reservas
 * Demuestra el uso práctico de las interfaces
 */
class BookingManager {
    private bookings: IBooking[] = [];
    private nextBookingId: number = 1;

    /**
     * Crea una nueva reserva
     * @param request - Datos de la reserva a crear
     * @returns Reserva creada o null si hay error
     */
    public createBooking(request: ICreateBookingRequest): IBooking | null {
        // Validar fechas
        const dateValidation = validateBookingDates(request.startDate, request.endDate);
        if (!dateValidation.isValid) {
            console.error(`Error en fechas: ${dateValidation.errorMessage}`);
            return null;
        }

        // Calcular precio total
        const nights = calculateStayDuration(request.startDate, request.endDate);
        const additionalServicesCost = request.additionalServices?.reduce(
            (total, service) => total + (service.price * service.quantity), 0
        ) || 0;
        const totalAmount = request.paymentInfo.amount + additionalServicesCost;

        // Crear la reserva
        const booking: IBooking = {
            bookingId: `BK-${this.nextBookingId.toString().padStart(6, '0')}`,
            roomId: request.roomId,
            userId: request.userId,
            startDate: request.startDate,
            endDate: request.endDate,
            createdAt: new Date(),
            updatedAt: new Date(),
            numberOfGuests: request.numberOfGuests,
            guestNames: request.guestNames,
            primaryGuestContact: request.primaryGuestContact,
            status: BookingStatus.PENDING,
            specialRequests: request.specialRequests,
            basePrice: request.paymentInfo.amount,
            additionalServices: request.additionalServices || [],
            totalAmount: totalAmount,
            paymentInfo: {
                ...request.paymentInfo,
                paymentDate: new Date()
            }
        };

        this.bookings.push(booking);
        this.nextBookingId++;

        return booking;
    }

    /**
     * Obtiene todas las reservas
     */
    public getAllBookings(): IBooking[] {
        return [...this.bookings];
    }

    /**
     * Busca reserva por ID
     */
    public findBookingById(bookingId: string): IBooking | undefined {
        return this.bookings.find(booking => booking.bookingId === bookingId);
    }
}

/**
 * Función principal de demostración
 */
function runDemo(): void {
    console.log("=".repeat(60));
    console.log("DEMOSTRACIÓN DE POO EN TYPESCRIPT - SISTEMA HOTELERO");
    console.log("=".repeat(60));

    // ===================================================
    // 1. DEMOSTRACIÓN DE LA CLASE ROOM
    // ===================================================
    console.log("\n1. CREACIÓN DE HABITACIONES ESTÁNDAR");
    console.log("-".repeat(40));

    // Crear habitaciones estándar
    const habitacion101 = new Room(
        101,
        "Habitación Deluxe Vista Mar",
        "deluxe",
        150,
        2,
        ["WiFi gratis", "TV por cable", "Aire acondicionado", "Minibar"]
    );

    const habitacion201 = new Room(
        201,
        "Habitación Familiar",
        "familiar",
        200,
        4,
        ["WiFi gratis", "TV por cable", "Cocina pequeña"]
    );

    console.log(habitacion101.getDescription());
    console.log("\n" + habitacion201.getDescription());

    // Demostrar métodos de la clase Room
    console.log("\n--- MÉTODOS DE LA CLASE ROOM ---");
    console.log(`¿Puede acomodar 3 personas? ${habitacion101.canAccommodate(3)}`);
    console.log(`Precio por 5 noches: $${habitacion101.calculateTotalPrice(5)}`);

    habitacion101.addAmenity("Servicio de limpieza diario");
    console.log(`Amenidades actualizadas: ${habitacion101.amenities.join(", ")}`);

    // ===================================================
    // 2. DEMOSTRACIÓN DE LA CLASE SUITE (HERENCIA)
    // ===================================================
    console.log("\n\n2. CREACIÓN DE SUITES (HERENCIA)");
    console.log("-".repeat(40));

    // Crear suites con funcionalidades extendidas
    const suite301 = new Suite(
        301,
        "Suite Presidencial Vista Océano",
        500,
        4,
        true,  // hasAdditionalBed
        40,    // livingRoomSize
        ["WiFi premium", "Smart TV 65\"", "Sistema de sonido", "Jacuzzi"],
        ["Mayordomo personal", "Champagne de bienvenida", "Transporte privado"],
        true   // balconyAccess
    );

    const suite401 = new Suite(
        401,
        "Suite Junior",
        300,
        2,
        false, // hasAdditionalBed
        20,    // livingRoomSize
        ["WiFi premium", "Smart TV", "Cafetera Nespresso"],
        ["Room service premium"],
        false  // balconyAccess
    );

    // Demostrar método sobrescrito getDescription()
    console.log(suite301.getDescription());
    console.log("\n" + suite401.getDescription());

    // Demostrar métodos específicos de Suite
    console.log("\n--- MÉTODOS ESPECÍFICOS DE SUITE ---");
    console.log(`Suite 301 es suite de lujo: ${suite301.isLuxurySuite()}`);
    console.log(`Suite 401 es suite de lujo: ${suite401.isLuxurySuite()}`);

    // Demostrar método sobrescrito de cálculo de precio
    console.log(`Precio Suite 301 (3 noches, con servicios premium): $${suite301.calculateTotalPrice(3, true)}`);
    console.log(`Precio Suite 301 (3 noches, sin servicios premium): $${suite301.calculateTotalPrice(3, false)}`);

    // Añadir servicios premium dinámicamente
    suite401.addPremiumService("Desayuno en la habitación");
    suite401.addPremiumService("Late check-out gratuito");
    console.log(`Servicios premium Suite 401: ${suite401.premiumServices.join(", ")}`);

    // ===================================================
    // 3. DEMOSTRACIÓN DE INTERFACES (IBooking)
    // ===================================================
    console.log("\n\n3. SISTEMA DE RESERVAS CON INTERFACES");
    console.log("-".repeat(40));

    // Crear manager de reservas
    const bookingManager = new BookingManager();

    // Información de contacto del huésped
    const guestContact: IGuestContact = {
        email: "maria.garcia@email.com",
        phone: "+1-555-0123",
        emergencyContact: {
            name: "Carlos García",
            phone: "+1-555-0124",
            relationship: "Esposo"
        }
    };

    // Información de pago
    const paymentInfo: IPaymentInfo = {
        method: PaymentMethod.CREDIT_CARD,
        amount: 1500, // 3 noches x $500
        currency: "USD",
        transactionId: "TX-789123456",
        isPaid: true
    };

    // Servicios adicionales
    const additionalServices: IAdditionalService[] = [
        {
            serviceId: "SPA-001",
            serviceName: "Masaje relajante en suite",
            price: 120,
            quantity: 1,
            description: "Masaje de 60 minutos en la comodidad de su suite"
        },
        {
            serviceId: "DINING-001",
            serviceName: "Cena romántica privada",
            price: 200,
            quantity: 1,
            description: "Cena para dos personas en el balcón de la suite"
        }
    ];

    // Crear solicitud de reserva
    const bookingRequest: ICreateBookingRequest = {
        roomId: 301,
        userId: "USER-001",
        startDate: new Date('2025-12-15'),
        endDate: new Date('2025-12-18'),
        numberOfGuests: 2,
        guestNames: ["María García", "Carlos García"],
        primaryGuestContact: guestContact,
        specialRequests: "Decoración romántica para aniversario. Llegada tarde aproximadamente 10 PM.",
        additionalServices: additionalServices,
        paymentInfo: paymentInfo
    };

    // Crear la reserva
    const nuevaReserva = bookingManager.createBooking(bookingRequest);

    if (nuevaReserva) {
        console.log("✅ RESERVA CREADA EXITOSAMENTE");
        console.log(`ID de Reserva: ${nuevaReserva.bookingId}`);
        console.log(`Habitación: Suite ${nuevaReserva.roomId}`);
        console.log(`Huésped principal: ${nuevaReserva.guestNames[0]}`);
        console.log(`Check-in: ${nuevaReserva.startDate.toLocaleDateString()}`);
        console.log(`Check-out: ${nuevaReserva.endDate.toLocaleDateString()}`);
        console.log(`Duración: ${calculateStayDuration(nuevaReserva.startDate, nuevaReserva.endDate)} noches`);
        console.log(`Estado: ${nuevaReserva.status}`);
        console.log(`Total: $${nuevaReserva.totalAmount}`);
        console.log(`Solicitudes especiales: ${nuevaReserva.specialRequests}`);
        
        // Mostrar servicios adicionales
        if (nuevaReserva.additionalServices.length > 0) {
            console.log("\nServicios adicionales:");
            nuevaReserva.additionalServices.forEach(service => {
                console.log(`  - ${service.serviceName}: $${service.price} x ${service.quantity}`);
            });
        }
    }

    // ===================================================
    // 4. VALIDACIONES Y TYPE GUARDS
    // ===================================================
    console.log("\n\n4. VALIDACIONES Y TYPE GUARDS");
    console.log("-".repeat(40));

    // Demostrar validación de fechas
    const fechaInvalida = validateBookingDates(
        new Date('2025-12-20'),
        new Date('2025-12-18') // Fecha fin anterior a inicio
    );
    
    console.log(`Validación de fechas inválidas: ${fechaInvalida.isValid}`);
    if (!fechaInvalida.isValid) {
        console.log(`Error: ${fechaInvalida.errorMessage}`);
    }

    // Demostrar type guard
    if (nuevaReserva && isIBooking(nuevaReserva)) {
        console.log("✅ El objeto es una reserva válida según el type guard");
    }

    // Objeto que NO implementa IBooking correctamente
    const objetoInvalido = {
        bookingId: "test",
        roomId: "no-es-numero", // Error: debería ser number
        userId: 123 // Error: debería ser string
    };

    console.log(`¿Objeto inválido es IBooking? ${isIBooking(objetoInvalido)}`);

    // ===================================================
    // 5. DEMOSTRACIÓN DE POLIMORFISMO
    // ===================================================
    console.log("\n\n5. POLIMORFISMO EN ACCIÓN");
    console.log("-".repeat(40));

    const habitaciones: Room[] = [habitacion101, habitacion201, suite301, suite401];

    console.log("Información de todas las habitaciones:");
    habitaciones.forEach((habitacion, index) => {
        console.log(`\n--- Habitación ${index + 1} ---`);
        console.log(`Tipo: ${habitacion.constructor.name}`);
        console.log(`Nombre: ${habitacion.name}`);
        console.log(`Precio por 2 noches: $${habitacion.calculateTotalPrice(2)}`);
        console.log(`Puede acomodar 3 personas: ${habitacion.canAccommodate(3)}`);
        
        // Verificar si es una Suite para mostrar información adicional
        if (habitacion instanceof Suite) {
            console.log(`Es suite de lujo: ${habitacion.isLuxurySuite()}`);
            console.log(`Tiene cama adicional: ${habitacion.hasAdditionalBed}`);
        }
    });

    // ===================================================
    // 6. SERIALIZACIÓN Y DESERIALIZACIÓN
    // ===================================================
    console.log("\n\n6. SERIALIZACIÓN Y DESERIALIZACIÓN");
    console.log("-".repeat(40));

    // Convertir suite a JSON
    const suiteJSON = suite301.toJSON();
    console.log("Suite serializada a JSON:");
    console.log(JSON.stringify(suiteJSON, null, 2));

    // Crear suite desde JSON
    const datosNuevaSuite = {
        id: 501,
        name: "Suite Ejecutiva",
        pricePerNight: 400,
        maxOccupancy: 3,
        hasAdditionalBed: true,
        livingRoomSize: 30,
        amenities: ["WiFi premium", "Escritorio ejecutivo"],
        premiumServices: ["Acceso a lounge ejecutivo"],
        balconyAccess: true
    };

    const suiteDesdeJSON = Suite.fromJSON(datosNuevaSuite);
    console.log("\nSuite creada desde JSON:");
    console.log(suiteDesdeJSON.getDescription());

    console.log("\n" + "=".repeat(60));
    console.log("DEMOSTRACIÓN COMPLETADA EXITOSAMENTE");
    console.log("=".repeat(60));
}

// Ejecutar la demostración
try {
    runDemo();
} catch (error) {
    console.error("Error durante la demostración:", error);
}

// Exportar elementos para uso en otros módulos
export { BookingManager, runDemo };
