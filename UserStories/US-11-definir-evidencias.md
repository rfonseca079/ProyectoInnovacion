# US-11 — Definir las evidencias de aprendizaje

## Original

**Rol:** docente

**Historia**  
Como docente quiero combinar los chequeos de la clase con las evaluaciones ya calendarizadas para saber qué evidencia voy a recoger y cuándo.

## Contexto

Paso 5 de 8. Título: **Evidencias de aprendizaje**. Apoyo: «Combine chequeos durante la clase con las evaluaciones ya calendarizadas.»

## Criterios de aceptación

1. La zona izquierda muestra evidencias durante la clase. La zona derecha muestra las evaluaciones calendarizadas, alineadas con los rubros del paso 2.
2. Cada evidencia es una tarjeta editable con qué mide, cuándo, instrumento y vínculo con un aprendizaje esperado.
3. Las tarjetas se aceptan, editan y regeneran según US-16.
4. **Equilibrar carga evaluativa del mes** sustituye el conjunto de la derecha por la siguiente distribución guardada de fechas e instrumentos. No borra los rubros del paso 2: reubica las evidencias que ya están asociadas a esos rubros.
5. Si una evidencia calendarizada queda en una semana que el calendario marca como feriado o suspendido, la tarjeta muestra el aviso «Esta fecha está marcada como no lectiva en el calendario.» **Continuar** no se bloquea por ese aviso.
6. Para continuar debe haber al menos una evidencia durante la clase y una calendarizada, ambas con los cuatro datos completos.
7. **Continuar** abre el paso 6.

## Escenario `mat-4-marzo-2026`, variante 1

Durante la clase:

- Tres preguntas orales de chequeo. Miden si el estudiantado explica una equivalencia con sus palabras. Instrumento: preguntas orales. Momento: durante la construcción.
- Salida rápida de 2 ítems. Mide la representación 1/2 = 2/4. Instrumento: boleta corta. Momento: cierre de la lección.
- Observación del material concreto. Indicadores: toma la ficha correcta, justifica la equivalencia y escucha a la pareja. Instrumento: lista breve. Momento: activación y construcción.
- Conversación matemática en parejas. Rúbrica de tres criterios: uso de la palabra «equivalente», explicación del numerador y escucha activa.

Calendarizadas:

- Quiz 1, viernes 13 de marzo, semana 2. Mide fracciones equivalentes. Instrumento: quiz escrito.
- Prueba escrita, viernes 27 de marzo, semana 4. Mide los aprendizajes del mes. Instrumento: prueba escrita.
- Proyecto corto «Fracciones en mi comunidad», entrega en la semana 4. Instrumento: producto breve con rúbrica.
- Práctica en clase con puntaje de desempeño. No hay laboratorio aparte.

## Variante de equilibrio

La segunda carga guardada mueve el quiz al viernes 20 de marzo y deja la prueba escrita el 27 de marzo, con la frase «El quiz sale de la semana de introducción para no sumar dos instrumentos en la semana 2.» La tercera carga deja un solo quiz y pasa 10 % del peso del quiz a desempeño en clase, siempre que el paso 2 todavía tenga esos rubros. Si la docente ya cambió los nombres de los rubros, esta tercera carga no se ofrece y el botón muestra la variante que sí conserva los nombres actuales; si ninguna coincide, indica: «No hay otra carga guardada para los rubros actuales.»

## Otros escenarios

`esp-2-abril-2026` guarda como evidencia calendarizada un «Quiz de idea principal» de abril.  
`cie-7-febrero-2026` guarda una «Práctica de reconocimiento de organelos» en febrero.  
Cada escenario tiene tres cargas evaluativas guardadas.

## Enhanced

**Funcionalidad.** El paso 5 parte las evidencias en `kind = FORMATIVE` y `kind = SCHEDULED`. Cada `Evidence` guarda `measures`, `when`, `instrument` y `expectedLearning`. Aceptar, editar y regenerar usan las rutas de bloque de US-16, con claves `evidence-formative-*` y `evidence-scheduled-*`.

**Equilibrar carga evaluativa del mes** llama `POST /api/plans/:planId/actions/balance-assessment-load`. Sustituye solo las evidencias calendarizadas por el siguiente conjunto cuyo `rubricNames` coincide con los nombres actuales de `RubricItem`. No borra ni renombra rubros. Si ninguno coincide, `409` y el texto «No hay otra carga guardada para los rubros actuales.» Si `when` cae en un `CalendarDay` `HOLIDAY` o `SUSPENDED`, la tarjeta muestra «Esta fecha está marcada como no lectiva en el calendario.» y **Continuar** sigue habilitado si los cuatro campos de al menos una evidencia de cada lado están completos.

**Módulos.** `frontend/src/pages/steps/EvidenceStepPage.tsx`. Backend: comparación de nombres de rúbrica en `runStoredAction.ts` y cruce con `CalendarDay`.

**Definición de terminado.** Jest: la segunda carga del escenario de matemáticas mueve el quiz al 20 de marzo; nombres de rubro distintos y sin conjunto compatible devuelven `409`; un feriado no produce `422`. Prueba de componente del aviso y de las dos columnas.

**No funcional.** La tercera carga que mueve 10 % de peso solo se aplica si los nombres de rubro siguen siendo los de la semilla. No envía el aviso a ningún servicio externo.
