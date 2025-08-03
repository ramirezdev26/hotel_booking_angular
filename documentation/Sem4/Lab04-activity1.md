# Lab04 - Actividad 1: Introducción a TypeScript

## Descripción de la Actividad
Esta actividad tiene como objetivo configurar el entorno para trabajar con TypeScript y comprender sus conceptos básicos mediante ejercicios prácticos.

## Estructura del Proyecto

```
frontend/
├── package.json          # Configuración del proyecto y dependencias
├── tsconfig.json         # Configuración de TypeScript
├── src/
│   ├── hello.ts         # Primer script básico en TypeScript
│   └── types.ts         # Ejercicios de tipos avanzados
└── dist/                # Directorio de salida (generado al compilar)
```

## 1. Instalación y Configuración

### Dependencias Instaladas
- **typescript**: ^5.0.0 - Compilador de TypeScript
- **@types/node**: ^20.0.0 - Definiciones de tipos para Node.js

### Configuración de tsconfig.json
El archivo de configuración incluye las siguientes opciones principales:

```json
{
  "compilerOptions": {
    "target": "ES6",                    // Especifica ECMAScript 6 como destino
    "outDir": "./dist",                 // Directorio de salida para archivos compilados
    "strict": true,                     // Habilita verificaciones estrictas
    "module": "commonjs",               // Sistema de módulos CommonJS
    "declaration": true,                // Genera archivos .d.ts
    "sourceMap": true,                  // Genera mapas de código fuente
    "lib": ["ES6", "DOM", "DOM.Iterable"]
  }
}
```

### Scripts NPM Configurados
- `npm run build`: Compila todos los archivos TypeScript
- `npm run start`: Ejecuta el archivo hello.js compilado
- `npm run dev`: Compilación en modo watch
- `npm run run-hello`: Compila y ejecuta hello.ts
- `npm run run-types`: Compila y ejecuta types.ts

## 2. Primer Script en TypeScript (hello.ts)

### Características Implementadas
- ✅ Variables con tipos explícitos
- ✅ Función que recibe dos números y devuelve su suma
- ✅ Funciones con arrow syntax
- ✅ Parámetros opcionales y por defecto
- ✅ Arrays tipados y objetos con tipos explícitos
- ✅ Documentación JSDoc

### Ejemplo de Código
```typescript
// Variables con tipos explícitos
const mensaje: string = "¡Hola desde TypeScript!";
const version: number = 1.0;
const esActivo: boolean = true;

// Función de suma solicitada
function sumar(a: number, b: number): number {
    return a + b;
}

// Función con parámetros opcionales
function saludar(nombre: string, apellido?: string): string {
    if (apellido) {
        return `Hola, ${nombre} ${apellido}!`;
    }
    return `Hola, ${nombre}!`;
}
```

## 3. Ejercicios Básicos (types.ts)

### Conceptos Implementados

#### 3.1 Diferencias entre any, unknown y never
- **any**: Desactiva verificación de tipos (evitar en producción)
- **unknown**: Tipo seguro para valores desconocidos, requiere verificación
- **never**: Representa valores que nunca ocurren

#### 3.2 Union Types
```typescript
type IDTipo = string | number;
type EstadoReserva = "pendiente" | "confirmada" | "cancelada";
```

#### 3.3 Intersection Types
```typescript
type EmpleadoCompleto = Persona & Empleado;
```

#### 3.4 Literal Types
```typescript
type TipoHabitacion = "simple" | "doble" | "suite" | "presidencial";
type Puerto = 3000 | 8080 | 443;
```

#### 3.5 Mapped Types
```typescript
// Hace todas las propiedades opcionales
type UsuarioOpcional = {
    [K in keyof Usuario]?: Usuario[K];
};

// Hace todas las propiedades readonly
type UsuarioReadonly = {
    readonly [K in keyof Usuario]: Usuario[K];
};
```

#### 3.6 Utility Types
- **Partial<T>**: Hace propiedades opcionales
- **Required<T>**: Hace propiedades requeridas
- **Pick<T, K>**: Selecciona propiedades específicas
- **Omit<T, K>**: Excluye propiedades específicas
- **Record<K, T>**: Crea tipo con claves K y valores T

#### 3.7 Enums - Ejemplo Práctico
```typescript
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
```

## 4. Compilación y Ejecución

### Comandos para Compilar
```bash
# Compilar todos los archivos
npm run build

# Compilar y ejecutar hello.ts
npm run run-hello

# Compilar y ejecutar types.ts
npm run run-types

# Modo desarrollo (watch)
npm run dev
```

### Salida Esperada de hello.ts
```
=== PRIMER SCRIPT EN TYPESCRIPT ===
¡Hola desde TypeScript!
Versión: 1.0
Estado activo: true

=== OPERACIONES MATEMÁTICAS ===
Suma de 10 + 5 = 15
Multiplicación de 4 * 3 = 12

=== FUNCIONES CON PARÁMETROS ===
Hola, Juan!
Hola, María García!
```

### Salida Esperada de types.ts
```
=== EJERCICIOS BÁSICOS DE TYPESCRIPT ===

1. ANY, UNKNOWN Y NEVER:
   any: true
   unknown (verificado): VALOR DESCONOCIDO

2. UNION TYPES:
   ID procesado: ABC123
   ID procesado: 456
   Estado cambiado a: confirmada

3. INTERSECTION TYPES:
   Empleado: Ana García, Depto: IT
```

## 5. Características Avanzadas Implementadas

### Ejemplo Práctico Combinado
Se implementó un sistema de reservas de hotel que combina todos los conceptos:
- Interfaces base y composición
- Types utilitarios
- Enums para estados y servicios
- Funciones tipadas para crear reservas

```typescript
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
```

## 6. Buenas Prácticas Implementadas

- ✅ **Strict mode habilitado**: Verificaciones estrictas de tipos
- ✅ **Documentación JSDoc**: Comentarios descriptivos en funciones
- ✅ **Tipos explícitos**: Evitando inferencia implícita donde sea posible
- ✅ **Separación de responsabilidades**: Archivos organizados por propósito
- ✅ **Exports organizados**: Módulos exportan tipos y funciones para reutilización
- ✅ **Nomenclatura consistente**: PascalCase para tipos, camelCase para variables
- ✅ **Configuración completa**: tsconfig.json con opciones de producción

## 7. Validación de Errores

El proyecto está configurado para detectar:
- Tipos implícitos any
- Null/undefined checks estrictos
- Verificación de tipos de función
- Retornos implícitos en funciones
- Inconsistencias en nombres de archivos

## 8. Conclusiones

La implementación demuestra un dominio completo de TypeScript incluyendo:
- Configuración profesional del entorno
- Uso correcto de tipos básicos y avanzados
- Aplicación práctica en contexto de aplicación de reservas hoteleras
- Estructura de proyecto escalable y mantenible

Todos los archivos se compilan sin errores y ejecutan correctamente, cumpliendo con los criterios de evaluación establecidos.
