Diseña una aplicación web de escritorio (desktop-first, 1440px de ancho, NO móvil, NO responsive móvil) llamada "EduAcompaña". Es un producto serio e institucional para docentes de primaria y secundaria en Costa Rica (MEP). Idioma: español de Costa Rica. Sin pantalla de login.

OBJETIVO DEL PRODUCTO
Guiar a la persona docente en un flujo secuencial (wizard) para construir su planeamiento didáctico con ayuda de IA. La IA sugiere todo el contenido en tarjetas editables dentro de cada paso; el docente puede aceptar, editar o regenerar. Al final genera un PDF con formato tipo plantilla oficial MEP.

CASO DE EJEMPLO (usar estos datos en TODAS las pantallas, ya llenas, realistas y coherentes)
- Docente: Juanita Pérez
- Centro educativo: Escuela República de Arabia Saudita
- Dirección Regional: San José (ejemplo)
- Nivel: 4.° año, I y II Ciclos (Primaria)
- Asignatura: Matemática
- Modalidad: Presencial
- Curso lectivo: 2026
- Periodicidad del planeamiento: Mensual (marzo 2026)
- Periodo lectivo: Primer período (23 feb – 3 jul 2026)
- Grupo: 4.° A, 28 estudiantes

ESTILO VISUAL
- Serio, limpio, institucional, profesional. Sin look infantil, sin emojis, sin purple gradients, sin dark mode.
- Paleta libre pero sobria: blancos/grises claros, un azul petróleo o verde bosque como color primario, acento ámbar/dorado muy contenido para IA y CTAs.
- Tipografía expresiva pero legible (no Inter/Roboto/Arial): por ejemplo una sans moderna para UI + una serif discreta solo para el nombre del producto en el header.
- Fondo con sutil textura o gradiente muy suave (no plano muerto).
- Mucho espacio, jerarquía clara, formularios bien organizados.
- La IA se ve como “asistente experto”: chips “Sugerido por IA”, botones “Regenerar”, “Aceptar sugerencia”, “Editar”.
- Wizard con barra de progreso horizontal numerada (pasos) fija arriba bajo el header.
- Header web: logo/wordmark “EduAcompaña” a la izquierda; a la derecha contexto del planeamiento (Matemática · 4.° · Escuela República de Arabia Saudita · Juanita Pérez).
- Footer simple con “Borrador guardado automáticamente”.
- NO cards decorativas innecesarias. Usar contenedores solo cuando ayuden a editar/aceptar sugerencias o agrupar formularios.
- Incluir microinteracciones sugeridas en notas: hover en botones, progreso del wizard, aparición suave de sugerencias IA.

ESTRUCTURA GENERAL DEL WIZARD
Pasos visibles en la barra:
0 Configuración → 1 Programa y calendario → 2 Unidades y evaluación → 3 Grupo → 4 Mediación → 5 Evidencias de aprendizaje → 6 Sesiones → 7 Formato MEP / PDF → 8 Ajuste post-clase

Cada pantalla (excepto la previa si aplica) debe incluir:
- Título del paso + 1 frase de apoyo
- Contenido principal con datos de ejemplo ya cargados
- Panel/área de sugerencias IA en tarjetas editables DENTRO del paso (no chat lateral)
- Botones inferiores: “Atrás” (secundario) y “Continuar” (primario)
- Indicador “Paso X de 8”

GENERAR SOLO ESTAS PANTALLAS COMPLETAS (desktop). No crear pantallas de adorno, settings, perfil ni marketing.

============================================================
PANTALLA 1 — Configuración del planeamiento (previa)
============================================================
Título: “Nuevo planeamiento”
Subtítulo: “Defina el contexto curricular. Con esos datos se prepara una propuesta que puede modificar.”

