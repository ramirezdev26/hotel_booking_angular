# Análisis Deferred Loading - Proyecto Capstone

## ¿Qué es Deferred Loading?

Deferred Loading en Angular 17+ utiliza `@defer` blocks para cargar partes del template de forma diferida hasta que se cumple una condición específica. Esto mejora el rendimiento inicial al no cargar componentes innecesarios.

## ¿Cómo funcionan los @defer blocks?

Los @defer blocks permiten diferir la carga de:
- Componentes pesados
- Contenido que no es inmediatamente visible  
- Funcionalidades opcionales
- Componentes condicionales

## Triggers Disponibles

- `@defer (on viewport)` - Cuando entra en el viewport
- `@defer (on idle)` - Cuando el browser está idle
- `@defer (on interaction)` - Cuando el usuario interactúa
- `@defer (on timer(2s))` - Después de un tiempo específico

## Análisis de Componentes Candidatos

### ✅ **APTO** - HomeComponent Hotel Cards

**Ubicación:** `src/app/pages/home/home.html`

**Actual:**
```html
@if (hotels$ | async; as hotels) {
  <div class="hotels-grid">
    @for (hotel of hotels; track hotel.id) {
      <app-hotel-card
        [hotel]="hotel"
        [showBookButton]="true"
        (bookHotel)="onHotelBooked()">
      </app-hotel-card>
    }
  </div>
}
```

**Optimización Propuesta:**
```html
@if (hotels$ | async; as hotels) {
  <div class="hotels-grid">
    @for (hotel of hotels; track hotel.id) {
      @defer (on viewport) {
        <app-hotel-card
          [hotel]="hotel"
          [showBookButton]="true"
          (bookHotel)="onHotelBooked()">
        </app-hotel-card>
      } @placeholder {
        <div class="hotel-skeleton">Loading hotel...</div>
      }
    }
  </div>
}
```

**Justificación:**
- Las cards de hoteles pueden ser muchas
- No todas son visibles inicialmente
- Se cargan cuando entran al viewport



### ❌ **NO APTO** - Critical Components

#### HeaderComponent y FooterComponent
- **Razón**: Son críticos para la navegación
- **Siempre visibles**: No se benefician de deferred loading

#### Loading Spinners
- **Razón**: Necesitan mostrarse inmediatamente
- **Propósito**: Dar feedback inmediato al usuario

## Implementaciones Propuestas

### 1. Home Template con @defer
```html
<div class="home-container">
  <section class="hero-section">
    <div class="hero-content">
      <h1>Find Your Perfect Stay</h1>
      <p>Discover amazing hotels around the world</p>
    </div>
  </section>

  <section class="hotels-section">
    <div class="section-header">
      <h2>Featured Hotels</h2>
    </div>

    @if (isLoading$ | async) {
      <div class="loading-container">
        <mat-spinner></mat-spinner>
        <p>Loading hotels...</p>
      </div>
    }

    @if (error$ | async) {
      @defer (on idle) {
        <div class="error-container">
          <mat-icon>error</mat-icon>
          <h3>Error loading hotels</h3>
          <p>Please try again.</p>
          <button mat-raised-button (click)="refreshHotels()">
            Try Again
          </button>
        </div>
      } @placeholder {
        <div class="error-placeholder">Error occurred</div>
      }
    }

    @if (hotels$ | async; as hotels) {
      <div class="hotels-grid">
        @for (hotel of hotels; track hotel.id) {
          @defer (on viewport) {
            <app-hotel-card
              [hotel]="hotel"
              [showBookButton]="true"
              (bookHotel)="onHotelBooked()">
            </app-hotel-card>
          } @placeholder {
            <div class="hotel-skeleton">
              <div class="skeleton-image"></div>
              <div class="skeleton-content"></div>
            </div>
          }
        }
      </div>
    }
  </section>
</div>
```

### 2. CSS para Skeletons
```scss
.hotel-skeleton,
.booking-skeleton,
.search-result-skeleton {
  height: 300px;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  margin-bottom: 16px;

  .skeleton-image {
    width: 100%;
    height: 200px;
    background: #e0e0e0;
    border-radius: 4px;
    margin-bottom: 12px;
  }

  .skeleton-content {
    .skeleton-line {
      height: 16px;
      background: #e0e0e0;
      border-radius: 4px;
      margin-bottom: 8px;
    }
  }
}
```

## Pruebas de Funcionalidad

### Tests Recomendados
1. **Viewport Testing**: Verificar que componentes cargan al hacer scroll
2. **Network Testing**: Confirmar que bundles se cargan bajo demanda
3. **User Experience**: Validar que skeletons mejoran percepción de velocidad

## Limitaciones

### Consideraciones
- Solo disponible en Angular 17+
- Requiere testing extensivo
- Puede complicar el debugging
- Skeletons requieren mantenimiento adicional

## Conclusión

Deferred Loading ofrece optimizaciones significativas para componentes de lista como hotel cards. La implementación debe ser gradual, priorizando componentes que no son inmediatamente visibles.

## Referencias

1. Angular Official: Deferrable Views
   https://angular.io/guide/defer

2. Angular Blog: Introducing @defer
   https://blog.angular.io/introducing-angular-v17-4d7033312e4b

3. Web.dev: Optimize LCP with @defer
   https://web.dev/defer-non-critical-css/