# TrackWise — Architecture Overview

> 📌 This document will be expanded in future milestones.

## System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                        Browser                           │
│   React 19 + Vite + TypeScript + Tailwind + shadcn/ui   │
└─────────────────────────┬────────────────────────────────┘
                          │  REST / JSON
                          ▼
┌──────────────────────────────────────────────────────────┐
│                  Spring Boot 3 API                       │
│         Java 21 · Spring Web · Spring Data JPA           │
└─────────────────────────┬────────────────────────────────┘
                          │  JDBC
                          ▼
┌──────────────────────────────────────────────────────────┐
│                     PostgreSQL                           │
└──────────────────────────────────────────────────────────┘
```

## Layers

| Layer | Technology | Responsibility |
|-------|-----------|----------------|
| Presentation | React 19, Tailwind CSS, shadcn/ui | UI rendering, routing |
| API | Spring Boot 3, Spring Web | REST endpoints, request validation |
| Service | Spring `@Service` | Business logic |
| Persistence | Spring Data JPA, PostgreSQL | Data access |

## Milestones

- **M1** — Project foundation (current)
- **M2** — Authentication & user management
- **M3** — Core expense CRUD
- **M4** — Dashboard & analytics
- **M5** — Export, settings, polish
