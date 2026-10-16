import { PrismaClient } from "@prisma/client";

export type MepRowTemplate = {
  expectedLearning: string;
  mediationStrategy: string;
  indicator: string;
};

export type MepTemplate = {
  competencies: string;
  observations: string;
  rows: MepRowTemplate[];
};

export const mepTemplates: Record<string, MepTemplate> = {
  "mat-4-marzo-2026": {
    competencies: "Ciudadanía responsable y solidaria; Competencias para la vida",
    observations:
      "El 4.° A trabaja mejor con material concreto y necesita apoyo para leer enunciados largos.",
    rows: [
      {
        expectedLearning: "reconocer fracciones equivalentes",
        mediationStrategy: "activación con material concreto y construcción de 1/2 = 2/4 = 3/6",
        indicator: "representa al menos dos fracciones equivalentes con fichas",
      },
      {
        expectedLearning: "resolver un problema sencillo de parte-todo",
        mediationStrategy: "práctica en parejas y cierre con una regla verbal",
        indicator: "explica con sus palabras por qué dos fracciones equivalen",
      },
    ],
  },
  "esp-2-abril-2026": {
    competencies: "Comunicación oral y escrita; Competencias para la vida",
    observations: "El 2.° B responde cuando el cuento se lee en voz alta antes de la pregunta.",
    rows: [
      {
        expectedLearning: "identificar la idea principal de un cuento corto",
        mediationStrategy: "Lectura en voz alta del cuento de la semana",
        indicator: "dice de qué trata el cuento en una oración",
      },
      {
        expectedLearning: "reconocer al personaje principal",
        mediationStrategy: "preguntas cortas sobre quién actúa en el cuento",
        indicator: "señala al personaje principal en la lámina",
      },
    ],
  },
  "cie-7-febrero-2026": {
    competencies: "Pensamiento científico; Competencias para la vida",
    observations: "El 7.° C responde mejor cuando la observación precede al esquema.",
    rows: [
      {
        expectedLearning: "reconocer las partes de la célula que se observan",
        mediationStrategy: "Observación guiada de la célula",
        indicator: "rotula en el dibujo las partes observadas",
      },
      {
        expectedLearning: "comparar la célula animal y la vegetal",
        mediationStrategy: "contraste en parejas a partir de las láminas",
        indicator: "nombra una diferencia visible entre las dos células",
      },
    ],
  },
};

export async function seedMepTemplate(prisma: PrismaClient, scenarioId: string): Promise<void> {
  const template = mepTemplates[scenarioId];
  if (!template) {
    return;
  }
  await prisma.suggestionVariant.upsert({
    where: { scenarioId_blockKey_variant: { scenarioId, blockKey: "mep-template", variant: 1 } },
    update: { body: JSON.stringify(template), step: 7 },
    create: {
      scenarioId,
      blockKey: "mep-template",
      step: 7,
      variant: 1,
      body: JSON.stringify(template),
    },
  });
}
