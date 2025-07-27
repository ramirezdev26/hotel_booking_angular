/**
 * Script de prueba simple para los endpoints de hoteles
 * Ejecutar: node tests/hotel-endpoints-test.js
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';

// Datos de prueba para crear un hotel
const testHotel = {
  name: "Hotel Ejemplo",
  description: "Un hermoso hotel ubicado en el centro de la ciudad con excelentes servicios y comodidades para huéspedes.",
  address: {
    street: "Av. Principal 123",
    city: "La Paz",
    state: "La Paz",
    country: "Bolivia",
    zipCode: "0001",
    coordinates: {
      latitude: -16.5000,
      longitude: -68.1193
    }
  },
  images: [
    "https://example.com/hotel1.jpg",
    "https://example.com/hotel2.jpg"
  ],
  amenities: ["WiFi", "Pool", "Gym", "Restaurant", "Parking"],
  contact: {
    phone: "+591-2-123-4567",
    email: "contacto@hotelejemplo.com",
    website: "https://hotelejemplo.com"
  },
  policies: {
    checkIn: "14:00",
    checkOut: "12:00",
    cancellation: "Cancelación gratuita hasta 24 horas antes",
    children: "Niños menores de 12 años no pagan"
  }
};

// Función helper para hacer requests
async function makeRequest(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    return { status: response.status, data };
  } catch (error) {
    return { error: error.message };
  }
}

// Tests de los endpoints
async function runTests() {
  console.log('🚀 Iniciando pruebas de endpoints de hoteles...\n');

  // 1. Health check
  console.log('1️⃣ Testing health check...');
  const health = await makeRequest('/health');
  console.log(`Status: ${health.status}`);
  console.log(`Response:`, health.data);
  console.log('\n');

  // 2. Obtener todos los hoteles (inicialmente vacío)
  console.log('2️⃣ Testing GET /hotels (lista vacía)...');
  const getAllEmpty = await makeRequest('/hotels');
  console.log(`Status: ${getAllEmpty.status}`);
  console.log(`Response:`, getAllEmpty.data);
  console.log('\n');

  // 3. Crear un hotel
  console.log('3️⃣ Testing POST /hotels (crear hotel)...');
  const createHotel = await makeRequest('/hotels', 'POST', testHotel);
  console.log(`Status: ${createHotel.status}`);
  console.log(`Response:`, createHotel.data);
  
  if (createHotel.status !== 201) {
    console.log('❌ Error creando hotel, abortando pruebas...');
    return;
  }
  
  const hotelId = createHotel?.data?.data?.id;
  console.log(`✅ Hotel creado con ID: ${hotelId}\n`);

  // 4. Obtener hotel por ID
  console.log('4️⃣ Testing GET /hotels/:id...');
  const getById = await makeRequest(`/hotels/${hotelId}`);
  console.log(`Status: ${getById.status}`);
  console.log(`Response:`, getById.data);
  console.log('\n');

  // 5. Obtener todos los hoteles (ahora con data)
  console.log('5️⃣ Testing GET /hotels (con data)...');
  const getAllWithData = await makeRequest('/hotels');
  console.log(`Status: ${getAllWithData.status}`);
  console.log(`Response:`, getAllWithData.data);
  console.log('\n');

  // 6. Búsqueda de hoteles
  console.log('6️⃣ Testing POST /hotels/search...');
  const searchCriteria = {
    destination: "La Paz",
    checkInDate: "2025-08-01",
    checkOutDate: "2025-08-05",
    guests: { adults: 2, children: 0 }
  };
  const search = await makeRequest('/hotels/search', 'POST', searchCriteria);
  console.log(`Status: ${search.status}`);
  console.log(`Response:`, search.data);
  console.log('\n');

  // 7. Actualizar hotel
  console.log('7️⃣ Testing PUT /hotels/:id...');
  const updateData = {
    name: "Hotel Ejemplo Actualizado",
    description: "Descripción actualizada del hotel con nuevas características y servicios mejorados."
  };
  const update = await makeRequest(`/hotels/${hotelId}`, 'PUT', { ...testHotel, ...updateData });
  console.log(`Status: ${update.status}`);
  console.log(`Response:`, update.data);
  console.log('\n');

  // 8. Filtros en GET /hotels
  console.log('8️⃣ Testing GET /hotels con filtros...');
  const filtered = await makeRequest('/hotels?city=La Paz&minRating=1&amenities=WiFi,Pool');
  console.log(`Status: ${filtered.status}`);
  console.log(`Response:`, filtered.data);
  console.log('\n');

  // 9. Eliminar hotel (soft delete)
  console.log('9️⃣ Testing DELETE /hotels/:id...');
  const deleteHotel = await makeRequest(`/hotels/${hotelId}`, 'DELETE');
  console.log(`Status: ${deleteHotel.status}`);
  console.log(`Response:`, deleteHotel.data);
  console.log('\n');

  // 10. Verificar que el hotel esté inactivo
  console.log('🔟 Testing GET /hotels después del delete...');
  const getAfterDelete = await makeRequest('/hotels');
  console.log(`Status: ${getAfterDelete.status}`);
  console.log(`Response:`, getAfterDelete.data);
  console.log('\n');

  console.log('✅ Pruebas completadas!');
}

// Ejecutar pruebas si el servidor está corriendo
runTests().catch(console.error);
