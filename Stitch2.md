Diseña una aplicación web de escritorio (desktop-first, 1440px de ancho, NO móvil, NO responsive móvil) llamada "EduAcompaña". Es un producto serio e institucional para docentes de primaria y secundaria en Costa Rica (MEP). Idioma: español de Costa Rica. Sin pantalla de login.

OBJETIVO DEL PRODUCTO
Guiar a la persona docente en un flujo secuencial (wizard) para construir su planeamiento didáctico con ayuda de IA, partiendo de los documentos reales que ya usa en el centro educativo. La IA sugiere contenido en tarjetas editables dentro de cada paso; el docente puede aceptar, editar o regenerar. Al final consolida un PDF con formato de plantilla oficial MEP (I y II Ciclos), alineado al planeamiento, a la rúbrica de trabajo cotidiano, a los anexos/folleto del estudiantado y a la calendarización del Comité de Evaluación.

DOCUMENTOS REALES DEL DOCENTE QUE EL PRODUCTO DEBE REFLEJAR
El diseño y el contenido de ejemplo DEBEN sentirse tomados de estos artefactos institucionales (no inventar otra lógica pedagógica):

1) Planeamiento didáctico 2026 (Primero y Segundo Ciclos) — Ciencias, Sexto, periodicidad mensual Febrero–marzo
   - Encabezado administrativo MEP: Dirección Regional, centro, docente, asignatura, nivel, curso lectivo, periodicidad, competencias generales.
   - Cuerpo en tres columnas: Aprendizajes esperados | Estrategias de mediación | Indicadores.
   - Las estrategias de mediación se organizan con la secuencia didáctica real: FOCALIZACIÓN → EXPLORACIÓN → CONTRASTACIÓN → APLICACIÓN.
   - Incluye reflexiones docentes (“¿Qué funcionó? / ¿Qué no funcionó? / ¿Qué puedo mejorar?”) y observaciones.
   - Temas del periodo: Sistema nervioso y cuidado de la salud; medidas preventivas y drogas; Sistema endocrino y su relación con el nervioso.
   - Hay notas de adecuación (“Se mantiene”, apoyo visual, acompañamiento) sin convertir el producto en un expediente SEN.

2) Rúbrica para evaluar trabajo cotidiano — Ciencias, febrero y marzo 2026
   - Instrumento con indicadores de aprendizaje y niveles Inicial (1) / Intermedio (2) / Avanzado (3).
   - Matriz por estudiante × indicador + espacio de descripción del desempeño.
   - El producto debe ayudar a alinear evidencias y evaluación formativa con esta rúbrica (no solo con pruebas escritas).

3) Folleto Anexos, Ciencias 2026 (6.°, febrero–marzo)
   - Material del estudiantado: textos cortos, ejercicios de relacionar/completar/V-F, dibujar y señalar, hábitos de cuidado, enfermedades del sistema endocrino.
   - En mediación y sesiones debe aparecer como “Anexo / Folleto” usable en clase (pegar en cuaderno, completar, juegos, maquetas).

4) Circular del Comité de Evaluación — Calendarización de II periodo 2026 (Escuela Timoleón Morera Soto)
   - Reglas: no coincidir envío de tareas con aplicación de pruebas; máximo 2 evaluaciones al día; coordinar cambios con Comité y docente guía; sexto tiene cronograma distinto por pruebas estandarizadas.
   - Fechas tipo: tareas cortas con tabla de evaluación; entrega de temas; aplicación de pruebas de materias básicas (Ciencias, Español, Sociales, Matemáticas); pruebas de complementarias; pruebas estandarizadas de sexto; ampliaciones; informes al hogar.
   - El calendario del wizard debe mostrar estas restricciones como hechos del centro, no como “feriados genéricos”.

CASO DE EJEMPLO (usar estos datos en TODAS las pantallas, ya llenas, realistas y coherentes con los documentos)
- Docente: Andrea Brenes Ch
- Centro educativo: Escuela Timoleón Morera Soto
- Dirección Regional de Educación: Alajuela (Circuito 08)
- Nivel: 6.° año, I y II Ciclos (Primaria)
- Asignatura: Ciencias
- Modalidad: Presencial
- Curso lectivo: 2026
- Periodicidad del planeamiento: Mensual — Febrero–marzo
- Competencia general marcada: Ciudadanía responsable y solidaria
- Grupo: 6.°, ~28–30 estudiantes (mostrar nombres de ejemplo solo en la rúbrica de trabajo cotidiano, no en el diagnóstico)
- Temas del mes: Sistema nervioso (componentes y funciones); medidas preventivas / drogas; introducción al sistema endocrino y equilibrio con el nervioso
- Evidencia/instrumento cotidiano: rúbrica Inicial–Intermedio–Avanzado del trabajo cotidiano
- Material de apoyo: Folleto Anexos Ciencias 6.° 2026
- Restricción institucional: Circular del Comité de Evaluación (calendarización de pruebas y tareas; para sexto, atención a pruebas estandarizadas en el II periodo)

