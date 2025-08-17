/**
 * decorators-demo.ts - Demostración minimalista de decorators experimentales
 * Ejemplos prácticos de @Component e @Input únicamente
 */

import 'reflect-metadata';
import { 
    Component, 
    Input, 
    getComponentConfig,
    getInputProperties
} from './decorators.js';

// ========================================
// COMPONENTE BÁSICO CON @Component E @Input
// ========================================

/**
 * Componente de tarjeta de hotel - Ejemplo básico de @Component e @Input
 */
@Component({
    selector: 'app-hotel-card',
    template: '<div class="hotel-card">{{hotelName}} - ${{price}}</div>',
    styleUrls: ['./hotel-card.css']
})
class HotelCardComponent {
    @Input() hotelName: string = '';
    @Input('hotel-price') price: number = 0;
    @Input() maxGuests: number = 0;
    @Input() description: string = '';

    constructor() {
        console.log('🏨 HotelCardComponent creado');
    }

    displayInfo(): void {
        console.log(`✅ Información del hotel:`);
        console.log(`   Nombre: ${this.hotelName}`);
        console.log(`   Precio: $${this.price}`);
        console.log(`   Capacidad: ${this.maxGuests} huéspedes`);
        console.log(`   Descripción: ${this.description}`);
    }

    updatePrice(newPrice: number): void {
        console.log(`💰 Actualizando precio de ${this.price} a ${newPrice}`);
        this.price = newPrice;
    }
}

// ========================================
// COMPONENTE DE LISTA - DEMOSTRACIÓN ADICIONAL
// ========================================

@Component({
    selector: 'app-hotel-list',
    template: '<div class="hotel-list">Lista de hoteles</div>'
})
class HotelListComponent {
    @Input() hotels: any[] = [];
    @Input() title: string = 'Lista de Hoteles';
    @Input('show-count') showCount: boolean = true;

    constructor() {
        console.log('📋 HotelListComponent creado');
    }

    displayList(): void {
        console.log(`📋 ${this.title}`);
        if (this.showCount) {
            console.log(`   Total de hoteles: ${this.hotels.length}`);
        }
        this.hotels.forEach((hotel, index) => {
            console.log(`   ${index + 1}. ${typeof hotel === 'string' ? hotel : hotel.name || 'Hotel sin nombre'}`);
        });
    }

    addHotel(hotel: any): void {
        this.hotels.push(hotel);
        console.log(`➕ Hotel añadido: ${typeof hotel === 'string' ? hotel : hotel.name}`);
    }
}

// ========================================
// FUNCIÓN DE DEMOSTRACIÓN
// ========================================

function runMinimalDemo(): void {
    console.log("=".repeat(50));
    console.log("DEMOSTRACIÓN: @Component e @Input");
    console.log("=".repeat(50));

    // 1. Crear componente HotelCard
    console.log("\n1. CREANDO COMPONENTE HOTEL CARD");
    console.log("-".repeat(30));

    const hotelCard = new HotelCardComponent();
    
    // Configurar propiedades @Input
    hotelCard.hotelName = "Hotel Paradise";
    hotelCard.price = 250;
    hotelCard.maxGuests = 4;
    hotelCard.description = "Un hermoso hotel frente al mar";

    // 2. Mostrar información del hotel
    console.log("\n2. MOSTRANDO INFORMACIÓN DEL HOTEL");
    console.log("-".repeat(30));

    hotelCard.displayInfo();

    // 3. Actualizar precio
    console.log("\n3. ACTUALIZANDO PRECIO");
    console.log("-".repeat(30));

    hotelCard.updatePrice(300);
    hotelCard.displayInfo();

    // 4. Crear segundo componente
    console.log("\n4. CREANDO COMPONENTE DE LISTA");
    console.log("-".repeat(30));

    const hotelList = new HotelListComponent();
    hotelList.title = "Hoteles Disponibles";
    hotelList.showCount = true;
    hotelList.hotels = [
        "Hotel Paradise",
        "Hotel Sunset",
        "Hotel Mountain View"
    ];

    hotelList.displayList();

    // 5. Añadir nuevo hotel
    console.log("\n5. AÑADIENDO NUEVO HOTEL");
    console.log("-".repeat(30));

    hotelList.addHotel("Hotel Ocean Breeze");
    hotelList.displayList();

    // 6. Mostrar metadata
    console.log("\n6. INFORMACIÓN DE METADATA");
    console.log("-".repeat(30));

    const config = getComponentConfig(HotelCardComponent);
    console.log(`Selector: ${config?.selector}`);
    console.log(`Template definido: ${!!config?.template}`);

    const inputs = getInputProperties(HotelCardComponent);
    console.log(`Total @Input properties: ${inputs.length}`);
    inputs.forEach(input => {
        console.log(`   - ${input.propertyKey}${input.alias ? ` (alias: ${input.alias})` : ''}`);
    });

    // 7. Prueba con alias
    console.log("\n7. VERIFICANDO ALIAS EN @Input");
    console.log("-".repeat(30));

    const listInputs = getInputProperties(HotelListComponent);
    console.log(`HotelListComponent inputs:`);
    listInputs.forEach(input => {
        console.log(`   - ${input.propertyKey}${input.alias ? ` (alias: ${input.alias})` : ''}`);
    });

    console.log("\n" + "=".repeat(50));
    console.log("DEMOSTRACIÓN COMPLETADA");
    console.log("=".repeat(50));
}

// Ejecutar demostración
try {
    runMinimalDemo();
} catch (error) {
    console.error("Error en la demostración:", error);
}

export { HotelCardComponent, HotelListComponent, runMinimalDemo };
