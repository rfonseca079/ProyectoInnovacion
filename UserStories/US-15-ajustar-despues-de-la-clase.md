# US-15 — Ajustar el planeamiento después de la clase

## Original

**Rol:** docente

**Historia**  
Como docente quiero registrar lo que sí ocurrió en la clase y aplicar un ajuste ya definido para que las sesiones de la semana y el formato MEP queden actualizados.

## Contexto

Paso 8 de 8. Título: **Ajuste lo planeado según lo ocurrido**. Apoyo: «Puede registrar lo ocurrido y redistribuir las actividades para adaptarlas al tiempo disponible.» María Solís abre su planeamiento en este paso, con el ajuste todavía sin aplicar. Juanita llega aquí después de continuar desde el formato MEP.

## Criterios de aceptación

1. La zona izquierda muestra, para la sesión guardada como referencia, lo planeado, lo ejecutado, los aprendizajes logrados, los pendientes y la evidencia recogida. Esos campos se pueden editar y se guardan solos.
2. La zona derecha muestra tres tarjetas de ajuste. Se aceptan, editan y regeneran según US-16.
3. La bitácora de la persona docente es editable y se guarda sola.
4. Un esquema corto de la semana muestra el efecto del ajuste. Antes de aplicarlo, muestra la semana original. Después de aplicarlo, muestra la semana actualizada con el texto guardado para ese ajuste.
5. El interruptor **Notificar cambios en evaluaciones calendarizadas** inicia apagado. El sistema guarda si queda encendido o apagado. No envía ninguna notificación.
6. **Aplicar ajustes al planeamiento** escribe en las sesiones de esa semana y en la tabla del formato MEP los textos del conjunto guardado `ajuste-semana` del escenario. Las tarjetas que la docente haya editado antes de aplicar usan ese texto editado en lugar del texto base del conjunto.
7. Después de aplicar, el estado del planeamiento pasa a **Ajustado**, el paso 7 muestra el documento actualizado y un PDF nuevo incluye esos cambios.
8. Volver a aplicar no duplica filas: reemplaza los textos del ajuste anterior por los que estén guardados en ese momento.
9. **Volver al formato MEP actualizado** abre el paso 7 con el documento ya modificado si el ajuste fue aplicado. Si aún no se aplica, abre el documento vigente e indica: «Aún no hay ajustes aplicados.»
10. **Atrás** regresa al paso 7.

## Conjunto `ajuste-semana` de `mat-4-marzo-2026`

Sesión de referencia: lunes 9 de marzo.

- Planeado: completar la activación y la construcción de equivalentes.
- Ejecutado: solo la activación y la mitad de la construcción. Faltaron 15 minutos por la dinámica de entrada.
- Logrado: reconocer mitades y cuartos con material concreto.
- Pendiente: completar 1/2 = 2/4 = 3/6 y la regla verbal.
- Evidencia: la salida rápida quedó incompleta en 6 estudiantes.
- Bitácora inicial: «La entrada se alargó. El grupo sí manipuló las fichas, pero no alcanzó a formular la regla.»
- Tarjeta 1: «Reprogramar el cierre de equivalentes al inicio del martes.»
- Tarjeta 2: «Acortar la práctica guiada del martes a 12 minutos.»
- Tarjeta 3: «Mover 2 ítems del extraclase a la práctica en clase.»

Al aplicar, quedan escritos estos resultados:

- La sesión del martes 10 de marzo inicia con el cierre de equivalentes que faltó el lunes.
- La práctica guiada del martes queda en 12 minutos.
- Dos ítems del extraclase de empaques pasan a la práctica del martes, y el extraclase queda en un ejemplo.
- La fila de equivalencias del formato MEP usa la estrategia «Retomar el martes la construcción de 1/2 = 2/4 = 3/6 que quedó pendiente el lunes.» y el indicador «Completa la equivalencia en la lección del martes.»

## Otros escenarios

En `cie-7-febrero-2026` la primera tarjeta contiene «Reprogramar el cierre de la observación de células al inicio de la siguiente lección.» Al aplicar, esa frase queda en la sesión siguiente y en la estrategia de la fila correspondiente del formato MEP.  
`esp-2-abril-2026` tiene su propio conjunto `ajuste-semana`, con una tarjeta que dice «Retomar la idea principal al inicio de la lección siguiente.»

## Enhanced

**Funcionalidad.** El paso 8 lee la sesión de referencia y los campos `planned`, `executed`, `achieved`, `pending` y `collectedEvidence`, editables con `PATCH`. Las tarjetas `adjustment-1`, `adjustment-2` y `adjustment-3` aceptan, editan y regeneran según US-16. La bitácora es `teacherLog`. El esquema semanal muestra las sesiones originales hasta que `adjustmentApplied` es verdadero.

El interruptor escribe `notifyEvaluationChanges` (default `false`) y no llama a ningún envío. **Aplicar ajustes al planeamiento** llama `POST /api/plans/:planId/adjustments/apply`. El servicio escribe el conjunto `adjustment-week` del escenario en las sesiones de esa semana y en las filas del `MepDocument`. Si una tarjeta está `EDITED`, usa ese `body` en lugar del texto base. La respuesta deja `status = ADJUSTED` y `adjustmentApplied = true`. Una segunda llamada reemplaza los mismos campos y no inserta filas.

**Volver al formato MEP actualizado** navega al paso 7. Si `adjustmentApplied` es falso, el paso 7 muestra el documento vigente y el aviso «Aún no hay ajustes aplicados.» **Atrás** también va al paso 7, sin ese aviso.

**Módulos.** `frontend/src/pages/steps/AdjustmentStepPage.tsx`. Backend: `backend/src/application/applyAdjustments.ts`. Semilla del conjunto de matemáticas, incluida la estrategia «Retomar el martes la construcción de 1/2 = 2/4 = 3/6 que quedó pendiente el lunes.» María entra con `adjustmentApplied = false`.

**Definición de terminado.** Jest: aplicar cambia la sesión del martes y la fila MEP, deja `ADJUSTED` y no duplica filas al repetir; una tarjeta editada reemplaza el texto base; el interruptor en verdadero no produce un mensaje saliente. Prueba de componente del aviso cuando todavía no se ha aplicado. El PDF posterior incluye la estrategia nueva.

**No funcional.** El aviso a dirección solo persiste el booleano. No hay correo, cola ni webhook.
