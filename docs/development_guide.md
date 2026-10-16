# Development Guide

Setup for Planificador AI. The demo runs entirely in Docker.

Repository: https://github.com/rfonseca079/ProyectoInnovacion

## Prerequisites

- Docker Desktop
- Git

Do not commit `.env` files or real passwords. Demo seed passwords belong only in the development seed.

## 1. Clone

```bash
git clone https://github.com/rfonseca079/ProyectoInnovacion.git
cd ProyectoInnovacion
```

## 2. Start the demo

From the repository root:

```bash
docker compose up -d --build
```

Open http://localhost:8088. The same app is available at http://127.0.0.1:8088.

That command starts three services:

- `postgres`: PostgreSQL 16. The host port `55432` forwards to `5432` in the container.
- `api`: Express. It applies the Prisma schema and loads the demo seed, then listens inside the Docker network.
- `web`: the built React app on port `8088`. The browser calls `/api` on that same origin, and nginx forwards those requests to `api`.

The demo container uses `NODE_ENV=development` so the seed can run. A production deployment must not load that seed.

## 3. Demo accounts

The seed creates these teachers. The shared demo password is `Demo2026`.

| Teacher | Email | Opening state |
| --- | --- | --- |
| Juanita Pérez | juanita.perez@demo.mep.cr | Draft on step 4, scenario `mat-4-marzo-2026` |
| Carlos Mora | carlos.mora@demo.mep.cr | Ready for delivery on step 7, scenario `esp-2-abril-2026` |
| María Solís | maria.solis@demo.mep.cr | Step 8 before adjustments, scenario `cie-7-febrero-2026` |

## 4. What this demo must not call

Do not add an LLM SDK, an email provider, or a public registration endpoint. Suggestion buttons read rows already stored for the plan's scenario.

## 5. Tests

The suites are for people changing the code. They are not required to open the demo. Backend tests use Jest. Frontend unit tests use Vitest and Testing Library. End-to-end tests use Playwright against the seeded teachers, in a 1440px desktop window.

```bash
cd backend && npm test
cd frontend && npm test
cd frontend && npm run test:e2e
```
