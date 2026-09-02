# TrackWise

> **Personal Expense Tracker** — A production-quality full-stack SaaS application
> for tracking income, expenses, budgets, savings goals, and financial analytics.

[![CI](https://github.com/nishanthpn006/trackwise/actions/workflows/ci.yml/badge.svg)](https://github.com/nishanthpn006/trackwise/actions/workflows/ci.yml)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3-6DB33F?style=flat&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Features

| Module | Highlights |
| --- | --- |
| **Authentication** | JWT-based login/register, BCrypt hashing, protected routes |
| **Dashboard** | Real-time balance, recent transactions, budget overview |
| **Transactions** | Full CRUD, search, filter by type/category/date, pagination |
| **Categories** | Custom categories with icons and colors, per-user scoped |
| **Budgets** | Monthly budget limits, live spending tracker, over-budget alerts |
| **Savings Goals** | Goal contributions, progress tracking, target date management |
| **Reports** | Monthly summaries, category breakdowns, income vs. expense trends |
| **Settings** | Profile management, password change, notification preferences |
| **Notifications** | In-app alerts, unread badge, budget/goal triggers |
| **Import / Export** | CSV import & export, full account backup, CSV template |

---

## Architecture

```text
                    ┌─────────────────────────────────────────┐
                    │           Browser / Client               │
                    └────────────────┬────────────────────────┘
                                     │ HTTP :80
                    ┌────────────────▼────────────────────────┐
                    │         Nginx (Docker: frontend)         │
                    │  SPA routing · Gzip · Security headers   │
                    └────────────────┬────────────────────────┘
                                     │ /api/ proxy
                    ┌────────────────▼────────────────────────┐
                    │      Spring Boot (Docker: backend)       │
                    │  REST API · JWT · Spring Security · JPA  │
                    └────────────────┬────────────────────────┘
                                     │ JDBC
                    ┌────────────────▼────────────────────────┐
                    │     PostgreSQL 17 (Docker: postgres)     │
                    │         Named volume: postgres_data       │
                    └─────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | React 19, Vite 8, TypeScript 6, Tailwind CSS 4, shadcn/ui, React Router v7, Recharts |
| **Backend** | Java 21, Spring Boot 3.3, Spring Security, Spring Data JPA |
| **Auth** | JWT (JJWT 0.12), BCrypt |
| **Database** | PostgreSQL 17 (H2 for tests) |
| **Containerisation** | Docker, Docker Compose |
| **CI/CD** | GitHub Actions |
| **Build Tools** | Maven (backend), npm / Vite (frontend) |

---

## Screenshots

> Screenshots are in the [`screenshots/`](screenshots/) directory.

---

## Quick Start

### Prerequisites

- **Docker Desktop** ≥ 4.x — [Download](https://www.docker.com/products/docker-desktop/)
- **Node.js 20+** — [Download](https://nodejs.org/) *(local dev only)*
- **Java 21** — [Download](https://adoptium.net/) *(local dev only)*

---

### Option A — Docker (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/nishanthpn006/trackwise.git
cd trackwise

# 2. Configure environment
cp .env.example .env
# Edit .env — set POSTGRES_PASSWORD and JWT_SECRET

# 3. Start all services
docker compose up -d

# 4. Open the app
open http://localhost        # or http://localhost on Windows
```

All three containers start in order: `postgres` → `backend` → `frontend`.

---

### Option B — Local Development

#### Frontend

```bash
cd frontend
npm install
npm run dev           # http://localhost:5173
```

#### Backend

```bash
cd backend
# Uses H2 in-memory DB by default — no PostgreSQL required
./mvnw spring-boot:run          # Linux/macOS
.\mvnw.cmd spring-boot:run      # Windows
# API available at http://localhost:8080
```

---

## Development Commands

| Command | Directory | Description |
| --- | --- | --- |
| `npm run dev` | `frontend/` | Start Vite dev server with HMR |
| `npm run type-check` | `frontend/` | TypeScript strict type check |
| `npm run lint` | `frontend/` | OXLint check |
| `npm run build` | `frontend/` | Production Vite bundle |
| `./mvnw clean test` | `backend/` | Run full test suite (63 tests) |
| `./mvnw package` | `backend/` | Build fat JAR |
| `docker compose up -d` | root | Start all Docker services |
| `docker compose logs -f` | root | Follow all container logs |
| `docker compose down -v` | root | Stop and remove volumes |

---

## Environment Variables

### Root `.env` (Docker Compose)

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `POSTGRES_DB` | No | `trackwise` | Database name |
| `POSTGRES_USER` | No | `trackwise` | Database user |
| `POSTGRES_PASSWORD` | **Yes** | — | Database password |
| `JWT_SECRET` | **Yes** | — | 64-char hex JWT signing key |
| `JWT_EXPIRATION_MS` | No | `86400000` | Token TTL in milliseconds (24 h) |
| `DB_POOL_SIZE` | No | `10` | HikariCP max pool size |
| `FRONTEND_PORT` | No | `80` | Host port for the frontend |

> **Generating a secure JWT secret:**
>
> ```bash
> openssl rand -hex 32
> ```

### Frontend `.env` (local dev only)

| Variable | Value |
| --- | --- |
| `VITE_APP_NAME` | `TrackWise` |
| `VITE_APP_ENV` | `development` |
| `VITE_API_BASE_URL` | `/api` |

---

## Health Endpoints

| Service | URL | Expected Response |
| --- | --- | --- |
| Frontend | `http://localhost/health` | `200 OK` |
| Backend | `http://localhost/api/actuator/health` | `{"status":"UP"}` |
| Backend (direct) | `http://localhost:8080/actuator/health` | `{"status":"UP"}` |

---

## CI/CD

GitHub Actions workflows run on every push and pull request to `main`:

| Workflow | Trigger | Steps |
| --- | --- | --- |
| **CI — Full Build** | All changes | Frontend (type-check, lint, build) + Backend (test, package) + Docker build |
| **Frontend CI** | `frontend/**` changes | Install → type-check → lint → build |
| **Backend CI** | `backend/**` changes | Test → package |

---

## Project Structure

```text
trackwise/
├── .github/
│   └── workflows/          # GitHub Actions CI/CD
│       ├── ci.yml           # Combined full-stack CI
│       ├── frontend.yml     # Frontend-only CI
│       └── backend.yml      # Backend-only CI
├── frontend/               # React 19 + Vite SPA
│   ├── src/
│   │   ├── components/      # shadcn/ui + custom components
│   │   ├── pages/           # Route-level page components
│   │   ├── services/        # Axios API service layer
│   │   ├── hooks/           # Custom React hooks
│   │   └── types/           # TypeScript type definitions
│   ├── Dockerfile           # Multi-stage Node → Nginx
│   └── nginx.conf           # Production Nginx configuration
├── backend/                # Spring Boot 3 REST API
│   ├── src/main/java/com/trackwise/
│   │   ├── controller/      # REST controllers (9 modules)
│   │   ├── service/         # Business logic layer
│   │   ├── repository/      # Spring Data JPA repositories
│   │   ├── entity/          # JPA entities
│   │   ├── dto/             # Request/Response DTOs
│   │   └── security/        # JWT filter, config
│   ├── src/main/resources/
│   │   ├── application.properties        # Base config (H2)
│   │   ├── application-postgres.properties
│   │   └── application-prod.properties   # Production config
│   └── Dockerfile           # Multi-stage JDK → JRE
├── docker-compose.yml       # Full-stack Docker Compose
├── .env.example             # Environment variable template
├── docs/                    # Architecture & design documents
├── screenshots/             # App screenshots
└── README.md
```

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/your-feature`.
3. Make your changes with passing tests.
4. Ensure CI passes: `npm run type-check && npm run lint && npm run build` (frontend), `./mvnw clean test` (backend).
5. Submit a pull request.

---

## License

MIT © 2024 TrackWise
