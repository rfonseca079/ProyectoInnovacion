import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

export const DEMO_PASSWORD = "Demo2026";

export const seededTeachers = [
  {
    fullName: "Juanita Pérez",
    email: "juanita.perez@demo.mep.cr",
    schoolName: "Escuela República de Arabia Saudita",
    regionalDirectorate: "Dirección Regional San José",
  },
  {
    fullName: "Carlos Mora",
    email: "carlos.mora@demo.mep.cr",
    schoolName: "Escuela José Figueres Ferrer",
    regionalDirectorate: "Dirección Regional Cartago",
  },
  {
    fullName: "María Solís",
    email: "maria.solis@demo.mep.cr",
    schoolName: "Liceo Experimental de San Pedro",
    regionalDirectorate: "Dirección Regional San José",
  },
];

export function assertSeedAllowed(nodeEnv: string | undefined): void {
  if (nodeEnv === "production") {
    throw new Error("Seed refused when NODE_ENV=production");
  }
}

export const stepOneBlockKeys = [
  "program-extract",
  "available-time",
  "calendar-restrictions",
  "month-objectives",
  "month-contents",
  "calendar-risks",
] as const;

function lessons(plannableLessons: string, affectedLessons: string): string {
  return JSON.stringify({ plannableLessons, affectedLessons });
}

export type SeededRubricItem = { name: string; count: number; percentage: number };

export const scenarioUnits: Record<
  string,
  { weeks: string[]; rubric: SeededRubricItem[]; distributions: number[][]; justifications: string[] }
> = {
  "mat-4-marzo-2026": {
    weeks: [
      "Fracción como parte-todo",
      "Fracciones equivalentes",
      "Comparación y orden",
      "Resolución de problemas y consolidación",
    ],
    rubric: [
      { name: "Prueba escrita", count: 1, percentage: 30 },
      { name: "Quices", count: 2, percentage: 20 },
      { name: "Trabajo extraclase", count: 2, percentage: 15 },
      { name: "Desempeño en clase y prácticas", count: 1, percentage: 20 },
      { name: "Proyecto corto «Fracciones en mi comunidad»", count: 1, percentage: 15 },
    ],
    distributions: [
      [30, 20, 15, 20, 15],
      [25, 15, 20, 25, 15],
      [20, 20, 10, 30, 20],
    ],
    justifications: [
      "Las equivalencias van después de parte-todo porque el grupo aún confunde mitad y cuarto; la prueba escrita pesa más porque el centro usa un instrumento sumativo al cierre del mes, y el proyecto queda en 15 % para no cargar la semana 4.",
      "El desempeño en clase sube porque el grupo aprende mejor con material concreto.",
      "La prueba escrita y el proyecto quedan en 20 % para equilibrar el cierre del mes.",
    ],
  },
  "esp-2-abril-2026": {
    weeks: ["Lectura narrada", "Vocabulario", "Idea principal", "Producción breve"],
    rubric: [
      { name: "Lectura en voz alta", count: 1, percentage: 25 },
      { name: "Vocabulario", count: 2, percentage: 25 },
      { name: "Idea principal", count: 1, percentage: 25 },
      { name: "Producción breve", count: 1, percentage: 25 },
    ],
    distributions: [
      [25, 25, 25, 25],
      [30, 20, 30, 20],
      [40, 20, 20, 20],
    ],
    justifications: [
      "La lectura narrada abre el mes para que el vocabulario y la idea principal tengan un texto conocido.",
      "La producción breve sube porque el grupo ya sostiene un párrafo.",
      "El vocabulario queda en 20 % para dar más peso a la lectura en voz alta.",
    ],
  },
  "cie-7-febrero-2026": {
    weeks: ["La célula como unidad de la vida", "Partes de la célula", "Célula animal y vegetal", "Observación de la célula"],
    rubric: [
      { name: "Informe de observación", count: 1, percentage: 40 },
      { name: "Quiz", count: 2, percentage: 20 },
      { name: "Práctica de laboratorio", count: 1, percentage: 20 },
      { name: "Participación", count: 1, percentage: 20 },
    ],
    distributions: [
      [40, 20, 20, 20],
      [30, 20, 30, 20],
      [25, 25, 25, 25],
    ],
    justifications: [
      "La observación cierra el mes porque el grupo necesita reconocer las partes antes de comparar células.",
      "La práctica de laboratorio sube porque el grupo aprende con el microscopio.",
      "Los cuatro rubros quedan parejos para no cargar una sola semana.",
    ],
  },
};

