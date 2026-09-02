# TrackWise — Architecture Documentation

## Table of Contents

- [High-Level Architecture](#high-level-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Authentication Flow](#authentication-flow)
- [Request / Response Flow](#request--response-flow)
- [Docker Networking](#docker-networking)
- [Database Layer](#database-layer)

---

## High-Level Architecture

TrackWise follows a classic three-tier architecture: a React SPA client, a Spring Boot REST API server, and a PostgreSQL relational database. In production, all three tiers run as Docker containers on a private bridge network, with Nginx serving as the public entry point.

```text
┌──────────────────────────────────────────────────────────────────┐
│                          USER BROWSER                            │
└────────────────────────────┬─────────────────────────────────────┘
                             │ HTTPS :443 (reverse proxy in production)
                             │ HTTP  :80  (Docker local)
┌────────────────────────────▼─────────────────────────────────────┐
│                  NGINX  (trackwise-frontend)                      │
│                                                                  │
│  /              → serves index.html  (SPA entry)                 │
│  /assets/*      → serves hashed JS/CSS chunks (1-year cache)     │
│  /api/*         → proxy_pass http://backend:8080                 │
│  /health        → 200 OK  (Docker health probe)                  │
└────────────────────────────┬─────────────────────────────────────┘
                             │ HTTP :8080 (internal network only)
┌────────────────────────────▼─────────────────────────────────────┐
│             SPRING BOOT  (trackwise-backend)                      │
│                                                                  │
│  Spring Security  →  JWT Filter  →  Controllers                  │
│  Services  →  Spring Data JPA  →  HikariCP Pool                  │
│  /actuator/health  (Docker + K8s probes)                         │
└────────────────────────────┬─────────────────────────────────────┘
                             │ JDBC (internal network only)
┌────────────────────────────▼─────────────────────────────────────┐
│              POSTGRESQL 17  (trackwise-postgres)                  │
│                                                                  │
│  Named volume: postgres_data  (survives container restarts)      │
└──────────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

The frontend is a React 19 Single Page Application built with Vite 8.

### Frontend Layer Structure

```text
src/
├── main.tsx              Entry point — mounts React root
├── App.tsx               Root component — provider tree
├── index.css             Global Tailwind base styles
│
├── routes/
│   └── index.tsx         Route definitions (all pages are lazy-loaded)
│
├── layouts/
│   ├── MainLayout.tsx    Authenticated layout (sidebar + header + outlet)
│   └── AuthLayout.tsx    Unauthenticated layout (centered card)
│
├── pages/                Route-level page components (one per route)
├── components/           Shared and feature-specific UI components
│   ├── common/           App-wide: ErrorBoundary, ProtectedRoute, etc.
│   ├── layout/           Sidebar, Header, MobileNav
│   ├── ui/               shadcn/ui primitives
│   └── [feature]/        Feature-specific components (transactions/, budgets/, ...)
│
├── hooks/                Custom React hooks (useTransactions, useBudgets, ...)
├── services/             Axios API service layer (one file per domain)
├── context/              React Context: AuthContext, ToastContext
├── types/                TypeScript type definitions (shared DTOs)
├── lib/                  Utility: cn(), formatters
├── utils/                Pure utility functions
└── config/               App constants, navigation config
```

### State Management

TrackWise uses **local component state + custom hooks** — no global state library is needed:

| Concern | Solution |
| --- | --- |
| Authentication | `AuthContext` + `localStorage` (JWT token) |
| Toast notifications | `ToastContext` |
| Server data | Custom hooks (`useTransactions`, `useBudgets`, …) with `useState` / `useEffect` |
| Forms | React Hook Form + Zod validation |

### Code Splitting

All route-level components are lazily imported:

```typescript
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
```

Vendor libraries are split into separate chunks by `vite.config.ts` `manualChunks`:

| Chunk | Libraries |
| --- | --- |
| `vendor-react` | react, react-dom, react-router |
| `vendor-charts` | recharts, d3-* |
| `vendor-forms` | react-hook-form, @hookform/resolvers, zod |
| `vendor-http` | axios |
| `vendor-ui` | lucide-react, clsx, tailwind-merge, class-variance-authority |

---

## Backend Architecture

The backend is a Spring Boot 3.3 REST API following a layered architecture.

### Backend Layer Structure

```text
com.trackwise/
├── TrackWiseApplication.java          Application entry point
│
├── config/
│   ├── SecurityConfig.java            Spring Security + JWT filter registration
│   ├── CorsConfig.java                CORS policy
│   └── ApplicationConfig.java         Bean definitions (PasswordEncoder, AuthManager)
│
├── controller/                        REST controllers (HTTP layer only)
│   ├── AuthController.java            POST /api/auth/register, /api/auth/login
│   ├── TransactionController.java     /api/transactions
│   ├── CategoryController.java        /api/categories
│   ├── BudgetController.java          /api/budgets
│   ├── GoalController.java            /api/goals
│   ├── ReportController.java          /api/reports
│   ├── DashboardController.java       /api/dashboard
│   ├── UserController.java            /api/users
│   ├── NotificationController.java    /api/notifications
│   └── DataController.java            /api/data
│
├── service/                           Business logic layer
├── repository/                        Spring Data JPA repositories
├── entity/                            JPA entities (mapped to DB tables)
├── dto/                               Request / Response DTOs (no entity exposure)
├── exception/                         GlobalExceptionHandler + custom exceptions
├── security/                          JwtService, JwtAuthFilter, UserDetailsService
└── util/                              Utility classes
```

### Security Chain

```text
HTTP Request
    │
    ▼
JwtAuthFilter
    │  extracts and validates Bearer token
    ▼
SecurityContextHolder  ←── sets authenticated principal
    │
    ▼
@PreAuthorize / method-level ownership checks in Service layer
    │
    ▼
Controller → Service → Repository → Database
```

### Response Structure

All endpoints return HTTP-standard status codes with JSON bodies:

```json
// Success
{ "field": "value", ... }

// Error
{
  "status": 400,
  "error": "Bad Request",
  "message": "Amount must be greater than zero",
  "timestamp": "2024-08-04T16:00:00Z"
}
```

---

## Authentication Flow

```text
┌──────────┐                    ┌─────────────┐               ┌──────────┐
│  Client  │                    │ Spring Boot │               │   DB     │
└────┬─────┘                    └──────┬──────┘               └────┬─────┘
     │                                 │                           │
     │  POST /api/auth/login           │                           │
     │  { email, password }            │                           │
     │ ──────────────────────────────► │                           │
     │                                 │  SELECT user WHERE email  │
     │                                 │ ─────────────────────────►│
     │                                 │  User { hashedPassword }  │
     │                                 │ ◄─────────────────────────│
     │                                 │                           │
     │                                 │  BCrypt.verify(password,  │
     │                                 │    hashedPassword)        │
     │                                 │                           │
     │  200 { token, user }            │                           │
     │ ◄────────────────────────────── │                           │
     │                                 │                           │
     │  stores token in localStorage   │                           │
     │                                 │                           │
     │  GET /api/transactions          │                           │
     │  Authorization: Bearer <token>  │                           │
     │ ──────────────────────────────► │                           │
     │                                 │  JwtAuthFilter validates  │
     │                                 │  token signature + expiry │
     │                                 │                           │
     │                                 │  sets SecurityContext     │
     │                                 │                           │
     │                                 │  Service checks ownership │
     │                                 │  (userId == resource.userId)
     │                                 │                           │
     │  200 { transactions: [...] }    │                           │
     │ ◄────────────────────────────── │                           │
```

---

## Request / Response Flow

```text
Browser
  │
  │  (1) React component calls service function
  │      e.g. transactionService.getTransactions({ page: 0, size: 20 })
  │
  │  (2) Axios adds Authorization: Bearer <token>
  │
  │  (3) Nginx proxies /api/* → backend:8080
  │
  │  (4) JwtAuthFilter validates token → populates SecurityContext
  │
  │  (5) Controller deserializes request, validates @Valid DTO
  │
  │  (6) Service executes business logic, ownership check
  │
  │  (7) Repository executes paginated JPA query
  │
  │  (8) Entity → Response DTO (no entity exposed to client)
  │
  │  (9) JSON response → Axios → React state update → re-render
  │
  ▼
Updated UI
```

---

## Docker Networking

All containers share the `trackwise-network` bridge network. Ports are only
exposed to the host where necessary.

```text
Host Machine
│
│  :80 (FRONTEND_PORT)
│  │
│  ▼
│  trackwise-frontend  (nginx:1.27-alpine)
│  │   internal: trackwise-network
│  │   → backend:8080  (API proxy)
│  │
│  trackwise-backend   (eclipse-temurin:21-jre-alpine)
│  │   internal: trackwise-network
│  │   → postgres:5432 (JDBC)
│  │
│  trackwise-postgres  (postgres:17-alpine)
│       internal: trackwise-network
│       volume: postgres_data → /var/lib/postgresql/data
│
│  (no external port exposure for backend or postgres)
```

### Startup Order

```text
postgres (healthy)
    └─► backend (healthy)
            └─► frontend (healthy)
```

Health checks ensure each container is fully ready before the next starts.

---

## Database Layer

| Aspect | Configuration |
| --- | --- |
| Database | PostgreSQL 17 (H2 in-memory for tests) |
| Connection pool | HikariCP, max 10 connections (production) |
| Schema management | `ddl-auto=update` (development), `ddl-auto=validate` (recommended for production) |
| Dialect | `PostgreSQLDialect` (production), H2Dialect (tests) |
| Batch size | 25 inserts/updates per batch |
| Fetch strategy | `FetchType.LAZY` on all `@ManyToOne` / `@OneToMany` |
| Transactions | `@Transactional` on all service methods that modify data |
