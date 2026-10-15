# Development Guide

Setup for Planificador AI. `backend/` and `frontend/` exist. Login is the first working slice. Later wizard steps are still being added.

Repository: https://github.com/rfonseca079/ProyectoInnovacion

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- Docker Desktop, for PostgreSQL
- Git

Do not commit `.env` files or real passwords. Demo seed passwords belong only in the development seed.

## 1. Clone

```bash
git clone https://github.com/rfonseca079/ProyectoInnovacion.git
cd ProyectoInnovacion
```

## 2. Database

From the repository root, once `docker-compose.yml` exists:

```bash
docker compose up -d
```

Expected local database:

- Host: `127.0.0.1`
- Port: `55432` on the host, forwarded to `5432` in the container, because another PostgreSQL may already use 5432
- Database: `planificador`
- User and password: values from `backend/.env`, never hardcoded in source

## 3. Backend

`backend/.env.example` is the template. Copy it to `backend/.env` and set at least:

```env
DATABASE_URL="postgresql://USER:PASSWORD@127.0.0.1:55432/planificador"
PORT=3000
NODE_ENV=development
SESSION_SECRET=replace-with-a-long-random-string
```

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run db:seed
npm run dev
```

The API listens on `http://127.0.0.1:3000` unless `PORT` is set. If 3000 is already taken, set `PORT` and `VITE_API_URL` to the same free port.

`npm run db:seed` loads the three teachers and the three suggestion scenarios described in `docs/data-model.md`. It must refuse to run when `NODE_ENV=production`.

## 4. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

`frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

The web app is desktop-first. Check it in a 1440px-wide window. Teacher-facing text is Spanish.

## 5. Tests

```bash
cd backend && npm test
cd frontend && npm test
cd frontend && npm run test:e2e
```

Backend tests use Jest. Frontend unit tests use Vitest and Testing Library. End-to-end tests use Playwright against the seeded teachers.

## 6. Demo accounts

The development seed creates these teachers. The shared demo password is `Demo2026`.

| Teacher | Email | Opening state |
| --- | --- | --- |
| Juanita Pérez | juanita.perez@demo.mep.cr | Draft on step 4, scenario `mat-4-marzo-2026` |
| Carlos Mora | carlos.mora@demo.mep.cr | Ready for delivery on step 7, scenario `esp-2-abril-2026` |
| María Solís | maria.solis@demo.mep.cr | Step 8 before adjustments, scenario `cie-7-febrero-2026` |

## 7. What this demo must not call

Do not add an LLM SDK, an email provider, or a public registration endpoint. Suggestion buttons read rows already stored for the plan's scenario.