const scenarios = [
  {
    id: "mat-4-marzo-2026",
    schoolYear: 2026,
    subject: "MATH" as const,
    gradeLevel: 4,
    month: 3,
    blocks: {
      "program-extract": [
        "Extracto del programa de Matemática 4.°\nEje: Números y operaciones — Fracciones.\nAprendizajes esperados: representar fracciones propias como parte de un todo con material concreto; reconocer fracciones equivalentes en contextos cotidianos; comparar y ordenar fracciones con denominadores hasta 12; resolver problemas sencillos de parte-todo.\nContenidos clave: concepto de fracción, fracciones equivalentes, comparación y orden, resolución de problemas.\nEvaluación: formativa continua y sumativa según la rúbrica del centro.",
        "Extracto del programa de Matemática 4.°\nEje: Números y operaciones — Fracciones en la recta.\nAprendizajes esperados: Ubicar fracciones en la recta numérica.",
        "Extracto del programa de Matemática 4.°\nEje: Números y operaciones — Problemas con fracciones.\nAprendizajes esperados: Plantear problemas de la comunidad con fracciones.",
      ],
      "available-time": [lessons("18", "2"), lessons("16", "3"), lessons("14", "4")],
      "calendar-restrictions": [
        "Consejo de docentes el 6 de marzo; asueto del 30 y 31 de marzo por inicio de Semana Santa.",
        "El consejo de docentes del 6 de marzo deja una lección sin contenido nuevo.",
        "La Semana Santa recorta las dos últimas lecciones del mes.",
      ],
      "month-objectives": [
        "Priorizar parte-todo, equivalencias y comparación, y dejar la resolución de problemas para la semana 4.",
        "Priorizar la ubicación de fracciones en la recta antes de compararlas.",
        "Priorizar problemas de la comunidad y usar la recta solo como apoyo.",
      ],
      "month-contents": [
        "El mes alcanza para parte-todo, equivalencias, comparación y una semana de problemas. No incluye operaciones avanzadas con fracciones impropias.",
        "El mes alcanza para la recta numérica, equivalencias y una comparación breve.",
        "El mes alcanza para problemas de la comunidad con fracciones propias y una revisión de equivalencias.",
      ],
      "calendar-risks": [
        "Se recomienda redistribuir la introducción a fracciones equivalentes a la semana del 9 al 13 de marzo por el asueto del 30 y 31 de marzo.",
        "Se recomienda pasar la introducción de equivalencias a la semana del 16 al 20 de marzo.",
        "Se recomienda usar el 6 de marzo solo para diagnóstico y no para contenido nuevo.",
      ],
    },
    days: [
      { date: "2026-03-06", kind: "SUSPENDED" as const, label: "Consejo de docentes" },
      { date: "2026-03-13", kind: "ASSESSMENT" as const, label: "Quiz de la semana 2" },
      { date: "2026-03-27", kind: "ASSESSMENT" as const, label: "Prueba de la semana 4" },
      { date: "2026-03-30", kind: "HOLIDAY" as const, label: "Asueto por inicio de Semana Santa" },
      { date: "2026-03-31", kind: "HOLIDAY" as const, label: "Asueto por inicio de Semana Santa" },
    ],
  },
  {
    id: "esp-2-abril-2026",
    schoolYear: 2026,
    subject: "SPANISH" as const,
    gradeLevel: 2,
    month: 4,
    blocks: {
      "program-extract": [
        "Extracto del programa de Español 2.° — Comprensión lectora: texto narrativo. Aprendizajes esperados: leer textos narrativos breves y reconocer personajes.",
        "Extracto del programa de Español 2.° — Comprensión lectora: idea principal del cuento.",
        "Extracto del programa de Español 2.° — Comprensión lectora: secuencia de hechos.",
      ],
      "available-time": [lessons("16", "1"), lessons("15", "2"), lessons("14", "2")],
      "calendar-restrictions": [
        "Acto cívico del 11 de abril.",
        "Ensayo del acto cívico ocupa la primera lección del 10 de abril.",
        "El 11 de abril no hay lección de lectura.",
      ],
      "month-objectives": [
        "Priorizar personajes y secuencia en textos narrativos breves.",
        "Priorizar la idea principal antes del vocabulario nuevo.",
        "Priorizar la relectura en voz alta de un cuento conocido.",
      ],
      "month-contents": [
        "El mes alcanza para personajes, escenario y una producción breve.",
        "El mes alcanza para idea principal y vocabulario del cuento.",
        "El mes alcanza para secuencia de hechos y una relectura guiada.",
      ],
      "calendar-risks": [
        "El acto cívico del 11 de abril recorta la lectura en voz alta.",
        "Conviene pasar la idea principal a la semana siguiente al acto.",
        "Usar el día del acto solo para retomar personajes, no para contenido nuevo.",
      ],
    },
    days: [{ date: "2026-04-06", kind: "TEACHING" as const, label: "Lectura de cuento" }],
  },
  {
    id: "cie-7-febrero-2026",
    schoolYear: 2026,
    subject: "SCIENCE" as const,
    gradeLevel: 7,
    month: 2,
    blocks: {
      "program-extract": [
        "Extracto del programa de Ciencias 7.° — La célula como unidad de la vida. Aprendizajes esperados: distinguir célula vegetal y célula animal.",
        "Extracto del programa de Ciencias 7.° — Organelos y su función.",
        "Extracto del programa de Ciencias 7.° — Comparar células en el microscopio.",
      ],
      "available-time": [lessons("12", "1"), lessons("11", "2"), lessons("10", "2")],
      "calendar-restrictions": [
        "Feria científica del 14 de febrero.",
        "El montaje de la feria ocupa la lección del 13 de febrero.",
        "El 14 de febrero no hay observación de laboratorio.",
      ],
      "month-objectives": [
        "Priorizar la célula como unidad de la vida y la diferencia entre célula vegetal y animal.",
        "Priorizar los organelos antes de la comparación en el microscopio.",
        "Priorizar la observación guiada y dejar el esquema rotulado para el cierre.",
      ],
      "month-contents": [
        "El mes alcanza para membrana, núcleo y una comparación vegetal-animal.",
        "El mes alcanza para organelos principales y un esquema rotulado.",
        "El mes alcanza para una observación guiada y la comparación de dos células.",
      ],
      "calendar-risks": [
        "La feria científica del 14 de febrero recorta la observación de células.",
        "Conviene pasar la observación al inicio de la semana siguiente.",
        "Usar el día de la feria solo para retomar el esquema, no para contenido nuevo.",
      ],
    },
    days: [{ date: "2026-02-06", kind: "TEACHING" as const, label: "Observación de la célula" }],
  },
];