Formulario en dos columnas:
Izquierda:
- Ciclo: I y II Ciclos (seleccionado)
- Nivel: 4.° año
- Asignatura: Matemática
- Modalidad: Presencial / Virtual / Híbrida (Presencial seleccionado)
- Curso lectivo: 2026
- Periodicidad: Mensual → Mes: Marzo
Derecha:
- Centro educativo: Escuela República de Arabia Saudita
- Dirección Regional de Educación: San José
- Nombre docente: Juanita Pérez
- Sección/grupo: 4.° A
- Cantidad de estudiantes: 28
- Lecciones semanales de Matemática: 5 (40 min c/u)

Bloque inferior: “Resumen listo para iniciar” con chips de los datos elegidos.
CTA primario grande: “Iniciar planeamiento con IA”.
Nota visual: esta pantalla NO tiene aún la barra completa de 8 pasos, o la muestra en estado inicial (paso 0 activo).

============================================================
PANTALLA 2 — Paso 1: Programa oficial, objetivos y calendarización
============================================================
Título: “Programa, objetivos y tiempo disponible”
Apoyo: “Revise lo esencial del programa oficial y la calendarización real del mes, incluyendo feriados.”

Layout 3 zonas:
1) Programa oficial (izquierda, ~40%):
   - Card “Extracto del programa de Matemática 4.°” con:
     - Eje/tema: Números y operaciones — Fracciones
     - Aprendizajes esperados (3–4 bullets realistas)
     - Contenidos clave
     - Reglas de evaluación relevantes (evaluación formativa continua + sumativa según rúbrica del centro)
   - Botón: “Reanalizar programa”

2) Tiempo disponible (centro):
   - Total lecciones planificables en marzo: 18
   - Lecciones no lectivas / afectadas: 2
   - Lista editable de restricciones

3) Calendarización con feriados CR (derecha o abajo a lo ancho):
   - Mini calendario marzo 2026
   - Días marcados: feriados/asueto relevantes de Costa Rica (ej. feriados nacionales del calendario escolar; incluir al menos Semana Santa si cae cerca, 11 de abril Juan Santamaría si aplica al mes mostrado, y recesos institucionales de ejemplo)
   - Para marzo 2026 mostrar de forma creíble: días lectivos, fin de semana, y al menos 1–2 fechas especiales/feriados o actividades institucionales (ej. “Consejo de docentes”, “Feriado nacional”)
   - Leyenda: Lectivo / Feriado / Suspendido / Evaluación
   - Sugerencia IA: “Se recomienda redistribuir la introducción a fracciones equivalentes a la semana del 9–13 de marzo por el asueto del día X”

Tarjetas IA editables:
- “Objetivos priorizados del mes”
- “Contenidos que caben en 18 lecciones”
- “Riesgos de calendario”

CTA: Continuar a Unidades y evaluación.

============================================================
PANTALLA 3 — Paso 2: Unidades, secuencia y rúbrica de evaluación
============================================================
Título: “Organice unidades y defina la evaluación”
Apoyo: “Esta distribución es una propuesta. Puede modificarla según las necesidades de su grupo.”

Arriba: timeline horizontal de 4 semanas de marzo con unidades:
- Semana 1: Fracción como parte-todo
- Semana 2: Fracciones equivalentes
- Semana 3: Comparación y orden
- Semana 4: Resolución de problemas + consolidación
Cada bloque es una tarjeta editable (arrastrable visualmente).

Abajo: “Metodología de evaluación del periodo” (definida por la docente):
Tabla editable:
- Prueba escrita (1) — 30%
- Quices (2) — 20%
- Trabajo extraclase (2) — 15%
- Desempeño en clase / prácticas — 20%
- Proyecto corto “Fracciones en mi comunidad” — 15%
Total: 100% con validación visual en verde “Distribución completa”.
Botones: “Agregar rubro”, “Redistribuir con IA”.

Sugerencia IA: justificación breve del orden didáctico y de los pesos.

============================================================
PANTALLA 4 — Paso 3: Diagnóstico del grupo
============================================================
Título: “Conozca a su grupo”
Apoyo: “Complete el perfil del grupo. Después puede adaptar la mediación y las evaluaciones.”

