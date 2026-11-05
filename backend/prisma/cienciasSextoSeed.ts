export const CIENCIAS_SEXTO_SCENARIO_ID = "cie-6-febrero-2026";

export const cienciasSextoTeacher = {
  fullName: "Andrea Brenes Ch",
  email: "andrea.brenes@demo.mep.cr",
  schoolName: "Escuela Timoleón Morera Soto",
  regionalDirectorate: "Dirección Regional Alajuela",
};

export const cienciasSextoPlanId = "44444444-4444-4444-8444-444444444444";

const programExtract = [
  "Planeamiento didáctico 2026. Primero y Segundo Ciclos. Dirección Regional de Educación de Alajuela. Centro educativo: Timoleón Morera Soto. Persona docente: Andrea Brenes Ch. Asignatura: Ciencias. Nivel: sexto. Curso lectivo 2026. Periodicidad mensual: febrero-marzo. Competencia general: Ciudadanía responsable y solidaria. Aprendizajes esperados: identificar los principales componentes del sistema nervioso y sus funciones, como parte del cuidado de la salud; identificar tres componentes y algunas funciones cuando se mantiene la adecuación; describir medidas preventivas en el hogar, el centro educativo y la comunidad; reconocer las glándulas del sistema endocrino; describir la relación entre los sistemas nervioso y endocrino; valorar el equilibrio del cuerpo para la salud física y mental.",
  "El mismo planeamiento prioriza primero el sistema nervioso y deja las medidas preventivas y el sistema endocrino para las semanas siguientes.",
  "El mismo planeamiento abre con las glándulas del sistema endocrino y vuelve después al sistema nervioso y a las medidas preventivas.",
];

const calendarRestrictions = [
  "Circular DVM-PICR-DREA-SEC03-ETMS-CE-10-2026, miércoles 29 de julio de 2026. Comité de Evaluación de la Escuela Timoleón Morera Soto, dirigida al personal docente. Asunto: calendarización del II periodo 2026, del 20 de julio al 9 de diciembre. No deben coincidir las tareas con la aplicación de pruebas. Si hay que mover una prueba o una tarea, se informa al Comité de Evaluación y se coordina con el docente guía para que no haya más de 2 evaluaciones en un día. Sexto tiene un cronograma distinto por las pruebas estandarizadas. Primeras pruebas básicas, también para sexto: martes 1 de setiembre Ciencias, miércoles 2 Español, jueves 3 Sociales, viernes 4 Matemáticas. Pruebas estandarizadas de sexto: del 13 al 16 de octubre. Segundas pruebas de sexto: lunes 26 de octubre Ciencias, martes 27 Español, miércoles 28 Sociales, jueves 29 Matemáticas y viernes 30 para reprogramar. De 1.° a 5.° las segundas pruebas básicas van del 9 al 13 de noviembre.",
  "La circular pide no enviar tareas durante las pruebas y no superar dos evaluaciones en un mismo día.",
  "En sexto, las pruebas estandarizadas del 13 al 16 de octubre quedan antes de las segundas pruebas del 26 al 30 de octubre.",
];

export const cienciasSextoStepOne = {
  "program-extract": programExtract,
  "available-time": [
    JSON.stringify({ plannableLessons: "", affectedLessons: "" }),
    JSON.stringify({ plannableLessons: "", affectedLessons: "" }),
    JSON.stringify({ plannableLessons: "", affectedLessons: "" }),
  ],
  "calendar-restrictions": calendarRestrictions,
  "month-objectives": [
    "Febrero-marzo recorre el sistema nervioso, las medidas preventivas y el sistema endocrino, en ese orden del planeamiento.",
    "Priorizar los componentes del sistema nervioso y la maqueta antes de las medidas preventivas.",
    "Priorizar las glándulas y la relación con el sistema nervioso antes del afiche preventivo.",
  ],
  "month-contents": [
    "Alcanza para El Mensajero Humano, el parpadeo, la maqueta de cerebro y neurona, el afiche de medidas preventivas, el juego ¿Quién soy? de glándulas y la ficha médica. El folleto de anexos trae los ejercicios de ambos sistemas y las enfermedades: diabetes, hipotiroidismo, hipertiroidismo y problemas de crecimiento.",
    "Alcanza para la maqueta del sistema nervioso y los ejercicios 1 a 6 del folleto.",
    "Alcanza para las glándulas, la historia Los cambios de Mariana y una ficha médica.",
  ],
  "calendar-risks": [
    "El planeamiento es de febrero-marzo y la circular ordena el II periodo. Esas fechas no caen en febrero, pero sí limitan las pruebas de Ciencias de sexto: 1 de setiembre, 13 al 16 de octubre y 26 de octubre.",
    "No conviene calendarizar una tarea corta en la misma ventana de la prueba de Ciencias.",
    "Un cambio de fecha se coordina con el Comité de Evaluación y con el docente guía.",
  ],
};

