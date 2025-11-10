# Dockerfile for the Node.js server application

# --- Base Stage ---
# Use a specific Node.js version for reproducibility
FROM node:16-alpine as base

WORKDIR /usr/src/app

# Install dependencies first to leverage Docker layer caching
COPY server/package*.json ./
RUN npm install --only=production

# --- Production Stage ---
# Create a new, clean stage for the production image
FROM node:16-alpine as production

WORKDIR /usr/src/app

# Copy dependencies from the base stage
COPY --from=base /usr/src/app/node_modules ./node_modules

# Copy the rest of the server application code
COPY server/ .

# Expose the port the app runs on
EXPOSE 5000

# The command to run the application
CMD [ "npm", "start" ]