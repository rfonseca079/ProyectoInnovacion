# US-08 — Organizar unidades y la evaluación

## Original

**Rol:** docente

**Historia**  
Como docente quiero ordenar las unidades del mes y definir el porcentaje de cada rubro para dejar una evaluación que sume 100 %.

## Contexto

Paso 2 de 8. Título: **Organice unidades y defina la evaluación**. Apoyo: «Esta distribución es una propuesta. Puede modificarla según las necesidades de su grupo.» Las sugerencias siguen US-16.

## Criterios de aceptación

1. Se muestra una secuencia horizontal de cuatro semanas. Cada semana tiene un título editable.
2. La tabla de evaluación tiene rubro, cantidad y porcentaje. El total se calcula con los porcentajes escritos.
3. Si el total es 100, se ve el estado **Distribución completa** y **Continuar** puede seguir, siempre que las semanas y los rubros tengan nombre.
4. Si el total no es 100, **Continuar** no avanza y se indica: «La distribución debe sumar 100 %.»
5. **Agregar rubro** añade una fila editable con porcentaje 0 y vuelve a calcular el total.
6. **Quitar** elimina la fila elegida. No se puede quitar la última fila.
7. **Redistribuir con IA** sustituye los porcentajes por la siguiente distribución guardada. Cada distribución guardada ya suma 100 y no cambia los nombres de los rubros que la docente haya editado; solo cambia los porcentajes del conjunto guardado que coincida en cantidad de filas. Si la cantidad de filas no coincide con ninguna distribución guardada, el botón indica: «No hay una distribución guardada para esta cantidad de rubros.»
8. La tarjeta de justificación del orden y de los pesos se acepta, edita y regenera según US-16.
9. Para continuar, cada semana tiene nombre y cada rubro tiene nombre y porcentaje.

## Escenario `mat-4-marzo-2026`, variante 1

- Semana 1: Fracción como parte-todo.
- Semana 2: Fracciones equivalentes.
- Semana 3: Comparación y orden.
- Semana 4: Resolución de problemas y consolidación.
- Prueba escrita (1) — 30 %.
- Quices (2) — 20 %.
- Trabajo extraclase (2) — 15 %.
- Desempeño en clase y prácticas — 20 %.
- Proyecto corto «Fracciones en mi comunidad» — 15 %.
- Justificación: las equivalencias van después de parte-todo porque el grupo aún confunde mitad y cuarto; la prueba escrita pesa más porque el centro usa un instrumento sumativo al cierre del mes, y el proyecto queda en 15 % para no cargar la semana 4.

## Distribuciones guardadas para cinco rubros

- Variante 2: 25 %, 15 %, 20 %, 25 % y 15 %, en el mismo orden de filas.
- Variante 3: 20 %, 20 %, 10 %, 30 % y 20 %.

La justificación también tiene variantes 2 y 3 guardadas. La variante 2 dice que el desempeño en clase sube porque el grupo aprende mejor con material concreto.

## Otros escenarios

`esp-2-abril-2026` inicia con cuatro semanas de lectura narrada, vocabulario, idea principal y producción breve, y una rúbrica propia que suma 100 %.  
`cie-7-febrero-2026` inicia con cuatro semanas sobre la célula y una rúbrica propia que suma 100 %.  
Ambos tienen tres distribuciones guardadas para su cantidad inicial de rubros.

## Enhanced

**Funcionalidad.** El paso 2 muestra cuatro `Week.title` editables y las filas `RubricItem` (`name`, `count`, `percentage`). El total se calcula en cliente y se vuelve a validar en dominio. Si la suma es 100 y cada semana y rubro tienen nombre, se muestra «Distribución completa». Si no, **Continuar** no llama al avance, o el `POST .../steps/2/continue` responde `422` con «La distribución debe sumar 100 %.»

**Agregar rubro** inserta una fila con `percentage = 0` vía `PATCH`. **Quitar** borra la fila indicada y rechaza borrar la última. **Redistribuir con IA** llama `POST /api/plans/:planId/actions/redistribute-evaluation`. El servicio busca la siguiente distribución guardada con la misma cantidad de filas, sustituye solo los porcentajes y conserva los nombres editados. Si no hay conjunto para esa cantidad, responde `409` y la pantalla dice «No hay una distribución guardada para esta cantidad de rubros.» La justificación es el bloque `evaluation-justification`, con aceptar, editar y regenerar de US-16.

**Módulos.** `frontend/src/pages/steps/UnitsStepPage.tsx`. Backend: regla de suma 100 y de última fila en dominio; `runStoredAction.ts` para la redistribución. Semilla de las tres distribuciones de cinco rubros del escenario de matemáticas.

**Definición de terminado.** Jest: 30+20+15+20+15 permite continuar; agregar una fila en 0 lo impide; redistribuir cinco filas no cambia los nombres; seis filas sin distribución devuelven `409`; no se puede borrar la única fila. Prueba de componente del estado «Distribución completa».

**No funcional.** Las distribuciones guardadas ya suman 100. El botón no recalcula porcentajes con una fórmula libre.
