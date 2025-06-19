# --- Этап 1: Development ---
# Этот этап используется для локальной разработки с hot-reloading
FROM node:lts-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Порт, на котором работает Vite dev server
EXPOSE 5173

# Команда для запуска dev server
CMD ["npm", "run", "dev", "--", "--host"]


# --- Этап 2: Build ---
# Этот этап собирает статические файлы для продакшена
FROM node:lts-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build


# --- Этап 3: Production ---
# Этот этап отдает собранную статику через Nginx
# По умолчанию docker-compose будет использовать этот этап, т.к. он последний
FROM nginx:stable-alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]