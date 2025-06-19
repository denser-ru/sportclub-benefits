# --- Этап 1: Builder ---
# Устанавливает все зависимости, включая dev, и может использоваться для тестов в CI
FROM python:3.12-slim as builder

WORKDIR /app

# Устанавливаем системные зависимости
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Создаем виртуальное окружение
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Копируем файл с зависимостями
COPY pyproject.toml .

# Устанавливаем все зависимости, включая [dev]
RUN pip install --no-cache-dir .[dev]


# --- Этап 2: Final ---
# Собирает чистый production-образ без dev-зависимостей и тестов
# По умолчанию docker-compose будет использовать этот этап, т.к. он последний
FROM python:3.12-slim as final

# Создаем пользователя без root-прав для безопасности
RUN useradd --create-home --shell /bin/bash appuser

WORKDIR /app

# Устанавливаем системные зависимости, необходимые для работы приложения (только curl для healthcheck)
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Копируем виртуальное окружение с зависимостями из builder'а
COPY --from=builder /opt/venv /opt/venv

# Копируем код приложения и конфигурацию логгирования
COPY . .
COPY log_config.yaml .

# Меняем владельца файлов на нашего пользователя
RUN chown -R appuser:appuser /app

# Переключаемся на пользователя без root-прав
USER appuser

# Указываем Python использовать наше окружение
ENV PATH="/opt/venv/bin:$PATH"

EXPOSE 8000

# Команда для запуска приложения в production-режиме с кастомной конфигурацией логов
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--log-config", "log_config.yaml"]