ESTILO VISUAL
- Serio, limpio, institucional, profesional. Sin look infantil, sin emojis en la UI del producto (sí pueden aparecer en capturas del folleto si se muestra como documento adjunto), sin purple gradients, sin dark mode.
- Paleta libre pero sobria: blancos/grises claros, un azul petróleo o verde bosque como color primario, acento ámbar/dorado muy contenido para IA y CTAs.
- Tipografía expresiva pero legible (no Inter/Roboto/Arial): sans moderna para UI + serif discreta solo para el wordmark “EduAcompaña”.
- Fondo con sutil textura o gradiente muy suave.
- Mucho espacio, jerarquía clara, formularios bien organizados.
- La IA se ve como “asistente experto”: chips “Sugerido por IA”, botones “Regenerar”, “Aceptar sugerencia”, “Editar”.
- Wizard con barra de progreso horizontal numerada fija bajo el header.
- Header: logo/wordmark “EduAcompaña” a la izquierda; a la derecha contexto (Ciencias · 6.° · Escuela Timoleón Morera Soto · Andrea Brenes Ch).
- Footer: “Borrador guardado automáticamente”.
- NO cards decorativas innecesarias. Contenedores solo para editar/aceptar sugerencias, agrupar formularios o previsualizar documentos.
- Microinteracciones: hover en botones, progreso del wizard, aparición suave de sugerencias IA.

ESTRUCTURA GENERAL DEL WIZARD
Pasos visibles en la barra:
0 Configuración → 1 Programa, documentos y calendario → 2 Unidades y evaluación → 3 Grupo → 4 Mediación → 5 Evidencias y rúbrica cotidiana → 6 Sesiones → 7 Formato MEP / PDF → 8 Ajuste post-clase

Cada pantalla (excepto la previa si aplica) incluye:
- Título del paso + 1 frase de apoyo
- Contenido principal con datos de ejemplo ya cargados
- Sugerencias IA en tarjetas editables DENTRO del paso (no chat lateral)
- Botones inferiores: “Atrás” (secundario) y “Continuar” (primario)
- Indicador “Paso X de 8”

GENERAR SOLO ESTAS PANTALLAS COMPLETAS (desktop). No crear pantallas de adorno, settings, perfil ni marketing.

============================================================
PANTALLA 1 — Configuración del planeamiento (previa)
============================================================
Título: “Nuevo planeamiento”
Subtítulo: “Defina el contexto curricular. Con esos datos y los documentos del centro se prepara una propuesta que puede modificar.”

Formulario en dos columnas:
Izquierda — Contexto curricular:
- Ciclo: I y II Ciclos
- Nivel: 6.° año
- Asignatura: Ciencias
- Modalidad: Presencial
- Curso lectivo: 2026
- Periodicidad: Mensual → Meses: Febrero–marzo

Derecha — Datos del centro/grupo:
- Centro educativo: Escuela Timoleón Morera Soto
- Dirección Regional de Educación: Alajuela
- Nombre docente: Andrea Brenes Ch
- Sección/grupo: 6.°
- Cantidad de estudiantes: 28
- Lecciones semanales de Ciencias: 5 (40 min c/u)

Bloque “Documentos de partida” (solo lectura / chips):
- Planeamiento didáctico MEP (plantilla I y II Ciclos)
- Rúbrica de trabajo cotidiano Ciencias feb–mar 2026
- Folleto Anexos Ciencias 6.° 2026
- Circular Comité de Evaluación — II periodo 2026

Resumen listo para iniciar con chips.
CTA primario: “Iniciar planeamiento con IA”.
Nota: sin barra completa de 8 pasos, o paso 0 activo.

============================================================
PANTALLA 2 — Paso 1: Programa, documentos del centro y tiempo
============================================================
Título: “Programa, documentos del centro y tiempo disponible”
Apoyo: “Revise el extracto curricular y las restricciones reales del Comité de Evaluación y del calendario escolar.”

