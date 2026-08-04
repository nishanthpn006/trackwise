# TrackWise — Deployment Guide

This guide covers every deployment scenario from local development to production Docker.

---

## Table of Contents

- [Local Development](#local-development)
- [Docker Compose Deployment](#docker-compose-deployment)
- [Production Deployment](#production-deployment)
- [Environment Variables Reference](#environment-variables-reference)
- [Database Setup](#database-setup)
- [Health Endpoints](#health-endpoints)
- [Troubleshooting](#troubleshooting)

---

## Local Development

### Prerequisites

| Tool | Version | Install |
| --- | --- | --- |
| Node.js | 20+ | https://nodejs.org/ |
| Java | 21 | https://adoptium.net/ |
| Maven | 3.9+ | bundled `./mvnw` wrapper |

### Frontend

```bash
cd frontend
npm install
cp .env.example .env         # defaults are fine for local dev
npm run dev                  # http://localhost:5173
```

The Vite dev server proxies `/api` to `http://localhost:8080` automatically.

### Backend

```bash
cd backend

# Start with in-memory H2 (no PostgreSQL required)
./mvnw spring-boot:run          # Linux / macOS
.\mvnw.cmd spring-boot:run      # Windows

# Start with local PostgreSQL
SPRING_PROFILES_ACTIVE=postgres ./mvnw spring-boot:run
```

The backend starts at `http://localhost:8080`.

---

## Docker Compose Deployment

### Prerequisites

- Docker Desktop 4.x+

### Steps

```bash
# 1. Clone
git clone https://github.com/nishanthpn006/trackwise.git
cd trackwise

# 2. Configure
cp .env.example .env

# Edit .env with your values:
#   POSTGRES_PASSWORD=<strong password>
#   JWT_SECRET=<output of: openssl rand -hex 32>
nano .env   # or use your preferred editor

# 3. Build and start
docker compose up -d

# 4. Watch logs until all services are healthy
docker compose logs -f

# 5. Verify
curl http://localhost/health
curl http://localhost/api/actuator/health
```

The application is available at `http://localhost`.

### Container Management

```bash
# View running containers
docker compose ps

# Follow logs for a specific service
docker compose logs -f backend

# Restart a service
docker compose restart backend

# Stop all services (preserves data volume)
docker compose stop

# Stop and remove everything including the data volume
docker compose down -v
```

---

## Production Deployment

### Security Checklist

- [ ] `POSTGRES_PASSWORD` is a strong, unique password (not the example value)
- [ ] `JWT_SECRET` is a 64-char random hex string (`openssl rand -hex 32`)
- [ ] Root `.env` is not committed to version control
- [ ] Docker images are built from the production Dockerfiles (multi-stage)
- [ ] TLS/HTTPS is terminated at a reverse proxy (e.g. Nginx, Cloudflare, AWS ALB) in front of port 80
- [ ] PostgreSQL port 5432 is not exposed externally (internal Docker network only)
- [ ] Backend port 8080 is not exposed externally (proxied through Nginx)

### Recommended Production Environment Variables

```bash
# Generate JWT secret
JWT_SECRET=$(openssl rand -hex 32)

# Use a managed PostgreSQL service URL
DB_URL=jdbc:postgresql://your-managed-db-host:5432/trackwise
```

### Docker Production Compose Override

For production, create a `docker-compose.override.yml` (gitignored):

```yaml
services:
  backend:
    environment:
      SPRING_PROFILES_ACTIVE: prod
  postgres:
    ports: []   # do not expose PostgreSQL externally
```

Then start with:

```bash
docker compose -f docker-compose.yml -f docker-compose.override.yml up -d
```

---

## Environment Variables Reference

### Root `.env` (Docker Compose)

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `POSTGRES_DB` | No | `trackwise` | PostgreSQL database name |
| `POSTGRES_USER` | No | `trackwise` | PostgreSQL username |
| `POSTGRES_PASSWORD` | **Yes** | — | PostgreSQL password |
| `JWT_SECRET` | **Yes** | — | 64-char hex JWT signing key |
| `JWT_EXPIRATION_MS` | No | `86400000` | Token TTL in ms (24 hours) |
| `DB_POOL_SIZE` | No | `10` | HikariCP max pool size |
| `FRONTEND_PORT` | No | `80` | Host port mapped to Nginx |

### Backend Spring Profile Variables

| Variable | Profile | Description |
| --- | --- | --- |
| `SPRING_PROFILES_ACTIVE` | — | Set to `prod` for production |
| `DB_URL` | prod | Full JDBC URL for PostgreSQL |
| `DB_USERNAME` | prod | Database username |
| `DB_PASSWORD` | prod | Database password |
| `SERVER_PORT` | all | HTTP port (default: 8080) |

---

## Database Setup

### Development (H2 — automatic)

No setup needed. The H2 in-memory database starts automatically with the backend.
Schema is created by Hibernate (`ddl-auto=update`).

### Production (PostgreSQL)

The `postgres` container in Docker Compose automatically creates the database and user
from `POSTGRES_DB` and `POSTGRES_USER` on first start.

Hibernate creates all tables on first boot (`ddl-auto=update`).

For managed PostgreSQL (e.g., AWS RDS, Supabase):

```sql
CREATE DATABASE trackwise;
CREATE USER trackwise WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE trackwise TO trackwise;
```

Then set `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` environment variables accordingly.

---

## Health Endpoints

| Endpoint | Method | Description |
| --- | --- | --- |
| `GET /health` | Nginx | Frontend health (returns `200 OK`) |
| `GET /api/actuator/health` | via Nginx | Full stack health (JSON) |
| `GET /actuator/health` | Backend direct | Backend health (JSON) |
| `GET /actuator/health/liveness` | Backend | Kubernetes liveness probe |
| `GET /actuator/health/readiness` | Backend | Kubernetes readiness probe |

Example response:

```json
{
  "status": "UP",
  "components": {
    "db": { "status": "UP" },
    "diskSpace": { "status": "UP" },
    "ping": { "status": "UP" }
  }
}
```

---

## Troubleshooting

### Backend fails to start — database connection refused

```bash
# Check postgres container health
docker compose ps
docker compose logs postgres

# Common cause: POSTGRES_PASSWORD not set in .env
```

### Frontend shows blank page or 404

```bash
# Check Nginx logs
docker compose logs frontend

# Verify the dist was built correctly in the image
docker compose exec frontend ls /usr/share/nginx/html
```

### `JWT_SECRET` error at startup

The production profile has no default for `JWT_SECRET`. Generate one:

```bash
openssl rand -hex 32
```

Add the output to your `.env` file.

### Port 80 already in use

Change the frontend port in `.env`:

```bash
FRONTEND_PORT=8081
```

Then restart: `docker compose up -d`.

### Rebuild images after code changes

```bash
docker compose build --no-cache
docker compose up -d
```
