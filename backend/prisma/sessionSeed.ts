import { PrismaClient } from "@prisma/client";

export type StoredClassSession = {
  position: number;
  day: string;
  occursOn: string;
  expectedLearning: string;
  durationMinutes: number;
  start: string;
  development: string;
  close: string;
  materials: string;
  formativeEvidence: string;
  homework: string | null;
  expanded: boolean;
  planBNote: string | null;
  planBMinutes: number | null;
};

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

export function activeWeekPosition(scenarioId: string): number {
  return scenarioId === "mat-4-marzo-2026" ? 2 : 1;
}

export function weekSessionBlockKey(weekPosition: number): string {
  return `week-sessions-${weekPosition}`;
}

function datesFrom(start: string): string[] {
  const origin = new Date(`${start}T00:00:00.000Z`);
  return days.map((_, offset) => {
    const date = new Date(origin);
    date.setUTCDate(origin.getUTCDate() + offset);
    return date.toISOString().slice(0, 10);
  });
}

function briefWeek(title: string, start: string): StoredClassSession[] {
  return datesFrom(start).map((occursOn, index) => ({
    position: index + 1,
    day: days[index],
    occursOn,
    expectedLearning: `Repaso breve de ${title}.`,
    durationMinutes: 40,
    start: "5 min de repaso.",
    development: "15 min de práctica corta.",
    close: "5 min de cierre.",
    materials: "Cuaderno.",
    formativeEvidence: "Pregunta oral.",
    homework: null,
    expanded: false,
    planBNote: null,
    planBMinutes: null,
  }));
}

function mathWeek2(): StoredClassSession[][] {
  const dates = datesFrom("2026-03-09");
  const first: StoredClassSession[] = [
    {
      position: 1,
      day: "Lunes",
      occursOn: dates[0],
      expectedLearning: "reconocer fracciones equivalentes con material concreto",
      durationMinutes: 40,
      start: "10 min con círculos fraccionarios",
      development: "25 min para representar 1/2 = 2/4 = 3/6",
      close: "5 min para compartir una regla",
      materials: "círculos y fichas",
      formativeEvidence: "observación de la manipulación",
      homework: "buscar 3 ejemplos de equivalencias en empaques",
      expanded: true,
      planBNote: null,
      planBMinutes: null,
    },
    {
      position: 2,
      day: "Martes",
      occursOn: dates[1],
      expectedLearning: "practicar equivalencias con una actividad breve",
      durationMinutes: 40,
      start: "5 min de repaso",
      development: "práctica breve de equivalencias",
      close: "5 min de puesta en común",
      materials: "cuaderno",
      formativeEvidence: "ejercicio breve",
      homework: null,
      expanded: false,
      planBNote: null,
      planBMinutes: null,
    },
    {
      position: 3,
      day: "Miércoles",
      occursOn: dates[2],
      expectedLearning: "explicar con lenguaje matemático por qué dos fracciones son equivalentes",
      durationMinutes: 40,
      start: "8 min de repaso de la regla",
      development: "22 min de práctica en parejas",
      close: "10 min de vocabulario: equivalente, numerador y denominador",
      materials: "cuaderno y pizarra",
      formativeEvidence: "salida rápida de 2 ítems",
      homework: null,
      expanded: true,
      planBNote: null,
      planBMinutes: null,
    },
    {
      position: 4,
      day: "Jueves",
      occursOn: dates[3],
      expectedLearning: "sostener la práctica si la actividad institucional reduce el tiempo",
      durationMinutes: 40,
      start: "5 min de consigna",
      development: "práctica guiada de equivalencias",
      close: "5 min de cierre",
      materials: "fichas",
      formativeEvidence: "observación",
      homework: null,
      expanded: false,
      planBNote: "Jueves con posible afectación por actividad institucional",
      planBMinutes: 25,
    },
    {
      position: 5,
      day: "Viernes",
      occursOn: dates[4],
      expectedLearning: "comprobar equivalencias con el quiz 1",
      durationMinutes: 40,
      start: "5 min de indicaciones",
      development: "resolución del quiz 1",
      close: "5 min de revisión",
      materials: "quiz impreso",
      formativeEvidence: "quiz 1",
      homework: null,
      expanded: false,
      planBNote: null,
      planBMinutes: null,
    },
  ];
  const second = first.map((session) => ({ ...session }));
  second[0] = { ...second[0], development: "Representación solo con papel." };
  second[3] = { ...second[3], planBMinutes: 20 };
  const third = first.map((session) => ({ ...session, close: "5 min" }));
  third[2] = { ...third[2], formativeEvidence: "observación de la práctica en parejas" };
  third[4] = { ...third[4], formativeEvidence: "salida rápida de 2 ítems" };
  return [first, second, third];
}

