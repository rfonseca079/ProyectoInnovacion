# US-05 — Guardar el borrador automáticamente

## Original

**Rol:** docente

**Historia**  
Como docente quiero que el planeamiento se guarde solo mientras trabajo para retomar después sin perder lo que acepté o edité.

## Contexto

El pie de las pantallas del wizard dice **Borrador guardado automáticamente**, como en `stitch.md`. El guardado escribe en la base del demo. No depende de una acción de un modelo de lenguaje.

## Criterios de aceptación

1. El sistema guarda al salir de un campo modificado, al aceptar una sugerencia, al editar una sugerencia, al regenerar un bloque que actualiza el texto visible, al agregar o quitar un rubro, al cambiar el interruptor de notificación, al aplicar los ajustes y al cambiar de paso.
2. Después de un guardado correcto, el pie dice **Borrador guardado automáticamente**.
3. Si el guardado falla, el pie dice «No se pudo guardar el borrador. Intente de nuevo.» y lo escrito sigue en pantalla.
4. Al cerrar sesión y volver a entrar, el planeamiento abre con el último contenido guardado y en el último paso guardado.
5. Lo guardado de una docente no aparece en la cuenta de otra.
6. La fecha de actualización de la lista (US-03) cambia cuando el borrador se guarda.

## Enhanced

**Funcionalidad.** Cada guardado exitoso hace `PATCH /api/plans/:planId` con el fragmento cambiado (`PlanPatch`) y actualiza `updatedAt`. Disparadores: salir de un campo modificado, aceptar, editar, regenerar cuando el texto visible cambia, alta o baja de rubro, cambio de `notifyEvaluationChanges`, aplicar ajustes y cambiar de paso. La respuesta `200` deja el pie en «Borrador guardado automáticamente». Si la petición falla, el pie dice «No se pudo guardar el borrador. Intente de nuevo.» y el formulario conserva lo escrito.

Al volver a entrar, `GET /api/plans/:planId` abre `currentStep` y los `PlanBlock` persistidos. Un `planId` de otra cuenta responde `404`.

**Campos que pueden ir en el parche.** Configuración, `body` y `status` de un bloque, filas de rúbrica, sesiones, campos del documento MEP, bitácora y el interruptor de notificación.

**Módulos.** `frontend/src/services/planService.ts` y el pie en `WizardChrome.tsx`. Backend: `backend/src/application/updatePlan.ts`. Las acciones de US-16 que ya devuelven el plan guardado no necesitan un segundo `PATCH`.

**Definición de terminado.** Jest: un parche actualiza `updatedAt` y un docente ajeno recibe `404`. Prueba de componente del pie en éxito y en error de red, sin vaciar el campo. No se agrega un botón Guardar.

**No funcional.** El guardado no llama a un modelo de lenguaje. Un fallo de red no descarta el texto local.
