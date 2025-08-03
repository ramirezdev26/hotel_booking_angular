/**
 * types.ts - Ejercicios básicos de TypeScript
 * Demuestra diferentes tipos avanzados y conceptos fundamentales
 */

console.log("=== EJERCICIOS BÁSICOS DE TYPESCRIPT ===\n");

// ========================================
// 1. DIFERENCIA ENTRE ANY, UNKNOWN Y NEVER
// ========================================

console.log("1. ANY, UNKNOWN Y NEVER:");

// ANY - Desactiva la verificación de tipos (evitar en código de producción)
let variableAny: any = "Puede ser cualquier cosa";
variableAny = 42;
variableAny = true;
// variableAny.foo.bar;  No hay verificación de tipos
console.log(`   any: ${variableAny}`);

// UNKNOWN - Tipo seguro para valores desconocidos
let variableUnknown: unknown = "Valor desconocido";
// variableUnknown.toUpperCase(); // Error: necesita verificación de tipo
if (typeof variableUnknown === "string") {
    console.log(`   unknown (verificado): ${variableUnknown.toUpperCase()}`);
}

// NEVER - Representa valores que nunca ocurren
function lanzarError(mensaje: string): never {
    throw new Error(mensaje);
}

function procesarTipo(valor: string | number): string {
    if (typeof valor === "string") {
        return valor.toUpperCase();
    } else if (typeof valor === "number") {
        return valor.toString();
    } else {
        // Este bloque nunca debería ejecutarse
        const _exhaustiveCheck: never = valor;
        return _exhaustiveCheck;
    }
}

// ========================================
// 2. UNION TYPES
// ========================================

console.log("\n2. UNION TYPES:");

type IDTipo = string | number;
type EstadoReserva = "pendiente" | "confirmada" | "cancelada";

function procesarID(id: IDTipo): string {
    return `ID procesado: ${id}`;
}

function cambiarEstado(estado: EstadoReserva): void {
    console.log(`   Estado cambiado a: ${estado}`);
}

console.log(`   ${procesarID("ABC123")}`);
console.log(`   ${procesarID(456)}`);
cambiarEstado("confirmada");

// ========================================
// 3. INTERSECTION TYPES
// ========================================

console.log("\n3. INTERSECTION TYPES:");

interface Persona {
    nombre: string;
    edad: number;
}

interface Empleado {
    id: string;
    departamento: string;
    salario: number;
}

// Intersection type combina ambas interfaces
type EmpleadoCompleto = Persona & Empleado;

const empleado: EmpleadoCompleto = {
    nombre: "Ana García",
    edad: 30,
    id: "EMP001",
    departamento: "IT",
    salario: 50000
};

console.log(`   Empleado: ${empleado.nombre}, Depto: ${empleado.departamento}`);

// ========================================
// 4. LITERAL TYPES
// ========================================

console.log("\n4. LITERAL TYPES:");

type TipoHabitacion = "simple" | "doble" | "suite" | "presidencial";
type Puerto = 3000 | 8080 | 443;

function reservarHabitacion(tipo: TipoHabitacion): string {
    return `Habitación ${tipo} reservada`;
}

const configurarServidor = (puerto: Puerto): void => {
    console.log(`   Servidor configurado en puerto: ${puerto}`);
};

console.log(`   ${reservarHabitacion("suite")}`);
configurarServidor(3000);

// ========================================
// 5. MAPPED TYPES
// ========================================

console.log("\n5. MAPPED TYPES:");

interface Usuario {
    id: number;
    nombre: string;
    email: string;
    activo: boolean;
}

// Hace todas las propiedades opcionales
type UsuarioOpcional = {
    [K in keyof Usuario]?: Usuario[K];
};

// Hace todas las propiedades de solo lectura
type UsuarioReadonly = {
    readonly [K in keyof Usuario]: Usuario[K];
};

// Transforma todos los tipos a string
type UsuarioStringificado = {
    [K in keyof Usuario]: string;
};

const usuarioOpcional: UsuarioOpcional = {
    nombre: "Pedro"
    // Otras propiedades son opcionales
};

const usuarioReadonly: UsuarioReadonly = {
    id: 1,
    nombre: "María",
    email: "maria@example.com",
    activo: true
};

// usuarioReadonly.nombre = "Otro nombre"; // Error: es readonly

console.log(`   Usuario opcional: ${usuarioOpcional.nombre}`);
console.log(`   Usuario readonly: ${usuarioReadonly.nombre}`);

// ========================================
// 6. UTILITY TYPES
// ========================================

console.log("\n6. UTILITY TYPES:");

// Partial<T> - Hace todas las propiedades opcionales
type UsuarioActualizable = Partial<Usuario>;

// Required<T> - Hace todas las propiedades requeridas
type UsuarioCompleto = Required<Usuario>;

// Pick<T, K> - Selecciona solo las propiedades especificadas
type InfoBasica = Pick<Usuario, "id" | "nombre">;

