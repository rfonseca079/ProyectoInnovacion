# Design

## Context

The repository has requirements and HTTP contracts, and no `backend/` or `frontend/` application yet. See proposal.md for why this slice comes first. Login is the first vertical slice, so it also creates the application skeleton later stories reuse.

## Goals / Non-Goals

**Goals:**

- Seeded email and password sign-in with one shared error for bad credentials.
- An httpOnly session cookie that survives refresh and ends when the browser closes.

**Non-Goals:**

- Registration, password reset, guest access, and a mobile layout.
- Storing a token in `localStorage`.

## Decisions

- Use Express, Prisma, and PostgreSQL on the API, and React with Vite on the web, matching `docs/backend-standards.md` and `docs/frontend-standards.md`.
- Store only `passwordHash`. Compare with a password hash library. Return `TeacherProfile` without the hash.
- Use a server session in an httpOnly cookie rather than a bearer token in browser storage, because US-01 ends the session when the browser closes.
- Map both unknown email and wrong password to HTTP 401 `INVALID_CREDENTIALS`. Map empty fields to HTTP 400 `VALIDATION`.
- Treat a plan id owned by another teacher as HTTP 404.

Alternative considered: JWT in `localStorage`. Rejected because it would survive the browser closing and would be readable by page scripts.

## Risks / Trade-offs

- [First slice also scaffolds the apps] → Keep the scaffold limited to auth, config, and an empty plan route so later changes do not inherit unused modules.
- [Demo password in the seed] → Seed only when `NODE_ENV` is not `production`.

## Migration Plan

No existing database. Add the `Teacher` table and seed in this change. Rollback is reverting the branch and dropping the created schema.

## Open Questions

None.
