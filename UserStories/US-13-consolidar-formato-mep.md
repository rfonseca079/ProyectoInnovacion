# US-13 — Consolidar el formato MEP

## Original

**Rol:** docente

**Historia**  
Como docente quiero ver el planeamiento reunido en una plantilla institucional para revisar, antes de descargarlo, que las decisiones de los pasos anteriores quedaron en un solo documento.

## Contexto

Paso 7 de 8. Título: **Planeamiento en formato institucional**. Apoyo: «Todas las decisiones anteriores se consolidan en la plantilla tipo MEP, lista para descargar.» La pantalla debe leerse como un documento formal, no como otro formulario suelto. La descarga y la vista previa del archivo están en US-14.

## Criterios de aceptación

1. Al entrar, el documento se arma con los datos guardados del planeamiento y con la plantilla del escenario. No se redacta en ese momento con un modelo de lenguaje.
2. El encabezado del documento muestra dirección regional, centro educativo, nombre docente, asignatura, nivel, curso lectivo y periodicidad mensual con el mes.
3. Muestra competencias generales ya marcadas en el escenario.
4. El cuerpo es una tabla de tres columnas: **Aprendizajes esperados**, **Estrategias de mediación** e **Indicadores**. Incluye al menos dos filas completas, tomadas de lo guardado en los pasos anteriores cuando esos campos fueron editados, y del texto base del escenario cuando no lo fueron.
5. Debajo aparecen los instrumentos de evaluación guardados en el paso 5 y un espacio de observaciones con la contextualización del grupo guardada en el paso 3.
6. El estado visible es **Listo para entrega a dirección**.
7. **Editar campos** permite corregir el encabezado, las celdas de la tabla y las observaciones. Esos cambios se guardan solos y son los que luego salen en el PDF.
8. Si un campo obligatorio del documento queda vacío, **Descargar PDF** no genera el archivo e indica el campo. La vista del documento sí permanece en pantalla.
9. **Atrás** regresa al paso 6. Si el planeamiento todavía no ha abierto el paso 8, ese paso sigue cerrado hasta que la persona elija **Continuar**.
10. **Continuar** abre el paso 8 con el ajuste todavía sin aplicar.

## Documento inicial de `mat-4-marzo-2026`

- Dirección Regional de Educación: San José.
- Centro educativo: Escuela República de Arabia Saudita.
- Docente: Juanita Pérez.
- Asignatura: Matemática. Nivel: 4.° año. Curso lectivo: 2026. Periodicidad: mensual, marzo.
- Competencias marcadas: Ciudadanía responsable y solidaria; Competencias para la vida.
- Fila 1. Aprendizaje: reconocer fracciones equivalentes. Mediación: activación con material concreto y construcción de 1/2 = 2/4 = 3/6. Indicador: representa al menos dos fracciones equivalentes con fichas.
- Fila 2. Aprendizaje: resolver un problema sencillo de parte-todo. Mediación: práctica en parejas y cierre con una regla verbal. Indicador: explica con sus palabras por qué dos fracciones equivalen.
- Observación inicial: el 4.° A trabaja mejor con material concreto y necesita apoyo para leer enunciados largos. El texto usa lo guardado en el diagnóstico si la docente lo cambió.

## Otros escenarios

El documento de Carlos Mora muestra Escuela José Figueres Ferrer, Español, 2.° año, abril 2026, y una fila cuya estrategia contiene «Lectura en voz alta del cuento de la semana».  
El de María Solís muestra Liceo Experimental de San Pedro, Ciencias, 7.° año, febrero 2026, y una fila cuya estrategia contiene «Observación guiada de la célula».

## Enhanced

**Funcionalidad.** Al entrar al paso 7, si aún no existe `MepDocument`, el servicio lo arma desde el snapshot del plan, las competencias del escenario y las filas base. Donde el docente haya editado aprendizajes, mediación, indicadores, evidencias u observaciones, se usan esos `PlanBlock`. El encabezado muestra `regionalDirectorate`, `schoolName`, `teacherName`, `subject`, `gradeLevel`, `schoolYear` y la periodicidad mensual con el mes. La tabla tiene `expectedLearning`, `mediationStrategy` e `indicator`, con al menos dos filas. Debajo van los instrumentos del paso 5 y `observations`.

**Editar campos** activa la edición y cada cambio hace `PATCH` sobre el documento. Esos valores son los que lee el PDF. Un campo obligatorio vacío no llama a la descarga y señala el campo; la vista permanece. **Atrás** va al paso 6. **Continuar** abre el paso 8 sin marcar el ajuste como aplicado. El estado visible es «Listo para entrega a dirección» mientras `status` sea `READY_FOR_DELIVERY`.

**Módulos.** `frontend/src/pages/steps/MepStepPage.tsx`. Backend: armado del documento en `backend/src/application/buildMepDocument.ts`, persistido como `MepDocument`. Los botones de archivo están especificados en US-14.

**Definición de terminado.** Jest: una observación editada en el paso 3 reemplaza la observación base; un campo vacío no produce PDF; continuar no pone `adjustmentApplied`. Prueba de componente de las tres columnas y de las frases distintivas de Carlos y María. Actualizar `docs/data-model.md` si se agrega una columna.

**No funcional.** El documento se ensambla con filas guardadas. No hay una llamada que redacte la plantilla. La pantalla se lee como documento, a 1440 px.