// Omit<T, K> - Excluye las propiedades especificadas
type UsuarioSinID = Omit<Usuario, "id">;

// Record<K, T> - Crea un tipo con claves K y valores T
type EstadisticasHotel = Record<TipoHabitacion, number>;

const actualizarUsuario = (id: number, datos: UsuarioActualizable): void => {
    console.log(`   Actualizando usuario ${id} con:`, datos);
};

const infoBasica: InfoBasica = {
    id: 1,
    nombre: "Carlos"
};

const estadisticas: EstadisticasHotel = {
    simple: 10,
    doble: 15,
    suite: 5,
    presidencial: 2
};

actualizarUsuario(1, { email: "nuevo@email.com" });
console.log(`   Info básica: ID ${infoBasica.id}, Nombre: ${infoBasica.nombre}`);
console.log(`   Habitaciones suite disponibles: ${estadisticas.suite}`);

// ========================================
// 7. ENUMS - EJEMPLO PRÁCTICO
// ========================================

console.log("\n7. ENUMS:");

// Enum numérico
enum EstadoHotel {
    CERRADO,        // 0
    ABIERTO,        // 1
    MANTENIMIENTO,  // 2
    RENOVACION      // 3
}

// Enum de string
enum TipoServicio {
    LIMPIEZA = "LIMPIEZA",
    ROOM_SERVICE = "ROOM_SERVICE",
    LAVANDERIA = "LAVANDERIA",
    TRANSPORTE = "TRANSPORTE"
}

// Enum con valores mixtos
enum CodigoRespuesta {
    EXITO = 200,
    NO_ENCONTRADO = 404,
    ERROR_SERVIDOR = 500,
    MANTENIMIENTO = "MAINTENANCE"
}

// Enum const (más eficiente)
const enum Prioridad {
    BAJA = 1,
    MEDIA = 2,
    ALTA = 3,
    CRITICA = 4
}

class Hotel {
    constructor(
        public nombre: string,
        public estado: EstadoHotel = EstadoHotel.CERRADO
    ) {}

    cambiarEstado(nuevoEstado: EstadoHotel): void {
        this.estado = nuevoEstado;
        console.log(`   Hotel ${this.nombre}: ${EstadoHotel[nuevoEstado]}`);
    }

    solicitarServicio(servicio: TipoServicio, prioridad: Prioridad): void {
        console.log(`   Servicio ${servicio} solicitado con prioridad ${prioridad}`);
    }
}

const hotel = new Hotel("Hotel Paradise");
hotel.cambiarEstado(EstadoHotel.ABIERTO);
hotel.solicitarServicio(TipoServicio.ROOM_SERVICE, Prioridad.ALTA);

// Trabajando con enums
console.log(`   Estado actual: ${EstadoHotel[hotel.estado]}`);
console.log(`   Código de éxito: ${CodigoRespuesta.EXITO}`);

// Iterando sobre enum
console.log("   Servicios disponibles:");
Object.values(TipoServicio).forEach(servicio => {
    console.log(`     - ${servicio}`);
});

// ========================================
// 8. EJEMPLO PRÁCTICO COMBINADO
// ========================================

console.log("\n8. EJEMPLO PRÁCTICO COMBINADO:");

interface BaseReserva {
    id: string;
    fechaInicio: Date;
    fechaFin: Date;
    huespedes: number;
}

type ReservaCompleta = BaseReserva & {
    hotel: string;
    habitacion: TipoHabitacion;
    estado: EstadoReserva;
    servicios: TipoServicio[];
    precio: number;
};

type ReservaResumen = Pick<ReservaCompleta, "id" | "hotel" | "estado" | "precio">;

const crearReserva = (datos: Omit<ReservaCompleta, "id">): ReservaCompleta => {
    return {
        id: `RES-${Date.now()}`,
        ...datos
    };
};

const reserva = crearReserva({
    fechaInicio: new Date("2025-08-15"),
    fechaFin: new Date("2025-08-20"),
    huespedes: 2,
    hotel: "Hotel Paradise",
    habitacion: "doble",
    estado: "confirmada",
    servicios: [TipoServicio.LIMPIEZA, TipoServicio.ROOM_SERVICE],
    precio: 1500
});

const resumen: ReservaResumen = {
    id: reserva.id,
    hotel: reserva.hotel,
    estado: reserva.estado,
    precio: reserva.precio
};

console.log(`   Reserva creada: ${resumen.id}`);
console.log(`   Hotel: ${resumen.hotel}, Estado: ${resumen.estado}`);
console.log(`   Precio total: $${resumen.precio}`);

console.log("\n=== FIN DE EJERCICIOS ===");

// Exportar tipos para uso en otros módulos
export {
    IDTipo,
    EstadoReserva,
    EmpleadoCompleto,
    TipoHabitacion,
    UsuarioOpcional,
    EstadoHotel,
    TipoServicio,
    ReservaCompleta,
    Hotel
};
