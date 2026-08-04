# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 — Build the Vite production bundle
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Cache node_modules layer separately from source
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline

# Copy source files and build
COPY . .
RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 — Serve with Nginx
# ─────────────────────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

LABEL org.opencontainers.image.title="TrackWise Frontend" \
      org.opencontainers.image.description="Personal Expense Tracker — React 19 SPA" \
      org.opencontainers.image.source="https://github.com/nishanthpn006/trackwise"

# Remove the default Nginx site
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/trackwise.conf

# Copy the Vite build output
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Health check — verifies Nginx is serving the /health route
HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
