# TrackWise Production Deployment Guide

This guide details step-by-step instructions for deploying **TrackWise Personal Expense Tracker** to production cloud platforms.

---

## 1. Architecture Overview

- **Frontend**: Single Page Application (SPA) built with React 19, TypeScript, and Vite. Servable via Nginx container or edge static hosts (Vercel, Netlify).
- **Backend**: Spring Boot 3.3 REST API running on Java 21 JRE with Spring Security JWT authentication and Spring Data JPA.
- **Database**: Managed PostgreSQL 16 database instance (Neon, Supabase, Render, Railway).

---

## 2. Frontend Deployment Options

### Option A: Vercel (Recommended Static Edge Deployment)

1. Import the `trackwise` repository into Vercel.
2. Select Root Directory: `frontend`.
3. Framework Preset: `Vite`.
4. Environment Variables:
   - `VITE_API_BASE_URL`: `https://<your-backend-domain>/api/v1`
5. Vercel will automatically read `vercel.json` for SPA fallback routing.

### Option B: Netlify

1. Connect repository to Netlify.
2. Base directory: `frontend`.
3. Build command: `npm run build`.
4. Publish directory: `frontend/dist`.
5. Environment Variables:
   - `VITE_API_BASE_URL`: `https://<your-backend-domain>/api/v1`

---

## 3. Backend Deployment Options

### Option A: Railway (Container Deployment)

1. Create a new project in Railway and select **Deploy from GitHub repo**.
2. Set Root Directory: `/`.
3. Config File: `railway.json`.
4. Environment Variables:
   - `SPRING_PROFILES_ACTIVE`: `prod`
   - `SERVER_PORT`: `8080`
   - `DB_URL`: `jdbc:postgresql://<neon-or-railway-host>:5432/<db_name>?sslmode=require`
   - `DB_USERNAME`: `<db_user>`
   - `DB_PASSWORD`: `<db_password>`
   - `JWT_SECRET`: `<64-character-hex-string>`
   - `JWT_EXPIRATION_MS`: `86400000`

### Option B: Render Blueprint

1. Go to Render Dashboard -> **Blueprints** -> **New Blueprint Instance**.
2. Connect repository and Render will parse `render.yaml`.
3. Render automatically provisions a PostgreSQL database and containerized Web Service.

---

## 4. Managed Database Setup (Neon / Supabase)

1. Provision a PostgreSQL 16 database cluster on [Neon](https://neon.tech) or [Supabase](https://supabase.com).
2. Copy the JDBC connection string:
   `jdbc:postgresql://ep-example-123456.us-east-2.aws.neon.tech:5432/neondb?sslmode=require`
3. The Spring Boot backend automatically creates tables and indexes on first startup via DDL validation and initial scripts (`schema.sql` / `data.sql`).

---

## 5. Verification & Health Monitoring

After deployment, verify system health:

- Backend Health Probe: `GET https://<your-backend-domain>/actuator/health`
- Backend Liveness State: `GET https://<your-backend-domain>/actuator/health/readiness`
- Backend Readiness State: `GET https://<your-backend-domain>/actuator/health/liveness`