Formulario + tarjetas (datos ejemplo ya llenos):
- Conocimientos previos: dominio de números naturales y nociones básicas de mitad/cuarto; dificultad con lenguaje matemático.
- Áreas de dificultad: equivalencias; representación en recta numérica; problemas de enunciado largo.
- Recursos del grupo/aula: pizarra, proyector, fichas manipulativas limitadas (1 kit por pareja), cuadernos, acceso ocasional a aula de cómputo.
- Ritmo general: heterogéneo; 6 estudiantes avanzados, 8 requieren más tiempo.
- Apoyos requeridos (campos generales, NO adecuaciones formales SEN): refuerzo en lectura de enunciados; trabajo en parejas tutoradas; tiempo adicional en quices para 3 estudiantes.
- Observaciones de Juanita: “El grupo responde bien a material concreto y juegos cortos de 8–10 minutos.”

Botón IA: “Generar implicaciones pedagógicas”. Muestra 3 tarjetas editables de recomendaciones (manipulativos, andamiaje, diferenciación ligera).

============================================================
PANTALLA 5 — Paso 4: Mediación dentro y fuera del aula
============================================================
Título: “Qué haremos para aprender”
Apoyo: “Defina el rol de la persona docente, el rol del estudiantado, los tiempos y los materiales. También el trabajo extraclase.”

Para la Unidad/Semana activa (Semana 2 — Fracciones equivalentes), mostrar:

A) Dentro del aula (tabla o bloques por momento):
Columnas: Actividad | Hace la persona docente | Hace el estudiantado | Tiempo | Materiales
Filas ejemplo:
- Activación con pizza/fichas | modela | manipulan y verbalizan | 10 min | círculos fraccionarios
- Construcción de equivalentes | guía preguntas | representan 1/2 = 2/4 = 3/6 | 25 min | fichas, mini pizarras
- Práctica guiada | monitorea | resuelven en duplas | 20 min | hoja de práctica
- Cierre | sintetiza | comparten regla en una frase | 5 min | pizarra

B) Fuera del aula:
- Trabajo extraclase 1: “Buscar 3 ejemplos de fracciones equivalentes en empaques de casa” (15–20 min)
- Práctica breve en cuaderno (6 ítems)
Cada ítem con propósito de aprendizaje visible.

Acciones IA por sección: “Regenerar mediación”, “Ajustar a 40 minutos”, “Simplificar materiales”.

============================================================
PANTALLA 6 — Paso 5: Cómo sabremos si aprendieron
============================================================
Título: “Evidencias de aprendizaje”
Apoyo: “Combine chequeos durante la clase con las evaluaciones ya calendarizadas.”

Dos columnas:

Izquierda — Durante la clase / por bloque (formativo):
- Preguntas verbales de chequeo (3 ejemplos)
- Ejercicio salida rápida (exit ticket) de 2 ítems
- Observación de manipulación concreta (lista breve de indicadores)
- Conversación matemática en duplas (rúbrica corta 3 criterios)

Derecha — Calendarizadas (sumativo alineado al paso 2):
- Quiz 1: viernes semana 2
- Prueba escrita: semana 4
- Proyecto corto: entrega semana 4
- Laboratorio/práctica evaluada: no aplica / práctica en clase con puntaje de desempeño

Cada evidencia es tarjeta editable con: qué mide, cuándo, instrumento, vínculo al aprendizaje esperado.
CTA IA: “Equilibrar carga evaluativa del mes”.

============================================================
PANTALLA 7 — Paso 6: Sesiones concretas de la semana
============================================================
Título: “Prepare la semana y cada sesión”
Apoyo: “Detalle qué toca esta semana. Toda sesión tiene inicio, desarrollo y cierre.”

Selector de semana: Semana 2 (9–13 marzo) activa.
Muestra 5 sesiones (Lunes a Viernes), cada una expandible. Mostrar 2 expandidas y el resto colapsadas.

