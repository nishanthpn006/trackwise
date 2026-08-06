# ─────────────────────────────────────────────────────────────────────────────
# TrackWise Frontend — Multi-Stage Production Dockerfile
# Stage 1: Build static assets with Node.js 20 & Vite
# Stage 2: Serve with high-performance Nginx 1.25 Alpine image
# ─────────────────────────────────────────────────────────────────────────────

# --- STAGE 1: Build Phase ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json ./

# Install dependencies (clean install)
RUN npm install

# Copy source code
COPY . .

# Environment build argument override (defaults to production)
ARG VITE_API_BASE_URL=/api/v1
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Run type check and Vite build
RUN npm run type-check && npm run build

# --- STAGE 2: Production Nginx Phase ---
FROM nginx:1.25-alpine AS runner

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static distribution from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port 80
EXPOSE 80

# Container healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Start Nginx in foreground mode
CMD ["nginx", "-g", "daemon off;"]
