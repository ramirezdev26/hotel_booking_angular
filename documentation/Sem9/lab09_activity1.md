# Lab09-activity1: Investigación sobre Flexbox, CSS Grid y Media Queries

## **Introducción**

El diseño responsivo es importante en el desarrollo web moderno. Este documento investiga las tres herramientas principales para crear layouts adaptativos: **Flexbox**, **CSS Grid** y **Media Queries**, incluyendo ejemplos prácticos del proyecto Hotel Booking.

## **1. Flexbox**

### **¿Qué es Flexbox?**

Flexbox (Flexible Box Layout) es un método de diseño CSS que permite distribuir elementos de manera eficiente en un contenedor, incluso cuando su tamaño es desconocido o dinámico. Proporciona control sobre la alineación, dirección, orden y tamaño de los elementos.

### **Propiedades Principales**

#### **Contenedor Flex (Flex Container)**
- `display: flex` - Activa el layout flexbox
- `flex-direction` - Define la dirección principal (row, column, row-reverse, column-reverse)
- `justify-content` - Alineación en el eje principal (flex-start, center, space-between, space-around)
- `align-items` - Alineación en el eje cruzado (stretch, center, flex-start, flex-end)
- `flex-wrap` - Permite que los elementos se envuelvan (nowrap, wrap, wrap-reverse)
- `gap` - Espacio entre elementos

#### **Elementos Flex (Flex Items)**
- `flex-grow` - Factor de crecimiento
- `flex-shrink` - Factor de contracción
- `flex-basis` - Tamaño base del elemento
- `flex` - Shorthand para grow, shrink y basis
- `align-self` - Alineación individual del elemento

### **Ejemplos Prácticos del Proyecto**

#### **Ejemplo 1: Loading Container (home.scss)**
```scss
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}
```
**Uso**: Centra el spinner de carga y texto verticalmente y horizontalmente.

#### **Ejemplo 2: App Container Layout (app.scss)**
```scss
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
```
**Uso**: Crea un layout de página completa donde el contenido principal ocupa todo el espacio disponible.

#### **Ejemplo 3: Form Row Layout (search.scss)**
```scss
.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;

  .form-field {
    flex: 1;
  }
}
```
**Uso**: Distribuye campos de formulario equitativamente en una fila con espaciado uniforme.

#### **Ejemplo 4: Hero Content (home.scss)**
```scss
.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  flex-direction: column;
}
```
**Uso**: Organiza contenido de hero section en columna centrada.

## **2. CSS Grid**

### **¿Qué es CSS Grid?**

CSS Grid Layout es un sistema de diseño bidimensional que permite crear layouts complejos con filas y columnas. Es ideal para diseños de página completos y componentes que requieren alineación precisa en ambas dimensiones.

### **Propiedades Clave**

#### **Contenedor Grid**
- `display: grid` - Activa el layout grid
- `grid-template-columns` - Define columnas (repeat, minmax, fr)
- `grid-template-rows` - Define filas
- `grid-gap` / `gap` - Espacio entre elementos
- `grid-template-areas` - Define áreas nombradas
- `justify-items` - Alineación horizontal de elementos
- `align-items` - Alineación vertical de elementos

#### **Elementos Grid**
- `grid-column` - Posición en columnas
- `grid-row` - Posición en filas
- `grid-area` - Área nombrada asignada
- `justify-self` - Alineación horizontal individual
- `align-self` - Alineación vertical individual

### **Ejemplos Prácticos del Proyecto**

#### **Ejemplo 1: Hotels Grid (home.scss)**
```scss
.hotels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
```
**Uso**: Crea una cuadrícula responsiva de tarjetas de hotel que se adapta automáticamente al espacio disponible.

#### **Ejemplo 2: Bookings Grid (my-bookings.scss)**
```scss
.bookings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}
```
**Uso**: Organiza las tarjetas de reservas en una cuadrícula adaptativa con tamaño mínimo de 400px.

#### **Ejemplo 3: Search Results Grid (search.scss)**
```scss
.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}
```
**Uso**: Muestra resultados de búsqueda en cuadrícula responsiva con elementos de mínimo 350px.

## **3. Media Queries**

### **¿Qué son las Media Queries?**

Las Media Queries son una característica de CSS que permite aplicar estilos diferentes según las características del dispositivo, como el ancho de la pantalla, orientación, resolución, etc. Son fundamentales para el diseño responsivo.

### **Sintaxis y Características**

#### **Sintaxis Básica**
```scss
@media (condición) {
  /* Estilos que se aplican cuando la condición es verdadera */
}
```

#### **Tipos de Consultas Comunes**
- `max-width` - Aplica estilos hasta un ancho máximo
- `min-width` - Aplica estilos desde un ancho mínimo
- `orientation` - Portrait o landscape
- `resolution` - Densidad de píxeles
- `hover` - Capacidad de hover del dispositivo

