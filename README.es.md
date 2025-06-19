<p align="center">
  <a href="README.ru.md">Русский</a> |
  <a href="README.en.md">English</a> |
  <a href="README.es.md">Español</a>
</p>

---

# Sportclub Benefits API & App

**Proyecto Full-Stack desarrollado como parte de un desafío técnico. Demuestra la creación de un servicio backend tolerante a fallos con FastAPI y una moderna aplicación frontend con React, unificados en un único sistema mediante Docker.**

---

## 🚀 Cómo Iniciar el Proyecto

Este es el método preferido para iniciar el proyecto, ya que levanta toda la infraestructura con un solo comando.

**Requisitos:**
*   Docker
*   Docker Compose

### 1. Desarrollo Local (con Hot-Reload)

Este modo es ideal para el desarrollo diario, ya que incluye la recarga automática del código sin necesidad de reiniciar los contenedores.

1.  Clona el repositorio:
    ```bash
    git clone <repository_url> sportclub-benefits
    cd sportclub-benefits
    ```

2.  Crea un archivo `.env` a partir del ejemplo:
    ```bash
    cp .env.example .env
    ```
    *En este archivo puedes modificar los puertos si ya están en uso.*

3.  Inicia los servicios:
    ```bash
    docker compose -f docker-compose.yml -f docker-compose.override.yml up --build
    ```

*   **Frontend** estará disponible en: `http://localhost:5173` (o el puerto especificado en `.env`)
*   **Backend API** estará disponible en: `http://localhost:8000` (documentación de la API: `http://localhost:8000/docs`)

### 2. Iniciar con Simulación de API Externa (Modo Mock)

Si la API real de `sportclub.com.ar` no está disponible, utiliza este modo. Inicia un servidor mock local.

```bash
docker compose -f docker-compose.yml -f docker-compose.override.yml -f compose.mock.yml up --build
```

### 3. Iniciar en Modo "Producción"

Este comando simula un despliegue en producción: utiliza imágenes optimizadas y ligeras sin herramientas de desarrollo.

```bash
docker compose -f docker-compose.yml up --build -d
```
*(la bandera `-d` inicia los contenedores en segundo plano)*

---

## ✅ Cómo Ejecutar los Tests

Los tests se ejecutan en contenedores Docker aislados, lo que garantiza la consistencia del entorno.

**Ejecutar tests para el Backend:**
```bash
docker compose -f docker-compose.yml -f docker-compose.override.yml run --rm backend-tests pytest
```

**Ejecutar tests para el Frontend:**
```bash
docker compose -f docker-compose.yml -f docker-compose.override.yml run --rm frontend-tests npm test
```

---

## 🏛️ Arquitectura y Decisiones de Diseño

El proyecto ha sido diseñado con un enfoque en la fiabilidad, escalabilidad y las mejores prácticas de desarrollo.

### Backend (Python/FastAPI)

*   **Clean Architecture Pragmática:** La lógica está claramente separada en capas:
    *   `api/`: **Presentation Layer** – Manejo de las peticiones HTTP.
    *   `services/`: **Application Logic Layer** – Orquestación de los procesos de negocio.
    *   `clients/`: **Infrastructure Layer** – Encapsulación de la interacción con la API externa de Sportclub.
    *   `domain/`: **Domain Layer** – Modelos Pydantic para un tipado estricto y validación de datos.
*   **Tolerancia a Fallos:** Se ha implementado un manejador de errores global. Si la API externa no está disponible, nuestro servicio no falla con un error 500, sino que responde cortésmente con un `503 Service Unavailable`, registrando el incidente en los logs.
*   **Configuración:** Los ajustes (URL, puertos) se gestionan a través de archivos `.env` utilizando `pydantic-settings`, lo que permite una configuración flexible para diferentes entornos.
*   **Logging Adaptativo:** El sistema de logging ajusta automáticamente el nivel de detalle: trazas completas en modo `DEBUG` para desarrollo y mensajes concisos `INFO`/`WARNING` para producción.

### Frontend (React/TypeScript/Vite)

*   **Stack Moderno:** Uso de React, TypeScript, Vite, Zustand y React Router DOM.
*   **Gestión de Estado Eficiente (Zustand):**
    *   El estado se divide en fragmentos granulares (`slices`), y los componentes utilizan selectores para suscribirse únicamente a los datos que necesitan. Esto **previene re-renderizados innecesarios**.
    *   Se implementa una estrategia **"cache-first"**: los datos para la página de detalle se buscan primero en la caché, y solo si no se encuentran se realiza una petición de red.
    *   La función "Favoritos" se guarda en `localStorage` mediante el middleware `persist`, asegurando la persistencia de la selección del usuario entre sesiones.
*   **Optimización del Rendimiento:**
    *   El filtrado de la lista de beneficios está memoizado con `useMemo`.
    *   Para el campo de búsqueda se aplica un hook personalizado `useDebounce`, que retrasa la ejecución del filtro, reduciendo la carga en la aplicación durante la escritura rápida.
*   **Accesibilidad (A11y):** Se han aplicado prácticas de accesibilidad básicas pero clave: marcado semántico (`<article>`, `<section>`), atributos `alt` para imágenes, atributos `aria-` y la asociación de `<label>` con los campos de entrada.

### DevOps y Contenerización

*   **Multi-stage Dockerfiles:** Tanto para el backend como para el frontend se utilizan compilaciones de varias etapas. Esto crea imágenes de producción mínimas y seguras, limpias de dependencias de compilación.
*   **Separación de Entornos (Dev/Prod):** El uso de `docker-compose.override.yml` permite tener configuraciones distintas para desarrollo (con hot-reload) y producción, lo cual es una mejor práctica.
*   **Healthchecks:** En `docker-compose.yml` se han configurado comprobaciones de estado para el servicio backend, lo que garantiza el orden correcto de inicio de los contenedores.
*   **Seguridad:** El servicio backend en la imagen final se ejecuta con un usuario sin privilegios de root (`appuser`).

---

Este proyecto demuestra la capacidad de crear aplicaciones completas y listas para producción, prestando atención no solo a la funcionalidad, sino también a la calidad de la arquitectura, el rendimiento y la fiabilidad.