function phraseWeek(phrase: string, start: string): StoredClassSession[][] {
  const base = datesFrom(start).map((occursOn, index) => ({
    position: index + 1,
    day: days[index],
    occursOn,
    expectedLearning: phrase,
    durationMinutes: 40,
    start: "8 min de encuadre",
    development: index === 0 ? phrase : "Práctica guiada de la semana.",
    close: "10 min de cierre",
    materials: "cuaderno",
    formativeEvidence: "observación",
    homework: null,
    expanded: index === 0 || index === 2,
    planBNote: null,
    planBMinutes: null,
  }));
  const second = base.map((session) => ({ ...session, development: `${session.development} Con apoyo escrito.` }));
  const third = base.map((session) => ({ ...session, close: "5 min" }));
  return [base, second, third];
}

const mathWeeks: StoredClassSession[][] = [
  briefWeek("Fracción como parte-todo", "2026-03-02"),
  mathWeek2()[0],
  briefWeek("Comparación y orden", "2026-03-16"),
  briefWeek("Resolución de problemas y consolidación", "2026-03-23"),
];

const spanishWeeks: StoredClassSession[][] = [
  phraseWeek("Lectura en voz alta del cuento de la semana", "2026-04-06")[0],
  briefWeek("Vocabulario", "2026-04-13"),
  briefWeek("Idea principal", "2026-04-20"),
  briefWeek("Producción breve", "2026-04-27"),
];

const scienceWeeks: StoredClassSession[][] = [
  phraseWeek("Observación guiada de la célula", "2026-02-02")[0],
  briefWeek("Partes de la célula", "2026-02-09"),
  briefWeek("Célula animal y vegetal", "2026-02-16"),
  briefWeek("Observación de la célula", "2026-02-23"),
];

const activeSets: Record<string, StoredClassSession[][]> = {
  "mat-4-marzo-2026": mathWeek2(),
  "esp-2-abril-2026": phraseWeek("Lectura en voz alta del cuento de la semana", "2026-04-06"),
  "cie-7-febrero-2026": phraseWeek("Observación guiada de la célula", "2026-02-02"),
};

const weekRows: Record<string, StoredClassSession[][]> = {
  "mat-4-marzo-2026": mathWeeks,
  "esp-2-abril-2026": spanishWeeks,
  "cie-7-febrero-2026": scienceWeeks,
};

function toRow(planId: string, weekPosition: number, session: StoredClassSession) {
  return {
    planId,
    weekPosition,
    position: session.position,
    day: session.day,
    occursOn: new Date(`${session.occursOn}T00:00:00.000Z`),
    expectedLearning: session.expectedLearning,
    durationMinutes: session.durationMinutes,
    start: session.start,
    development: session.development,
    close: session.close,
    materials: session.materials,
    formativeEvidence: session.formativeEvidence,
    homework: session.homework,
    expanded: session.expanded,
    status: "SUGGESTED" as const,
    planBNote: session.planBNote,
    planBMinutes: session.planBMinutes,
  };
}

function variantWeek(sessions: StoredClassSession[], suffix: string): StoredClassSession[] {
  return sessions.map((session) => ({
    ...session,
    development: `${session.development}${suffix}`,
  }));
}

export async function seedWeekSessionVariants(prisma: PrismaClient, scenarioId: string): Promise<void> {
  const weeks = weekRows[scenarioId];
  const activeVariants = activeSets[scenarioId];
  if (!weeks || !activeVariants) {
    return;
  }
  const active = activeWeekPosition(scenarioId);
  for (let position = 1; position <= weeks.length; position += 1) {
    const blockKey = weekSessionBlockKey(position);
    const variants =
      position === active
        ? activeVariants
        : [weeks[position - 1], variantWeek(weeks[position - 1], " Variante 2."), variantWeek(weeks[position - 1], " Variante 3.")];
    for (let index = 0; index < variants.length; index += 1) {
      const variant = index + 1;
      const body = JSON.stringify(variants[index]);
      await prisma.suggestionVariant.upsert({
        where: { scenarioId_blockKey_variant: { scenarioId, blockKey, variant } },
        update: { body, step: 6 },
        create: { scenarioId, blockKey, step: 6, variant, body },
      });
    }
  }
}

export async function copyPlanSessions(prisma: PrismaClient, planId: string, scenarioId: string): Promise<void> {
  const weeks = weekRows[scenarioId];
  if (!weeks) {
    return;
  }
  await prisma.classSession.deleteMany({ where: { planId } });
  await prisma.classSession.createMany({
    data: weeks.flatMap((sessions, index) =>
      sessions.map((session) => toRow(planId, index + 1, session)),
    ),
  });
  for (let position = 1; position <= weeks.length; position += 1) {
    const blockKey = weekSessionBlockKey(position);
    const stored = await prisma.suggestionVariant.findUnique({
      where: { scenarioId_blockKey_variant: { scenarioId, blockKey, variant: 1 } },
    });
    if (!stored) {
      continue;
    }
    await prisma.planBlock.upsert({
      where: { planId_blockKey: { planId, blockKey } },
      update: { body: stored.body, variant: 1, status: "SUGGESTED" },
      create: { planId, blockKey, status: "SUGGESTED", variant: 1, body: stored.body },
    });
  }
}
