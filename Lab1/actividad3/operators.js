// operators.js
// Ejemplos prácticos y documentados de operadores modernos de JavaScript

// 1. Operador de fusión nula (??)
// Devuelve el operando de la derecha solo si el de la izquierda es null o undefined
const nombre = null;
const nombreUsuario = nombre ?? 'Invitado';
console.log('??:', nombreUsuario); // 'Invitado'

document.body.insertAdjacentHTML('beforeend', `<pre>??: ${nombreUsuario}</pre>`);

// 2. Encadenamiento opcional (?.)
// Permite acceder a propiedades anidadas sin error si alguna es undefined/null
const persona = { datos: { edad: 25 } };
const edad = persona.datos?.edad;
const telefono = persona.contacto?.telefono;
console.log('?. edad:', edad); // 25
console.log('?. telefono:', telefono); // undefined

document.body.insertAdjacentHTML('beforeend', `<pre>?. edad: ${edad}\n?. telefono: ${telefono}</pre>`);

// 3. Operador AND lógico (&&)
// Evalúa el segundo operando solo si el primero es verdadero
const isLogged = true;
const mensaje = isLogged && 'Bienvenido de nuevo';
console.log('&&:', mensaje); // 'Bienvenido de nuevo'

document.body.insertAdjacentHTML('beforeend', `<pre>&&: ${mensaje}</pre>`);

// 4. Operador OR lógico (||)
// Devuelve el primer valor verdadero
const color = '';
const colorFinal = color || 'azul';
console.log('||:', colorFinal); // 'azul'

document.body.insertAdjacentHTML('beforeend', `<pre>||: ${colorFinal}</pre>`);

