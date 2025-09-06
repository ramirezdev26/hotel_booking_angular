# Comandos Necesarios de Angular CLI - Sistema de Reservas

## Introducción

Este documento presenta una investigación exhaustiva de los comandos de Angular CLI necesarios para el desarrollo del sistema de reservas de hotel, incluyendo la creación de componentes, servicios, y configuración del proyecto.

## Comandos Fundamentales de Proyecto

### 1. Creación del Proyecto

```bash
ng new hotel-booking-system
```
**Descripción**: Crea un nuevo proyecto Angular con la estructura base.

**Opciones Importantes**:
```bash
ng new hotel-booking-system --routing --style=scss --package-manager=npm
```
- `--routing`: Configura Angular Router automáticamente
- `--style=scss`: Establece SCSS como preprocesador CSS
- `--package-manager=npm`: Especifica npm como gestor de paquetes

**Uso en el Proyecto**: Comando inicial para establecer la base del sistema de reservas.

### 2. Servidor de Desarrollo

```bash
ng serve
```
**Descripción**: Inicia el servidor de desarrollo con hot reload.

**Opciones Útiles**:
```bash
ng serve --open --port=4200 --host=0.0.0.0
```
- `--open`: Abre automáticamente el navegador
- `--port`: Especifica el puerto (default: 4200)
- `--host`: Permite acceso desde otras máquinas

**Uso en el Proyecto**: Desarrollo continuo y testing de la aplicación de reservas.

## Comandos de Generación de Componentes

### 3. Generación de Componentes

#### Componentes Principales
```bash
# Componentes de layout
ng generate component shared/header
ng generate component shared/footer

# Componentes de contenido
ng generate component components/hotel-card
ng generate component components/search-filters
ng generate component components/hotel-details
ng generate component components/booking-date
ng generate component components/room-selection
ng generate component components/promotions
ng generate component components/user-menu
ng generate component components/booking-list
ng generate component components/booking-modal
```

**Descripción**: Crea componentes con archivos .ts, .html, .css y .spec.ts.

**Opciones Avanzadas**:
```bash
ng generate component components/hotel-card --skip-tests --inline-style
ng generate component shared/header --export --module=shared
```
- `--skip-tests`: Omite la creación del archivo de pruebas
- `--inline-style`: Incluye estilos en el archivo .ts
- `--export`: Exporta el componente en el módulo
- `--module`: Especifica el módulo donde declarar el componente

#### Componentes de Página
```bash
ng generate component pages/home
ng generate component pages/search
ng generate component pages/hotel-details
ng generate component pages/my-bookings
```

**Uso en el Proyecto**: Creación de todos los componentes identificados en el análisis.

### 4. Generación con Módulos

```bash
ng generate module shared --module=app
ng generate module components --module=app
ng generate module pages --module=app
```

**Descripción**: Crea módulos para organizar componentes relacionados.

**Uso en el Proyecto**: Organización modular del código para mejor mantenibilidad.

## Comandos de Servicios

### 5. Generación de Servicios

```bash
# Servicios de datos
ng generate service services/hotel
ng generate service services/booking
ng generate service services/auth
ng generate service services/filter

# Servicios de utilidades
ng generate service services/notification
ng generate service services/storage
```

**Descripción**: Crea servicios inyectables para lógica de negocio.

**Opciones Útiles**:
```bash
ng generate service services/hotel --skip-tests
ng generate service services/auth --providedIn=root
```

**Uso en el Proyecto**: Gestión de datos, autenticación y lógica de negocio del sistema de reservas.

## Comandos de Routing

### 6. Configuración de Rutas

```bash
ng generate module app-routing --flat --module=app
```

**Descripción**: Crea módulo de routing separado.

**Configuración Manual Necesaria**:
```typescript
// En app-routing.module.ts
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search', component: SearchComponent },
  { path: 'hotel/:id', component: HotelDetailsComponent },
  { path: 'my-bookings', component: MyBookingsComponent },
  { path: '**', redirectTo: '' }
];
```

**Uso en el Proyecto**: Navegación entre páginas del sistema de reservas.

## Comandos de Directivas y Pipes

### 7. Directivas Personalizadas

```bash
ng generate directive directives/highlight
ng generate directive directives/auto-focus
```

**Descripción**: Crea directivas personalizadas para comportamientos específicos.

**Uso en el Proyecto**: 
- Directiva highlight para resaltar hoteles favoritos
- Directiva auto-focus para mejorar UX en formularios

### 8. Pipes Personalizados

```bash
ng generate pipe pipes/currency-format
ng generate pipe pipes/date-range
ng generate pipe pipes/room-type
```

**Descripción**: Crea pipes para transformación de datos.

**Uso en el Proyecto**:
- Formateo de precios en diferentes monedas
- Formateo de rangos de fechas
- Traducción de tipos de habitación

## Comandos de Guards

### 9. Guards de Autenticación

```bash
ng generate guard guards/auth
ng generate guard guards/booking
```

**Descripción**: Crea guards para proteger rutas.

**Tipos de Guards**:
```bash
ng generate guard guards/auth --implements CanActivate
ng generate guard guards/booking --implements CanDeactivate
```

**Uso en el Proyecto**:
- Proteger página de reservas (requiere login)
- Confirmar salida de formularios no guardados

