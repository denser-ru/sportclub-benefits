# --- Stage 1: Development ---
# This stage is used for local development with hot-reloading
FROM node:lts-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Port for the Vite dev server
EXPOSE 5173

# Command to start the dev server
CMD ["npm", "run", "dev", "--", "--host"]


# --- Stage 2: Build ---
# This stage builds the static files for production
FROM node:lts-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build


# --- Stage 3: Production ---
# This stage serves the built static files with Nginx
# By default, docker-compose will use this stage as it is the last one
FROM nginx:stable-alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]