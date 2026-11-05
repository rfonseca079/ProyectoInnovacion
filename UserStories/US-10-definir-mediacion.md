# US-10 — Definir la mediación

## Original

**Rol:** docente

**Historia**  
Como docente quiero definir lo que haremos dentro y fuera del aula para dejar claro el rol docente, el rol del estudiantado, los tiempos y los materiales.

## Contexto

Paso 4 de 8. Título: **Qué haremos para aprender**. Apoyo: «Defina el rol de la persona docente, el rol del estudiantado, los tiempos y los materiales. También el trabajo extraclase.» Juanita Pérez entra a este paso cuando abre su borrador.

## Criterios de aceptación

1. La pantalla trabaja sobre la semana activa guardada en el escenario. En Matemática de marzo esa semana es la semana 2, Fracciones equivalentes.
2. La mediación dentro del aula se muestra en filas con actividad, lo que hace la persona docente, lo que hace el estudiantado, tiempo y materiales.
3. La mediación fuera del aula lista los trabajos extraclase, cada uno con su propósito de aprendizaje.
4. Esas filas y los extraclase se pueden editar. El cambio se guarda solo.
5. **Regenerar mediación** carga el siguiente conjunto guardado de actividades y extraclase.
6. **Ajustar a 40 minutos** carga el conjunto guardado cuyos tiempos suman 40 minutos, sin cambiar el tema de la semana.
7. **Simplificar materiales** carga el conjunto guardado que reduce los materiales.
8. Cada uno de esos botones recorre sus propias variantes y, al agotarlas, vuelve a la primera. El texto visible queda guardado y la tarjeta queda como **Sugerido por IA** hasta que se acepte o se edite.
9. Para continuar debe haber al menos una actividad dentro del aula y un tiempo en cada fila. La suma no tiene que ser 40 para continuar: ese ajuste es voluntario.
10. **Continuar** abre el paso 5.

## Escenario `mat-4-marzo-2026`, mediación inicial

Dentro del aula:

| Actividad | Docente | Estudiantado | Tiempo | Materiales |
| --- | --- | --- | --- | --- |
| Activación con fichas | Modela | Manipulan y verbalizan | 10 min | Círculos fraccionarios |
| Construcción de equivalentes | Guía preguntas | Representan 1/2 = 2/4 = 3/6 | 25 min | Fichas y mini pizarras |
| Práctica guiada | Monitorea | Resuelven en parejas | 20 min | Hoja de práctica |
| Cierre | Sintetiza | Comparten una regla en una frase | 5 min | Pizarra |

Fuera del aula:

- Buscar 3 ejemplos de fracciones equivalentes en empaques de la casa. Duración estimada: 15 a 20 minutos. Propósito: reconocer equivalencias en situaciones cotidianas.
- Práctica breve de cuaderno con 6 ítems. Propósito: fijar la representación simbólica trabajada en clase.

## Variantes que deben existir

- A 40 minutos: activación 8 min, construcción 14 min, práctica guiada 12 min y cierre 6 min.
- Materiales simplificados: papel y lápiz, cuaderno, pizarra y la misma pizarra del cierre. No usa círculos ni mini pizarras.
- Segunda mediación completa: cambia la activación por «relato corto de una pizza repartida» y mantiene el tema de equivalencias.
- Tercera mediación completa: la práctica guiada pasa a hacerse en el cuaderno, sin hoja impresa.

## Otros escenarios

`esp-2-abril-2026` guarda la mediación de una semana de cuento, con lectura en voz alta y un extraclase de llevar un cuento de la casa.  
`cie-7-febrero-2026` guarda la mediación de una semana sobre la célula, con observación de imágenes y un extraclase de rotular un esquema.  
En los tres escenarios existe una variante cuyos tiempos suman 40 minutos.

## Enhanced

**Funcionalidad.** El paso 4 muestra la semana activa del escenario. El bloque `mediation-in-class` es una lista de filas con `activity`, `teacherRole`, `studentRole`, `minutes` y `materials`. El bloque `mediation-outside` lista `task`, `purpose` y duración estimada. Editarlos hace `PATCH` y los marca `EDITED`.

Acciones, cada una con su propio ciclo de variantes:

- `POST /api/plans/:planId/actions/regenerate-mediation`
- `POST /api/plans/:planId/actions/fit-40-minutes` — los minutos guardados suman 40 y el tema no cambia
- `POST /api/plans/:planId/actions/simplify-materials`

Esas acciones reemplazan el texto visible y dejan los bloques en `SUGGESTED`, aunque antes estuvieran aceptados o editados. **Continuar** exige al menos una fila y `minutes` en cada fila. No exige que la suma sea 40; en ese caso el `POST .../steps/4/continue` responde `200`.

**Módulos.** `frontend/src/pages/steps/MediationStepPage.tsx`. Backend: `runStoredAction.ts`. Semilla de la tabla inicial, de la variante de 8+14+12+6 minutos y de los materiales simplificados.

**Definición de terminado.** Jest: `fit-40-minutes` suma 40; una fila sin minutos bloquea el paso; una suma distinta de 40 sí continúa. Prueba de componente de las cuatro columnas. Juanita, al abrir su semilla, cae en este paso.

**No funcional.** Los tiempos son datos guardados. El botón no reparte minutos con un cálculo nuevo.