Layout 3 zonas:

1) Programa y planeamiento base (izquierda ~40%):
   - Card “Extracto Ciencias 6.° — Febrero–marzo”:
     - Tema 1: Sistema nervioso (componentes y funciones) y cuidado de la salud
     - Tema 2: Medidas preventivas en hogar, escuela y comunidad; consecuencias del consumo de drogas
     - Tema 3: Sistema endocrino, relación con el nervioso y equilibrio de la salud
     - Competencia general: Ciudadanía responsable y solidaria
   - Botón: “Reanalizar programa”
   - Nota: “Estructura de mediación del planeamiento MEP: Focalización · Exploración · Contrastación · Aplicación”

2) Tiempo y carga del mes (centro):
   - Lecciones planificables en febrero–marzo: número creíble (ej. 16–18)
   - Lecciones afectadas por actividades institucionales / congresos: 2
   - Lista editable de restricciones tomadas de la circular:
     - No enviar tareas el mismo tramo de aplicación de pruebas
     - Máximo 2 evaluaciones el mismo día
     - Sexto: cronograma distinto por pruebas estandarizadas (II periodo)
     - Reprogramaciones con aviso al Comité de Evaluación

3) Calendarización del centro (derecha o ancho completo):
   - Mini calendario febrero–marzo 2026 + vista “II periodo” con hitos de la circular (aunque el planeamiento sea feb–mar, mostrar la circular como documento vigente del centro)
   - Marcar ejemplos: envío de tareas cortas con tabla; entrega de temas; prueba de Ciencias; pruebas estandarizadas de sexto (octubre en circular); informes al hogar
   - Leyenda: Lectivo / Suspendido / Tarea corta / Prueba / Estandarizada
   - Sugerencia IA: redistribuir maqueta del sistema nervioso lejos de semanas con alta carga evaluativa

Tarjetas IA editables:
- “Aprendizajes esperados priorizados del bimestre”
- “Contenidos que caben con el Folleto Anexos”
- “Riesgos de calendarización del Comité”

CTA: Continuar a Unidades y evaluación.

============================================================
PANTALLA 3 — Paso 2: Unidades, secuencia y evaluación del periodo
============================================================
Título: “Organice unidades y defina la evaluación”
Apoyo: “Esta distribución es una propuesta. Puede modificarla según las necesidades de su grupo y alinearla con la rúbrica del centro.”

Arriba: timeline de unidades febrero–marzo:
- Unidad A: Componentes y funciones del sistema nervioso
- Unidad B: Cuidado del sistema nervioso, prevención y drogas
- Unidad C: Sistema endocrino y equilibrio nervioso–endocrino
Cada bloque editable.

Abajo — dos bloques:

A) Metodología de evaluación del periodo (tabla editable, total 100%):
- Trabajo cotidiano (rúbrica Inicial–Intermedio–Avanzado) — ej. 40%
- Tareas cortas con tabla de evaluación (según circular) — ej. 15%
- Prueba escrita — ej. 30%
- Producto / maqueta / afiche preventivo — ej. 15%
Validación visual “Distribución completa”.
Botones: “Agregar rubro”, “Redistribuir con IA”.

B) Vista previa de la rúbrica de trabajo cotidiano (resumen, no la matriz completa aún):
Indicadores 1–6 con columnas Inicial / Intermedio / Avanzado, usando texto realista:
1. Identifica componentes del sistema nervioso
2. Describe y aplica medidas preventivas
3. Valora consecuencias del consumo de drogas
4. Identifica glándulas del sistema endocrino
5. Comprende relación nervioso–endocrino
6. Valora equilibrio y cuidado de la salud

Sugerencia IA: justificación breve del orden didáctico y del peso del trabajo cotidiano.

============================================================
PANTALLA 4 — Paso 3: Diagnóstico del grupo
============================================================
Título: “Conozca a su grupo”
Apoyo: “Complete el perfil del grupo. Después puede adaptar la mediación, los anexos y las evidencias. Sin datos sensibles individuales en este paso.”

