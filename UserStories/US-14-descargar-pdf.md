# US-14 — Previsualizar y descargar el PDF

## Original

**Rol:** docente

**Historia**  
Como docente quiero previsualizar y descargar el PDF del planeamiento para entregar el documento con los datos que quedaron guardados.

## Contexto

Las acciones están en el paso 7, sobre el documento de US-13. El PDF lo produce el sistema a partir de la base. No es un archivo fijo ni el resultado de un modelo de lenguaje.

## Criterios de aceptación

1. **Vista previa PDF** abre la versión de impresión del documento consolidado, con el mismo texto que se descargaría en ese momento.
2. **Descargar PDF** genera un archivo con el encabezado, la tabla, los instrumentos y las observaciones guardadas, incluidas las ediciones hechas en **Editar campos**.
3. El archivo se llama `planeamiento-{asignatura}-{nivel}-{mes}-{curso}.pdf`, en minúsculas y sin tildes. Para el planeamiento de Juanita el nombre es `planeamiento-matematica-4-marzo-2026.pdf`.
4. Si Juanita cambia una observación y descarga de nuevo, el PDF nuevo contiene esa observación y no la frase anterior.
5. El PDF de Carlos Mora contiene «Lectura en voz alta del cuento de la semana». El de María Solís contiene «Observación guiada de la célula».
6. Si falta un campo obligatorio del documento, no se descarga nada y se indica el campo.
7. **Exportar semana**, del paso 6, usa esta misma regla de generar el archivo desde lo guardado y no reutiliza el PDF institucional completo: lleva solo las cinco sesiones de la semana elegida (US-12).
8. Una docente no puede descargar el PDF del planeamiento de otra cuenta.

## Enhanced

**Funcionalidad.** **Vista previa PDF** pide el mismo recurso que la descarga y lo muestra en una vista de impresión, sin guardar otro archivo. **Descargar PDF** llama `GET /api/plans/:planId/document/pdf`. La respuesta `200` es `application/pdf` armado desde `MepDocument`, instrumentos y observaciones guardadas. El `Content-Disposition` usa `planeamiento-{subject}-{grade}-{month}-{schoolYear}.pdf` en minúsculas y sin tildes. Para Juanita: `planeamiento-matematica-4-marzo-2026.pdf`.

Si falta un campo obligatorio, `422` y no hay cuerpo de archivo. Una segunda descarga después de editar la observación contiene el texto nuevo. El PDF de Carlos incluye «Lectura en voz alta del cuento de la semana» y el de María «Observación guiada de la célula». Un plan de otra docente responde `404`.

**Exportar semana** es `GET /api/plans/:planId/weeks/:weekNumber/pdf` y nombra `semana-{number}-{subject}-{month}-{schoolYear}.pdf`. No reutiliza el PDF institucional.

**Módulos.** Botones en `MepStepPage.tsx` y `SessionsStepPage.tsx`. `frontend/src/services/planService.ts` descarga el binario. Backend: `backend/src/application/renderPlanPdf.ts`, `renderWeekPdf.ts`, `documentController.ts`.

**Definición de terminado.** Jest: el PDF generado contiene la observación editada y no la anterior; el de otra docente es `404`; el de la semana no incluye el encabezado institucional completo. Prueba de extremo a extremo de Juanita: editar una observación, descargar y comprobar el nombre del archivo.

**No funcional.** El binario se genera en el servidor desde filas guardadas. No hay un PDF estático en el repositorio ni una llamada a un modelo de lenguaje. El archivo no se guarda como sustituto del documento: la fuente sigue siendo la base.