Estructura de cada sesión expandida:
- Encabezado: Día, fecha, aprendizaje esperado del día, duración 40 min
- INICIO (minutos)
- DESARROLLO (minutos)
- CIERRE (minutos)
- Materiales
- Evidencia formativa del día
- Tarea/extraclase si aplica

Ejemplo Lunes (expandido): introducción a equivalentes con material concreto.
Ejemplo Miércoles (expandido): práctica y lenguaje matemático.
Incluir nota: “Jueves con posible afectación por actividad institucional — plan B de 25 min incluido”.

Botones: “Generar las 5 sesiones con IA”, “Duplicar estructura”, “Exportar semana” (secundario).

============================================================
PANTALLA 8 — Paso 7: Formato formal MEP + PDF
============================================================
Título: “Planeamiento en formato institucional”
Apoyo: “Todas las decisiones anteriores se consolidan en la plantilla tipo MEP, lista para descargar.”

Mostrar una vista de documento formal (tipo plantilla MEP 2026 para I y II Ciclos), con aspecto de página/print preview:

Encabezado de plantilla:
- Dirección Regional de Educación: San José
- Centro educativo: Escuela República de Arabia Saudita
- Nombre de la persona docente: Juanita Pérez
- Asignatura: Matemática
- Nivel: 4.° año
- Curso lectivo: 2026
- Periodicidad: Mensual — Marzo
- Competencias generales marcadas (ej. Ciudadanía responsable y solidaria; Competencias para la vida)

Cuerpo en tabla de 3 columnas al estilo MEP:
1) Aprendizajes esperados
2) Estrategias de mediación
3) Indicadores

Incluir al menos 2 filas completas con texto realista ya consolidado desde los pasos previos.
Debajo: Instrumentos de evaluación (lista) + Observaciones (espacio con nota de contextualización del 4.° A).

Barra de acciones superior del documento:
- “Editar campos”
- “Vista previa PDF”
- CTA primario: “Descargar PDF”
Estado: “Listo para entrega a dirección”

UI debe verse inequívocamente como consolidación formal, no como otro formulario suelto.

============================================================
PANTALLA 9 — Paso 8: Después de dar la clase — ajuste del plan
============================================================
Título: “Ajuste lo planeado según lo ocurrido”
Apoyo: “Puede registrar lo ocurrido y redistribuir las actividades para adaptarlas al tiempo disponible.”

Layout:
Izquierda — “Lo planeado vs lo ejecutado” para la sesión del lunes 9 de marzo:
- Planeado: completar activación + construcción de equivalentes
- Ejecutado: solo activación y mitad de la construcción (faltaron 15 min por dinámica de entrada)
- Aprendizajes logrados / pendientes (checklist)
- Evidencia recolectada: exit ticket incompleto en 6 estudiantes

Derecha — Ajuste inteligente:
- Tarjetas IA editables:
  1) “Reprogramar cierre de equivalentes al martes (inicio)”
  2) “Acortar práctica guiada del martes a 12 min”
  3) “Mover 2 ítems del extraclase a práctica en clase”
- Campo de bitácora docente: texto ejemplo de Juanita
- Impacto en calendario semanal (mini timeline actualizada)
- Toggle: “Notificar cambios en evaluaciones calendarizadas” (off)

CTA primario: “Aplicar ajustes al planeamiento”
CTA secundario: “Volver al formato MEP actualizado”

============================================================
REGLAS DE GENERACIÓN PARA STITCH
- Generar pantallas web desktop completas, alta fidelidad, con contenido real (no lorem ipsum).
- Mantener consistencia visual y de componentes entre pantallas (mismo header, tipografía, botones, wizard).
- Enfocado 100% en el flujo de planeamiento; cero pantallas decorativas.
- Mostrar estados útiles reales: sugerencias IA, validación 100% de rúbrica, preview MEP, plan B por feriado/actividad.
- Textos en español costarricense neutro-profesional (usted/persona docente).
- Priorizar claridad pedagógica y utilidad docente sobre ornamentación.
- Entregar las 9 pantallas en orden.
