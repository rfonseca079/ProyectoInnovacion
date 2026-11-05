import { PrismaClient } from "@prisma/client";
import { CIENCIAS_SEXTO_SCENARIO_ID } from "./cienciasSextoSeed";

export type StoredAdjustment = {
  planned: string;
  executed: string;
  achieved: string;
  pending: string;
  collectedEvidence: string;
  teacherLog: string;
  cards: [string, string, string];
  apply: {
    weekPosition: number;
    sessionPosition: number;
    start: string;
    development: string;
    homework: string;
    mepRowPosition: number;
    mediationStrategy: string;
    indicator: string;
  };
};

export const adjustmentBlockKeys = [
  "adjustment-planned",
  "adjustment-executed",
  "adjustment-achieved",
  "adjustment-pending",
  "adjustment-collected-evidence",
  "adjustment-log",
  "adjustment-1",
  "adjustment-2",
  "adjustment-3",
] as const;

const mathRetake = "Retomar el martes la construcción de 1/2 = 2/4 = 3/6 que quedó pendiente el lunes.";

export const adjustmentSets: Record<string, StoredAdjustment> = {
  "mat-4-marzo-2026": {
    planned: "Completar la activación y la construcción de equivalentes.",
    executed: "Solo la activación y la mitad de la construcción. Faltaron 15 minutos por la dinámica de entrada.",
    achieved: "Reconocer mitades y cuartos con material concreto.",
    pending: "Completar 1/2 = 2/4 = 3/6 y la regla verbal.",
    collectedEvidence: "La salida rápida quedó incompleta en 6 estudiantes.",
    teacherLog: "La entrada se alargó. El grupo sí manipuló las fichas, pero no alcanzó a formular la regla.",
    cards: [
      "Reprogramar el cierre de equivalentes al inicio del martes.",
      "Acortar la práctica guiada del martes a 12 minutos.",
      "Mover 2 ítems del extraclase a la práctica en clase.",
    ],
    apply: {
      weekPosition: 2,
      sessionPosition: 2,
      start: "Inicia con el cierre de equivalentes que faltó el lunes.",
      development: "Práctica guiada de 12 minutos. Dos ítems del extraclase de empaques pasan a la práctica.",
      homework: "Un ejemplo.",
      mepRowPosition: 1,
      mediationStrategy: mathRetake,
      indicator: "Completa la equivalencia en la lección del martes.",
    },
  },
  "esp-2-abril-2026": {
    planned: "Leer el cuento y conversar sobre la idea principal.",
    executed: "Se leyó el cuento. La idea principal quedó a medias.",
    achieved: "Identificar personajes del cuento.",
    pending: "Decir la idea principal con sus palabras.",
    collectedEvidence: "Dos estudiantes no terminaron la pregunta oral.",
    teacherLog: "La lectura ocupó casi toda la lección.",
    cards: [
      "Retomar la idea principal al inicio de la lección siguiente.",
      "Leer en voz alta un párrafo más corto.",
      "Dejar una pregunta de comprensión.",
    ],
    apply: {
      weekPosition: 1,
      sessionPosition: 2,
      start: "Retomar la idea principal al inicio de la lección siguiente.",
      development: "Lectura breve y una pregunta de comprensión.",
      homework: "Una pregunta de comprensión.",
      mepRowPosition: 1,
      mediationStrategy: "Retomar la idea principal al inicio de la lección siguiente.",
      indicator: "Dice la idea principal en la lección siguiente.",
    },
  },
  "cie-7-febrero-2026": {
    planned: "Observar la célula y cerrar con las partes vistas.",
    executed: "La observación empezó. El cierre de las partes no se alcanzó.",
    achieved: "Ubicar la célula en el microscopio.",
    pending: "Nombrar las partes observadas.",
    collectedEvidence: "El registro del cuaderno quedó incompleto.",
    teacherLog: "El montaje del microscopio tomó más tiempo del previsto.",
    cards: [
      "Reprogramar el cierre de la observación de células al inicio de la siguiente lección.",
      "Acortar la observación guiada.",
      "Dejar un registro breve en el cuaderno.",
    ],
    apply: {
      weekPosition: 1,
      sessionPosition: 2,
      start: "Reprogramar el cierre de la observación de células al inicio de la siguiente lección.",
      development: "Observación guiada más corta y registro en el cuaderno.",
      homework: "Un registro breve.",
      mepRowPosition: 1,
      mediationStrategy: "Reprogramar el cierre de la observación de células al inicio de la siguiente lección.",
      indicator: "Retoma la observación de la célula en la lección siguiente.",
    },
  },
  [CIENCIAS_SEXTO_SCENARIO_ID]: {
    planned: "Recorrer focalización, exploración, contrastación y aplicación del sistema nervioso.",
    executed: "Todavía no hay un registro de lo ocurrido en la clase.",
    achieved: "Aún no se anota un aprendizaje logrado.",
    pending: "Completar la maqueta y la exposición de los componentes.",
    collectedEvidence: "La rúbrica de trabajo cotidiano está lista, sin desempeños anotados.",
    teacherLog: "Las reflexiones del planeamiento siguen en blanco: ¿Qué funcionó? ¿Qué no funcionó? ¿Qué puedo mejorar?",
    cards: [
      "Retomar la maqueta al inicio de la lección siguiente si la exposición no alcanzó.",
      "Mantener la adecuación: leer las opciones y dejar colorear las más claras.",
      "Dejar los ejercicios 1 a 6 del folleto para la casa.",
    ],
    apply: {
      weekPosition: 1,
      sessionPosition: 1,
      start: "Retomar El Mensajero Humano y la maqueta al inicio de la lección siguiente.",
      development: "Exposición breve de los componentes del sistema nervioso.",
      homework: "Ejercicios 1 a 6 del folleto.",
      mepRowPosition: 1,
      mediationStrategy: "Retomar El Mensajero Humano y la maqueta al inicio de la lección siguiente.",
      indicator: "Expone los componentes del sistema nervioso en la lección siguiente.",
    },
  },
};

