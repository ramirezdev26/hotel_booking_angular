# Lab 01 - Actividad 2: Investigación sobre Herramientas de Desarrollo

**Estudiante:** Santiago Ramirez  
**Curso:** Programación 5  
**Fecha:** [Fecha Actual]

---

## ¿Por qué usar la versión LTS de Node.js en proyectos?

### Estabilidad que puedes confiar

La versión LTS (Long Term Support) de Node.js es básicamente la versión "estable" que las empresas prefieren usar en producción. **¿Por qué?** Porque recibe soporte durante **30 meses completos** - 18 meses de soporte activo y 12 meses adicionales de mantenimiento (Node.js Foundation, 2024). Esto significa que no vas a tener sorpresas desagradables con bugs críticos que aparezcan de la nada.

Imaginate trabajando en un proyecto empresarial importante y que de repente una actualización de Node.js rompa todo tu código. Con LTS, ese riesgo se reduce enormemente porque estas versiones pasan por un proceso de **estabilización mucho más riguroso**. Se enfocan en arreglar bugs y parches de seguridad en lugar de agregar características experimentales que podrían causar problemas.

### Compatibilidad con todo el ecosistema

Otra razón súper importante es que **prácticamente todos los paquetes de npm están optimizados para LTS**. Desde frameworks como Express.js hasta herramientas como Angular CLI, todos recomiendan usar LTS porque han sido probados específicamente con estas versiones (npm, Inc., 2024). Esto significa menos dolores de cabeza con dependencias incompatibles y más tiempo enfocándote en desarrollar tu aplicación.

---

## Tres características destacadas de Node.js 22.x

### 1. Motor V8 12.4 - Velocidad que se nota

Node.js 22.x viene con el **motor V8 versión 12.4** que incluye una mejora llamada "Maglev" - básicamente un compilador que hace que tu código JavaScript corra **hasta 30% más rápido** (Google V8 Team, 2024). Si tienes una API que maneja mucho tráfico o procesa datos pesados, vas a notar la diferencia.

También mejoraron el **garbage collector**, que es el encargado de limpiar la memoria que ya no usas. Antes tenías esas pausas incómodas donde la aplicación se "congelaba" por unos milisegundos mientras limpiaba memoria. Ahora es mucho más fluido, especialmente importante si manejas WebSockets o streams de datos en tiempo real.

### 2. Módulos ES nativos - Adiós a las configuraciones raras

¡Por fin! Node.js 22.x soporta **módulos ES de forma nativa** sin necesidad de flags raros o configuraciones especiales. Esto significa que puedes usar `import` y `export` como en cualquier proyecto de JavaScript moderno sin quebraderos de cabeza (Node.js Team, 2024).

Además, ahora tienes **top-level await**, que básicamente te permite usar `await` directamente en el nivel superior de tus módulos sin tener que crear funciones async. Súper útil para cargar configuraciones de bases de datos o inicializar conexiones cuando tu aplicación arranca.

### 3. Test Runner integrado - Menos dependencias

Node.js 22.x incluye su propio **sistema de testing integrado**, lo que significa que para casos básicos ya no necesitas instalar Jest, Mocha o similares. Viene con assertions, mocking básico y hasta reportes de cobertura (Node.js Team, 2024).

Esto es genial porque **reduces dependencias externas** y tu proyecto se vuelve más simple de mantener. Para proyectos pequeños o medianos, este test runner nativo puede ser todo lo que necesitas.

---

## Ventajas de Angular CLI 20.x sobre versiones anteriores

### Signals - El cambio de juego en performance

Angular CLI 20.x viene con soporte completo para **Signals**, que es básicamente una forma más inteligente de manejar cambios en tu aplicación. En lugar de revisar todo el árbol de componentes cada vez que algo cambia (como hacía antes), ahora solo revisa las partes que realmente necesitan actualizarse (Angular Team, 2024).

**¿Qué significa esto para ti?** Apps más rápidas, especialmente si tienes listas grandes o componentes complejos. En dispositivos móviles o conexiones lentas, la diferencia es súper notable. Es como pasar de revisar toda una biblioteca cada vez que buscas un libro, a ir directamente al estante correcto.

### Standalone Components - Menos código repetitivo

Una de las cosas más frustrantes de Angular era tener que crear módulos NgModule para todo. Angular CLI 20.x ahora **genera proyectos usando standalone components por defecto**, lo que significa menos código repetitivo y una estructura más simple (Google Angular Team, 2024).

Esto hace que Angular sea más accesible para desarrolladores nuevos y que tus bundles sean más pequeños porque solo cargas lo que realmente necesitas. Es como tener un sistema de importación más inteligente que solo trae lo que vas a usar.

### Herramientas de desarrollo mejoradas

El nuevo dev server basado en **Vite reduce los tiempos de compilación hasta en 60%** y tiene hot module replacement más eficiente. En proyectos grandes, esto significa menos tiempo esperando a que tu código compile y más tiempo desarrollando (Angular Team, 2024).

También mejoraron las herramientas de debugging y análisis de performance, así que es más fácil encontrar qué está haciendo lenta tu aplicación y cómo optimizarla.

---

## Mejoras recientes de Visual Studio Code (1.101+)

### Inteligencia Artificial integrada

VS Code 1.101+ tiene **GitHub Copilot integrado de forma más profunda**, y no solo te sugiere código sino que puede **explicarte código complejo** que no entiendas. Seleccionas un bloque de código complicado y te explica qué hace línea por línea (Microsoft Corporation, 2024).

