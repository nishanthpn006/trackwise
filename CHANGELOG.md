# Changelog

All notable changes to TrackWise are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2024-08-04

### Initial Production Release

TrackWise v1.0.0 is the first production-ready release of the personal expense
tracking SaaS application. It ships as a fully Dockerized, CI/CD-enabled,
full-stack application with comprehensive documentation.

---

### Added

#### Authentication & Security

- JWT-based authentication with configurable token expiration
- BCrypt password hashing with strength factor 10
- Per-request ownership validation on all user-scoped resources
- Automatic session expiry and client-side logout on 401 responses
- Spring Security CORS configuration restricted by environment
- Production-grade JWT secret externalized to environment variables

#### Dashboard

- Real-time financial summary: total balance, monthly income/expense
- Recent transactions list (last 10) with category badge and type indicator
- Active budget summary cards with live spending progress bars
- Active savings goals with visual progress indicators
- Month-over-month income vs. expense comparison

#### Transactions

- Full CRUD: create, read, update, delete
- Server-side pagination with configurable page size
- Search by title with debounced input
- Filter by transaction type (INCOME / EXPENSE)
- Filter by category
- Filter by date range (start date / end date)
- Transaction type badge with color-coded styling

#### Categories

- User-scoped categories (each user manages their own)
- Custom icon selection from Lucide React icon set
- Custom color picker for category visual identity
- Filter categories by transaction type

#### Budget Management

- Monthly and custom period budget limits
- Live spending calculation against each budget
- Over-budget visual alert with red progress bar
- Budget status: ACTIVE / EXCEEDED / COMPLETED
- Notification triggers when spending exceeds threshold

#### Savings Goals

- Create goals with target amount, target date, and description
- Contribution tracking: log deposits with date and notes
- Visual progress bar with percentage display
- Goal status: IN_PROGRESS / COMPLETED / CANCELLED
- Goal completion notification

#### Reports & Analytics

- Monthly summary: total income, total expense, net savings
- Category expense breakdown with pie chart
- Income vs. expense trend chart (line chart, monthly)
- Date range selector driving all report queries
- Recharts integration with responsive containers

#### Settings & User Preferences

- Profile update: full name, email
- Password change with current-password verification
- Currency / locale preference storage
- Notification preference toggles per category

#### Notifications & Reminders

- In-app notification feed with unread count badge
- Mark individual notifications as read
- Mark all notifications as read
- Delete individual notifications
- Notification types: BUDGET_ALERT, GOAL_MILESTONE, SYSTEM

#### Import / Export & Data Backup

- CSV export of all transactions with column headers
- Full account backup: multi-section CSV (transactions + categories + budgets + goals)
- CSV import with row-level validation, date/amount checks, error reporting
- CSV template download for import formatting guide

#### Infrastructure & DevOps

- Multi-stage Docker builds for both frontend (Node → Nginx) and backend (JDK → JRE)
- Docker Compose orchestration: postgres → backend → frontend with health-check ordering
- GitHub Actions CI/CD: frontend (type-check, lint, build), backend (test, package), combined Docker build
- Spring Boot Actuator health endpoints: `/actuator/health`, liveness, readiness probes
- Nginx production configuration: gzip, security headers, asset caching, SPA fallback, API proxy
- Production Spring profile (`prod`): PostgreSQL, graceful shutdown, compression

#### Performance

- Route-based code splitting via `React.lazy()` and `Suspense`
- Vendor chunk splitting: react, charts, forms, http, ui in separate chunks
- HikariCP connection pool with production-tuned settings
- Hibernate batch inserts (batch size 25)
- Paginated API responses on all list endpoints

#### Documentation

- Professional README with architecture diagram, quick start, and env vars reference
- DEPLOYMENT.md: local dev, Docker Compose, production deployment guide
- docs/architecture.md: full architecture + auth flow + request flow
- docs/er-diagram.md: Mermaid ER diagram + entity and relationship reference
- docs/api.md: complete REST API reference for all 10 controllers
- docs/user-guide.md: end-user documentation for all 11 modules
- docs/developer-guide.md: developer onboarding guide

---

### Tech Stack

| Layer | Technology | Version |
| --- | --- | --- |
| Frontend framework | React | 19 |
| Language | TypeScript | 6 |
| Build tool | Vite | 8 |
| CSS framework | Tailwind CSS | 4 |
| Component library | shadcn/ui | latest |
| Router | React Router | 7 |
| HTTP client | Axios | 1.x |
| Forms | React Hook Form + Zod | 7.x / 4.x |
| Charts | Recharts | 3.x |
| Icons | Lucide React | 1.x |
| Backend framework | Spring Boot | 3.3 |
| Language | Java | 21 |
| Auth | Spring Security + JWT | 0.12.6 |
| ORM | Spring Data JPA / Hibernate | 6.x |
| Database | PostgreSQL | 17 |
| Test DB | H2 | 2.x |
| Testing | JUnit 5 + Mockito | 5.x |
| Container | Docker + Nginx | latest |
| CI/CD | GitHub Actions | — |

---

### Test Coverage

- 63 backend unit tests across 9 REST controllers + 7 service classes
- 0 failures, 0 errors, 0 skipped
- Frontend: 0 TypeScript errors, 0 lint warnings, production build clean

---

### Known Limitations

- Email-based notification delivery (SMTP) is not implemented in v1.0.0; notifications are in-app only.
- Multi-currency conversion is not implemented; currency is stored as a preference label only.
- OAuth2 / social login is reserved for v2.0.
- Recurring transactions / scheduled entries are reserved for v2.0.

---

## [Unreleased]

Future enhancements planned for TrackWise 2.0:

- Email / push notifications
- OAuth2 social login (Google, GitHub)
- Recurring transaction scheduling
- Multi-currency with live exchange rates
- Mobile app (React Native)
- Data export to Excel / PDF
- Budget forecasting with ML
- Shared household budgets
