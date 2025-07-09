// script.js

// 1. Interacción con el DOM: botón de alerta
const alertBtn = document.getElementById('alertBtn');
alertBtn.onclick = () => {
  alert('¡Hola! Esto es una alerta desde JavaScript.');
};

// 2. Función para sumar dos números y mostrar el resultado
document.getElementById('sumBtn').onclick = () => {
  const n1 = Number(document.getElementById('num1').value);
  const n2 = Number(document.getElementById('num2').value);
  const result = addNumbers(n1, n2);
  document.getElementById('sumResult').textContent = ` Resultado: ${result}`;
};

function addNumbers(a, b) {
  return a + b;
}

// 3. JavaScript Funcional: map, filter, reduce
const numbers = Array.from({length: 30}, (_, i) => i + 1); // [1,2,...,30]

document.getElementById('runFunctional').onclick = () => {
  // Duplicar valores
  const doubled = numbers.map(n => n * 2);
  // Filtrar mayores a 30
  const filtered = doubled.filter(n => n > 30);
  // Sumar los filtrados
  const sum = filtered.reduce((acc, n) => acc + n, 0);
  document.getElementById('functionalResult').textContent =
    `Original: ${numbers}\nDuplicados: ${doubled}\nFiltrados (>30): ${filtered}\nSuma filtrados: ${sum}`;
};

// 4. JavaScript Asíncrono: función async/await simulando API
async function fakeApiCall() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Respuesta simulada de API después de 2 segundos');
    }, 2000);
  });
}

document.getElementById('runAsync').onclick = async () => {
  document.getElementById('asyncResult').textContent = 'Esperando respuesta...';
  document.getElementById('asyncResult').textContent = await fakeApiCall();
};

