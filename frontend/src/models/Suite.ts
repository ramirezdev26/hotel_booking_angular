/**
 * Suite.ts - Subclase que extiende Room para representar suites de lujo
 * Implementa funcionalidades específicas para habitaciones tipo suite
 */

import { Room } from './Room.js';

/**
 * Clase Suite - Extiende la clase Room para representar suites de lujo
 * Añade funcionalidades específicas como cama adicional y servicios premium
 */
export class Suite extends Room {
    // Propiedades específicas de la suite
    private _hasAdditionalBed: boolean;
    private _livingRoomSize: number; // Tamaño de sala en metros cuadrados
    private _premiumServices: string[];
    private _balconyAccess: boolean;

    /**
     * Constructor de la clase Suite
     * @param id - Identificador único de la suite
     * @param name - Nombre descriptivo de la suite
     * @param pricePerNight - Precio por noche (generalmente más alto que habitaciones estándar)
     * @param maxOccupancy - Número máximo de huéspedes
     * @param hasAdditionalBed - Indica si tiene cama adicional
     * @param livingRoomSize - Tamaño de la sala en metros cuadrados
     * @param amenities - Lista de amenidades incluidas
     * @param premiumServices - Servicios premium exclusivos de la suite
     * @param balconyAccess - Indica si tiene acceso a balcón
     */
    constructor(
        id: number,
        name: string,
        pricePerNight: number,
        maxOccupancy: number,
        hasAdditionalBed: boolean = false,
        livingRoomSize: number = 0,
        amenities: string[] = [],
        premiumServices: string[] = [],
        balconyAccess: boolean = false
    ) {
        // Llamada al constructor padre con tipo fijo "suite"
        super(id, name, "suite", pricePerNight, maxOccupancy, amenities);

        this.validateSuiteParams(livingRoomSize);

        this._hasAdditionalBed = hasAdditionalBed;
        this._livingRoomSize = livingRoomSize;
        this._premiumServices = premiumServices;
        this._balconyAccess = balconyAccess;

        // Añadir amenidades por defecto de suites
        this.addDefaultSuiteAmenities();
    }

    // Getters específicos de la suite
    public get hasAdditionalBed(): boolean {
        return this._hasAdditionalBed;
    }

    public get livingRoomSize(): number {
        return this._livingRoomSize;
    }

    public get premiumServices(): string[] {
        return [...this._premiumServices]; // Retorna copia para evitar mutaciones
    }

    public get balconyAccess(): boolean {
        return this._balconyAccess;
    }

    // Setters con validación
    public set hasAdditionalBed(hasAdditionalBed: boolean) {
        this._hasAdditionalBed = hasAdditionalBed;
        // Si se añade cama adicional, aumentar capacidad máxima
        if (hasAdditionalBed && this._maxOccupancy < 4) {
            this._maxOccupancy += 1;
        }
    }

    public set balconyAccess(access: boolean) {
        this._balconyAccess = access;
        if (access) {
            this.addAmenity("Balcón privado");
        } else {
            this.removeAmenity("Balcón privado");
        }
    }

    /**
     * Sobrescribe el método getDescription() para incluir información específica de la suite
     * @returns Descripción detallada de la suite incluyendo información adicional
     */
    public override getDescription(): string {
        // Obtener descripción base del padre
        const baseDescription = super.getDescription();

        // Información adicional específica de la suite
        const additionalBedInfo = this._hasAdditionalBed
            ? "✓ Cama adicional disponible"
            : "✗ Sin cama adicional";

        const livingRoomInfo = this._livingRoomSize > 0
            ? `Sala de estar: ${this._livingRoomSize}m²`
            : "Sin sala de estar separada";

        const balconyInfo = this._balconyAccess
            ? "✓ Acceso a balcón privado"
            : "✗ Sin balcón";

        const premiumServicesText = this._premiumServices.length > 0
            ? `\n  Servicios Premium: ${this._premiumServices.join(", ")}`
            : "";

        return `${baseDescription}
  === INFORMACIÓN DE SUITE ===
  ${additionalBedInfo}
  ${livingRoomInfo}
  ${balconyInfo}${premiumServicesText}`;
    }

    /**
     * Calcula el precio total considerando servicios premium
     * Sobrescribe el método padre para incluir costos adicionales
     * @param nights - Número de noches
     * @param includePremiumServices - Si incluir servicios premium en el cálculo
     * @returns Precio total con posibles servicios premium
     */
    public override calculateTotalPrice(nights: number, includePremiumServices: boolean = true): number {
        const basePrice = super.calculateTotalPrice(nights);

        if (!includePremiumServices || this._premiumServices.length === 0) {
            return basePrice;
        }

        // Costo adicional por servicios premium (ejemplo: 15% del precio base)
        const premiumServicesCost = basePrice * 0.15;

        return basePrice + premiumServicesCost;
    }

