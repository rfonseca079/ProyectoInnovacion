# US-07 — Revisar el programa y el calendario

## Original

**Rol:** docente

**Historia**  
Como docente quiero revisar el extracto del programa, el tiempo disponible y el calendario del mes para decidir qué sí alcanza a trabajar.

## Contexto

Paso 1 de 8. Título: **Programa, objetivos y tiempo disponible**. Apoyo: «Revise lo esencial del programa oficial y la calendarización real del mes, incluyendo feriados.» El marco del wizard es el de US-06. Las tarjetas se aceptan, editan y regeneran según US-16.

## Criterios de aceptación

1. La pantalla muestra tres zonas: extracto del programa, tiempo disponible y calendario del mes, con los datos guardados del escenario del planeamiento.
2. **Reanalizar programa** carga la siguiente variante guardada del extracto. Con la variante 1 visible, la primera pulsación muestra la variante 2 y la segunda, la variante 3. Una pulsación más vuelve a la variante 1.
3. El tiempo disponible y la lista de restricciones se pueden editar. Esos cambios se guardan solos.
4. El calendario muestra la leyenda **Lectivo**, **Feriado**, **Suspendido** y **Evaluación**, con los días ya marcados en el escenario. No calcula feriados en el momento.
5. Hay tres tarjetas editables: **Objetivos priorizados del mes**, **Contenidos que caben en el tiempo disponible** y **Riesgos de calendario**. Cada una tiene **Aceptar sugerencia**, **Editar** y **Regenerar**.
6. Para continuar deben quedar con texto el extracto, el total de lecciones planificables, las lecciones afectadas y las tres tarjetas.
7. **Continuar** abre el paso 2.

## Escenario `mat-4-marzo-2026`, variante 1

Extracto titulado **Extracto del programa de Matemática 4.°**.

- Eje: Números y operaciones — Fracciones.
- Aprendizajes esperados: representar fracciones propias como parte de un todo con material concreto; reconocer fracciones equivalentes en contextos cotidianos; comparar y ordenar fracciones con denominadores hasta 12; resolver problemas sencillos de parte-todo.
- Contenidos clave: concepto de fracción, fracciones equivalentes, comparación y orden, resolución de problemas.
- Evaluación: formativa continua y sumativa según la rúbrica del centro.
- Lecciones planificables en marzo: 18. Lecciones afectadas: 2.
- Restricciones guardadas: Consejo de docentes el 6 de marzo; asueto del 30 y 31 de marzo por inicio de Semana Santa.
- Calendario de marzo 2026: el 6 queda **Suspendido** (Consejo de docentes), el 13 **Evaluación** (quiz de la semana 2), el 27 **Evaluación** (prueba de la semana 4) y el 30 y 31 **Feriado**.
- Tarjeta de objetivos: priorizar parte-todo, equivalencias y comparación, y dejar la resolución de problemas para la semana 4.
- Tarjeta de contenidos: el mes alcanza para parte-todo, equivalencias, comparación y una semana de problemas. No incluye operaciones avanzadas con fracciones impropias.
- Tarjeta de riesgos: «Se recomienda redistribuir la introducción a fracciones equivalentes a la semana del 9 al 13 de marzo por el asueto del 30 y 31 de marzo.»

## Otras variantes guardadas de ese escenario

- Variante 2 del extracto: el eje visible es «Números y operaciones — Fracciones en la recta» e incluye el aprendizaje «Ubicar fracciones en la recta numérica.»
- Variante 3 del extracto: el eje visible es «Números y operaciones — Problemas con fracciones» e incluye «Plantear problemas de la comunidad con fracciones.»
- Variante 2 de riesgos: propone pasar la introducción de equivalencias a la semana del 16 al 20 de marzo.
- Variante 3 de riesgos: propone usar el 6 de marzo solo para diagnóstico y no para contenido nuevo.

Las variantes 2 y 3 de objetivos y de contenidos también están guardadas, con un texto distinto y coherente con fracciones de 4.° año. **Regenerar** en cada tarjeta recorre solo las variantes de esa tarjeta.

## Otros escenarios

En `esp-2-abril-2026` el extracto inicial contiene «Extracto del programa de Español 2.° — Comprensión lectora: texto narrativo».  
En `cie-7-febrero-2026` el extracto inicial contiene «Extracto del programa de Ciencias 7.° — La célula como unidad de la vida».  
Esos escenarios traen sus propios totales, calendarios y tres variantes por tarjeta.

## Enhanced

**Funcionalidad.** La página del paso 1 lee el `PlanDetail` ya cargado. Los bloques son `program-extract`, `available-time`, `calendar-restrictions`, `month-objectives`, `month-contents` y `calendar-risks`. El calendario llega como `CalendarDay` con `kind` `TEACHING | HOLIDAY | SUSPENDED | ASSESSMENT`; la interfaz no calcula feriados.

**Reanalizar programa** llama `POST /api/plans/:planId/actions/reanalyze-program` y sustituye `program-extract` por la siguiente variante, dejándolo en `SUGGESTED`. **Regenerar** de cada tarjeta llama `POST /api/plans/:planId/blocks/:blockKey/regenerate` y recorre solo las variantes de esa clave. Editar tiempo o restricciones hace `PATCH` de esos bloques. **Continuar** exige texto en el extracto, lecciones planificables, lecciones afectadas y las tres tarjetas; si falta alguno, `422`.

Los textos de la variante 1 y las frases distintivas de las variantes 2 y 3 quedan en `SuggestionVariant.body` del escenario, no en el componente.

**Módulos.** `frontend/src/pages/steps/ProgramStepPage.tsx`, `SuggestionCard.tsx`, `suggestionService.ts`. Backend: `runStoredAction.ts` y `regenerateBlock.ts`. Semilla de `CalendarDay` y de las tres variantes en `backend/prisma/seed.ts`.

**Definición de terminado.** Jest: tres llamadas a `reanalyze-program` vuelven a la variante 1 y el cuerpo contiene las frases de la historia original. Prueba de componente de la leyenda Lectivo, Feriado, Suspendido y Evaluación. Si se agrega un día marcado, actualizar `docs/data-model.md`.

**No funcional.** Ninguna petición de este paso sale a un proveedor de modelos. El calendario de marzo 2026 del escenario de matemáticas es dato guardado.
