/**
 * Script de prueba para los endpoints de tipos de habitación (RoomType)
 * Ejecutar: node tests/roomtype-endpoints-test.js
 * 
 * Nota: Asegúrate de tener el servidor corriendo en localhost:3000
 * y que exista al menos un hotel en la base de datos para las pruebas
 */

import fetch from 'node-fetch';
console.log("\n🔍 Iniciando pruebas de endpoints de RoomType...");
const BASE_URL = 'http://localhost:3000/api';

// ID de hotel de prueba - necesitarás reemplazar con un ID real de tu base de datos
// o ejecutar primero el test de hoteles para crear uno
let TEST_HOTEL_ID = '687bb53a8a654f8b47dd201b'; // Placeholder - se actualizará dinámicamente

// Datos de prueba para crear tipos de habitación
const testRoomTypes = {
  singleRoom: {
    hotelId: TEST_HOTEL_ID,
    name: "Habitación Individual Standard",
    description: "Cómoda habitación individual con todas las comodidades básicas para una estancia placentera.",
    capacity: {
      adults: 1,
      children: 0,
      totalGuests: 1
    },
    bedConfiguration: {
      singleBeds: 1,
      doubleBeds: 0,
      sofaBeds: 0
    },
    amenities: ["wifi", "tv", "air_conditioning", "desk", "safe"],
    images: [
      "https://example.com/single-room1.jpg",
      "https://example.com/single-room2.jpg"
    ],
    pricing: {
      basePrice: 80,
      currency: "USD",
      discounts: [
        {
          type: "early_bird",
          description: "Reserva con 30 días de anticipación",
          percentage: 15,
          minNights: 3
        }
      ]
    },
    availability: true,
    maxOccupancy: 1
  },
  
  familyRoom: {
    hotelId: TEST_HOTEL_ID,
    name: "Suite Familiar",
    description: "Amplia suite familiar con capacidad para 4 personas, incluye sala de estar y comodidades premium.",
    capacity: {
      adults: 2,
      children: 2,
      totalGuests: 4
    },
    bedConfiguration: {
      singleBeds: 0,
      doubleBeds: 1,
      sofaBeds: 1
    },
    amenities: ["wifi", "tv", "air_conditioning", "minibar", "safe", "balcony", "city_view", "sofa"],
    images: [
      "https://example.com/family-suite1.jpg",
      "https://example.com/family-suite2.jpg",
      "https://example.com/family-suite3.jpg"
    ],
    pricing: {
      basePrice: 250,
      currency: "USD",
      discounts: [
        {
          type: "family",
          description: "Descuento especial para familias",
          percentage: 20,
          minNights: 2
        },
        {
          type: "extended_stay",
          description: "Estadía prolongada de más de 7 noches",
          percentage: 25,
          minNights: 7
        }
      ]
    },
    availability: true,
    maxOccupancy: 1
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
    
    return {
      status: response.status,
      data: data,
      headers: response.headers
    };
  } catch (error) {
    console.error(`Error en request ${method} ${endpoint}:`, error.message);
    return {
      status: 500,
      data: { success: false, message: error.message }
    };
  }
}

// Función para obtener o crear un hotel de prueba
async function ensureTestHotel() {
  console.log('\n🏨 Verificando hotel de prueba...');
  
  // Primero intentar obtener hoteles existentes
  const hotelsResponse = await makeRequest('/hotels?limit=1');
  
  if (hotelsResponse.status === 200 && hotelsResponse.data.data && hotelsResponse.data.data.length > 0) {
    TEST_HOTEL_ID = hotelsResponse.data.data[0].id;
    console.log(`✅ Usando hotel existente: ${TEST_HOTEL_ID}`);
    return TEST_HOTEL_ID;
  }

  // Si no hay hoteles, crear uno de prueba
  console.log('📝 Creando hotel de prueba...');
  const testHotel = {
    name: "Hotel de Prueba para RoomTypes",
    description: "Hotel creado automáticamente para pruebas de tipos de habitación.",
    address: {
      street: "Calle de Prueba 123",
      city: "Ciudad Test",
      state: "Estado Test",
      country: "País Test",
      zipCode: "12345"
    },
    contact: {
      phone: "+591-2-000-0000",
      email: "test@hotel.com"
    }
  };

  const createResponse = await makeRequest('/hotels', 'POST', testHotel);
  
  if (createResponse.status === 201) {
    TEST_HOTEL_ID = createResponse.data.data.id;
    console.log(`✅ Hotel de prueba creado: ${TEST_HOTEL_ID}`);
    return TEST_HOTEL_ID;
  } else {
    console.error('❌ Error creando hotel de prueba:', createResponse.data);
    throw new Error('No se pudo crear hotel de prueba');
  }
}

// Función para actualizar los IDs de hotel en los datos de prueba
function updateTestDataWithHotelId(hotelId) {
  testRoomTypes.singleRoom.hotelId = hotelId;
  testRoomTypes.familyRoom.hotelId = hotelId;
}

