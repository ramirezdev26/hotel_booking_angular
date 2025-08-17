/**
 * hello.ts - Primer script en TypeScript
 * Demuestra conceptos básicos: variables tipadas y funciones
 */

// Declaración de variables con tipos explícitos
const mensaje: string = "¡Hola desde TypeScript!";
const version: number = 1.0;
const esActivo: boolean = true;

// Array tipado
const numeros: number[] = [1, 2, 3, 4, 5];

// Objeto con interfaz implícita
const usuario: { nombre: string; edad: number; email: string } = {
    nombre: "Santiago Ramirez",
    edad: 25,
    email: "santiago.ramirez@example.com"
};

/**
 * Función que recibe dos números y devuelve su suma
 * @param a - Primer número
 * @param b - Segundo número
 * @returns La suma de los dos números
 */
function sumar(a: number, b: number): number {
    return a + b;
}

/**
 * Función alternativa usando arrow function
 */
const multiplicar = (a: number, b: number): number => a * b;

/**
 * Función con parámetros opcionales
 */
function saludar(nombre: string, apellido?: string): string {
    if (apellido) {
        return `Hola, ${nombre} ${apellido}!`;
    }
    return `Hola, ${nombre}!`;
}

/**
 * Función con parámetros por defecto
 */
function calcularDescuento(precio: number, descuento: number = 0.1): number {
    return precio - (precio * descuento);
}

// Ejecución del script
console.log("=== PRIMER SCRIPT EN TYPESCRIPT ===");
console.log(mensaje);
console.log(`Versión: ${version}`);
console.log(`Estado activo: ${esActivo}`);

console.log("\n=== OPERACIONES MATEMÁTICAS ===");
const resultado1 = sumar(10, 5);
const resultado2 = multiplicar(4, 3);
console.log(`Suma de 10 + 5 = ${resultado1}`);
console.log(`Multiplicación de 4 * 3 = ${resultado2}`);

console.log("\n=== FUNCIONES CON PARÁMETROS ===");
console.log(saludar("Juan"));
console.log(saludar("María", "García"));

console.log("\n=== CÁLCULO DE DESCUENTOS ===");
console.log(`Precio con descuento por defecto (10%): $${calcularDescuento(100)}`);
console.log(`Precio con descuento del 20%: $${calcularDescuento(100, 0.2)}`);

console.log("\n=== INFORMACIÓN DEL USUARIO ===");
console.log(`Nombre: ${usuario.nombre}`);
console.log(`Edad: ${usuario.edad}`);
console.log(`Email: ${usuario.email}`);

console.log("\n=== PROCESAMIENTO DE ARRAYS ===");
console.log(`Números originales: ${numeros.join(", ")}`);
const numerosDobles = numeros.map(n => n * 2);
console.log(`Números duplicados: ${numerosDobles.join(", ")}`);

// Exportar funciones para uso en otros módulos
export { sumar, multiplicar, saludar, calcularDescuento };
