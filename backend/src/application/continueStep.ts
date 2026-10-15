import { Plan, PrismaClient, RubricItem } from "@prisma/client";
import { AppError, PLAN_FORBIDDEN } from "../domain/errors";
import { getPlan } from "./listPlans";

export const STEP_NOT_READY = "Complete los campos de este paso antes de continuar.";
export const RUBRIC_NOT_100 = "Los porcentajes de la evaluación deben sumar 100.";
export const STEP_OUT_OF_RANGE = "Seleccione un paso del 0 al 7.";
export const STEP_NOT_VISITED = "Ese paso todavía no está disponible.";

type PlanWithRubric = Plan & { rubricItems: RubricItem[]; blocks: { blockKey: string; body: string }[] };

function blockText(blocks: { blockKey: string; body: string }[], blockKey: string): string {
  return blocks.find((block) => block.blockKey === blockKey)?.body.trim() ?? "";
}

export function programStepProblem(blocks: { blockKey: string; body: string }[]): string | null {
  let plannableLessons = "";
  let affectedLessons = "";
  try {
    const parsed = JSON.parse(blockText(blocks, "available-time")) as {
      plannableLessons?: string;
      affectedLessons?: string;
    };
    plannableLessons = parsed.plannableLessons?.trim() ?? "";
    affectedLessons = parsed.affectedLessons?.trim() ?? "";
  } catch {
    plannableLessons = "";
    affectedLessons = "";
  }
  if (
    !blockText(blocks, "program-extract") ||
    !plannableLessons ||
    !affectedLessons ||
    !blockText(blocks, "month-objectives") ||
    !blockText(blocks, "month-contents") ||
    !blockText(blocks, "calendar-risks")
  ) {
    return STEP_NOT_READY;
  }
  return null;
}

function configurationProblem(plan: Plan): string | null {
  if (plan.section.trim().length === 0) {
    return "Complete el campo Sección o grupo.";
  }
  if (plan.studentCount <= 0) {
    return "La cantidad de estudiantes debe ser un número entero mayor que cero.";
  }
  if (plan.weeklyLessons <= 0) {
    return "Las lecciones semanales debe ser un número entero mayor que cero.";
  }
  if (plan.schoolName.trim().length === 0) {
    return "Complete el campo Centro educativo.";
  }
  if (plan.teacherName.trim().length === 0) {
    return "Complete el campo Nombre docente.";
  }
  if (!Number.isInteger(plan.month) || plan.month < 1 || plan.month > 12) {
    return "Seleccione el mes.";
  }
  return null;
}

function validationProblem(plan: PlanWithRubric, step: number): string | null {
  if (step === 0) {
    return configurationProblem(plan);
  }
  if (step === 1) {
    return programStepProblem(plan.blocks);
  }
  if (step === 2) {
    const total = plan.rubricItems.reduce((sum, item) => sum + item.percentage, 0);
    return total === 100 ? null : RUBRIC_NOT_100;
  }
  return STEP_NOT_READY;
}

export async function continueStep(
  prisma: PrismaClient,
  sessionId: string | undefined,
  planId: string,
  stepText: string,
) {
  const owned = await getPlan(prisma, sessionId, planId);
  const step = Number(stepText);
  if (!Number.isInteger(step) || step < 0 || step > 7) {
    throw new AppError(422, "VALIDATION", STEP_OUT_OF_RANGE);
  }
  const plan = await prisma.plan.findFirst({
    where: { id: planId },
    include: { rubricItems: true, blocks: true },
  });
  if (!plan) {
    throw new AppError(404, "NOT_FOUND", PLAN_FORBIDDEN);
  }
  if (step > plan.highestVisitedStep) {
    throw new AppError(422, "VALIDATION", STEP_NOT_VISITED);
  }
  const problem = validationProblem(plan, step);
  if (problem) {
    throw new AppError(422, "VALIDATION", problem);
  }
  const nextStep = step + 1;
  await prisma.plan.update({
    where: { id: planId },
    data: {
      currentStep: nextStep,
      highestVisitedStep: Math.max(plan.highestVisitedStep, nextStep),
      updatedAt: new Date(),
    },
  });
  return getPlan(prisma, sessionId, owned.id);
}
