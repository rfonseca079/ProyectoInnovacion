# Proposal

## Why

After sign-in, the teacher must see only their plans and choose whether to resume one or start another. The three demo accounts already have one stored plan each, and those rows must not be rebuilt when the list opens.

## What Changes

- Add the plan list as the first screen after login.
- Show subject, grade, month, school year, school, status, and last update for each owned plan.
- Map stored statuses to the Spanish labels Borrador · Paso N de 8, Listo para entrega, and Ajustado.
- Open a plan on its last saved step, with visited steps open and later steps closed.
- Add Nuevo planeamiento and an empty-state message.
- Seed Juanita, Carlos, and María with the plans described in US-03.

## Capabilities

### New Capabilities

- `plan-list`: Owned-plan list, status labels, and resume on the last saved step.

### Modified Capabilities

- None.

## Impact

- `GET /api/plans` and `GET /api/plans/{planId}`.
- `frontend/src/pages/PlanListPage.tsx` and `planService.ts`.
- Seed data in `backend/prisma/seed.ts`.
- List queries scoped by the session teacher.
