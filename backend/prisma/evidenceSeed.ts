import { CIENCIAS_SEXTO_SCENARIO_ID } from "./cienciasSextoSeed";

export type StoredEvidenceCard = {
  blockKey: string;
  kind: "FORMATIVE" | "SCHEDULED";
  position: number;
  title: string;
  measures: string;
  when: string;
  instrument: string;
  expectedLearning: string;
  occursOn: string | null;
};

export type StoredRubric = { name: string; count: number; percentage: number };

export type StoredLoad = {
  rubricNames: string[];
  rubric: StoredRubric[];
  scheduled: StoredEvidenceCard[];
  updatesRubric: boolean;
};

export type ScenarioEvidence = {
  formative: StoredEvidenceCard[][];
  loads: StoredLoad[];
};

export function evidenceCardJson(card: StoredEvidenceCard): string {
  return JSON.stringify({
    kind: card.kind,
    position: card.position,
    title: card.title,
    measures: card.measures,
    when: card.when,
    instrument: card.instrument,
    expectedLearning: card.expectedLearning,
    occursOn: card.occursOn,
  });
}

const mathRubric: StoredRubric[] = [
  { name: "Prueba escrita", count: 1, percentage: 30 },
  { name: "Quices", count: 2, percentage: 20 },
  { name: "Trabajo extraclase", count: 2, percentage: 15 },
  { name: "Desempeño en clase y prácticas", count: 1, percentage: 20 },
  { name: "Proyecto corto «Fracciones en mi comunidad»", count: 1, percentage: 15 },
];

const mathRubricSingleQuiz: StoredRubric[] = [
  { name: "Prueba escrita", count: 1, percentage: 30 },
  { name: "Quices", count: 1, percentage: 10 },
  { name: "Trabajo extraclase", count: 2, percentage: 15 },
  { name: "Desempeño en clase y prácticas", count: 1, percentage: 30 },
  { name: "Proyecto corto «Fracciones en mi comunidad»", count: 1, percentage: 15 },
];

const spanishRubric: StoredRubric[] = [
  { name: "Lectura en voz alta", count: 1, percentage: 25 },
  { name: "Vocabulario", count: 2, percentage: 25 },
  { name: "Idea principal", count: 1, percentage: 25 },
  { name: "Producción breve", count: 1, percentage: 25 },
];

const scienceRubric: StoredRubric[] = [
  { name: "Informe de observación", count: 1, percentage: 40 },
  { name: "Quiz", count: 2, percentage: 20 },
  { name: "Práctica de laboratorio", count: 1, percentage: 20 },
  { name: "Participación", count: 1, percentage: 20 },
];

function formative(blockKey: string, position: number, title: string, measures: string, when: string, instrument: string, expectedLearning: string): StoredEvidenceCard {
  return { blockKey, kind: "FORMATIVE", position, title, measures, when, instrument, expectedLearning, occursOn: null };
}

function scheduled(blockKey: string, position: number, title: string, measures: string, when: string, instrument: string, expectedLearning: string, occursOn: string | null): StoredEvidenceCard {
  return { blockKey, kind: "SCHEDULED", position, title, measures, when, instrument, expectedLearning, occursOn };
}

function formativeVariants(base: StoredEvidenceCard[]): StoredEvidenceCard[][] {
  return [
    base,
    base.map((card, index) => (index === 0 ? { ...card, measures: `${card.measures} Variante 2.` } : { ...card })),
    base.map((card, index) => (index === 0 ? { ...card, measures: `${card.measures} Variante 3.` } : { ...card })),
  ];
}

function load(rubric: StoredRubric[], cards: StoredEvidenceCard[], updatesRubric = false): StoredLoad {
  return { rubricNames: rubric.map((item) => item.name), rubric, scheduled: cards, updatesRubric };
}

