import { Cycle, Modality, PrismaClient, Subject } from "@prisma/client";
import { AppError } from "../domain/errors";
import { gradeBelongsToCycle, GRADE_OUTSIDE_CYCLE, resolveScenario } from "../domain/scenario";
import { getPlan } from "./listPlans";

export type PlanConfiguration = {
  cycle: Cycle;
  gradeLevel: number;
  subject: Subject;
  modality: Modality;
  schoolYear: number;
  month: number;
  schoolName: string;
  regionalDirectorate: string;
  teacherName: string;
  section: string;
  studentCount: number;
  weeklyLessons: number;
};

const cycles = new Set(["I_II", "III", "DIVERSIFIED"]);
const subjects = new Set(["MATH", "SPANISH", "SCIENCE", "SOCIAL_STUDIES"]);
const modalities = new Set(["IN_PERSON", "VIRTUAL", "HYBRID"]);

function requiredText(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new AppError(400, "VALIDATION", `Complete el campo ${label}.`);
  }
  return value.trim();
}

function requiredNumber(value: unknown, label: string): number {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(number) || number <= 0) {
    throw new AppError(400, "VALIDATION", `${label} debe ser un número entero mayor que cero.`);
  }
  return number;
}

export function parseConfiguration(body: Record<string, unknown>): PlanConfiguration {
  const cycle = requiredText(body.cycle, "Ciclo");
  if (!cycles.has(cycle)) {
    throw new AppError(400, "VALIDATION", "Seleccione un ciclo.");
  }
  const gradeLevel = requiredNumber(body.gradeLevel, "El nivel");
  if (!gradeBelongsToCycle(cycle as Cycle, gradeLevel)) {
    throw new AppError(400, "VALIDATION", GRADE_OUTSIDE_CYCLE);
  }
  const subject = requiredText(body.subject, "Asignatura");
  if (!subjects.has(subject)) {
    throw new AppError(400, "VALIDATION", "Seleccione una asignatura.");
  }
  const modality = requiredText(body.modality, "Modalidad");
  if (!modalities.has(modality)) {
    throw new AppError(400, "VALIDATION", "Seleccione una modalidad.");
  }
  const schoolYear = requiredNumber(body.schoolYear, "El curso lectivo");
  const month = typeof body.month === "number" ? body.month : Number(body.month);
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new AppError(400, "VALIDATION", "Seleccione el mes.");
  }
  const studentCount = requiredNumber(body.studentCount, "La cantidad de estudiantes");
  const weeklyLessons = requiredNumber(body.weeklyLessons, "Las lecciones semanales");
  return {
    cycle: cycle as Cycle,
    gradeLevel,
    subject: subject as Subject,
    modality: modality as Modality,
    schoolYear,
    month,
    schoolName: requiredText(body.schoolName, "Centro educativo"),
    regionalDirectorate: requiredText(body.regionalDirectorate, "Dirección regional"),
    teacherName: requiredText(body.teacherName, "Nombre docente"),
    section: requiredText(body.section, "Sección o grupo"),
    studentCount,
    weeklyLessons,
  };
}

async function copyStepOne(prisma: PrismaClient, planId: string, scenarioId: string): Promise<void> {
  const variants = await prisma.suggestionVariant.findMany({
    where: { scenarioId, step: 1, variant: 1 },
  });
  for (const variant of variants) {
    await prisma.planBlock.upsert({
      where: { planId_blockKey: { planId, blockKey: variant.blockKey } },
      update: { body: variant.body, variant: 1, status: "SUGGESTED" },
      create: {
        planId,
        blockKey: variant.blockKey,
        status: "SUGGESTED",
        variant: 1,
        body: variant.body,
      },
    });
  }
}

export async function createPlan(prisma: PrismaClient, sessionId: string | undefined, body: Record<string, unknown>) {
  const teacher = await import("./loginTeacher").then((module) => module.currentTeacher(prisma, sessionId));
  const configuration = parseConfiguration(body);
  const scenario = await resolveScenario(
    prisma,
    configuration.schoolYear,
    configuration.subject,
    configuration.gradeLevel,
    configuration.month,
  );
  const plan = await prisma.plan.create({
    data: {
      teacherId: teacher.id,
      ...configuration,
      status: "DRAFT",
      currentStep: 1,
      highestVisitedStep: 1,
      scenarioId: scenario.scenarioId,
      usedFallback: scenario.usedFallback,
    },
  });
  await copyStepOne(prisma, plan.id, scenario.scenarioId);
  return getPlan(prisma, sessionId, plan.id);
}

const matchKeys = ["schoolYear", "subject", "gradeLevel", "month"] as const;

export async function updatePlanConfiguration(
  prisma: PrismaClient,
  sessionId: string | undefined,
  planId: string,
  body: Record<string, unknown>,
) {
  const existing = await prisma.plan.findFirst({
    where: { id: planId, teacherId: (await import("./loginTeacher").then((module) => module.currentTeacher(prisma, sessionId))).id },
  });
  if (!existing) {
    throw new AppError(404, "NOT_FOUND", "No tiene acceso a este planeamiento.");
  }
  const merged = parseConfiguration({ ...existing, ...body });
  const matchChanged = matchKeys.some((key) => merged[key] !== existing[key]);
  const scenario = matchChanged
    ? await resolveScenario(prisma, merged.schoolYear, merged.subject, merged.gradeLevel, merged.month)
    : { scenarioId: existing.scenarioId ?? "mat-4-marzo-2026", usedFallback: existing.usedFallback };
  await prisma.plan.update({
    where: { id: planId },
    data: {
      ...merged,
      scenarioId: scenario.scenarioId,
      usedFallback: scenario.usedFallback,
      notifyEvaluationChanges:
        typeof body.notifyEvaluationChanges === "boolean"
          ? body.notifyEvaluationChanges
          : existing.notifyEvaluationChanges,
      updatedAt: new Date(),
    },
  });
  if (Array.isArray(body.rubric)) {
    await prisma.rubricItem.deleteMany({ where: { planId } });
    await prisma.rubricItem.createMany({
      data: body.rubric.map((item: { name: string; percentage: number }) => ({
        planId,
        name: item.name,
        percentage: item.percentage,
      })),
    });
  }
  if (Array.isArray(body.blocks)) {
    for (const block of body.blocks as { blockKey: string; body: string }[]) {
      await prisma.planBlock.updateMany({
        where: { planId, blockKey: block.blockKey },
        data: { body: block.body, status: "EDITED" },
      });
    }
  }
  if (matchChanged && existing.scenarioId !== scenario.scenarioId) {
    const variants = await prisma.suggestionVariant.findMany({
      where: { scenarioId: scenario.scenarioId, variant: 1 },
    });
    const suggested = await prisma.planBlock.findMany({ where: { planId, status: "SUGGESTED" } });
    for (const block of suggested) {
      const next = variants.find((variant) => variant.blockKey === block.blockKey);
      if (next) {
        await prisma.planBlock.update({
          where: { id: block.id },
          data: { body: next.body, variant: 1 },
        });
      }
    }
  }
  return getPlan(prisma, sessionId, planId);
}