    /**
     * Verifica disponibilidad considerando cama adicional
     * @param guests - Número de huéspedes
     * @returns true si puede acomodar considerando cama adicional
     */
    public override canAccommodate(guests: number): boolean {
        let maxCapacity = this._maxOccupancy;

        // Si tiene cama adicional, puede acomodar un huésped extra
        if (this._hasAdditionalBed) {
            maxCapacity += 1;
        }

        return guests > 0 && guests <= maxCapacity;
    }

    /**
     * Añade un servicio premium a la suite
     * @param service - Servicio premium a añadir
     */
    public addPremiumService(service: string): void {
        if (service.trim() && !this._premiumServices.includes(service)) {
            this._premiumServices.push(service);
        }
    }

    /**
     * Remueve un servicio premium de la suite
     * @param service - Servicio premium a remover
     */
    public removePremiumService(service: string): void {
        const index = this._premiumServices.indexOf(service);
        if (index > -1) {
            this._premiumServices.splice(index, 1);
        }
    }

    /**
     * Obtiene información completa de la suite
     * @returns Objeto con toda la información de la suite
     */
    public getSuiteDetails(): {
        basic: ReturnType<Suite['getSummary']>;
        suite: {
            hasAdditionalBed: boolean;
            livingRoomSize: number;
            balconyAccess: boolean;
            premiumServices: string[];
        };
    } {
        return {
            basic: this.getSummary(),
            suite: {
                hasAdditionalBed: this._hasAdditionalBed,
                livingRoomSize: this._livingRoomSize,
                balconyAccess: this._balconyAccess,
                premiumServices: [...this._premiumServices]
            }
        };
    }

    /**
     * Verifica si es una suite de lujo basada en criterios específicos
     * @returns true si cumple criterios de suite de lujo
     */
    public isLuxurySuite(): boolean {
        return this._livingRoomSize >= 25 &&
               this._balconyAccess &&
               this._premiumServices.length >= 3;
    }

    /**
     * Calcula el precio por metro cuadrado (incluyendo sala)
     * @returns Precio por metro cuadrado o null si no hay información de tamaño
     */
    public getPricePerSquareMeter(): number | null {
        if (this._livingRoomSize <= 0) {
            return null;
        }

        // Asumiendo que la habitación base tiene ~20m² + sala
        const totalArea = 20 + this._livingRoomSize;
        return this._pricePerNight / totalArea;
    }

    /**
     * Añade amenidades por defecto de suites
     * @private
     */
    private addDefaultSuiteAmenities(): void {
        const defaultAmenities = [
            "Minibar premium",
            "Servicio de habitaciones 24h",
            "Bata de baño de lujo",
            "Pantuflas",
            "TV de pantalla grande"
        ];

        defaultAmenities.forEach(amenity => {
            this.addAmenity(amenity);
        });
    }

    /**
     * Valida parámetros específicos de la suite
     * @param livingRoomSize - Tamaño de la sala
     * @private
     */
    private validateSuiteParams(livingRoomSize: number): void {
        if (livingRoomSize < 0) {
            throw new Error("El tamaño de la sala no puede ser negativo");
        }
    }

    /**
     * Método estático para crear una suite desde datos JSON
     * @param data - Datos de la suite en formato objeto
     * @returns Nueva instancia de Suite
     */
    public static fromJSON(data: {
        id: number;
        name: string;
        pricePerNight: number;
        maxOccupancy: number;
        hasAdditionalBed?: boolean;
        livingRoomSize?: number;
        amenities?: string[];
        premiumServices?: string[];
        balconyAccess?: boolean;
    }): Suite {
        return new Suite(
            data.id,
            data.name,
            data.pricePerNight,
            data.maxOccupancy,
            data.hasAdditionalBed,
            data.livingRoomSize,
            data.amenities,
            data.premiumServices,
            data.balconyAccess
        );
    }

    /**
     * Convierte la suite a formato JSON
     * @returns Objeto serializable con información completa de la suite
     */
    public override toJSON(): object {
        return {
            ...super.toJSON(),
            hasAdditionalBed: this._hasAdditionalBed,
            livingRoomSize: this._livingRoomSize,
            premiumServices: this._premiumServices,
            balconyAccess: this._balconyAccess
        };
    }
}