const mathScheduled: StoredEvidenceCard[] = [
  scheduled(
    "evidence-scheduled-1",
    1,
    "Quiz 1",
    "Fracciones equivalentes.",
    "viernes 13 de marzo, semana 2",
    "Quiz escrito",
    "Representa fracciones equivalentes.",
    "2026-03-13",
  ),
  scheduled(
    "evidence-scheduled-2",
    2,
    "Prueba escrita",
    "Los aprendizajes del mes.",
    "viernes 27 de marzo, semana 4",
    "Prueba escrita",
    "Resuelve problemas con fracciones equivalentes.",
    "2026-03-27",
  ),
  scheduled(
    "evidence-scheduled-3",
    3,
    "Proyecto corto «Fracciones en mi comunidad»",
    "Uso de fracciones en una situación de la comunidad.",
    "Entrega en la semana 4",
    "Producto breve con rúbrica",
    "Aplica fracciones equivalentes en un contexto cercano.",
    null,
  ),
  scheduled(
    "evidence-scheduled-4",
    4,
    "Práctica en clase",
    "Puntaje de desempeño durante la práctica. No hay laboratorio aparte.",
    "Durante las prácticas del mes",
    "Práctica en clase",
    "Muestra el procedimiento con material concreto.",
    null,
  ),
];

const mathQuizMoved = mathScheduled.map((card, index) =>
  index === 0
    ? {
        ...card,
        when: "viernes 20 de marzo",
        occursOn: "2026-03-20",
        expectedLearning: "El quiz sale de la semana de introducción para no sumar dos instrumentos en la semana 2.",
      }
    : { ...card },
);

const mathFormative = [
  formative(
    "evidence-formative-1",
    1,
    "Tres preguntas orales de chequeo",
    "Si el estudiantado explica una equivalencia con sus palabras.",
    "Durante la construcción",
    "Preguntas orales",
    "Explica una equivalencia con sus palabras.",
  ),
  formative(
    "evidence-formative-2",
    2,
    "Salida rápida de 2 ítems",
    "La representación 1/2 = 2/4.",
    "Cierre de la lección",
    "Boleta corta",
    "Representa 1/2 = 2/4.",
  ),
  formative(
    "evidence-formative-3",
    3,
    "Observación del material concreto",
    "Toma la ficha correcta, justifica la equivalencia y escucha a la pareja.",
    "Activación y construcción",
    "Lista breve",
    "Justifica una equivalencia con material concreto.",
  ),
  formative(
    "evidence-formative-4",
    4,
    "Conversación matemática en parejas",
    "Uso de la palabra «equivalente», explicación del numerador y escucha activa.",
    "Durante el trabajo en parejas",
    "Rúbrica de tres criterios",
    "Explica el numerador y usa la palabra «equivalente».",
  ),
];

const spanishScheduled = [
  scheduled(
    "evidence-scheduled-1",
    1,
    "Quiz de idea principal",
    "Identifica la idea principal de un párrafo.",
    "Abril, semana 3",
    "Quiz escrito",
    "Reconoce la idea principal.",
    "2026-04-17",
  ),
  scheduled(
    "evidence-scheduled-2",
    2,
    "Producción breve",
    "Escribe un párrafo con la idea principal.",
    "Semana 4 de abril",
    "Producción escrita",
    "Redacta un párrafo breve.",
    null,
  ),
];

const scienceScheduled = [
  scheduled(
    "evidence-scheduled-1",
    1,
    "Práctica de reconocimiento de organelos",
    "Reconoce organelos en una célula.",
    "Febrero, semana 2",
    "Práctica",
    "Nombra los organelos observados.",
    "2026-02-13",
  ),
  scheduled(
    "evidence-scheduled-2",
    2,
    "Informe de observación",
    "Describe lo observado en la lámina.",
    "Cierre de febrero",
    "Informe breve",
    "Describe las partes de la célula.",
    null,
  ),
];

const cienciasSextoRubric: StoredRubric[] = [
  { name: "Componentes del sistema nervioso", count: 1, percentage: 17 },
  { name: "Medidas preventivas", count: 1, percentage: 17 },
  { name: "Consecuencias del consumo de drogas", count: 1, percentage: 17 },
  { name: "Glándulas del sistema endocrino", count: 1, percentage: 17 },
  { name: "Relación nervioso y endocrino", count: 1, percentage: 16 },
  { name: "Equilibrio y cuidado de la salud", count: 1, percentage: 16 },
];

