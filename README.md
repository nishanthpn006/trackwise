# TrackWise

> **Personal Expense Tracker** — A production-quality full-stack SaaS application for tracking personal finances.

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=flat&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 6, TypeScript 5, Tailwind CSS 4, shadcn/ui |
| Backend | Java 21, Spring Boot 3, Spring Web, Spring Data JPA |
| Database | PostgreSQL 17 |
| Build Tools | Maven (backend), npm (frontend) |

---

## Project Structure

```
trackwise/
├── frontend/          # React 19 + Vite + TypeScript SPA
├── backend/           # Spring Boot 3 REST API
├── docs/              # Architecture & design documents
├── screenshots/       # App screenshots
├── .gitignore
└── README.md
```

---

## Quick Start

### Prerequisites

- **Java 21** — [Download](https://adoptium.net/)
- **Node.js 20+** — [Download](https://nodejs.org/)
- **PostgreSQL 17** — [Download](https://www.postgresql.org/download/) *(required from M2)*
- **Maven 3.9+** — or use the included `./mvnw` wrapper

---

### Frontend

```bash
cd frontend
npm install
cp .env.example .env          # configure VITE_API_BASE_URL
npm run dev                   # starts at http://localhost:5173
```

### Backend

```bash
cd backend
./mvnw spring-boot:run        # starts at http://localhost:8080
# Windows:
mvnw.cmd spring-boot:run
```

> **Note:** The backend runs without a database in Milestone 1. Configure PostgreSQL in `application.properties` before Milestone 2.

---

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production TypeScript build |
| `npm run lint` | ESLint check |
| `./mvnw clean package` | Build backend JAR |
| `./mvnw test` | Run backend tests |

---

## Milestones

| # | Name | Status |
|---|------|--------|
| 1 | Project Foundation | ✅ Complete |
| 2 | Authentication & Users | 🔜 Planned |
| 3 | Core Expense CRUD | 🔜 Planned |
| 4 | Dashboard & Analytics | 🔜 Planned |
| 5 | Export, Settings & Polish | 🔜 Planned |

---

## Architecture

See [`docs/architecture.md`](docs/architecture.md) for the full architecture overview.

---

## License

MIT © TrackWise
