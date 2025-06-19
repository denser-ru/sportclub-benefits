# --- Stage 1: Builder ---
# Installs all dependencies, including dev dependencies, and can be used for running tests in CI
FROM python:3.12-slim as builder

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Create a virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy the dependency file
COPY pyproject.toml .

# Install all dependencies, including [dev]
RUN pip install --no-cache-dir .[dev]


# --- Stage 2: Final ---
# Builds a clean production image without dev dependencies and tests
# By default, docker-compose will use this final stage
FROM python:3.12-slim as final

# Create a non-root user for security
RUN useradd --create-home --shell /bin/bash appuser

WORKDIR /app

# Install system dependencies required for the application (only curl for healthcheck)
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy the virtual environment with dependencies from the builder stage
COPY --from=builder /opt/venv /opt/venv

# Copy the application code and logging configuration
COPY . .
COPY log_config.yaml .

# Change file ownership to our non-root user
RUN chown -R appuser:appuser /app

# Switch to the non-root user
USER appuser

# Set the PATH to include the virtual environment's binaries
ENV PATH="/opt/venv/bin:$PATH"

EXPOSE 8000

# Command to run the application in production mode with a custom log config
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--log-config", "log_config.yaml"]