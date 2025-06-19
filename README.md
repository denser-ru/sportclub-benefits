<p align="center">
  <a href="README.ru.md">Русский</a> |
  <a href="README.md">English</a> |
  <a href="README.es.md">Español</a>
</p>

---

# Sportclub Benefits API & App

**A full-stack project developed as part of a technical challenge. It demonstrates the creation of a fault-tolerant backend service with FastAPI and a modern frontend application with React, unified into a single system using Docker.**

---

## 🚀 How to Run

This is the preferred method for launching the project, as it sets up the entire infrastructure with a single command.

**Prerequisites:**
*   Docker
*   Docker Compose

### 1. Local Development (with Hot-Reload)

This mode is ideal for daily development, as it includes automatic code reloading without restarting the containers.

1.  Clone the repository:
    ```bash
    git clone <repository_url> sportclub-benefits
    cd sportclub-benefits
    ```

2.  Create a `.env` file from the example:
    ```bash
    cp .env.example .env
    ```
    *You can change the ports in this file if they are already in use.*

3.  Start the services:
    ```bash
    docker compose -f docker-compose.yml -f docker-compose.override.yml up --build
    ```

*   **Frontend** will be available at: `http://localhost:5173` (or the port specified in `.env`)
*   **Backend API** will be available at: `http://localhost:8000` (API documentation: `http://localhost:8000/docs`)

### 2. Run with External API Mock

If the real `sportclub.com.ar` API is unavailable, use this mode. It starts a local mock server.

```bash
docker compose -f docker-compose.yml -f docker-compose.override.yml -f compose.mock.yml up --build
```

### 3. Run in "Production" Mode

This command simulates a production launch: it uses optimized, lightweight images without development tools.

```bash
docker compose -f docker-compose.yml up --build -d
```
*(the `-d` flag runs containers in the background)*

---

## ✅ How to Run Tests

Tests are executed in isolated Docker containers, ensuring a consistent environment.

**Run Backend Tests:**
```bash
docker compose -f docker-compose.yml -f docker-compose.override.yml run --rm backend-tests pytest
```

**Run Frontend Tests:**
```bash
docker compose -f docker-compose.yml -f docker-compose.override.yml run --rm frontend-tests npm test
```

---

## 🏛️ Architecture and Design Decisions

The project is designed with a focus on reliability, scalability, and best development practices.

### Backend (Python/FastAPI)

*   **Pragmatic Clean Architecture:** The logic is clearly separated into layers:
    *   `api/`: **Presentation Layer** – Handles HTTP requests.
    *   `services/`: **Application Logic Layer** – Orchestrates business processes.
    *   `clients/`: **Infrastructure Layer** – Encapsulates interaction with the external Sportclub API.
    *   `domain/`: **Domain Layer** – Pydantic models for strict typing and data validation.
*   **Fault Tolerance:** A global error handler is implemented. If the external API is unavailable, our service does not crash with a 500 error but gracefully responds with a `503 Service Unavailable` while logging the incident.
*   **Configuration:** Settings (URLs, ports) are managed via `.env` files using `pydantic-settings`, allowing for flexible configuration across different environments.
*   **Adaptive Logging:** The logging system automatically adjusts its verbosity: detailed tracebacks in `DEBUG` mode for development and concise `INFO`/`WARNING` messages for production.

### Frontend (React/TypeScript/Vite)

*   **Modern Stack:** Utilizes React, TypeScript, Vite, Zustand, and React Router DOM.
*   **Efficient State Management (Zustand):**
    *   The state is divided into granular slices, and components use selectors to subscribe only to the data they need. This **prevents unnecessary re-renders**.
    *   A **"cache-first"** strategy is implemented: data for a detail page is first looked up in the cache, and a network request is only sent if it's not found.
    *   The "Favorites" feature state is persisted to `localStorage` using the `persist` middleware, ensuring data is saved between sessions.
*   **Performance Optimization:**
    *   The list filtering logic is memoized with `useMemo`.
    *   A custom `useDebounce` hook is applied to the search input, delaying the filtering execution and reducing the application's load during rapid typing.
*   **Accessibility (A11y):** Core accessibility practices have been applied: semantic markup (`<article>`, `<section>`), `alt` attributes for images, `aria-` attributes, and linking `<label>`s to input fields.

### DevOps and Containerization

*   **Multi-stage Dockerfiles:** Both backend and frontend use multi-stage builds. This creates minimal and secure production images, stripped of build-time dependencies.
*   **Environment Separation (Dev/Prod):** The use of `docker-compose.override.yml` allows for different configurations for development (with hot-reload) and production, which is a best practice.
*   **Healthchecks:** Health checks are configured in `docker-compose.yml` for the backend service, ensuring the correct startup order of containers.
*   **Security:** The backend service in the final image runs as a non-root user (`appuser`).

---

This project demonstrates the ability to build complete, production-ready applications, focusing not only on functionality but also on the quality of architecture, performance, and reliability.
