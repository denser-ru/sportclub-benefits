#!/bin/bash
#
# Этот скрипт копирует конфигурационные и другие непереведенные файлы
# из исходной директории ('../ru') в текущую директорию проекта.
# Он автоматически создает необходимые поддиректории.

# Прерывает выполнение скрипта при любой ошибке
set -e

# --- Конфигурация ---
SOURCE_DIR="../ru"
DEST_DIR="."

echo "Запуск скрипта копирования файлов..."
echo "Источник: $SOURCE_DIR"
echo "Назначение: $DEST_DIR"
echo ""

# --- Проверка ---
if [ ! -d "$SOURCE_DIR" ]; then
    echo "Ошибка: Исходная директория '$SOURCE_DIR' не найдена."
    echo "Убедитесь, что вы находитесь в правильной директории."
    exit 1
fi

# --- Список файлов для копирования ---
# Массив содержит пути к файлам относительно корневой папки
files_to_copy=(
    # Корневые файлы
    ".gitignore"
    "LICENSE"
    "README.md"
    "README.ru.md"
    "README.en.md"
    "README.es.md"

    # Файлы Backend
    "backend/.dockerignore"
    "backend/log_config.yaml"
    "backend/pyproject.toml"
    "backend/tests/__init__.py"
    "backend/clients/__init__.py"
    "backend/api/__init__.py"
    "backend/domain/__init__.py"
    "backend/services/__init__.py"

    # Файлы Frontend
    "frontend/.dockerignore"
    "frontend/.gitignore"
    "frontend/.prettierrc"
    "frontend/eslint.config.js"
    "frontend/index.html"
    "frontend/package.json"
    "frontend/tsconfig.json"
    "frontend/tsconfig.app.json"
    "frontend/tsconfig.node.json"
    "frontend/vite.config.ts"
    "frontend/vitest.config.ts"
    "frontend/src/index.css"
    "frontend/src/main.tsx"
    "frontend/src/test-setup.ts"
    "frontend/src/vite-env.d.ts"
    "frontend/__mocks__/axios.ts"
    "frontend/src/components/layout/Layout.tsx"
    "frontend/src/components/layout/Navbar.css"
)

echo "Будет скопировано ${#files_to_copy[@]} файлов..."

# --- Цикл копирования ---
for file_path in "${files_to_copy[@]}"; do
    source_file="$SOURCE_DIR/$file_path"
    dest_file="$DEST_DIR/$file_path"

    # Получаем путь к директории назначения
    dest_path_dir=$(dirname "$dest_file")

    # Создаем директорию назначения, если она не существует
    mkdir -p "$dest_path_dir"

    # Копируем файл
    cp "$source_file" "$dest_file"
    echo "  - Скопирован: $file_path"
done

echo ""
echo "Скрипт успешно завершен. Все указанные файлы скопированы."