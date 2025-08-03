/**
 * Room.ts - Clase base para representar una habitación de hotel
 * Implementa la estructura básica de datos para habitaciones del sistema de reservas
 */

/**
 * Clase Room - Representa una habitación de hotel con sus características básicas
 * Esta clase sirve como base para diferentes tipos de habitaciones
 */
export class Room {
    // Propiedades protegidas para permitir acceso desde subclases
    protected _id: number;
    protected _name: string;
    protected _type: string;
    protected _pricePerNight: number;
    protected _maxOccupancy: number;
    protected _isAvailable: boolean;
    protected _amenities: string[];

    /**
     * Constructor de la clase Room
     * @param id - Identificador único de la habitación
     * @param name - Nombre descriptivo de la habitación
     * @param type - Tipo de habitación (simple, doble, suite, etc.)
     * @param pricePerNight - Precio por noche en la moneda base
     * @param maxOccupancy - Número máximo de huéspedes
     * @param amenities - Lista de amenidades incluidas (opcional)
     */
    constructor(
        id: number,
        name: string,
        type: string,
        pricePerNight: number,
        maxOccupancy: number,
        amenities: string[] = []
    ) {
        this.validateConstructorParams(id, name, type, pricePerNight, maxOccupancy);

        this._id = id;
        this._name = name;
        this._type = type;
        this._pricePerNight = pricePerNight;
        this._maxOccupancy = maxOccupancy;
        this._isAvailable = true; // Por defecto disponible
        this._amenities = amenities;
    }

    // Getters públicos para acceso controlado a las propiedades
    public get id(): number {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get type(): string {
        return this._type;
    }

    public get pricePerNight(): number {
        return this._pricePerNight;
    }

    public get maxOccupancy(): number {
        return this._maxOccupancy;
    }

    public get isAvailable(): boolean {
        return this._isAvailable;
    }

    public get amenities(): string[] {
        return [...this._amenities]; // Retorna copia para evitar mutaciones
    }

    // Setters con validación
    public set pricePerNight(price: number) {
        if (price <= 0) {
            throw new Error("El precio por noche debe ser mayor a 0");
        }
        this._pricePerNight = price;
    }

    public set isAvailable(available: boolean) {
        this._isAvailable = available;
    }

    /**
     * Obtiene una descripción detallada de la habitación
     * Método virtual que puede ser sobrescrito por subclases
     * @returns Descripción formateada de la habitación
     */
    public getDescription(): string {
        const amenitiesText = this._amenities.length > 0
            ? `\n  Amenidades: ${this._amenities.join(", ")}`
            : "";

        return `Habitación: ${this._name}
  ID: ${this._id}
  Tipo: ${this._type}
  Precio por noche: $${this._pricePerNight}
  Capacidad máxima: ${this._maxOccupancy} huéspedes
  Disponible: ${this._isAvailable ? "Sí" : "No"}${amenitiesText}`;
    }

    /**
     * Calcula el precio total para una estadía
     * @param nights - Número de noches
     * @returns Precio total calculado
     */
    public calculateTotalPrice(nights: number): number {
        if (nights <= 0) {
            throw new Error("El número de noches debe ser mayor a 0");
        }
        return this._pricePerNight * nights;
    }

    /**
     * Verifica si la habitación puede acomodar el número de huéspedes
     * @param guests - Número de huéspedes
     * @returns true si puede acomodar, false en caso contrario
     */
    public canAccommodate(guests: number): boolean {
        return guests > 0 && guests <= this._maxOccupancy;
    }

    /**
     * Añade una amenidad a la habitación
     * @param amenity - Amenidad a añadir
     */
    public addAmenity(amenity: string): void {
        if (amenity.trim() && !this._amenities.includes(amenity)) {
            this._amenities.push(amenity);
        }
    }

    /**
     * Remueve una amenidad de la habitación
     * @param amenity - Amenidad a remover
     */
    public removeAmenity(amenity: string): void {
        const index = this._amenities.indexOf(amenity);
        if (index > -1) {
            this._amenities.splice(index, 1);
        }
    }

    /**
     * Obtiene información resumida de la habitación
     * @returns Objeto con información básica
     */
    public getSummary(): {
        id: number;
        name: string;
        type: string;
        pricePerNight: number;
        maxOccupancy: number;
        isAvailable: boolean;
    } {
        return {
            id: this._id,
            name: this._name,
            type: this._type,
            pricePerNight: this._pricePerNight,
            maxOccupancy: this._maxOccupancy,
            isAvailable: this._isAvailable
        };
    }

    /**
     * Valida los parámetros del constructor
     * @param id - ID de la habitación
     * @param name - Nombre de la habitación
     * @param type - Tipo de habitación
     * @param pricePerNight - Precio por noche
     * @param maxOccupancy - Capacidad máxima
     */
    private validateConstructorParams(
        id: number,
        name: string,
        type: string,
        pricePerNight: number,
        maxOccupancy: number
    ): void {
        if (id <= 0) {
            throw new Error("El ID debe ser un número positivo");
        }
        if (!name.trim()) {
            throw new Error("El nombre de la habitación no puede estar vacío");
        }
        if (!type.trim()) {
            throw new Error("El tipo de habitación no puede estar vacío");
        }
        if (pricePerNight <= 0) {
            throw new Error("El precio por noche debe ser mayor a 0");
        }
        if (maxOccupancy <= 0) {
            throw new Error("La capacidad máxima debe ser mayor a 0");
        }
    }

    /**
     * Método estático para crear una habitación desde datos JSON
     * @param data - Datos de la habitación en formato objeto
     * @returns Nueva instancia de Room
     */
    public static fromJSON(data: {
        id: number;
        name: string;
        type: string;
        pricePerNight: number;
        maxOccupancy: number;
        amenities?: string[];
    }): Room {
        return new Room(
            data.id,
            data.name,
            data.type,
            data.pricePerNight,
            data.maxOccupancy,
            data.amenities
        );
    }

    /**
     * Convierte la habitación a formato JSON
     * @returns Objeto serializable
     */
    public toJSON(): object {
        return {
            id: this._id,
            name: this._name,
            type: this._type,
            pricePerNight: this._pricePerNight,
            maxOccupancy: this._maxOccupancy,
            isAvailable: this._isAvailable,
            amenities: this._amenities
        };
    }
}
