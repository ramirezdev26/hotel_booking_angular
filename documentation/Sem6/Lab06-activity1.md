# Lab06 - Actividad #1: Consumo de API - Mostrar Opciones de Hoteles Disponibles

## Descripción
Implementación de la integración con la API del backend para obtener y mostrar hoteles disponibles usando componentes Angular dedicados.

## Implementación Realizada

### 1. HomeService (`src/app/pages/home/services/home.service.ts`)
- **Arquitectura**: Patrón de "servicios por página" siguiendo las lecciones del profesor Diego Garcia
- **State Management**: BehaviorSubject con estados discriminados (idle, loading, success, error)
- **Observables Reactivos**: `hotels$`, `isLoading$`, `error$`
- **Lifecycle**: Implementa ngOnDestroy() con cleanup automático
- **Provider**: Local en el componente (no global)

```typescript
// Ejemplo de uso
this.hotels$ = this.homeService.hotels$;
this.isLoading$ = this.homeService.isLoading$;
this.error$ = this.homeService.error$;
```

### 2. Interfaces Actualizadas (`src/app/shared/models/hotel.ts`)
- **Hotel Interface**: Adaptada para coincidir con la respuesta real de la API
- **HotelApiResponse**: Interface para respuesta completa con paginación
- Estructura completa: address, contact, policies, rating, amenities, etc.

### 3. Componentes Modificados

#### HotelCardComponent
- Adaptado para nueva estructura de datos de la API
- Métodos helper: `getLocation()`, `getMainImage()`
- Rating usando `hotel.rating.average`
- Fallback para imágenes faltantes

#### HomeComponent
- Integración completa con HomeService
- Estados reactivos con async pipe
- Manejo de errores con MatSnackBar
- Loading spinners y mensajes informativos

### 4. Configuración de la Aplicación

#### API Configuration (`src/app/core/`)
```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    // ...otros providers
    provideHttpClient(),
    provideApiUrl({ url: 'http://localhost:3000' })
  ]
};
```

### 5. Templates y Estilos
- **Home Template**: Estados reactivos, loading/error/success
- **Hotel Card Template**: Datos derivados con métodos helper
- **Estilos CSS**: Layout responsive y estados visuales

## Arquitectura de Servicios por Página

### Nueva Estructura
```
pages/
├── home/
│   ├── services/
│   │   └── home.service.ts    ← Servicio específico para home
│   └── home.ts                ← Provider local del servicio
└── [futuras-páginas]/
    └── services/              ← Servicios específicos por página
```

### Beneficios
1. **Separación de Responsabilidades**: Cada página maneja su lógica
2. **Encapsulamiento**: Servicios cerca de donde se usan
3. **Escalabilidad**: Fácil agregar nuevas páginas
4. **Mantenimiento**: Lógica específica fácil de encontrar

## Endpoint Utilizado
- **GET** `http://localhost:3000/api/hotels`
- **Respuesta**: Lista de hoteles con paginación
- **Manejo de errores**: Observables de error y notificaciones

## Manejo de Errores
1. **Servicio**: Estados de error en BehaviorSubject
2. **Componente**: Suscripción a error$ para snackbars
3. **UI**: Loading spinners, mensajes de error, botón "Try Again"

## Características Implementadas

✅ **Servicio específico por página** con state management reactivo  
✅ **Componentes actualizados** para nueva API  
✅ **Datos mostrados**: nombre, ubicación, rating, descripción, amenidades  
✅ **Manejo robusto de errores** con recuperación  
✅ **Arquitectura escalable** siguiendo patrones de las lecciones  

## Patrones Aplicados (Transcripts de Diego Garcia)
- **Union Types**: Estados discriminados (idle, loading, success, error)
- **BehaviorSubject**: State management reactivo
- **Lifecycle Management**: ngOnDestroy() con cleanup
- **Provider Strategy**: Servicios locales por página
- **Observable Filtering**: filter() y map() para narrowing

## Diferencias con Versión Anterior
1. **Estructura**: `shared/services/hotel.service.ts` → `pages/home/services/home.service.ts`
2. **Nombre**: `HotelService` → `HomeService`
3. **Provider**: Global → Local en componente
4. **Arquitectura**: Patrón "servicios por página"

## Próximos Pasos
- Configurar Node.js v22 correctamente
- Probar integración completa con backend
- Seguir patrón para futuras páginas (search, bookings, etc.)
