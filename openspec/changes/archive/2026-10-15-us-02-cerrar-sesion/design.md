# Design

## Context

Depends on the session created by `us-01-iniciar-sesion`. See proposal.md. Logout must invalidate that session and leave plan rows untouched.

## Goals / Non-Goals

**Goals:**

- Clear the server session and the cookie from the list and the wizard.
- Keep saved plans for the same account.

**Non-Goals:**

- Deleting drafts, revoking other devices beyond this cookie, or adding a confirmation dialog.

## Decisions

- `POST /api/auth/logout` returns 204 and deletes the server session record, then expires the cookie.
- The client clears in-memory auth state and the loaded plan list, then navigates to `/login`. Route guards already send unauthenticated users to login, which covers Back and refresh.
- Logout does not run inside a transaction with plan writes.

Alternative considered: clearing only the cookie. Rejected because a copied cookie could still be presented until it expires.

## Risks / Trade-offs

- [Logout during an unsaved keystroke] → Autosave from US-05 is a separate change. This change only preserves data already stored.

## Migration Plan

No schema change if US-01 already stores the session. Rollback is reverting the logout route.

## Open Questions

None.
