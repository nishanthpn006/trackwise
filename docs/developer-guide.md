# TrackWise — Developer Guide

This guide covers everything a developer needs to understand, run, test,
and deploy the TrackWise codebase.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Repository Structure](#repository-structure)
- [Naming Conventions](#naming-conventions)
- [Running Locally](#running-locally)
- [Building](#building)
- [Testing](#testing)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Adding a New Feature](#adding-a-new-feature)

---

## Architecture Overview

TrackWise is a full-stack SaaS application:

- **Frontend** — React 19 SPA, Vite 8, TypeScript 6, Tailwind CSS 4, shadcn/ui
- **Backend** — Spring Boot 3.3, Java 21, Spring Security + JWT, Spring Data JPA
- **Database** — PostgreSQL 17 (H2 in-memory for tests)
- **Container** — Docker (multi-stage builds), Docker Compose
- **CI/CD** — GitHub Actions

See [`docs/architecture.md`](architecture.md) for detailed diagrams and flow documentation.

---

## Prerequisites

| Tool | Version | Install |
| --- | --- | --- |
| Node.js | 20+ | [nodejs.org](https://nodejs.org/) |
| npm | 10+ | bundled with Node.js |
| Java | 21 | [adoptium.net](https://adoptium.net/) |
| Maven | 3.9+ | bundled `./mvnw` wrapper |
| Docker Desktop | 4.x+ | [docker.com](https://www.docker.com/products/docker-desktop/) |
| Git | 2.x+ | [git-scm.com](https://git-scm.com/) |

---

## Repository Structure

```text
trackwise/
├── .github/
│   └── workflows/
│       ├── ci.yml           # Combined CI (frontend + backend + Docker)
│       ├── frontend.yml     # Frontend-only CI
│       └── backend.yml      # Backend-only CI
│
├── frontend/                # React SPA
│   ├── src/
│   │   ├── App.tsx          # Root provider tree
│   │   ├── main.tsx         # React DOM entry point
│   │   ├── index.css        # Global Tailwind styles
│   │   ├── routes/          # Route definitions (lazy-loaded)
│   │   ├── layouts/         # MainLayout, AuthLayout
│   │   ├── pages/           # One component per route
│   │   ├── components/
│   │   │   ├── common/      # ErrorBoundary, ProtectedRoute
│   │   │   ├── layout/      # Sidebar, Header, MobileNav
│   │   │   ├── ui/          # shadcn/ui primitives
│   │   │   └── [feature]/   # Feature components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # Axios API calls (one file per domain)
│   │   ├── context/         # AuthContext, ToastContext
│   │   ├── types/           # Shared TypeScript types
│   │   ├── lib/             # cn(), formatters
│   │   ├── utils/           # Pure utility functions
│   │   └── config/          # Constants, navigation config
│   ├── Dockerfile           # Multi-stage: Node 20 → Nginx 1.27
│   ├── nginx.conf           # Nginx SPA config with API proxy
│   ├── vite.config.ts       # Vite build config with chunk splitting
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── backend/                 # Spring Boot API
│   ├── src/
│   │   ├── main/java/com/trackwise/
│   │   │   ├── TrackWiseApplication.java
│   │   │   ├── config/        # Security, CORS, ApplicationConfig
│   │   │   ├── controller/    # REST controllers
│   │   │   ├── service/       # Business logic
│   │   │   ├── repository/    # Spring Data JPA repositories
│   │   │   ├── entity/        # JPA entities
│   │   │   ├── dto/           # Request / Response DTOs
│   │   │   ├── exception/     # GlobalExceptionHandler
│   │   │   ├── security/      # JwtService, JwtAuthFilter
│   │   │   └── util/          # Utilities
│   │   ├── main/resources/
│   │   │   ├── application.properties          # Base (H2 default)
│   │   │   ├── application-postgres.properties # PostgreSQL profile
│   │   │   └── application-prod.properties     # Production profile
│   │   └── test/java/com/trackwise/
│   │       ├── controller/    # Controller unit tests (9 files)
│   │       └── service/       # Service unit tests (7 files)
│   ├── Dockerfile            # Multi-stage: JDK 21 → JRE 21
│   └── pom.xml
│
├── docs/
│   ├── architecture.md      # System architecture documentation
│   ├── api.md               # REST API reference
│   ├── er-diagram.md        # Database ER diagram
│   ├── user-guide.md        # End-user documentation
│   └── developer-guide.md   # This file
│
├── docker-compose.yml        # Full-stack Docker Compose
├── .env.example              # Environment variable template
├── .gitignore
├── CHANGELOG.md
├── DEPLOYMENT.md
├── LICENSE
└── README.md
```

---

## Naming Conventions

### Frontend

| Item | Convention | Example |
| --- | --- | --- |
| Components | PascalCase | `TransactionCard.tsx` |
| Hooks | camelCase, `use` prefix | `useTransactions.ts` |
| Services | camelCase, `Service` suffix | `transactionService.ts` |
| Types | PascalCase | `TransactionResponse` |
| Constants | UPPER_SNAKE_CASE | `API_BASE_URL` |
| CSS classes | Tailwind utilities only | `className="flex gap-4"` |

### Backend

| Item | Convention | Example |
| --- | --- | --- |
| Controllers | PascalCase, `Controller` suffix | `TransactionController.java` |
| Services | PascalCase, `Service` suffix | `TransactionService.java` |
| Repositories | PascalCase, `Repository` suffix | `TransactionRepository.java` |
| Entities | PascalCase | `Transaction.java` |
| DTOs — Request | PascalCase, `Request` suffix | `TransactionRequest.java` |
| DTOs — Response | PascalCase, `Response` suffix | `TransactionResponse.java` |
| Test classes | `*Test` suffix | `TransactionControllerTest.java` |

---

## Running Locally

### Backend (no database required)

```bash
cd backend

# Option A — H2 in-memory (zero config, default)
./mvnw spring-boot:run          # Linux/macOS
.\mvnw.cmd spring-boot:run      # Windows

# Option B — PostgreSQL (requires local PostgreSQL instance)
SPRING_PROFILES_ACTIVE=postgres \
  DB_URL=jdbc:postgresql://localhost:5432/trackwise \
  DB_USERNAME=trackwise \
  DB_PASSWORD=yourpassword \
  ./mvnw spring-boot:run
```

API available at `http://localhost:8080`.

### Frontend (Dev Server)

```bash
cd frontend
npm install
cp .env.example .env    # edit if needed
npm run dev             # http://localhost:5173
```

The Vite dev server proxies `/api` to `http://localhost:8080` automatically.

---

## Building

### Frontend Production Build

```bash
cd frontend
npm run build   # outputs to frontend/dist/
```

### Backend JAR

```bash
cd backend
./mvnw package -DskipTests      # outputs to backend/target/*.jar
```

### Docker Images

```bash
docker build -t trackwise-frontend ./frontend
docker build -t trackwise-backend  ./backend
```

---

## Testing

### Frontend Testing

```bash
cd frontend
npm run type-check   # TypeScript strict check (0 errors expected)
npm run lint         # OXLint (0 warnings/errors expected)
npm run build        # Production build (no warnings expected)
```

### Backend Testing

```bash
cd backend
./mvnw clean test           # 63 tests, 0 failures expected
./mvnw clean test -Dtest=TransactionControllerTest  # single class
```

Test database is H2 in-memory — no PostgreSQL needed for tests.

### Test Structure

| Package | Count | Coverage |
| --- | --- | --- |
| `controller.*` | 9 files, ~49 tests | All REST controllers |
| `service.*` | 7 files, ~14 tests | Core service layer |
| `TrackWiseApplicationTests` | 1 test | Application context load |
| **Total** | **63 tests** | **100% pass** |

---

## Deployment

### Docker Compose (local / staging)

```bash
cp .env.example .env
# Edit .env: set POSTGRES_PASSWORD and JWT_SECRET
docker compose up -d
```

### Production

See [`DEPLOYMENT.md`](../DEPLOYMENT.md) for the full production checklist.

Key points:

- Use `SPRING_PROFILES_ACTIVE=prod` for the production Spring profile
- Generate `JWT_SECRET` with `openssl rand -hex 32`
- Terminate TLS at a reverse proxy (Nginx, Cloudflare, ALB) in front of port 80
- Do not expose `backend:8080` or `postgres:5432` externally

### CI/CD (GitHub Actions)

Push to `main` triggers `.github/workflows/ci.yml` which:

1. Runs frontend: type-check → lint → build
2. Runs backend: test → package
3. Builds both Docker images (no push in v1.0.0)

---

## Environment Variables

See `README.md` for the full environment variable reference table.

### Generating secrets

```bash
# JWT secret (64-char hex)
openssl rand -hex 32

# Strong password
openssl rand -base64 24
```

---

## Adding a New Feature

Follow this pattern to add a new module (e.g. "Subscriptions"):

### Backend Steps

1. **Entity** — create `Subscription.java` in `entity/` with JPA annotations.
2. **Repository** — create `SubscriptionRepository.java` extending `JpaRepository`.
3. **DTOs** — create `SubscriptionRequest.java` and `SubscriptionResponse.java` in `dto/`.
4. **Service** — create `SubscriptionService.java` with ownership validation.
5. **Controller** — create `SubscriptionController.java` with `@RestController`, `@RequestMapping("/api/subscriptions")`.
6. **Tests** — create `SubscriptionControllerTest.java` and `SubscriptionServiceTest.java`.

### Frontend Steps

1. **Types** — add `Subscription` types to `src/types/`.
2. **Service** — create `subscriptionService.ts` in `src/services/`.
3. **Hook** — create `useSubscriptions.ts` in `src/hooks/`.
4. **Components** — create `src/components/subscriptions/` with feature components.
5. **Page** — create `SubscriptionsPage.tsx` in `src/pages/`.
6. **Route** — add lazy import + `<Route>` in `src/routes/index.tsx`.
7. **Navigation** — add entry to `src/config/navigation.ts`.

### Checklist

- [ ] Ownership check in service (`user.getId().equals(entity.getUser().getId())`)
- [ ] `@Valid` on all request DTOs in controller
- [ ] No entity classes returned directly from controllers (use DTOs)
- [ ] No `console.log` statements
- [ ] No `: any` TypeScript types
- [ ] All new components have proper ARIA labels
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes
- [ ] `./mvnw clean test` passes