Campos ya llenos (generales):
- Conocimientos previos: nociones básicas del cuerpo humano; dificultad para relacionar estructuras con funciones.
- Áreas de dificultad: vocabulario científico; abstracción de impulsos/hormonas; lectura de enunciados largos.
- Recursos: pizarra, televisor/proyector, plastilina, cartulinas, fichas, cuaderno, acceso ocasional a celular/tablet para juegos en línea, Folleto Anexos impreso.
- Ritmo: heterogéneo; varios estudiantes requieren apoyo visual y acompañamiento (“Se mantiene”).
- Apoyos generales (NO adecuaciones formales SEN): material visual, tiempos prudenciales, trabajo en parejas, instrucciones orales + escritas.
- Observación docente: “El grupo responde bien a juegos de roles, maquetas y actividades de patio/corredor cuando el espacio lo permite.”

Botón IA: “Generar implicaciones pedagógicas” → 3 tarjetas (manipulativos/maqueta, andamiaje con anexos, diferenciación ligera).

============================================================
PANTALLA 5 — Paso 4: Mediación dentro y fuera del aula
============================================================
Título: “Qué haremos para aprender”
Apoyo: “Organice Focalización, Exploración, Contrastación y Aplicación. Incluya el Folleto Anexos y el trabajo extraclase.”

Unidad activa: Sistema nervioso — componentes y funciones.

A) Dentro del aula — secuencia MEP (bloques o tabla por momento):
Columnas sugeridas: Momento | Actividad | Hace la persona docente | Hace el estudiantado | Tiempo | Materiales / Anexo

Filas ejemplo tomadas del planeamiento real:
- FOCALIZACIÓN: “El Mensajero Humano” (mensajes de peligro/supervivencia de un extremo a otro del aula/patio) | 10–15 min | papeles, marcadores, cinta
- EXPLORACIÓN: reacción al estímulo luminoso / cuadro comparativo del anexo | subgrupos de 4 | foco, cuaderno, Anexo – cuadro comparativo
- CONTRASTACIÓN: video + maqueta de cerebro (lóbulos) y neurona en cartulina 50×30 | plastilina, hojas de color, palillos, cartulina | exposición de 5 min por pareja
- APLICACIÓN: 4 subgrupos con funciones del sistema nervioso + juego en línea “Qué es - Sistema nervioso” | 10 min + juego

Chip visible: “Adecuación / Se mantiene: entrega de etiquetas ya recortadas y apoyo visual”.

B) Fuera del aula:
- Completar Ejercicio 1–3 del Folleto Anexos (relacionar componentes–funciones; completar; V/F)
- Buscar 1 ejemplo cotidiano de reacción del sistema nervioso en casa (breve)

Acciones IA: “Regenerar mediación”, “Ajustar a 40 minutos”, “Simplificar materiales”, “Usar solo Folleto Anexos”.

============================================================
PANTALLA 6 — Paso 5: Evidencias de aprendizaje y rúbrica cotidiana
============================================================
Título: “Evidencias de aprendizaje”
Apoyo: “Combine chequeos en clase con la rúbrica de trabajo cotidiano y las evaluaciones calendarizadas del Comité.”

Tres zonas:

1) Durante la clase / formativo:
- Observación de la maqueta (indicadores: identifica / reconoce componentes)
- Preguntas de mesa redonda (funciones y salud)
- Exit ticket: 2 ítems del Folleto Anexos
- Lista breve de desempeño alineada a Inicial–Intermedio–Avanzado

2) Trabajo cotidiano (rúbrica del centro):
- Vista compacta de matriz: estudiantes de ejemplo (5–6 filas) × Indicadores 1–3 del nervioso, con celdas 1/2/3
- Columna “Descripción del desempeño”
- CTA: “Abrir rúbrica completa” (panel o estado expandido)

3) Calendarizadas (según circular / periodo):
- Tarea corta con tabla de evaluación (ventana de envío)
- Prueba de Ciencias (fecha tipo del cronograma del centro)
- Producto: afiche/cómic/campaña preventiva o ficha médica de enfermedad endocrina
- Nota: “Sexto: cuidar choque con pruebas estandarizadas y no saturar el mismo día”

Cada evidencia: qué mide, cuándo, instrumento, vínculo al aprendizaje esperado / indicador de rúbrica.
CTA IA: “Equilibrar carga evaluativa del mes”.

============================================================
PANTALLA 7 — Paso 6: Sesiones concretas de la semana
============================================================
Título: “Prepare la semana y cada sesión”
Apoyo: “Detalle inicio, desarrollo y cierre. Cada sesión puede citar el anexo o la maqueta.”

Selector: Semana activa del bloque Sistema nervioso.
5 sesiones L–V; 2 expandidas, resto colapsadas.

