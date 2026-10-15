# US-02 — Cerrar sesión

## Original

**Rol:** docente

**Historia**  
Como docente quiero cerrar mi sesión para que otra persona que use el mismo equipo no quede dentro de mi cuenta.

## Contexto

Complementa el acceso de US-01. El control está disponible en la lista de planeamientos y dentro del wizard.

## Criterios de aceptación

1. Con la sesión activa, el encabezado muestra **Cerrar sesión**.
2. Al elegir **Cerrar sesión**, el sistema termina la sesión y muestra la pantalla de acceso.
3. Después de salir, volver atrás en el navegador no muestra la lista ni el planeamiento; vuelve a pedir el acceso.
4. Actualizar la página después de salir mantiene a la persona en la pantalla de acceso.
5. El borrador que ya estaba guardado permanece en la base para la próxima sesión de esa misma cuenta.

## Enhanced

**Funcionalidad.** El botón **Cerrar sesión** del encabezado llama `POST /api/auth/logout` y espera `204`. El servidor invalida la sesión y limpia la cookie. La interfaz borra el estado en memoria y navega a `/login`. Después, **Atrás** y recargar siguen en `/login` porque `GET /api/auth/me` responde `401`. El logout no borra filas de `Plan` ni de `PlanBlock`.

**Módulos.** Control en `frontend/src/components/WizardChrome.tsx` y en `frontend/src/pages/PlanListPage.tsx`. Servicio `authService.logout`. Backend: `backend/src/application/logout.ts` y `authController.ts`.

**Definición de terminado.** Jest: logout deja la siguiente petición autenticada en `401` y el planeamiento sigue en la base. Playwright: salir, volver atrás y comprobar la pantalla de acceso. No hace falta cambiar el modelo de datos.

**No funcional.** La cookie no queda reutilizable. No se escribe el identificador de sesión en el log.