const seededPlans = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    email: "juanita.perez@demo.mep.cr",
    cycle: "I_II" as const,
    gradeLevel: 4,
    subject: "MATH" as const,
    month: 3,
    status: "DRAFT" as const,
    currentStep: 4,
    highestVisitedStep: 4,
    updatedAt: new Date("2026-03-10T18:00:00.000Z"),
    scenarioId: "mat-4-marzo-2026",
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    email: "carlos.mora@demo.mep.cr",
    cycle: "I_II" as const,
    gradeLevel: 2,
    subject: "SPANISH" as const,
    month: 4,
    status: "READY_FOR_DELIVERY" as const,
    currentStep: 7,
    highestVisitedStep: 7,
    updatedAt: new Date("2026-04-02T18:00:00.000Z"),
    scenarioId: "esp-2-abril-2026",
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    email: "maria.solis@demo.mep.cr",
    cycle: "III" as const,
    gradeLevel: 7,
    subject: "SCIENCE" as const,
    month: 2,
    status: "READY_FOR_DELIVERY" as const,
    currentStep: 8,
    highestVisitedStep: 8,
    updatedAt: new Date("2026-02-18T18:00:00.000Z"),
    scenarioId: "cie-7-febrero-2026",
  },
];

export async function seedTeachers(prisma: PrismaClient, nodeEnv: string | undefined): Promise<void> {
  assertSeedAllowed(nodeEnv);
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  for (const teacher of seededTeachers) {
    await prisma.teacher.upsert({
      where: { email: teacher.email },
      update: {
        fullName: teacher.fullName,
        schoolName: teacher.schoolName,
        regionalDirectorate: teacher.regionalDirectorate,
        passwordHash,
      },
      create: { ...teacher, passwordHash },
    });
  }

  for (const scenario of scenarios) {
    await prisma.scenario.upsert({
      where: { id: scenario.id },
      update: {
        schoolYear: scenario.schoolYear,
        subject: scenario.subject,
        gradeLevel: scenario.gradeLevel,
        month: scenario.month,
      },
      create: {
        id: scenario.id,
        schoolYear: scenario.schoolYear,
        subject: scenario.subject,
        gradeLevel: scenario.gradeLevel,
        month: scenario.month,
      },
    });
    for (const blockKey of stepOneBlockKeys) {
      const bodies = scenario.blocks[blockKey];
      for (let index = 0; index < bodies.length; index += 1) {
        const variant = index + 1;
        await prisma.suggestionVariant.upsert({
          where: {
            scenarioId_blockKey_variant: {
              scenarioId: scenario.id,
              blockKey,
              variant,
            },
          },
          update: { body: bodies[index], step: 1 },
          create: {
            scenarioId: scenario.id,
            blockKey,
            step: 1,
            variant,
            body: bodies[index],
          },
        });
      }
    }
    const units = scenarioUnits[scenario.id];
    const stepTwoBlocks: Record<string, string[]> = {
      "evaluation-distribution": units.distributions.map((row) => JSON.stringify(row)),
      "evaluation-justification": units.justifications,
    };
    for (const blockKey of Object.keys(stepTwoBlocks)) {
      const bodies = stepTwoBlocks[blockKey];
      for (let index = 0; index < bodies.length; index += 1) {
        const variant = index + 1;
        await prisma.suggestionVariant.upsert({
          where: {
            scenarioId_blockKey_variant: {
              scenarioId: scenario.id,
              blockKey,
              variant,
            },
          },
          update: { body: bodies[index], step: 2 },
          create: {
            scenarioId: scenario.id,
            blockKey,
            step: 2,
            variant,
            body: bodies[index],
          },
        });
      }
    }
    for (const day of scenario.days) {
      const date = new Date(`${day.date}T00:00:00.000Z`);
      await prisma.calendarDay.upsert({
        where: { scenarioId_date: { scenarioId: scenario.id, date } },
        update: { kind: day.kind, label: day.label },
        create: { scenarioId: scenario.id, date, kind: day.kind, label: day.label },
      });
    }
  }

  for (const plan of seededPlans) {
    const teacher = await prisma.teacher.findUniqueOrThrow({ where: { email: plan.email } });
    const data = {
      teacherId: teacher.id,
      cycle: plan.cycle,
      gradeLevel: plan.gradeLevel,
      subject: plan.subject,
      modality: "IN_PERSON" as const,
      schoolYear: 2026,
      month: plan.month,
      schoolName: teacher.schoolName,
      regionalDirectorate: teacher.regionalDirectorate,
      teacherName: teacher.fullName,
      section: "A",
      studentCount: 28,
      weeklyLessons: 5,
      status: plan.status,
      currentStep: plan.currentStep,
      highestVisitedStep: plan.highestVisitedStep,
      scenarioId: plan.scenarioId,
      usedFallback: false,
      updatedAt: plan.updatedAt,
    };
    await prisma.plan.upsert({
      where: { id: plan.id },
      update: data,
      create: { id: plan.id, ...data },
    });
    const variants = await prisma.suggestionVariant.findMany({
      where: { scenarioId: plan.scenarioId, step: 1, variant: 1 },
    });
    for (const variant of variants) {
      await prisma.planBlock.upsert({
        where: { planId_blockKey: { planId: plan.id, blockKey: variant.blockKey } },
        update: { body: variant.body, variant: 1, status: "SUGGESTED" },
        create: {
          planId: plan.id,
          blockKey: variant.blockKey,
          status: "SUGGESTED",
          variant: 1,
          body: variant.body,
        },
      });
    }
    const units = scenarioUnits[plan.scenarioId];
    await prisma.week.deleteMany({ where: { planId: plan.id } });
    await prisma.week.createMany({
      data: units.weeks.map((title, index) => ({ planId: plan.id, position: index + 1, title })),
    });
    await prisma.rubricItem.deleteMany({ where: { planId: plan.id } });
    await prisma.rubricItem.createMany({
      data: units.rubric.map((item, index) => ({ planId: plan.id, position: index + 1, ...item })),
    });
    const stepTwo = await prisma.suggestionVariant.findMany({
      where: { scenarioId: plan.scenarioId, step: 2, variant: 1 },
    });
    for (const variant of stepTwo) {
      await prisma.planBlock.upsert({
        where: { planId_blockKey: { planId: plan.id, blockKey: variant.blockKey } },
        update: { body: variant.body, variant: 1, status: "SUGGESTED" },
        create: {
          planId: plan.id,
          blockKey: variant.blockKey,
          status: "SUGGESTED",
          variant: 1,
          body: variant.body,
        },
      });
    }
  }
}
