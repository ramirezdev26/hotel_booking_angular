/**
 * decorators.ts - Implementación minimalista de decorators experimentales
 * Simula @Component e @Input de Angular de forma simplificada
 */

import 'reflect-metadata';

// ========================================
// TIPOS E INTERFACES BÁSICAS
// ========================================

export interface ComponentConfig {
    selector: string;
    template?: string;
    templateUrl?: string;
    styleUrls?: string[];
}

export interface InputMetadata {
    propertyKey: string;
    alias?: string;
}

// ========================================
// METADATA KEYS
// ========================================

const COMPONENT_KEY = Symbol('component');
const INPUT_KEY = Symbol('inputs');

// ========================================
// DECORATOR DE CLASE: @Component
// ========================================

/**
 * Decorator @Component - Simula el comportamiento de Angular
 * @param config Configuración del componente
 */
export function Component(config: ComponentConfig) {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        if (!config.selector) {
            throw new Error('Component debe tener un selector');
        }

        // Guardar configuración
        Reflect.defineMetadata(COMPONENT_KEY, config, constructor);

        // Retornar clase extendida con funcionalidades mínimas
        return class extends constructor {
            constructor(...args: any[]) {
                super(...args);
                console.log(`🚀 Componente inicializado: ${constructor.name}`);
                console.log(`   Selector: ${config.selector}`);
                this.initializeInputs();
            }

            initializeInputs(): void {
                const inputs = Reflect.getMetadata(INPUT_KEY, constructor.prototype) || [];

                if (inputs.length > 0) {
                    console.log(`   📥 Propiedades @Input: ${inputs.map((i: InputMetadata) => i.propertyKey).join(', ')}`);
                }
            }

            getComponentConfig(): ComponentConfig {
                return Reflect.getMetadata(COMPONENT_KEY, constructor) || {};
            }
        };
    };
}

// ========================================
// DECORATOR DE PROPIEDAD: @Input
// ========================================

/**
 * Decorator @Input - Marca propiedades como entrada del componente
 * @param alias Alias opcional para la propiedad
 */
export function Input(alias?: string) {
    return function (target: any, propertyKey: string | symbol) {
        const inputs: InputMetadata[] = Reflect.getMetadata(INPUT_KEY, target) || [];

        inputs.push({
            propertyKey: propertyKey.toString(),
            alias
        });

        Reflect.defineMetadata(INPUT_KEY, inputs, target);
        console.log(`📝 Registrado @Input: ${propertyKey.toString()}${alias ? ` (alias: ${alias})` : ''}`);
    };
}

// ========================================
// FUNCIONES UTILITARIAS
// ========================================

export function getComponentConfig(target: any): ComponentConfig | undefined {
    return Reflect.getMetadata(COMPONENT_KEY, target);
}

export function getInputProperties(target: any): InputMetadata[] {
    return Reflect.getMetadata(INPUT_KEY, target.prototype) || [];
}