Esto es especialmente útil cuando trabajas con código legacy o cuando entras a un proyecto nuevo y necesitas entender rápidamente cómo funciona todo. Es como tener un compañero senior siempre disponible para explicarte las cosas.

### Performance mejorado

Optimizaron el editor para que use **40% menos memoria** en proyectos TypeScript grandes y las funciones como "Go to Definition" respondan mucho más rápido. Si trabajas con proyectos grandes, vas a notar que el editor se siente más fluido (Microsoft Corporation, 2024).

También mejoraron cómo se cargan las extensiones - ahora se cargan solo cuando las necesitas, no todas al inicio. Esto hace que VS Code arranque más rápido y use menos recursos.

### Colaboración remota avanzada

Las nuevas funciones de **Live Share** te permiten debuggear código con otros desarrolladores en tiempo real. Pueden ver las mismas variables, poner breakpoints y navegar por el código juntos, como si estuvieran físicamente en la misma computadora (Microsoft Corporation, 2024).

También hay mejor soporte para desarrollo en contenedores y GitHub Codespaces, lo que significa que puedes trabajar en proyectos complejos sin instalar nada en tu máquina local.

---

## Comparación de ESLint, Prettier y Angular Language Service

### ESLint - El detector de problemas

**ESLint** es como tener un revisor de código automático que encuentra errores y problemas de estilo antes de que tu código siquiera se ejecute. Su fuerte es la **configurabilidad** - puedes ajustarlo para que siga exactamente las reglas que tu equipo prefiere (ESLint Team, 2024).

```javascript
// ESLint puede detectar esto como problemático
if (user = null) { // ¿Asignación en lugar de comparación?
    console.log("User is null");
}
```

Es especialmente útil en equipos grandes donde necesitas mantener consistencia en el código y evitar errores comunes. Tiene plugins para React, Vue, Angular y prácticamente cualquier framework que uses.

### Prettier - El organizador automático

**Prettier** se enfoca únicamente en **hacer que tu código se vea bien y consistente**. No le importa si tu lógica está correcta, solo quiere que todo esté bien formateado (Prettier Team, 2024).

```javascript
// Código desorganizado
const user={name:"John",age:30,city:"New York"};

// Prettier lo convierte en:
const user = {
  name: "John",
  age: 30,
  city: "New York"
};
```

La gran ventaja es que **elimina debates sobre estilo** en el equipo. Ya no pierdes tiempo discutiendo si usar comillas simples o dobles, Prettier decide por ti.

### Angular Language Service - El especialista

**Angular Language Service** es específicamente para proyectos Angular. Entiende profundamente cómo funciona Angular y te da ayuda específica como autocompletado en templates, navegación entre componentes y detección de errores específicos del framework (Angular Team, 2024).

```html
<!-- Detecta errores en templates -->
<div *ngFor="let item of items">
  {{item.nonExistentProperty}} <!-- Te avisa que esta propiedad no existe -->
</div>
```

Es indispensable si desarrollas en Angular porque te ahorra mucho tiempo identificando errores que serían difíciles de encontrar manualmente.

### Comparación rápida

| Herramienta | Para qué sirve | Nivel de configuración |
|-------------|---------------|----------------------|
| **ESLint** | Encontrar errores y problemas de código | Alto - Muy configurable |
| **Prettier** | Formatear código automáticamente | Bajo - Opiniones fijas |
| **Angular Language Service** | Soporte específico para Angular | Medio - Depende del proyecto |

**¿Cuál usar?** Los tres juntos funcionan perfecto: ESLint cuida la calidad, Prettier cuida el formato, y Angular Language Service te ayuda específicamente con Angular.

---

## Conclusiones

### Todo funciona mejor junto

Lo interesante de estas herramientas es que **no compiten entre sí, se complementan**. Node.js 22.x te da una base sólida y rápida, Angular CLI 20.x te facilita crear y mantener proyectos complejos, y VS Code 1.101+ te da el ambiente perfecto para trabajar con todo esto.

### Vale la pena mantenerse actualizado

Las mejoras en performance, facilidad de uso y productividad que vienen con estas versiones recientes **justifican el esfuerzo de actualizar**. Especialmente las optimizaciones de velocidad en Node.js y Angular, y las características de IA en VS Code que realmente aceleran el desarrollo.

### Recomendación final

Si estás empezando un proyecto nuevo o puedes permitirte actualizar uno existente, **usar estas versiones específicas te va a ahorrar tiempo y dolores de cabeza**. La combinación de estabilidad (LTS), performance mejorado y herramientas más inteligentes hace que desarrollar sea más eficiente y divertido.

---

## Referencias

- Angular Team. (2025). Angular CLI 20.x Release Notes. https://angular.io/cli/
- ESLint Team. (2025). ESLint Documentation. https://eslint.org/docs/
- Google Angular Team. (2025). Angular Signals Architecture. https://blog.angular.io/
- Google V8 Team. (2025). V8 JavaScript Engine 12.4 Release. https://v8.dev/blog/
- Microsoft Corporation. (2025). Visual Studio Code 1.101 Release Notes. https://code.visualstudio.com/updates/
- Node.js Foundation. (2025). Node.js Release Schedule. https://nodejs.org/en/about/releases/
- Node.js Team. (2025). Node.js 22.x Documentation. https://nodejs.org/docs/
- npm, Inc. (2025). npm Registry Documentation. https://docs.npmjs.com/
- Prettier Team. (2025). Prettier Documentation. https://prettier.io/docs/