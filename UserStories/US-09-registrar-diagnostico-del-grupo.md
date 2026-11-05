# US-09 — Registrar el diagnóstico del grupo

## Original

**Rol:** docente

**Historia**  
Como docente quiero registrar cómo llega mi grupo para que las sugerencias de mediación y de evaluación usen ese contexto ya guardado.

## Contexto

Paso 3 de 8. Título: **Conozca a su grupo**. Apoyo: «Complete el perfil del grupo. Después puede adaptar la mediación y las evaluaciones.» En este demo el ajuste consiste en mostrar textos ya asociados a ese escenario, no en producir un diagnóstico nuevo.

## Criterios de aceptación

1. El formulario incluye conocimientos previos, áreas de dificultad, recursos del aula, ritmo del grupo, apoyos requeridos y observaciones de la persona docente.
2. Esos seis campos son obligatorios para continuar. Si uno queda vacío, **Continuar** no avanza y señala el campo.
3. Los apoyos se redactan como apoyo general de aula. La pantalla no tiene una sección de adecuaciones curriculares formales ni pide datos sensibles del estudiantado.
4. **Generar implicaciones pedagógicas** muestra tres tarjetas guardadas: manipulativos, andamiaje y diferenciación ligera. Si ya están visibles, el botón pasa al siguiente conjunto guardado.
5. Cada tarjeta se acepta, edita y regenera según US-16. **Regenerar** en una tarjeta recorre las variantes de esa tarjeta. **Generar implicaciones pedagógicas** cambia las tres al mismo tiempo.
6. Al continuar por primera vez, el paso 4 queda visitado.

## Escenario `mat-4-marzo-2026`, variante 1

- Conocimientos previos: dominio de números naturales y nociones básicas de mitad y cuarto; dificultad con el lenguaje matemático.
- Áreas de dificultad: equivalencias, representación en la recta numérica y problemas de enunciado largo.
- Recursos: pizarra, proyector, un kit de fichas por pareja, cuadernos y acceso ocasional al aula de cómputo.
- Ritmo: heterogéneo; 6 estudiantes avanzan con soltura y 8 requieren más tiempo.
- Apoyos: refuerzo en la lectura de enunciados, trabajo en parejas tutoradas y tiempo adicional en quices para 3 estudiantes.
- Observaciones: «El grupo responde bien a material concreto y juegos cortos de 8 a 10 minutos.»
- Tarjeta 1: usar círculos y fichas en parejas antes de pasar a la simbolización.
- Tarjeta 2: modelar la frase «un medio equivale a dos cuartos» y dejarla visible en la pizarra.
- Tarjeta 3: el grupo avanzado crea un ejemplo propio; quien requiere más tiempo trabaja solo con mitades y cuartos.

## Conjunto alterno de implicaciones

El segundo conjunto guardado incluye la frase «Iniciar la recta numérica solo después de la representación concreta.» El tercero incluye «Acortar el enunciado del problema a dos oraciones antes de pedir el cálculo.»

## Otros escenarios

`esp-2-abril-2026` guarda un perfil de 2.° B sobre lectura de cuentos y tres implicaciones de lectura en voz alta.  
`cie-7-febrero-2026` guarda un perfil de 7.° C sobre la célula y tres implicaciones de observación concreta.  
La frase que identifica el primer apoyo de Ciencias es «Observar células en láminas o imágenes antes de copiar el esquema.»

## Enhanced

**Funcionalidad.** El paso 3 edita seis bloques obligatorios: `prior-knowledge`, `difficulties`, `resources`, `pace`, `supports` y `teacher-notes`. **Continuar** responde `422` e indica el campo vacío. El formulario no tiene sección de adecuaciones formales ni campos de identificación del estudiantado.

**Generar implicaciones pedagógicas** llama `POST /api/plans/:planId/actions/generate-implications` y sustituye a la vez `implication-manipulatives`, `implication-scaffolding` e `implication-differentiation` por el siguiente conjunto, en estado `SUGGESTED`. **Regenerar** de una tarjeta solo cicla esa clave. Los tres conjuntos del escenario de matemáticas incluyen las frases de la historia original.

**Módulos.** `frontend/src/pages/steps/GroupStepPage.tsx`. Backend: `runStoredAction.ts` y la semilla de los tres conjuntos por escenario.

**Definición de terminado.** Jest: un campo vacío bloquea el paso 3; la acción cambia las tres tarjetas juntas; regenerar una no cambia las otras dos. Prueba de componente de que no existe un apartado de adecuaciones. La primera visita exitosa deja `highestVisitedStep` en 4.

**No funcional.** Los apoyos son texto libre de aula. No se guardan nombres ni diagnósticos de estudiantes.
