# TrackWise Docker & Containerization Guide

This guide explains how to build, run, and manage **TrackWise** containers locally or on VPS host environments using Docker and Docker Compose.

---

## 1. Quick Start with Docker Compose

Run the full stack (PostgreSQL + Spring Boot Backend + Nginx Frontend) with a single command:

```bash
docker-compose up -d --build
```

### Access Points
- **Frontend App**: `http://localhost`
- **Backend API**: `http://localhost:8080/api/v1`
- **Actuator Health Check**: `http://localhost:8080/actuator/health`

---

## 2. Stopping Container Stack

```bash
docker-compose down
```

To stop containers and remove persistent database volumes:

```bash
docker-compose down -v
```

---

## 3. Individual Container Builds

### Building Frontend Nginx Container
```bash
cd frontend
docker build -t trackwise-frontend:latest .
docker run -p 80:80 trackwise-frontend:latest
```

### Building Backend Spring Boot Container
```bash
cd backend
docker build -t trackwise-backend:latest .
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=dev \
  trackwise-backend:latest
```

---

## 4. Container Health Check Verification

Inspect health status of all running containers:

```bash
docker-compose ps
```

All three containers (`trackwise-db`, `trackwise-backend`, `trackwise-frontend`) will show status `(healthy)`.