## Comandos de Interfaces y Modelos

### 10. Interfaces TypeScript

```bash
ng generate interface models/hotel
ng generate interface models/booking
ng generate interface models/user
ng generate interface models/search-filters
```

**Descripción**: Crea interfaces TypeScript para tipado fuerte.

**Uso en el Proyecto**: Definición de modelos de datos para hoteles, reservas y usuarios.

## Comandos de Testing

### 11. Ejecución de Pruebas

```bash
# Pruebas unitarias
ng test

# Pruebas end-to-end
ng e2e

# Cobertura de código
ng test --code-coverage
```

**Opciones de Testing**:
```bash
ng test --watch=false --browsers=ChromeHeadless
ng e2e --port=4200 --host=localhost
```

**Uso en el Proyecto**: Validación de funcionalidades críticas como proceso de reserva.

## Comandos de Build y Deployment

### 12. Construcción para Producción

```bash
ng build --prod
```

**Opciones de Build**:
```bash
ng build --prod --aot --build-optimizer --output-path=dist/hotel-booking
```
- `--aot`: Ahead-of-Time compilation
- `--build-optimizer`: Optimizaciones adicionales
- `--output-path`: Directorio de salida personalizado

**Uso en el Proyecto**: Preparación para deployment del sistema de reservas.

### 13. Análisis del Bundle

```bash
ng build --stats-json
npx webpack-bundle-analyzer dist/hotel-booking-system/stats.json
```

**Descripción**: Analiza el tamaño del bundle para optimización.

**Uso en el Proyecto**: Optimización de performance para carga rápida.

## Comandos de Configuración

### 14. Adición de Librerías

```bash
# Angular Material
ng add @angular/material

# PWA Support
ng add @angular/pwa

# Angular Elements
ng add @angular/elements
```

**Uso en el Proyecto**:
- Material Design para UI components
- PWA para experiencia móvil mejorada

### 15. Configuración de Linting

```bash
ng lint
ng lint --fix
```

**Configuración personalizada**:
```bash
ng lint --format=stylish --type-check
```

**Uso en el Proyecto**: Mantener código consistente y de calidad.

## Comandos de Actualización

### 16. Actualización de Dependencias

```bash
ng update
ng update @angular/core @angular/cli
ng update --all
```

**Descripción**: Actualiza Angular y dependencias de manera segura.

**Uso en el Proyecto**: Mantener el proyecto actualizado con últimas versiones.

## Comandos Específicos para el Proyecto de Reservas

### 17. Secuencia de Comandos para Setup Inicial

```bash
# 1. Crear proyecto
ng new hotel-booking-system --routing --style=scss

# 2. Navegar al directorio
cd hotel-booking-system

# 3. Agregar Angular Material
ng add @angular/material

# 4. Crear estructura de módulos
ng generate module shared --module=app
ng generate module components --module=app
ng generate module pages --module=app

# 5. Generar componentes principales
ng generate component shared/header --module=shared
ng generate component shared/footer --module=shared
ng generate component components/hotel-card --module=components
ng generate component components/search-filters --module=components

# 6. Generar servicios
ng generate service services/hotel
ng generate service services/booking
ng generate service services/auth

# 7. Generar páginas
ng generate component pages/home --module=pages
ng generate component pages/search --module=pages
ng generate component pages/hotel-details --module=pages
ng generate component pages/my-bookings --module=pages

# 8. Iniciar desarrollo
ng serve --open
```

### 18. Comandos para Desarrollo Continuo

```bash
# Testing durante desarrollo
ng test --watch

# Lint y format
ng lint --fix

# Build de desarrollo
ng build --watch

# Análisis de bundle
ng build --stats-json && npx webpack-bundle-analyzer dist/stats.json
```

## Scripts Personalizados en package.json

### 19. Scripts Recomendados

```json
{
  "scripts": {
    "start": "ng serve",
    "build": "ng build --prod",
    "test": "ng test",
    "test:coverage": "ng test --code-coverage",
    "lint": "ng lint",
    "lint:fix": "ng lint --fix",
    "e2e": "ng e2e",
    "analyze": "ng build --stats-json && npx webpack-bundle-analyzer dist/hotel-booking-system/stats.json",
    "generate:component": "ng generate component",
    "generate:service": "ng generate service",
    "serve:prod": "ng build --prod && http-server dist/hotel-booking-system"
  }
}
```

## Conclusiones

### Comandos Críticos para el Proyecto

1. **Setup Inicial**: `ng new`, `ng add @angular/material`
2. **Desarrollo**: `ng generate component/service`, `ng serve`
3. **Testing**: `ng test`, `ng e2e`
4. **Deployment**: `ng build --prod`

### Mejores Prácticas

- Usar flags apropiados (`--skip-tests`, `--module`)
- Organizar componentes en módulos específicos
- Configurar scripts personalizados para tareas comunes
- Usar `ng update` regularmente para mantener dependencias actualizadas

### Flujo de Desarrollo Recomendado

1. Crear proyecto con configuración inicial
2. Configurar estructura modular
3. Generar componentes y servicios iterativamente
4. Testing continuo durante desarrollo
5. Build y análisis antes de deployment

Este conjunto de comandos proporciona una base sólida para el desarrollo eficiente del sistema de reservas de hotel.