// Tests de los endpoints
async function testGetAllRoomTypes() {
  console.log('\n📋 Test: GET /api/rooms (Obtener todos los tipos de habitación)');
  
  const response = await makeRequest('/rooms');
  
  console.log(`Status: ${response.status}`);
  console.log('Response:', JSON.stringify(response.data, null, 2));
  
  if (response.status === 200) {
    console.log('✅ GET /rooms exitoso');
    if (response.data.data) {
      console.log(`📊 Total de tipos encontrados: ${response.data.data.length}`);
    }
  } else {
    console.log('❌ GET /rooms falló');
  }
  
  return response;
}

async function testGetRoomTypesByHotel() {
  console.log(`\n🏨 Test: GET /api/rooms/hotel/${TEST_HOTEL_ID} (Tipos por hotel)`);
  
  const response = await makeRequest(`/rooms/hotel/${TEST_HOTEL_ID}`);
  
  console.log(`Status: ${response.status}`);
  console.log('Response:', JSON.stringify(response.data, null, 2));
  
  if (response.status === 200) {
    console.log('✅ GET /rooms/hotel/:id exitoso');
  } else {
    console.log('❌ GET /rooms/hotel/:id falló');
  }
  
  return response;
}

async function testCreateRoomType(roomTypeData, testName) {
  console.log(`\n➕ Test: POST /api/rooms (Crear ${testName})`);
  
  const response = await makeRequest('/rooms', 'POST', roomTypeData);
  
  console.log(`Status: ${response.status}`);
  console.log('Response:', JSON.stringify(response.data, null, 2));
  
  if (response.status === 201) {
    console.log(`✅ POST /rooms exitoso - ${testName} creado`);
    return response.data.data.id; // Retornar ID del tipo creado
  } else {
    console.log(`❌ POST /rooms falló para ${testName}`);
    return null;
  }
}

async function testGetRoomTypeById(roomTypeId) {
  console.log(`\n🔍 Test: GET /api/rooms/${roomTypeId} (Obtener por ID)`);
  
  const response = await makeRequest(`/rooms/${roomTypeId}`);
  
  console.log(`Status: ${response.status}`);
  console.log('Response:', JSON.stringify(response.data, null, 2));
  
  if (response.status === 200) {
    console.log('✅ GET /rooms/:id exitoso');
  } else {
    console.log('❌ GET /rooms/:id falló');
  }
  
  return response;
}

async function testUpdateRoomType(roomTypeId) {
  console.log(`\n✏️ Test: PUT /api/rooms/${roomTypeId} (Actualizar tipo)`);
  
  const updateData = {
    name: "Habitación Individual Premium - Actualizada",
    description: "Habitación actualizada con mejores comodidades y vista premium.",
    pricing: {
      basePrice: 120,
      currency: "USD"
    },
    amenities: ["wifi", "tv", "air_conditioning", "desk", "safe", "minibar", "city_view"]
  };
  
  const response = await makeRequest(`/rooms/${roomTypeId}`, 'PUT', updateData);
  
  console.log(`Status: ${response.status}`);
  console.log('Response:', JSON.stringify(response.data, null, 2));
  
  if (response.status === 200) {
    console.log('✅ PUT /rooms/:id exitoso');
  } else {
    console.log('❌ PUT /rooms/:id falló');
  }
  
  return response;
}

async function testCheckAvailability(roomTypeId) {
  console.log(`\n📅 Test: POST /api/rooms/${roomTypeId}/availability (Verificar disponibilidad)`);
  
  const availabilityData = {
    checkInDate: "2025-08-01",
    checkOutDate: "2025-08-05"
  };
  
  const response = await makeRequest(`/rooms/${roomTypeId}/availability`, 'POST', availabilityData);
  
  console.log(`Status: ${response.status}`);
  console.log('Response:', JSON.stringify(response.data, null, 2));
  
  if (response.status === 200) {
    console.log('✅ POST /rooms/:id/availability exitoso');
  } else {
    console.log('❌ POST /rooms/:id/availability falló');
  }
  
  return response;
}

async function testUpdatePricing(roomTypeId) {
  console.log(`\n💰 Test: PUT /api/rooms/${roomTypeId}/pricing (Actualizar precios)`);
  
  const pricingData = {
    basePrice: 150,
    currency: "USD",
    discounts: [
      {
        type: "seasonal",
        description: "Descuento de temporada baja",
        percentage: 30,
        validFrom: "2025-01-01",
        validTo: "2025-03-31",
        minNights: 2
      }
    ]
  };
  
  const response = await makeRequest(`/rooms/${roomTypeId}/pricing`, 'PUT', pricingData);
  
  console.log(`Status: ${response.status}`);
  console.log('Response:', JSON.stringify(response.data, null, 2));
  
  if (response.status === 200) {
    console.log('✅ PUT /rooms/:id/pricing exitoso');
  } else {
    console.log('❌ PUT /rooms/:id/pricing falló');
  }
  
  return response;
}