export const cienciasSextoUnits = {
  weeks: [
    "Sistema nervioso: componentes y funciones",
    "Medidas preventivas y consumo de drogas",
    "Sistema endocrino y su relación con el nervioso",
    "Enfermedades del sistema endocrino y hábitos",
  ],
  rubric: [
    { name: "Componentes del sistema nervioso", count: 1, percentage: 17 },
    { name: "Medidas preventivas", count: 1, percentage: 17 },
    { name: "Consecuencias del consumo de drogas", count: 1, percentage: 17 },
    { name: "Glándulas del sistema endocrino", count: 1, percentage: 17 },
    { name: "Relación nervioso y endocrino", count: 1, percentage: 16 },
    { name: "Equilibrio y cuidado de la salud", count: 1, percentage: 16 },
  ],
  distributions: [
    [17, 17, 17, 17, 16, 16],
    [20, 16, 16, 16, 16, 16],
    [16, 16, 16, 20, 16, 16],
  ],
  justifications: [
    "La rúbrica del centro evalúa el trabajo cotidiano en tres niveles: Inicial (1), Intermedio (2) y Avanzado (3). No asigna porcentajes. Este reparto iguala los seis indicadores solo para que el total del paso sume 100.",
    "Los componentes del sistema nervioso suben a 20 % porque la maqueta es el indicador más trabajado en el planeamiento.",
    "Las glándulas suben a 20 % cuando el mes se cierra con el sistema endocrino.",
  ],
};

