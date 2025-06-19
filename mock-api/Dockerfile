FROM node:lts-alpine

# Устанавливаем json-server глобально
RUN npm install -g json-server

# Создаем рабочую директорию и копируем нашу "базу данных"
WORKDIR /data
COPY db.json .

# Открываем порт, на котором будет работать сервер
EXPOSE 3004

# Запускаем сервер
CMD ["json-server", "--watch", "db.json", "--host", "0.0.0.0", "--port", "3004"]