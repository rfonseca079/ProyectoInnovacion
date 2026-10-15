# US-16 — Usar sugerencias simuladas

## Original

**Rol:** docente

**Historia**  
Como docente quiero aceptar, editar o pedir otra sugerencia para armar el planeamiento con textos ya preparados, sin esperar a que un modelo de lenguaje redacte nada.

## Contexto

Esta historia fija el comportamiento común de todo lo que en `stitch.md` aparece como trabajo de la IA: reanalizar, regenerar, redistribuir, generar implicaciones, equilibrar la carga, generar sesiones y proponer ajustes. En el demo, cada una de esas acciones lee la base. No hay chat lateral. La sugerencia aparece en tarjetas dentro del paso.

## Criterios de aceptación

1. Ninguna acción del wizard llama a un servicio de inteligencia artificial ni inventa un párrafo en el momento. Si un texto no está guardado, el botón indica: «No hay otra sugerencia guardada para este bloque.»
2. Al abrir un paso por primera vez, sus campos y tarjetas muestran la variante 1 del escenario asociado. Esas tarjetas quedan en estado **Sugerido por IA** y el texto ya forma parte del borrador.
3. **Aceptar sugerencia** deja ese texto en el planeamiento y marca la tarjeta como **Aceptada**.
4. **Editar** permite cambiar el texto, lo guarda y marca la tarjeta como **Editada**.
5. **Regenerar** muestra la siguiente variante guardada de ese bloque, en círculo: 1, 2, 3 y otra vez 1. Cada bloque regenerable tiene tres variantes.
6. Si la tarjeta sigue en **Sugerido por IA**, **Regenerar** también actualiza el campo visible. Si ya está **Aceptada** o **Editada**, el campo conserva el texto de la docente hasta que acepte la variante nueva.
7. Aceptar, editar y regenerar cuando cambia el texto visible disparan el guardado de US-05.
8. Los botones con nombre propio (**Reanalizar programa**, **Redistribuir con IA**, **Generar implicaciones pedagógicas**, **Regenerar mediación**, **Ajustar a 40 minutos**, **Simplificar materiales**, **Equilibrar carga evaluativa del mes** y **Generar las 5 sesiones con IA**) cargan la variante guardada para esa acción, según la historia de su paso. Esa acción sí sustituye el texto visible del bloque, aunque estuviera aceptado o editado, y deja las tarjetas afectadas otra vez en **Sugerido por IA**.
9. El escenario se elige al crear el planeamiento y se vuelve a elegir si cambian el curso lectivo, la asignatura, el nivel o el mes. La modalidad, el centro y el grupo no cambian el escenario.
10. Si la combinación coincide con un escenario, se usan sus textos. Si no coincide, se usa `mat-4-marzo-2026` y en cada paso se lee: «No hay un escenario específico para esta combinación. Las sugerencias corresponden a Matemática, 4.° año, marzo 2026.» El encabezado del planeamiento conserva lo que la docente configuró.
11. Un cambio de escenario actualiza solo los bloques que siguen en **Sugerido por IA**. Los aceptados o editados no se reemplazan.

## Escenarios guardados

| Id | Cuándo se usa | Se reconoce porque |
| --- | --- | --- |
| `mat-4-marzo-2026` | 2026, Matemática, 4.° año, marzo. También es el respaldo. | El extracto habla de fracciones de 4.° año. |
| `esp-2-abril-2026` | 2026, Español, 2.° año, abril. | El extracto contiene «Extracto del programa de Español 2.° — Comprensión lectora: texto narrativo». |
| `cie-7-febrero-2026` | 2026, Ciencias, 7.° año, febrero. | El extracto contiene «Extracto del programa de Ciencias 7.° — La célula como unidad de la vida». |

Estudios Sociales, otro nivel, otro mes u otro año muestran el aviso de respaldo y los textos de `mat-4-marzo-2026`.

## Planeamientos semilla

- Juanita Pérez usa `mat-4-marzo-2026`. Su borrador ya tiene guardados los pasos 0 a 4 con la variante 1. Las tarjetas de esos pasos están en **Sugerido por IA**.
- Carlos Mora usa `esp-2-abril-2026`. Los pasos 0 a 7 están guardados con la variante 1 y las tarjetas en **Aceptada**.
- María Solís usa `cie-7-febrero-2026`. Los pasos 0 a 8 están guardados con la variante 1. El conjunto `ajuste-semana` todavía no se ha aplicado.

## Bloques que siempre tienen tres variantes

Extracto del programa, objetivos del mes, contenidos del tiempo disponible, riesgos de calendario, justificación de la evaluación, cada implicación pedagógica, mediación completa, materiales simplificados, carga evaluativa, cada conjunto de cinco sesiones y cada tarjeta de ajuste posterior a la clase. Las distribuciones de porcentajes siguen, además, la regla de cantidad de rubros de US-08.

## Enhanced

**Funcionalidad.** Esta historia es el contrato común. No hay cliente de modelo de lenguaje en frontend ni en backend. Si no existe otra fila, la acción responde `404` y el botón muestra «No hay otra sugerencia guardada para este bloque.»

Rutas:

- `POST /api/plans/:planId/blocks/:blockKey/accept` deja `status = ACCEPTED` y conserva el `body` visible.
- `PATCH /api/plans/:planId/blocks/:blockKey` con `{ body }` deja `status = EDITED`.
- `POST /api/plans/:planId/blocks/:blockKey/regenerate` avanza `variant` en círculo 1 → 2 → 3 → 1. Si el estado era `SUGGESTED`, también sustituye `body`. Si era `ACCEPTED` o `EDITED`, `body` no cambia hasta un accept posterior.
- `POST /api/plans/:planId/actions/:actionKey` sustituye el texto visible, aunque el bloque estuviera aceptado o editado, y lo devuelve a `SUGGESTED`.

Claves de acción: `reanalyze-program`, `redistribute-evaluation`, `generate-implications`, `regenerate-mediation`, `fit-40-minutes`, `simplify-materials`, `balance-assessment-load`, `generate-week-sessions`. `duplicate-structure` copia campos de sesión y no cicla una variante.

La primera visita a un paso crea los `PlanBlock` desde la variante 1, en `SUGGESTED`, y los guarda. El escenario se resuelve por `schoolYear + subject + gradeLevel + month`. Sin coincidencia: `scenarioId = mat-4-marzo-2026` y `usedFallback = true`, con el aviso de la historia original en cada paso. Un cambio de esa clave recarga solo bloques `SUGGESTED`.

**Módulos.** `frontend/src/components/SuggestionCard.tsx` y `suggestionService.ts`. Backend: `acceptSuggestion.ts`, `editBlock.ts`, `regenerateBlock.ts`, `runStoredAction.ts`, selector de escenario en dominio. Tabla `SuggestionVariant` en `backend/prisma/schema.prisma`, cargada por `seed.ts`.

**Definición de terminado.** Jest del ciclo de tres variantes, de que regenerar no pisa un bloque `EDITED`, de que una acción con nombre sí lo sustituye, y del respaldo de Estudios Sociales. Una prueba de revisión confirma que el código de aplicación no importa un SDK de modelos. Actualizar `docs/api-spec.yml` y `docs/data-model.md` si aparece otra clave de bloque.

**No funcional.** Las tres variantes de cada bloque regenerable existen antes de pulsar el botón. La interfaz no tiene panel de chat. Cada accept, edit y regeneración que cambia el texto visible dispara el guardado de US-05.