export const cienciasSextoGroup = {
  "prior-knowledge": [
    "La focalización mide lo que el grupo ya sabe con la actividad El Mensajero Humano: advertencias de peligro que se pasan de un extremo al otro del aula.",
    "El grupo comenta, después del parpadeo, si cerraron un ojo o ambos y qué cambia el tiempo de reacción.",
    "Antes del sistema endocrino se parte de una situación cotidiana: nervios antes de un examen, corazón rápido y dificultad para concentrarse.",
  ],
  difficulties: [
    "Se mantiene la adecuación curricular. A quien la requiere se le leen las opciones y colorea las que le resultan más fáciles de comprender y recordar.",
    "La maqueta del cerebro y de la neurona necesita palillos, plastilina y más tiempo que una explicación oral.",
    "Las enfermedades del sistema endocrino piden un ejemplo sencillo y apoyo visual.",
  ],
  resources: [
    "Tarjetas, marcadores, cinta adhesiva, foco, cuaderno de ciencias, anexo del cuadro comparativo, plastilina, cartulina de 50 cm por 30 cm, palillos, folleto de anexos y acceso a celular, tableta o computadora para los juegos en línea.",
    "Folleto de anexos con los ejercicios del sistema nervioso y del sistema endocrino.",
    "Infografía de glándulas y la historia Los cambios de Mariana.",
  ],
  pace: [
    "La mediación sigue focalización, exploración, contrastación y aplicación. La exposición de la maqueta dispone de unos 5 minutos por pareja y la aplicación de las funciones, de unos 10 minutos por subgrupo.",
    "El parpadeo se hace en subgrupos de 4 antes de la mesa redonda.",
    "El juego ¿Quién soy? se repite para que cada persona describa más de una glándula.",
  ],
  supports: [
    "Se mantiene el material visual y el acompañamiento. Los indicadores de nivel Inicial de la rúbrica se logran con apoyo de la persona docente.",
    "En la adecuación se conservan las mismas actividades y se simplifica la lectura.",
    "La ficha médica puede presentarse oralmente o con un esquema.",
  ],
  "teacher-notes": [
    "Las reflexiones del planeamiento siguen en blanco: ¿Qué funcionó? ¿Qué no funcionó? ¿Qué puedo mejorar? El instrumento de trabajo cotidiano tiene dos listas, de 22 estudiantes cada una. Esos nombres no se copian aquí.",
    "Conviene llenar las reflexiones después de la maqueta, no antes.",
    "La segunda lista del instrumento corresponde a otro grupo del mismo nivel y usa los mismos seis indicadores.",
  ],
  "implication-manipulatives": [
    "Armar la maqueta del cerebro y de la neurona con plastilina, cartulina y palillos antes de exponer.",
    "Usar el anexo del cuadro comparativo para anotar el tiempo de parpadeo.",
    "Recortar los nombres de las partes y pegarlos en el palillo que corresponde.",
  ],
  "implication-scaffolding": [
    "Pasar el mensaje de El Mensajero Humano antes de nombrar cerebro, médula espinal y nervios.",
    "Proyectar el video del sistema nervioso después de la actividad, no en lugar de ella.",
    "Leer Los cambios de Mariana y preguntar qué le ocurre antes de nombrar una enfermedad.",
  ],
  "implication-differentiation": [
    "Quien tiene adecuación curricular escucha las opciones y colorea las más claras. El resto expone la maqueta.",
    "Un subgrupo crea la situación hipotética de una función; otro completa el folleto.",
    "La ficha médica puede tener solo síntomas y un cuidado cuando se necesita menos texto.",
  ],
};

export const cienciasSextoInClass = [
  {
    activity: "Focalización: El Mensajero Humano",
    teacherRole: "Organiza emisor y receptor y observa cómo pasa el mensaje",
    studentRole: "Anota una advertencia de peligro y la entrega a la persona siguiente",
    minutes: 10,
    materials: "Tarjetas, marcadores y cinta adhesiva",
  },
  {
    activity: "Exploración: parpadeo ante una luz",
    teacherRole: "Pide el anexo del cuadro comparativo y las preguntas de la mesa redonda",
    studentRole: "En subgrupos de 4 anota el tiempo de parpadeo y compara resultados",
    minutes: 10,
    materials: "Foco, cuaderno de ciencias y anexo del cuadro comparativo",
  },
  {
    activity: "Contrastación: maqueta de cerebro y neurona",
    teacherRole: "Entrega los nombres de las partes y acompaña la exposición",
    studentRole: "Arma la maqueta y expone los componentes en unos 5 minutos",
    minutes: 10,
    materials: "Plastilina, cartulina, palillos y video del sistema nervioso",
  },
  {
    activity: "Aplicación: funciones del sistema nervioso",
    teacherRole: "Asigna una función a cada subgrupo y lee las opciones a quien lo requiere",
    studentRole: "Crea una situación hipotética y practica el juego Qué es - Sistema nervioso",
    minutes: 10,
    materials: "Fichas y celular, tableta o computadora",
  },
];

export const cienciasSextoOutside = [
  {
    task: "Ejercicios 1 a 6 del folleto: relacionar, completar, verdadero o falso, dibujar y señalar cerebro, médula espinal y nervios.",
    purpose: "Reconocer los componentes del sistema nervioso y una función de cada uno.",
    estimatedDuration: "20 minutos",
  },
  {
    task: "Ejercicios del folleto sobre glándulas, hormonas y tres hábitos para cuidar el sistema endocrino.",
    purpose: "Relacionar el sistema endocrino con el nervioso y el equilibrio del cuerpo.",
    estimatedDuration: "20 minutos",
  },
];