### **Ejemplos Prácticos del Proyecto**

#### **Ejemplo 1: Responsive Grid (múltiples archivos)**
```scss
.hotels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
```
**Uso**: Cambia de múltiples columnas a una sola columna en pantallas pequeñas.

#### **Ejemplo 2: Responsive Form Layout (search.scss)**
```scss
.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
}
```
**Uso**: Convierte layout horizontal de formulario a vertical en móviles.

#### **Ejemplo 3: Responsive Typography (home.scss)**
```scss
.hero-content {
  h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 20px;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.25rem;
    opacity: 0.9;

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
}
```
**Uso**: Reduce el tamaño de texto en pantallas pequeñas para mejor legibilidad.

#### **Ejemplo 4: Responsive Booking Form (booking.scss)**
```scss
.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
}

.half-width {
  flex: 0 0 200px;

  @media (max-width: 768px) {
    flex: 1;
  }
}
```
**Uso**: Adapta el formulario de reserva para pantallas móviles.

## **4. Container Queries**

### **¿Qué son las Container Queries?**

Container Queries son una nueva característica de CSS que permite aplicar estilos basados en el tamaño del contenedor padre en lugar del viewport. Esto permite crear componentes verdaderamente responsivos.

### **Sintaxis Básica**
```scss
.container {
  container-type: inline-size;
  container-name: card;
}

@container card (max-width: 300px) {
  .content {
    /* Estilos cuando el contenedor es menor a 300px */
  }
}
```

### **Estado en el Proyecto**
Actualmente el proyecto utiliza Media Queries tradicionales. Container Queries podrían implementarse para:
- Tarjetas de hotel adaptativas según su contenedor
- Componentes de formulario que se adapten a diferentes layouts
- Elementos de navegación responsivos por contexto

## **5. Comparación: Flexbox vs CSS Grid**

### **Cuándo usar Flexbox**

#### **Ventajas de Flexbox**
- **Unidimensional**: Ideal para layouts en una sola dirección (fila o columna)
- **Distribución de espacio**: Excelente para distribuir espacio entre elementos
- **Alineación**: Control preciso de alineación en ambos ejes
- **Flexibilidad**: Elementos pueden crecer, contraerse y envolver

#### **Casos de uso ideales**
- Barras de navegación
- Centrado de contenido
- Distribución de botones
- Layouts de formularios simples
- Componentes lineales

#### **Ejemplos del proyecto donde Flexbox es ideal**
```scss
// Centrado de contenido de carga
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

// Layout de aplicación
.app-container {
  display: flex;
  flex-direction: column;
}
```

### **Cuándo usar CSS Grid**

#### **Ventajas de CSS Grid**
- **Bidimensional**: Perfecto para layouts complejos con filas y columnas
- **Precisión**: Control exacto sobre posicionamiento
- **Responsividad**: Auto-fill y auto-fit para layouts adaptativos
- **Áreas nombradas**: Organización semántica del layout

#### **Casos de uso ideales**
- Layouts de página completos
- Galerías de imágenes
- Dashboards
- Cuadrículas de productos
- Layouts complejos con múltiples secciones

#### **Ejemplos del proyecto donde Grid es ideal**
```scss
// Cuadrícula de hoteles
.hotels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

// Cuadrícula de reservas
.bookings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}
```

### **Tabla Comparativa**

| Característica | Flexbox | CSS Grid |
|---------------|---------|----------|
| **Dimensión** | Unidimensional | Bidimensional |
| **Uso principal** | Distribución de elementos en línea | Layouts complejos de página |
| **Alineación** | Excelente en un eje | Excelente en ambos ejes |
| **Responsividad** | Mediante flex-wrap | Mediante auto-fill/auto-fit |
| **Complejidad** | Simple y directo | Más potente pero complejo |
| **Soporte** | Excelente | Muy bueno (moderno) |

### **Uso Combinado**

En el proyecto se utilizan ambos de manera complementaria:

```scss
// Grid para el layout general
.hotels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

// Flexbox para elementos internos
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
```

## **6. Breakpoints Utilizados en el Proyecto**

### **Estrategia Mobile-First**

El proyecto utiliza una responsividad con breakpoints consistentes:

```scss
// Breakpoint principal
@media (max-width: 768px) {
  // Estilos para móviles y tablets
}

// Ejemplos de implementación:
.form-row {
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
}
```
## **7. Referencias**

### **Documentación Oficial**
1. **MDN Web Docs - Flexbox**: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout
2. **MDN Web Docs - CSS Grid**: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout
3. **MDN Web Docs - Media Queries**: https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries

### **Responsive Design**
1. **Google Web Fundamentals - Responsive Design**: https://web.dev/responsive-web-design-basics/
2. **Smashing Magazine - Responsive Design Patterns**: https://www.smashingmagazine.com/2016/05/flexible-grids-and-responsive-web-design/