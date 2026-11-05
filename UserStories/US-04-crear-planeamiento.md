# US-04 — Crear un planeamiento

## Original

**Rol:** docente

**Historia**  
Como docente quiero definir el contexto curricular de un planeamiento nuevo para que el demo llene el wizard con el escenario guardado que corresponda.

## Contexto

Corresponde a la pantalla «Nuevo planeamiento» de `stitch.md`. Esta pantalla es el paso 0. Todavía no muestra «Paso X de 8». La barra puede verse con **Configuración** activa. Al confirmar, el sistema elige un escenario según US-16 y abre el paso 1 ya lleno con la variante 1 de ese escenario.

## Criterios de aceptación

1. El título es **Nuevo planeamiento** y el apoyo es: «Defina el contexto curricular. Con esos datos se prepara una propuesta que puede modificar.»
2. El nombre de la docente, el centro educativo y la dirección regional llegan escritos con los datos de su cuenta. Puede corregirlos para este planeamiento.
3. Los demás campos empiezan vacíos. El resumen en chips se actualiza con lo que ya eligió.
4. El botón **Iniciar planeamiento con IA** solo se habilita cuando todos los campos obligatorios son válidos.
5. Si falta un campo, el sistema indica cuál es. Si el nivel no pertenece al ciclo, indica: «Seleccione un nivel del ciclo elegido.»
6. La cantidad de estudiantes y las lecciones semanales deben ser números enteros mayores que cero.
7. Al iniciar, el sistema guarda el planeamiento, le asocia el escenario correspondiente, marca visitados los pasos 0 y 1, y abre el paso 1.
8. El encabezado del wizard usa la asignatura, el nivel, el centro y el nombre guardados en esta configuración.
9. Si la persona regresa a Configuración y cambia curso lectivo, asignatura, nivel o mes, el sistema vuelve a buscar el escenario. Los bloques que siguen como «Sugerido por IA» pasan a mostrar la variante 1 del nuevo escenario. Los bloques aceptados o editados conservan su texto.
10. La periodicidad del demo es mensual: se elige el mes del curso lectivo.

## Campos obligatorios

Izquierda: ciclo, nivel, asignatura, modalidad, curso lectivo, mes.  
Derecha: centro educativo, dirección regional, nombre docente, sección o grupo, cantidad de estudiantes, lecciones semanales de la asignatura.

## Catálogos guardados

- Ciclos y niveles: I y II Ciclos con 1.° a 6.° año; III Ciclo con 7.° a 9.° año; Educación Diversificada con 10.° y 11.° año.
- Modalidad: Presencial, Virtual, Híbrida.
- Asignaturas disponibles para elegir: Matemática, Español, Ciencias y Estudios Sociales.
- Curso lectivo de los escenarios semilla: 2026. Otro año se puede guardar, y las sugerencias usan el escenario de respaldo (US-16).

## Datos de cuenta que se rellenan solos

| Cuenta | Centro | Dirección regional |
| --- | --- | --- |
| Juanita Pérez | Escuela República de Arabia Saudita | San José |
| Carlos Mora | Escuela José Figueres Ferrer | Cartago |
| María Solís | Liceo Experimental de San Pedro | San José |

## Caso de referencia

Si Juanita crea otro planeamiento con I y II Ciclos, 4.° año, Matemática, Presencial, 2026, marzo, grupo 4.° A, 28 estudiantes y 5 lecciones de 40 minutos, el escenario asociado es `mat-4-marzo-2026` y el paso 1 muestra el extracto de fracciones descrito en US-07.

## Enhanced

**Funcionalidad.** La ruta `/plans/new` muestra el paso 0. Al entrar, rellena `teacherName`, `schoolName` y `regionalDirectorate` desde `GET /api/auth/me`. El resto de `PlanConfiguration` empieza vacío. Los chips reflejan solo los campos ya elegidos.

`POST /api/plans` exige `cycle`, `gradeLevel`, `subject`, `modality`, `schoolYear`, `month`, `schoolName`, `regionalDirectorate`, `teacherName`, `section`, `studentCount` y `weeklyLessons`. Valores de catálogo: `cycle` `I_II | III | DIVERSIFIED`; grados 1–6, 7–9 y 10–11 según el ciclo; `subject` `MATH | SPANISH | SCIENCE | SOCIAL_STUDIES`; `modality` `IN_PERSON | VIRTUAL | HYBRID`; `month` 1–12. `studentCount` y `weeklyLessons` son enteros mayores que cero. Si el grado no pertenece al ciclo, `400` con «Seleccione un nivel del ciclo elegido.» **Iniciar planeamiento con IA** permanece deshabilitado hasta que el formulario es válido.

La respuesta `201` es un `PlanDetail` con `currentStep = 1`, `highestVisitedStep = 1`, `status = DRAFT`, `scenarioId` resuelto y los `PlanBlock` de la variante 1 del paso 1. La interfaz abre `/plans/:id/steps/1`.

Volver a Configuración y cambiar `schoolYear`, `subject`, `gradeLevel` o `month` hace `PATCH /api/plans/:planId`. El servicio vuelve a elegir escenario: los bloques `SUGGESTED` pasan a la variante 1 nueva; `ACCEPTED` y `EDITED` no cambian. Modalidad, centro y grupo no cambian el escenario.

**Módulos.** `frontend/src/pages/PlanConfigPage.tsx`, `planService.create` y `planService.update`. Backend: `backend/src/application/createPlan.ts`, selector de escenario en dominio, `planController.ts`.

**Definición de terminado.** Jest del caso Juanita → `mat-4-marzo-2026`, de Estudios Sociales → respaldo con `usedFallback = true`, y de un grado fuera de ciclo. Prueba de componente del botón deshabilitado. Actualizar `docs/api-spec.yml` si se agrega un campo.

**No funcional.** La selección de escenario es una consulta a `SuggestionVariant`, sin modelo de lenguaje. El encabezado usa el snapshot guardado, no el perfil, después de crear.
