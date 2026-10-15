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

const scenarios = [
  {
    id: "mat-4-marzo-2026",
    schoolYear: 2026,
    subject: "MATH" as const,
    gradeLevel: 4,
    month: 3,
    extract: "Aprendizajes esperados: representar fracciones propias como parte de un todo con material concreto.",
    objectives: "El mes trabaja el concepto de fracción, fracciones equivalentes y comparación.",
  },
  {
    id: "esp-2-abril-2026",
    schoolYear: 2026,
    subject: "SPANISH" as const,
    gradeLevel: 2,
    month: 4,
    extract: "Aprendizajes esperados: leer textos narrativos breves y reconocer personajes.",
    objectives: "El mes trabaja comprensión de lectura en textos narrativos.",
  },
  {
    id: "cie-7-febrero-2026",
    schoolYear: 2026,
    subject: "SCIENCE" as const,
    gradeLevel: 7,
    month: 2,
    extract: "Aprendizajes esperados: distinguir célula vegetal y célula animal.",
    objectives: "El mes trabaja la estructura básica de la célula.",
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
    for (const block of [
      { blockKey: "program-extract", body: scenario.extract },
      { blockKey: "month-objectives", body: scenario.objectives },
    ]) {
      await prisma.suggestionVariant.upsert({
        where: {
          scenarioId_blockKey_variant: {
            scenarioId: scenario.id,
            blockKey: block.blockKey,
            variant: 1,
          },
        },
        update: { body: block.body, step: 1 },
        create: {
          scenarioId: scenario.id,
          blockKey: block.blockKey,
          step: 1,
          variant: 1,
          body: block.body,
        },
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
  }
}