function fieldBodies(set: StoredAdjustment): Record<string, string> {
  return {
    "adjustment-planned": set.planned,
    "adjustment-executed": set.executed,
    "adjustment-achieved": set.achieved,
    "adjustment-pending": set.pending,
    "adjustment-collected-evidence": set.collectedEvidence,
    "adjustment-log": set.teacherLog,
    "adjustment-1": set.cards[0],
    "adjustment-2": set.cards[1],
    "adjustment-3": set.cards[2],
  };
}

export async function seedAdjustmentVariants(prisma: PrismaClient, scenarioId: string): Promise<void> {
  const set = adjustmentSets[scenarioId];
  if (!set) {
    return;
  }
  const body = JSON.stringify(set);
  await prisma.suggestionVariant.upsert({
    where: { scenarioId_blockKey_variant: { scenarioId, blockKey: "adjustment-week", variant: 1 } },
    update: { body, step: 8 },
    create: { scenarioId, blockKey: "adjustment-week", step: 8, variant: 1, body },
  });
  for (let card = 0; card < set.cards.length; card += 1) {
    const blockKey = `adjustment-${card + 1}`;
    for (let index = 0; index < 3; index += 1) {
      const variant = index + 1;
      const cardBody = index === 0 ? set.cards[card] : `${set.cards[card]} Variante ${variant}.`;
      await prisma.suggestionVariant.upsert({
        where: { scenarioId_blockKey_variant: { scenarioId, blockKey, variant } },
        update: { body: cardBody, step: 8 },
        create: { scenarioId, blockKey, step: 8, variant, body: cardBody },
      });
    }
  }
}

export async function copyAdjustmentBlocks(prisma: PrismaClient, planId: string, scenarioId: string): Promise<void> {
  const set = adjustmentSets[scenarioId];
  if (!set) {
    return;
  }
  for (const [blockKey, body] of Object.entries(fieldBodies(set))) {
    await prisma.planBlock.upsert({
      where: { planId_blockKey: { planId, blockKey } },
      update: { body, variant: 1, status: "SUGGESTED" },
      create: { planId, blockKey, status: "SUGGESTED", variant: 1, body },
    });
  }
}