const cienciasSextoScheduled = [
  scheduled(
    "evidence-scheduled-1",
    1,
    "Primera prueba de Ciencias",
    "Prueba básica de sexto, según la circular del Comité de Evaluación. No enviar tareas en esa ventana.",
    "Martes 1 de setiembre de 2026",
    "Prueba escrita",
    "Identifica componentes del sistema nervioso y medidas preventivas.",
    "2026-09-01",
  ),
  scheduled(
    "evidence-scheduled-2",
    2,
    "Pruebas estandarizadas de sexto",
    "Cronograma distinto de sexto. No coinciden con tareas.",
    "Del 13 al 16 de octubre de 2026",
    "Prueba estandarizada",
    "Sigue el cronograma de sexto del MEP.",
    "2026-10-13",
  ),
  scheduled(
    "evidence-scheduled-3",
    3,
    "Segunda prueba de Ciencias de sexto",
    "Después de las pruebas estandarizadas. El viernes 30 de octubre queda para reprogramar.",
    "Lunes 26 de octubre de 2026",
    "Prueba escrita",
    "Relaciona el sistema nervioso y el endocrino.",
    "2026-10-26",
  ),
];

function shifted(cards: StoredEvidenceCard[], occursOn: string, when: string): StoredEvidenceCard[] {
  return cards.map((card, index) => (index === 0 ? { ...card, occursOn, when } : { ...card }));
}

export const scenarioEvidence: Record<string, ScenarioEvidence> = {
  "mat-4-marzo-2026": {
    formative: formativeVariants(mathFormative),
    loads: [load(mathRubric, mathScheduled), load(mathRubric, mathQuizMoved), load(mathRubricSingleQuiz, mathQuizMoved.map((card) => ({ ...card })), true)],
  },
  "esp-2-abril-2026": {
    formative: formativeVariants([
      formative(
        "evidence-formative-1",
        1,
        "Preguntas sobre la idea principal",
        "Si el estudiantado dice la idea principal con sus palabras.",
        "Durante la lectura",
        "Preguntas orales",
        "Explica la idea principal.",
      ),
      formative(
        "evidence-formative-2",
        2,
        "Salida de una oración",
        "Escribe una oración sobre el texto.",
        "Cierre de la lección",
        "Boleta corta",
        "Escribe una oración completa.",
      ),
    ]),
    loads: [
      load(spanishRubric, spanishScheduled),
      load(spanishRubric, shifted(spanishScheduled, "2026-04-24", "Abril, semana 4")),
      load(spanishRubric, shifted(spanishScheduled, "2026-04-24", "Abril, semana 4")),
    ],
  },
  "cie-7-febrero-2026": {
    formative: formativeVariants([
      formative(
        "evidence-formative-1",
        1,
        "Preguntas sobre las partes de la célula",
        "Si el estudiantado nombra un organelo que observa.",
        "Durante la observación",
        "Preguntas orales",
        "Nombra una parte de la célula.",
      ),
      formative(
        "evidence-formative-2",
        2,
        "Salida con un organelo",
        "Escribe el nombre de un organelo.",
        "Cierre de la lección",
        "Boleta corta",
        "Identifica un organelo.",
      ),
    ]),
    loads: [
      load(scienceRubric, scienceScheduled),
      load(scienceRubric, shifted(scienceScheduled, "2026-02-20", "Febrero, semana 3")),
      load(scienceRubric, shifted(scienceScheduled, "2026-02-20", "Febrero, semana 3")),
    ],
  },
  [CIENCIAS_SEXTO_SCENARIO_ID]: {
    formative: formativeVariants([
      formative(
        "evidence-formative-1",
        1,
        "Maqueta del sistema nervioso",
        "Determina los componentes del sistema nervioso con la maqueta. En nivel Inicial los reconoce con apoyo.",
        "Contrastación",
        "Maqueta y exposición breve",
        "Identifica cerebro, médula espinal y nervios.",
      ),
      formative(
        "evidence-formative-2",
        2,
        "Mesa redonda y afiche preventivo",
        "Señala funciones del sistema nervioso y menciona medidas en el hogar, el centro educativo y la comunidad.",
        "Aplicación",
        "Mesa redonda y afiche",
        "Describe medidas preventivas y consecuencias del consumo de drogas.",
      ),
    ]),
    loads: [
      load(cienciasSextoRubric, cienciasSextoScheduled),
      load(cienciasSextoRubric, cienciasSextoScheduled.map((card, index) => (index === 0 ? { ...card, when: "Se mueve si el Comité de Evaluación y el docente guía confirman otra fecha." } : card))),
      load(cienciasSextoRubric, cienciasSextoScheduled),
    ],
  },
};
