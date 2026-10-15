---
description: Backend standards for the Planificador AI API. TypeScript, Express, Prisma, and PostgreSQL. No LLM provider and no serverless deployment.
globs: ["backend/src/**/*.ts", "backend/prisma/**/*.{prisma,ts}", "backend/package.json"]
alwaysApply: true
---

# Backend standards

## Overview

The API serves the Planificador AI demo. It authenticates seeded teachers, stores plans, and returns suggestion text that already exists in PostgreSQL. It does not call a language model, send email, or accept public registration.

Follow the contracts in `docs/api-spec.yml` and the entities in `docs/data-model.md`.

## Stack

- Node.js 20 and TypeScript
- Express
- Prisma and PostgreSQL
- Jest for unit and HTTP tests
- Session cookie: `httpOnly`, closed when the browser closes
- Passwords hashed before storage

Do not add AWS Lambda, a serverless framework, or an LLM SDK.

## Layout

```text
backend/
  prisma/schema.prisma
  prisma/seed.ts
  src/domain/
  src/application/
  src/infrastructure/
  src/presentation/
```

- Domain holds entities, invariants, and repository interfaces.
- Application services orchestrate one use case each, such as create plan, accept suggestion, or apply adjustment.
- Infrastructure implements repositories with Prisma.
- Presentation is thin: routes, controllers, and request validation. Controllers call services and map errors to the API status codes.

## Rules that must stay in the domain

- A teacher can read and change only their own plans. Another teacher's id answers as not found.
- Grade must belong to the selected cycle: grades 1–6 for cycles I and II, 7–9 for cycle III, 10–11 for diversified education.
- `studentCount` and `weeklyLessons` are integers greater than zero.
- Step 2 can continue only when rubric percentages sum to 100.
- Scenario selection uses school year, subject, grade, and month. Anything else falls back to `mat-4-marzo-2026` and sets `usedFallback`.
- Changing that key reloads only blocks still in `SUGGESTED`.
- `Regenerate` cycles variants 1–3. A named action replaces the visible body and returns the block to `SUGGESTED`.
- Applying adjustments writes the stored `adjustment-week` payload and replaces those fields on a second apply.
- The notification toggle is persisted and never triggers a message.
- PDF bytes are rendered from saved document or session rows.
- The seed command refuses to run when `NODE_ENV=production`.

## API

- Prefix: `/api`
- Error body: `{ "code": string, "message": string }`
- Teacher-facing `message` values are the Spanish sentences in the user stories.
- Login failure for an unknown email and a wrong password uses the same message, the same `401`, and a password comparison in both cases. An unknown email is compared with a stand-in hash so the response time does not reveal which check failed.
- Do not return `passwordHash`.

## Testing

- Write the failing test first.
- Cover scenario fallback, the 100% rubric rule, cross-teacher access, regenerate versus accept, and adjustment replace.
- Use a database whose name contains `test` for integration tests. Do not point tests at a shared development database.

## Security

- Read secrets from the environment.
- Hash passwords.
- Scope every plan query by the session teacher.
- Keep the session cookie `httpOnly`.
- Do not log passwords, session ids, or full PDF payloads.
