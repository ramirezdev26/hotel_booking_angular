# Lab 09 - Actividad #3: Mejoras Generales en el Código y Vistas

## Descripción de la Actividad
Refactorizar el código y las vistas para mejorar su legibilidad, mantenimiento y experiencia de usuario, siguiendo las buenas prácticas de diseño web y arquitectura SPA enseñadas en las lecciones.


## Problemas Identificados en el Proyecto

### **1. Uso Excesivo de Divs - Falta de HTML Semántico**

#### **Problemas de Semantic HTML Detectados:**

**A. Estructura de Página sin Semántica**
```html
<!-- ❌ ANTES: Divitis - Uso excesivo de divs -->
<div class="header-container">
  <div class="navigation-wrapper">
    <div class="logo-section">
      <div class="brand-name">Hotel Booking</div>
    </div>
    <div class="menu-section">
      <div class="nav-links">
        <div class="nav-item">Home</div>
        <div class="nav-item">Search</div>
      </div>
    </div>
  </div>
</div>
```

```html
<!-- ✅ DESPUÉS: HTML Semántico -->
<header class="header-container">
  <nav class="navigation-wrapper">
    <section class="logo-section">
      <h1 class="brand-name">Hotel Booking</h1>
    </section>
    <section class="menu-section">
      <ul class="nav-links">
        <li><a href="/home" class="nav-item">Home</a></li>
        <li><a href="/search" class="nav-item">Search</a></li>
      </ul>
    </section>
  </nav>
</header>
```

**B. Cards de Hotel sin Estructura Semántica**
```html
<!-- ❌ ANTES: Sin semántica -->
<div class="hotel-card">
  <div class="hotel-image-container">
    <div class="hotel-image"></div>
  </div>
  <div class="hotel-content">
    <div class="hotel-title">Hotel Paradise</div>
    <div class="hotel-location">Miami Beach</div>
    <div class="hotel-price">$250/night</div>
    <div class="hotel-actions">
      <div class="book-button">Book Now</div>
    </div>
  </div>
</div>
```

```html
<!-- ✅ DESPUÉS: Estructura semántica -->
<article class="hotel-card">
  <figure class="hotel-image-container">
    <img src="hotel.jpg" alt="Hotel Paradise view" class="hotel-image">
  </figure>
  <section class="hotel-content">
    <h3 class="hotel-title">Hotel Paradise</h3>
    <address class="hotel-location">Miami Beach</address>
    <span class="hotel-price">$250/night</span>
    <footer class="hotel-actions">
      <button class="book-button" type="button">Book Now</button>
    </footer>
  </section>
</article>
```

**C. Formularios sin Labels Apropiados**
```html
<!-- ❌ ANTES: Divs como contenedores de form -->
<div class="form-container">
  <div class="input-group">
    <div class="input-label">Check-in Date</div>
    <div class="input-wrapper">
      <input type="date" class="date-input">
    </div>
  </div>
</div>
```

```html
<!-- ✅ DESPUÉS: Formulario semántico -->
<form class="booking-form">
  <fieldset class="date-selection">
    <legend>Stay Dates</legend>
    <div class="input-group">
      <label for="checkin" class="input-label">Check-in Date</label>
      <input type="date" id="checkin" name="checkin" class="date-input" required>
    </div>
  </fieldset>
</form>
```

## Refactoring Realizado

### **1. Mejoras en HTML Semántico**

#### **Elementos Semánticos Implementados:**
- `<header>` para encabezados de página
- `<nav>` para navegación principal
- `<main>` para contenido principal
- `<section>` para secciones temáticas
- `<article>` para contenido independiente (hotel cards)
- `<aside>` para contenido lateral (filtros)
- `<footer>` para pie de página
- `<figure>` y `<figcaption>` para imágenes con descripción

#### **Beneficios de HTML Semántico:**
✅ **Accesibilidad mejorada** - Screen readers pueden navegar mejor
✅ **SEO optimizado** - Motores de búsqueda entienden la estructura  
✅ **Mantenibilidad** - Código más legible y autodocumentado
✅ **Responsive design** - Mejor comportamiento en diferentes dispositivos