async function testSearchRoomTypes() {
  console.log('\n🔎 Test: POST /api/rooms/search (Búsqueda avanzada)');
  
  const searchCriteria = {
    capacity: 2,
    priceRange: {
      min: 50,
      max: 300
    },
    amenities: ["wifi", "tv"],
    checkInDate: "2025-08-15",
    checkOutDate: "2025-08-20",
    page: 1,
    limit: 10,
    sortBy: "pricing.basePrice",
    sortOrder: "asc"
  };
  
  const response = await makeRequest('/rooms/search', 'POST', searchCriteria);
  
  console.log(`Status: ${response.status}`);
  console.log('Response:', JSON.stringify(response.data, null, 2));
  
  if (response.status === 200) {
    console.log('✅ POST /rooms/search exitoso');
  } else {
    console.log('❌ POST /rooms/search falló');
  }
  
  return response;
}

async function testDeleteRoomType(roomTypeId) {
  console.log(`\n🗑️ Test: DELETE /api/rooms/${roomTypeId} (Eliminar tipo)`);
  
  const response = await makeRequest(`/rooms/${roomTypeId}`, 'DELETE');
  
  console.log(`Status: ${response.status}`);
  console.log('Response:', JSON.stringify(response.data, null, 2));
  
  if (response.status === 200) {
    console.log('✅ DELETE /rooms/:id exitoso');
  } else {
    console.log('❌ DELETE /rooms/:id falló');
  }
  
  return response;
}

// Tests de validación (casos negativos)
async function testValidationErrors() {
  console.log('\n❌ Tests de Validación (Casos Negativos)');
  
  // Test 1: Crear tipo sin datos requeridos
  console.log('\n📝 Test: POST /rooms sin datos requeridos');
  const incompleteData = {
    name: "Solo nombre"
  };
  
  const response1 = await makeRequest('/rooms', 'POST', incompleteData);
  console.log(`Status: ${response1.status}`);
  console.log('Errores de validación:', JSON.stringify(response1.data, null, 2));
  
  // Test 2: ID inválido
  console.log('\n🔍 Test: GET /rooms con ID inválido');
  const response2 = await makeRequest('/rooms/invalid-id');
  console.log(`Status: ${response2.status}`);
  console.log('Response:', JSON.stringify(response2.data, null, 2));
  
  // Test 3: Hotel inexistente
  console.log('\n🏨 Test: POST /rooms con hotelId inexistente');
  const invalidHotelData = {
    ...testRoomTypes.singleRoom,
    hotelId: "507f1f77bcf86cd799439099" // ID que no existe
  };
  
  const response3 = await makeRequest('/rooms', 'POST', invalidHotelData);
  console.log(`Status: ${response3.status}`);
  console.log('Response:', JSON.stringify(response3.data, null, 2));
}

// Función principal para ejecutar todos los tests
async function runAllTests() {
  console.log('🚀 Iniciando pruebas de endpoints de RoomType');
  console.log('=' .repeat(60));
  
  try {
    // Verificar que el servidor esté corriendo
    console.log('🔍 Verificando conexión al servidor...');
    const healthCheck = await makeRequest('/health');
    
    if (healthCheck.status !== 200) {
      throw new Error('El servidor no está respondiendo. Asegúrate de que esté corriendo en localhost:3000');
    }
    
    console.log('✅ Servidor conectado correctamente');
    
    // Configurar hotel de prueba
    await ensureTestHotel();
    updateTestDataWithHotelId(TEST_HOTEL_ID);
    
    // Ejecutar tests de funcionalidad principal
    await testGetAllRoomTypes();
    await testGetRoomTypesByHotel();
    
    // Crear tipos de habitación de prueba
    const singleRoomId = await testCreateRoomType(testRoomTypes.singleRoom, "Habitación Individual");
    const familyRoomId = await testCreateRoomType(testRoomTypes.familyRoom, "Suite Familiar");
    
    if (singleRoomId) {
      await testGetRoomTypeById(singleRoomId);
      await testUpdateRoomType(singleRoomId);
      await testCheckAvailability(singleRoomId);
      await testUpdatePricing(singleRoomId);
    }
    
    // Tests de búsqueda
    await testSearchRoomTypes();
    
    // Tests de validación
    await testValidationErrors();
    
    // Limpiar - eliminar tipos creados
    if (singleRoomId) {
      await testDeleteRoomType(singleRoomId);
    }
    if (familyRoomId) {
      await testDeleteRoomType(familyRoomId);
    }
    
    console.log('\n' + '=' .repeat(60));
    console.log('✅ Todas las pruebas de RoomType completadas');
    console.log('📊 Revisa los resultados arriba para verificar el funcionamiento de cada endpoint');
    
  } catch (error) {
    console.error('\n❌ Error durante las pruebas:', error.message);
    console.log('\n💡 Consejos:');
    console.log('   - Asegúrate de que el servidor esté corriendo: npm run dev');
    console.log('   - Verifica la conexión a MongoDB');
    console.log('   - Confirma que el puerto 3000 esté disponible');
  }
}

  runAllTests().catch(console.error);

