# US-06 — Recorrer el wizard

## Original

**Rol:** docente

**Historia**  
Como docente quiero avanzar, retroceder y reabrir los pasos que ya visité para completar el planeamiento en orden y corregir un paso anterior.

## Contexto

El wizard tiene un encabezado, una barra de pasos y un pie comunes. El ancho de referencia es de escritorio, como pide `stitch.md`. Las sugerencias de cada paso se comportan según US-16.

## Criterios de aceptación

1. El encabezado muestra **EduAcompaña** a la izquierda y, a la derecha, el contexto guardado: asignatura, nivel, centro educativo y nombre docente.
2. El encabezado incluye **Mis planeamientos** y **Cerrar sesión**. **Mis planeamientos** vuelve a la lista sin descartar el borrador ya guardado.
3. La barra muestra, en este orden: **0 Configuración**, **1 Programa y calendario**, **2 Unidades y evaluación**, **3 Grupo**, **4 Mediación**, **5 Evidencias de aprendizaje**, **6 Sesiones**, **7 Formato MEP / PDF**, **8 Ajuste post-clase**.
4. En los pasos 1 a 8 se lee **Paso X de 8**. En Configuración no aparece ese indicador.
5. Los pasos 1 a 7 muestran **Atrás** y **Continuar**. **Atrás** abre el paso anterior aunque el paso actual tenga datos inválidos.
6. **Continuar** solo abre el siguiente paso si el actual cumple sus campos obligatorios. En evaluación, además, los porcentajes deben sumar 100 % (US-08).
7. Si **Continuar** está bloqueado, el sistema explica qué falta y no marca el siguiente paso como visitado.
8. Un paso ya visitado se puede abrir desde la barra sin exigir que el paso actual sea válido.
9. Un paso aún no visitado se ve en la barra y no se puede abrir.
10. Al continuar con éxito, el paso destino queda visitado y el borrador se guarda (US-05).
11. En el paso 8 no hay **Continuar**. Las acciones de ese paso son las de US-15.
12. Desde Configuración, **Atrás** regresa a **Mis planeamientos**.

## Recorrido mínimo para dejar un paso visitado

El planeamiento nuevo sale de Configuración hacia el paso 1. Cada **Continuar** válido habilita solo el paso inmediato. Carlos Mora, en su planeamiento semilla, puede abrir los pasos 0 a 7 y no el 8. María Solís puede abrir los nueve. Juanita Pérez puede abrir del 0 al 4.

## Enhanced

**Funcionalidad.** Las rutas son `/plans`, `/plans/new` y `/plans/:planId/steps/:step`. `WizardChrome` pinta el wordmark, el contexto (`subject`, `gradeLevel`, `schoolName`, `teacherName`), **Mis planeamientos** y **Cerrar sesión**. La barra usa los nueve rótulos de la historia original. Los pasos `1` a `8` muestran «Paso X de 8»; el `0` no.

**Continuar** llama `POST /api/plans/:planId/steps/:step/continue` solo si el paso es válido. `200` incrementa `highestVisitedStep`, guarda el borrador y navega al paso siguiente. `422` explica el campo faltante y no marca el destino como visitado. En el paso 2 el dominio exige que los porcentajes sumen 100. **Atrás** y un clic en un paso ya visitado (`step <= highestVisitedStep`) navegan sin esa validación. Un paso mayor que `highestVisitedStep` se ve y no es clickable. En el paso 8 no existe **Continuar**. Desde el paso 0, **Atrás** va a `/plans`.

**Módulos.** `frontend/src/components/WizardChrome.tsx`, páginas de paso bajo `frontend/src/pages/steps/`, `planService.continue`. Backend: `backend/src/application/continueStep.ts`.

**Definición de terminado.** Jest: continuar un paso inválido no sube `highestVisitedStep`; continuar el paso 6 con datos válidos deja `status = READY_FOR_DELIVERY` al abrir el 7, según US-12. Prueba de componente: el paso 5 de Juanita no es clickable si `highestVisitedStep` es 4. Viewport de escritorio, 1440 px.

**No funcional.** Cambiar de paso no descarta el borrador ya guardado. La barra no depende de un cálculo en el cliente distinto del `highestVisitedStep` devuelto por la API.
