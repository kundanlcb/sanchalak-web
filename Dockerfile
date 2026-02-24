# Stage 1: Build Stage
FROM node:20-alpine AS build

# Add build-time dependencies if needed
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Use npm ci for faster, more reliable installs in CI/Docker
RUN npm ci

# Copy only the files needed for the build (honors .dockerignore)
COPY . .

# Build-time arguments
ARG VITE_API_BASE_URL=/api
ARG VITE_USE_MOCK_API=false

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_USE_MOCK_API=$VITE_USE_MOCK_API

# Production build
RUN npm run build

# Stage 2: Production Stage
FROM nginx:stable-alpine

# Set labels for better maintainability
LABEL maintainer="Sanchalan Team"
LABEL version="1.0"
LABEL description="Optimized Nginx image for Sanchalan Frontend"

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add a healthcheck to ensure the container is running correctly
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
