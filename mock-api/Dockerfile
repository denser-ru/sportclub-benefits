FROM node:lts-alpine

# Install json-server globally
RUN npm install -g json-server

# Create working directory and copy our "database"
WORKDIR /data
COPY db.json .

# Expose the port the server will run on
EXPOSE 3004

# Start the server
CMD ["json-server", "--watch", "db.json", "--host", "0.0.0.0", "--port", "3004"]