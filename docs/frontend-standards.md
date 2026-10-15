---
description: Frontend standards for the Planificador AI desktop web app. React, TypeScript, and Vite. No mobile layout and no Bootstrap.
globs: ["frontend/src/**/*.{ts,tsx}", "frontend/package.json", "frontend/vite.config.ts"]
alwaysApply: true
---

# Frontend standards

## Overview

The UI is a desktop web app for teachers. The reference width is 1440px. Do not add a mobile or responsive-mobile layout. Visual structure and example copy come from `stitch.md`. Behavior comes from `UserStories/`.

The screen never calls a language model. Suggestion cards render the body returned by the API.

## Stack

- React 18 and TypeScript
- Vite
- React Router
- Vitest and Testing Library
- Playwright for end-to-end tests
- CSS for the desktop layout. Do not add Bootstrap, Create React App, or a mobile component kit.

## Layout

```text
frontend/src/
  pages/
  components/
  services/
  styles/
  App.tsx
```

- `services/` is the only place that calls the API.
- Pages own the wizard step they render.
- Shared chrome (header, step bar, footer, primary and secondary buttons) lives in `components/` and matches US-06.

## Product UI

- Teacher-facing labels, errors, and PDF-related messages are Costa Rican Spanish, using the exact button names from the user stories.
- Code, component names, and service names stay in English.
- Header: wordmark **Planificador AI**, plan context, **Mis planeamientos**, and **Cerrar sesión**.
- Steps 1–7 show **Atrás** and **Continuar**. Step 8 uses the adjustment actions from US-15.
- A step that has not been visited is visible and not clickable.
- The footer shows **Borrador guardado automáticamente** after a successful save, and the failure sentence from US-05 when the save fails.
- When `usedFallback` is true, every step shows the fallback sentence from US-16.

## Behavior

- After login, open the plan list. A signed-in teacher who opens login returns to that list.
- Logout clears the plan list held in memory, so the next teacher does not see the previous rows while their own list is loading.
- Show "Aún no tiene planeamientos." only after a successful list response with no rows. A failed load shows "No se pudieron cargar los planeamientos."
- Opening another teacher's plan address shows "No tiene acceso a este planeamiento." and does not render that plan.
- Autosave on field blur, accept, edit, named actions, and step changes.
- **Continuar** stays disabled until the step's required fields are valid. Back and already visited steps stay available.
- **Descargar PDF** and **Exportar semana** download the file returned by the API. They do not build a fake PDF in the browser from a static asset.
- Keep session handling on the cookie. Do not store the password or a token in `localStorage`.

## Testing

- Component tests cover disabled continue, the 100% rubric message, and the fallback notice.
- Playwright covers login failure, Juanita opening step 4, and one regenerate that changes the stored variant text.
- Run the browser checks at a desktop viewport. A narrow screenshot is not the product.
