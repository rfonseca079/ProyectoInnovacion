# US-12 — Preparar las sesiones de la semana

## Original

**Rol:** docente

**Historia**  
Como docente quiero ver y ajustar cada sesión de la semana para llegar a clase con inicio, desarrollo y cierre.

## Contexto

Paso 6 de 8. Título: **Prepare la semana y cada sesión**. Apoyo: «Detalle qué toca esta semana. Toda sesión tiene inicio, desarrollo y cierre.»

## Criterios de aceptación

1. Un selector muestra las semanas guardadas del mes. La semana activa del escenario aparece seleccionada.
2. La semana activa lista cinco sesiones, de lunes a viernes. Dos llegan expandidas y las otras tres, contraídas. Se pueden abrir y cerrar.
3. Cada sesión expandida muestra día, fecha, aprendizaje esperado, duración de 40 minutos, inicio, desarrollo, cierre, materiales, evidencia formativa del día y tarea o extraclase si existe.
4. Esos campos se pueden editar y se guardan solos.
5. **Generar las 5 sesiones con IA** sustituye las cinco sesiones de la semana seleccionada por el siguiente conjunto guardado y las marca como **Sugerido por IA**.
6. **Duplicar estructura** copia inicio, desarrollo, cierre, materiales y evidencia de la sesión que está expandida al resto de esa semana. Conserva el día, la fecha y el aprendizaje esperado de cada sesión. Si hay más de una expandida, usa la primera. Si no hay ninguna, indica: «Abra una sesión para duplicar su estructura.»
7. **Exportar semana** descarga un PDF con las cinco sesiones guardadas de la semana seleccionada. El archivo se llama `semana-{numero}-{asignatura}-{mes}-{curso}.pdf`, en minúsculas y sin tildes en el nombre. El PDF contiene el texto guardado, no un texto nuevo.
8. Para continuar, las cinco sesiones de la semana activa tienen aprendizaje, inicio, desarrollo y cierre.
9. **Continuar** abre el paso 7 y el estado del planeamiento pasa a **Listo para entrega** cuando ese paso se abre con los datos válidos.

## Escenario `mat-4-marzo-2026`, semana 2

El selector inicia en **Semana 2 (9 al 13 de marzo)**. Lunes y miércoles llegan expandidos.

- Lunes 9 de marzo. Aprendizaje: reconocer fracciones equivalentes con material concreto. Inicio 10 min con círculos fraccionarios. Desarrollo 25 min para representar 1/2 = 2/4 = 3/6. Cierre 5 min para compartir una regla. Materiales: círculos y fichas. Evidencia: observación de la manipulación. Tarea: buscar 3 ejemplos de equivalencias en empaques.
- Martes 10 de marzo, contraída, con contenido guardado de práctica breve de equivalencias.
- Miércoles 11 de marzo. Aprendizaje: explicar con lenguaje matemático por qué dos fracciones son equivalentes. Inicio 8 min de repaso de la regla. Desarrollo 22 min de práctica en parejas. Cierre 10 min de vocabulario: equivalente, numerador y denominador. Evidencia: salida rápida de 2 ítems. Sin tarea.
- Jueves 12 de marzo, contraída. Incluye la nota «Jueves con posible afectación por actividad institucional» y un plan B guardado de 25 minutos.
- Viernes 13 de marzo, contraída, con el quiz 1 como evidencia del día.

Las semanas 1, 3 y 4 también tienen cinco sesiones guardadas, más breves, para que el selector cambie de contenido.

El segundo conjunto de la semana 2 cambia el desarrollo del lunes a una representación solo con papel y deja el plan B del jueves en 20 minutos. El tercer conjunto acorta todos los cierres a 5 minutos y mueve la salida rápida al viernes.

## Otros escenarios

`esp-2-abril-2026` abre una semana de abril con cinco sesiones de lectura y la frase «Lectura en voz alta del cuento de la semana».  
`cie-7-febrero-2026` abre una semana de febrero con cinco sesiones y la frase «Observación guiada de la célula».  
Cada semana activa de esos escenarios tiene tres conjuntos guardados de cinco sesiones.

## Enhanced

**Funcionalidad.** El selector lista las `Week` del mes y marca `active`. Cada `Session` guarda `day`, `date`, `expectedLearning`, `durationMinutes` (40), `start`, `development`, `close`, `materials`, `formativeEvidence` y `homework` opcional. `expanded` llega en los datos de la semana 2: lunes y miércoles en verdadero. Editar hace `PATCH`.

**Generar las 5 sesiones con IA** llama `POST /api/plans/:planId/actions/generate-week-sessions` con la semana seleccionada, sustituye las cinco sesiones y las deja en `SUGGESTED`. **Duplicar estructura** llama `POST /api/plans/:planId/actions/duplicate-structure`. Copia inicio, desarrollo, cierre, materiales y evidencia de la primera sesión expandida; conserva día, fecha y aprendizaje de las demás. Si ninguna está expandida, `409` y «Abra una sesión para duplicar su estructura.»

**Exportar semana** usa `GET /api/plans/:planId/weeks/:weekNumber/pdf` (US-14). **Continuar** exige aprendizaje, inicio, desarrollo y cierre en las cinco sesiones de la semana activa. Al abrir el paso 7 con datos válidos, `status` pasa a `READY_FOR_DELIVERY`.

**Módulos.** `frontend/src/pages/steps/SessionsStepPage.tsx`. Backend: `runStoredAction.ts` y `renderWeekPdf.ts`. Semilla de las semanas 1 a 4 y de tres conjuntos para la semana activa.

**Definición de terminado.** Jest: generar reemplaza las cinco sesiones; duplicar no cambia la fecha de las otras; continuar sin cierre responde `422`; el paso 7 queda `READY_FOR_DELIVERY`. Prueba de componente de dos sesiones expandidas y tres contraídas.

**No funcional.** El PDF de la semana sale de las sesiones guardadas. El nombre de archivo lo define US-14.
