# Laboratorio Semana 2: Backend Fundamentos
## Santiago Ramírez Cano

### Resumen General

Este repositorio contiene la implementación completa de las actividades del Laboratorio de la Semana 2, enfocadas en el desarrollo de fundamentos backend con Node.js y Express.

### Actividades Implementadas

#### 📚 [Actividad 1: Investigación sobre Express](./actividad1/Lab02-activity1.md)
- Investigación teórica sobre Express.js y sus ventajas
- Análisis del concepto de middleware con ejemplos prácticos
- Comparación entre Express, Koa y Fastify
- Herramientas adicionales útiles para desarrollo con Express

#### 🏗️ [Actividad 2: Introducción a Node.js y Express](./actividad_2_3_4/lab02-activity2.md)
- Configuración completa del proyecto con arquitectura por capas
- Implementación de servidor Express con middleware de seguridad
- Diseño de endpoints RESTful para sistema de reservas hoteleras
- Configuración de CORS, body parsing, logging y validaciones

#### 🔧 [Actividad 3: Implementación de Operaciones CRUD](./actividad_2_3_4/Lab02-activity3.md)
- Operaciones CRUD completas para Hoteles y Tipos de Habitaciones
- Arquitectura Clean Architecture con separación por capas
- Persistencia en MongoDB con repositorios especializados
- Validaciones robustas con Joi y manejo de errores

#### 🔍 [Actividad 4: Implementación del Buscador de Habitaciones](./actividad_2_3_4/Lab02-activity4.md)
- Sistema de búsqueda avanzada combinando hoteles y habitaciones
- Filtros por ubicación, capacidad, rango de precios y amenidades
- Validaciones complejas y manejo robusto de errores
- Optimizaciones de base de datos y consultas eficientes

### Estructura del Proyecto

```
Sem2/
├── actividad1/                    # Investigación teórica
│   └── Lab02-activity1.md
├── actividad_2_3_4/              # Implementación práctica
│   ├── src/                      # Código fuente (Clean Architecture)
│   ├── tests/                    # Pruebas automatizadas
│   ├── screenshots/              # Capturas de pantalla de pruebas
│   ├── lab02-activity2.md        # Documentación Actividad 2
│   ├── Lab02-activity3.md        # Documentación Actividad 3
│   ├── Lab02-activity4.md        # Documentación Actividad 4
│   └── swaggerAPI.yml           # Documentación OpenAPI
```

### Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Base de Datos**: MongoDB con Mongoose
- **Validaciones**: Joi
- **Seguridad**: CORS, Rate Limiting, Morgan
- **Documentación**: Markdown, OpenAPI/Swagger

### Características Destacadas

- ✅ **Arquitectura Clean**: Separación clara por capas y responsabilidades
- ✅ **API RESTful**: Endpoints bien diseñados siguiendo convenciones REST
- ✅ **Validaciones Robustas**: Manejo completo de errores y casos edge
- ✅ **Documentación Detallada**: Capturas de pantalla y ejemplos prácticos
- ✅ **Optimización de Rendimiento**: Consultas eficientes y paginación inteligente

### Pull Request para Revisión

🔗 **Enlace al Pull Request**: [Merge Request - Laboratorio Semana 2](https://gitlab.com/jala-university1/cohort-2/oficial-es-programaci-n-5-cspr-351.ga.t2.25.m1/secci-n-b/santiago-ramirez-cano/laboratories/-/merge_requests/1?resolved_conflicts=true)

El Pull Request contiene todo el código implementado para las actividades 2, 3 y 4, incluyendo:
- Implementación completa del sistema de reservas hoteleras
- Operaciones CRUD para hoteles y tipos de habitaciones
- Buscador avanzado de habitaciones con filtros múltiples
- Pruebas automatizadas y documentación

### Instrucciones de Ejecución

```bash
# Navegar al directorio del proyecto
cd actividad_2_3_4/

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

La documentación detallada de cada actividad se encuentra en sus respectivos archivos `.md` con explicaciones completas, ejemplos de código y capturas de pantalla de las pruebas realizadas.