Estructura expandida:
- Día, fecha, aprendizaje esperado, 40 min
- INICIO / DESARROLLO / CIERRE (minutos)
- Materiales + Folleto Anexos (ejercicio N)
- Evidencia formativa del día (rúbrica cotidiana / observación)
- Extraclase si aplica
- Nota plan B si hay actividad institucional

Ejemplo Lunes expandido: Focalización “Mensajero Humano” + cierre verbal.
Ejemplo Miércoles expandido: Contrastación maqueta cerebro/neurona + exposición corta.
Incluir: “Jueves con posible afectación — plan B de 25 min con ejercicios 1–2 del Folleto”.

Botones: “Generar las 5 sesiones con IA”, “Duplicar estructura”, “Exportar semana”.

============================================================
PANTALLA 8 — Paso 7: Formato formal MEP + PDF
============================================================
Título: “Planeamiento en formato institucional”
Apoyo: “Se consolida la plantilla MEP de I y II Ciclos, lista para entrega a dirección.”

Vista documento / print preview (no formulario suelto):

Encabezado:
- Dirección Regional de Educación: Alajuela
- Centro educativo: Escuela Timoleón Morera Soto
- Nombre de la persona docente: Andrea Brenes Ch
- Asignatura: Ciencias
- Nivel: Sexto / 6.° año
- Curso lectivo: 2026
- Periodicidad: Mensual — Febrero–marzo
- Competencia general: Ciudadanía responsable y solidaria (marcada)

Cuerpo tabla 3 columnas:
1) Aprendizajes esperados
2) Estrategias de mediación (texto que mencione Focalización / Exploración / Contrastación / Aplicación, maqueta, anexos, videos)
3) Indicadores (versiones graduales: determina / identifica / reconoce — como en el planeamiento real)

Al menos 2 filas completas:
- Fila 1: componentes y funciones del sistema nervioso + maqueta
- Fila 2: medidas preventivas / afiche o campaña + indicadores orales/gráficos

Debajo:
- Instrumentos de evaluación: rúbrica de trabajo cotidiano; tarea corta con tabla; prueba; producto preventivo
- Observaciones / contextualización del 6.°
- Espacio “Reflexiones de la persona docente” (¿Qué funcionó? ¿Qué no? ¿Qué mejorar?)

Acciones:
- “Editar campos”
- “Vista previa PDF”
- CTA: “Descargar PDF”
Estado: “Listo para entrega a dirección”

============================================================
PANTALLA 9 — Paso 8: Después de dar la clase — ajuste del plan
============================================================
Título: “Ajuste lo planeado según lo ocurrido”
Apoyo: “Registre la clase real y replanifique sin romper la circular ni la rúbrica.”

Izquierda — Planeado vs ejecutado (sesión del lunes de maqueta/activación):
- Planeado: Focalización + inicio de Exploración
- Ejecutado: solo Focalización (faltaron ~15 min por dinámica de entrada)
- Aprendizajes logrados / pendientes
- Evidencia: rúbrica cotidiana incompleta en varios estudiantes; exit ticket parcial

Derecha — Ajuste inteligente (tarjetas IA):
1) Reprogramar Exploración (cuadro comparativo del anexo) al martes
2) Acortar Contrastación del miércoles y dejar exposición en 3 min
3) Mover 2 ítems del Folleto a práctica en clase
- Bitácora docente
- Mini timeline semanal actualizada
- Toggle: “Notificar cambios en evaluaciones calendarizadas al Comité” (off; solo guarda la intención)

CTA primario: “Aplicar ajustes al planeamiento”
CTA secundario: “Volver al formato MEP actualizado”

============================================================
REGLAS DE GENERACIÓN PARA STITCH
- Generar pantallas web desktop completas, alta fidelidad, con contenido real (no lorem ipsum).
- Mantener consistencia visual y de componentes entre pantallas (mismo header, tipografía, botones, wizard).
- Enfocado 100% en el flujo de planeamiento; cero pantallas decorativas.
- El contenido DEBE verse anclado a los cuatro documentos del docente (planeamiento MEP, rúbrica cotidiana, folleto anexos, circular de evaluación).
- Mostrar estados útiles reales: sugerencias IA, validación 100% de rúbrica/porcentajes, preview MEP con Focalización–Aplicación, plan B, hitos del Comité de Evaluación.
- Textos en español costarricense neutro-profesional (usted / persona docente).
- Priorizar claridad pedagógica y utilidad docente sobre ornamentación.
- Entregar las 9 pantallas en orden.
