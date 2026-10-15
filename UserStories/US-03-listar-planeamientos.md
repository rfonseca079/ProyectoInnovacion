# US-03 — Ver mis planeamientos

## Original

**Rol:** docente

**Historia**  
Como docente quiero ver la lista de mis planeamientos para abrir uno que ya empecé o crear otro.

## Contexto

Es la primera pantalla después de iniciar sesión. Cada cuenta del demo entra con un planeamiento propio. La presentación visual de las pantallas interiores sigue `stitch.md`; esta historia define qué se puede hacer en la lista.

## Criterios de aceptación

1. La lista muestra solo los planeamientos de la persona autenticada.
2. Cada fila muestra asignatura, nivel, mes, curso lectivo, centro educativo, estado y fecha de la última actualización.
3. Los estados posibles son **Borrador · Paso N de 8**, **Listo para entrega** y **Ajustado**.
4. Al abrir un planeamiento, el sistema lo deja en el último paso guardado. Los pasos ya visitados se pueden abrir desde la barra (US-06). Los que no se han visitado siguen cerrados.
5. **Nuevo planeamiento** abre la configuración de US-04.
6. Si la cuenta no tuviera planeamientos, la lista muestra «Aún no tiene planeamientos.» y el botón **Nuevo planeamiento**.
7. La lista tiene el enlace **Cerrar sesión** (US-02).

## Datos que deben verse al entrar

| Cuenta | Qué aparece en la lista | Al abrirlo |
| --- | --- | --- |
| Juanita Pérez | Matemática · 4.° año · Marzo 2026 · Escuela República de Arabia Saudita · Borrador · Paso 4 de 8 · 10 de marzo de 2026 | Paso 4, Mediación. Pasos 0 a 4 visitados. |
| Carlos Mora | Español · 2.° año · Abril 2026 · Escuela José Figueres Ferrer · Listo para entrega · 2 de abril de 2026 | Paso 7, Formato MEP. Pasos 0 a 7 visitados. El paso 8 aún no. |
| María Solís | Ciencias · 7.° año · Febrero 2026 · Liceo Experimental de San Pedro · Listo para entrega · 18 de febrero de 2026 | Paso 8, Ajuste post-clase. Pasos 0 a 8 visitados. Los ajustes aún no se han aplicado. |

Esos tres planeamientos ya están guardados. No se construyen en el momento de abrirlos.

## Enhanced

**Funcionalidad.** `GET /api/plans` devuelve solo los `PlanSummary` del `teacherId` de la sesión, ordenados por `updatedAt` descendente. Cada ítem trae `id`, `subject`, `gradeLevel`, `month`, `schoolYear`, `schoolName`, `status`, `currentStep` y `updatedAt`. La pantalla traduce esos campos al texto de la fila: asignatura y mes en español, y el estado `DRAFT` como «Borrador · Paso N de 8» usando `currentStep`. `READY_FOR_DELIVERY` es «Listo para entrega» y `ADJUSTED` es «Ajustado».

Abrir una fila navega a `/plans/:planId/steps/:currentStep` con el detalle de `GET /api/plans/:planId`. **Nuevo planeamiento** navega a `/plans/new`. La lista vacía muestra «Aún no tiene planeamientos.» y el mismo botón. La semilla de `backend/prisma/seed.ts` crea los tres planeamientos de la tabla original; abrirlos no los reconstruye.

**Módulos.** `frontend/src/pages/PlanListPage.tsx`, `frontend/src/services/planService.ts`. Backend: `backend/src/application/listPlans.ts`, `getPlan.ts`, `planController.ts`.

**Definición de terminado.** Jest: la consulta filtra por docente y un id ajeno no aparece. Prueba de componente de la fila de Juanita y del estado vacío. Playwright con las tres cuentas de US-01, cada una viendo una sola fila. Si cambia una columna, actualizar `docs/api-spec.yml` y `docs/data-model.md`.

**No funcional.** La lista no incluye bloques ni textos de sugerencia. Respuesta acotada al docente de la cookie.
